import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Login from "./auth/Login";
import Navbar from "./Navbar";
import { CirclePlus, MoveRight } from "lucide-react";
import Cookies from "js-cookie";

function Home() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [quote, setQuote] = useState("");
  const [time, setTime] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    task: "",
  });
  const token = Cookies.get("token");

  setInterval(() => setTime(new Date()), 1000);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          console.log("auth failed, showing login page instead");
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("rerouting back to login");
      });

    getTasks();

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api`, {
        withCredentials: true,
      })
      .then((response) => {
        setQuote(response.data[0].content + " — " + response.data[0].author);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleComplete = (task_id) => {
    console.log(task_id);
    axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/complete/` + task_id)
      .then((res) => {
        setData(data.filter((task) => task.task_id !== task_id));
        getTasks();
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = TaskValidation(values);
    setErrors(err);
    if (err.task === "") {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/task`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            console.log(res);
            getTasks();
            setValues({ task: "" });
          } else {
            console.log(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const getTasks = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleInput = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function TaskValidation(values) {
    let error = {};

    if (values.task === "") {
      error.task = "Please enter a task";
    } else {
      error.task = "";
    }

    return error;
  }

  return (
    <>
      {auth ? (
        <>
          <Navbar page="home"></Navbar>
          <div className="px-4 py-20 h-screen w-full">
            <div className="flex flex-col md:flex-row md:justify-between w-full h-full">
              <div className="w-full md:w-1/2 p-4 flex flex-col items-center justify-center">
                <div className="bg-white rounded-lg h-full flex flex-col justify-center text-left">
                  <h3 className="text-2xl mb-10">Welcome, {name}</h3>
                  <h1 className="font-semibold text-8xl mb-10">
                    {time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </h1>
                  <h3 className="text-2xl mb-10">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <p>
                    <span className="text-sm text-gray-500 sm:text-center">
                      App logo by{" "}
                      <a href="https://www.svgrepo.com" target="_blank">
                        SVG Repo{" "}
                      </a>
                    </span>
                    <span className="text-sm text-gray-500 sm:text-center">
                      & Button icons by{" "}
                      <a href="https://lucide.dev/license" target="_blank">
                        Lucide
                      </a>
                    </span>
                  </p>
                </div>
              </div>

              <div className="w-full md:w-1/4 flex flex-col justify-between">
                <div className="h-full p-4">
                  <div className="text-left border border-gray-200 bg-gray-50 rounded-lg p-6 h-full overflow-hidden">
                    <h3 className="text-lg font-semibold mb-4">Your Tasks</h3>
                    <form noValidate onSubmit={handleSubmit}>
                      <div className="mt-2 flex items-start mb-2">
                        <div className="flex-grow flex flex-col">
                          <div>
                            <input
                              id="task"
                              name="task"
                              type="text"
                              value={values.task}
                              placeholder="Add a new task"
                              required
                              onChange={handleInput}
                              className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 ${
                                errors.task ? "border-red-500" : "border-0"
                              }`}
                            />
                          </div>
                          {errors.task && (
                            <span className="block mt-2 text-sm text-red-500 text-left">
                              Please enter your task
                            </span>
                          )}
                        </div>
                        <button className="flex sticky top-0 items-center rounded-md ml-4 mt-1 py-1.5 text-sm text-blue-700 leading-6 hover:text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                          <CirclePlus size={16} />
                        </button>
                      </div>
                    </form>
                    <ul
                      role="list"
                      className="divide-y divide-gray-100 overflow-y-auto max-h-full"
                    >
                      {data.length === 0 ? (
                        <li className="flex flex-col items-start">
                          <p className="text-gray-500 mt-3 mb-3">
                            You have no tasks
                          </p>
                          <Link
                            to="/tasks"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            Add a new task
                            <MoveRight className="ml-2" size={20} />
                          </Link>
                        </li>
                      ) : (
                        data.map((task) => (
                          <li
                            key={task._id}
                            className="flex justify-between gap-x-6 py-5"
                          >
                            <div className="flex min-w-0 flex-grow gap-x-4 items-center">
                              <button
                                onClick={() => handleComplete(task._id)}
                                className="flex rounded-full w-4 h-4 border border-gray-400 shrink-0 hover:bg-gray-400"
                              ></button>
                              <div className="min-w-0 flex-auto">
                                <p className="font-semibold truncate leading-9 text-gray-900 text-left">
                                  {task.task}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/4 flex flex-col justify-between text-left">
                <div className="h-1/2 p-4">
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-6 h-full flex flex-col justify-center">
                    <div className="flex-grow py-10">
                      <h3 className="text-lg font-semibold mb-4">
                        Daily Inspiration
                      </h3>
                      <p className="text-gray-700 mb-4 text-sm md:text-lg">
                        {quote || "Loading..."}
                      </p>
                      <a
                        href="https://github.com/lukePeavey/quotable"
                        className="text-sm text-gray-700"
                      >
                        Quotes provided by{" "}
                        <span className="text-blue-500">Quotable</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="h-1/2 p-4 text-left">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-full flex flex-col justify-center">
                    <h3 className="text-lg font-semibold mb-4">
                      How are you feeling today?
                    </h3>
                    <Link
                      to="/write"
                      className="mt-3 text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Add a new journal entry{" "}
                      <MoveRight size={18} className="ml-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}

export default Home;
