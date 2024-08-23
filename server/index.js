const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const UserModel = require("./models/Users");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const TaskModel = require("./models/Tasks");
const JournalModel = require("./models/Journals");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

app.use(cookieParser());
app.options(process.env.FRONTEND_URL, cors());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

const quoteProxy = createProxyMiddleware({
  target:
    "https://api.quotable.io/quotes/random?tags=inspirational|motivational|success&maxLength=80",
  changeOrigin: true,
  on: {
    proxyRes: (proxyRes, req, res) => {
      proxyRes.headers["Access-Control-Allow-Origin"] =
        process.env.FRONTEND_URL;
      proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
    },
  },
});

app.use("/api", quoteProxy);

mongoose.connect(process.env.MONGODB_URL);

const verifyUser = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ Error: "You are not authenticated." });
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("verify token: " + token);
        console.log("verify secret key:" + process.env.JWT_SECRET_KEY);
        return res.status(401).json({ Error: "Incorrect token." });
      } else {
        req.email = decoded.email;
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ name, email, password: hash })
        .then((users) => res.json(users))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err.message));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign(
            { name: user.name, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
          );
          console.log("secret key: " + process.env.JWT_SECRET_KEY); //debuggin
          console.log("token: " + token); //debuggin
          res.cookie("token", token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
          });
          res.json({ Status: "Success" });
        } else {
          res.json({ Error: "Incorrect password." });
        }
      });
    } else {
      res.json({ Error: "The user does not exist." });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.get("/tasks", verifyUser, async (req, res) => {
  const user_email = req.email;
  TaskModel.find({ user_email, status: false }).then((tasks) => {
    if (tasks) {
      res.json(tasks);
    } else {
      res.json({ Error: "You are not authorized." });
    }
  });
});

app.post("/task", verifyUser, async (req, res) => {
  try {
    const user_email = req.email;
    const { task } = req.body;

    if (!task) {
      return res.status(400).json({ Error: "Please enter a task." });
    }

    const newTask = new TaskModel({
      user_email,
      task,
    });

    await newTask.save();

    res.json({ Status: "Success" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ Error: "Could not add a new task. Please try again" });
  }
});

app.put("/edit/:task_id", verifyUser, async (req, res) => {
  const task_id = req.params.task_id;
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ Error: "Please enter a task." });
  }

  TaskModel.findByIdAndUpdate(task_id, { task }, { new: true }).then((task) => {
    if (task) {
      res.json({ Status: "Success" });
    } else {
      res.json({ Error: "Invalid task." });
    }
  });
});

app.delete("/delete/:task_id", verifyUser, async (req, res) => {
  const task_id = req.params.task_id;

  TaskModel.deleteOne({ _id: task_id })
    .then((result) => {
      if (result.deletedCount === 1) {
        res.json({ Status: "Success" });
      } else {
        res.json({ Error: "Unsuccessfully deleted. Task not found." });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ Error: "Server error." });
    });
});

app.put("/complete/:task_id", verifyUser, async (req, res) => {
  const task_id = req.params.task_id;

  try {
    const task = await TaskModel.findByIdAndUpdate(
      task_id,
      { status: true },
      { new: true }
    );

    if (task) {
      res.json({ Status: "Success", task });
    } else {
      res.status(404).json({ Error: "Task not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Server error." });
  }
});

app.get("/journals", verifyUser, async (req, res) => {
  const user_email = req.email;
  JournalModel.find({ user_email }).then((journal) => {
    if (journal) {
      res.json(journal);
    } else {
      res.json({ Error: "You are not authorized." });
    }
  });
});

app.post("/journal", verifyUser, async (req, res) => {
  const user_email = req.email;
  const { title, entry } = req.body;

  JournalModel.create({ user_email, title, entry })
    .then((entry) => res.json({ Status: "Success" }))
    .catch((err) => res.json({ Error: "Could not add new entry. Try again" }));
});

app.get("/entry/:journal_id", verifyUser, async (req, res) => {
  const journal_id = req.params.journal_id;

  try {
    const entry = await JournalModel.findOne({ _id: journal_id });

    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ Error: "Entry not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Server error." });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running.");
});
