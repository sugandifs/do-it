const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  user_email: String,
  task: String,
  status: { type: Boolean, default: false },
});

const TaskModel = new mongoose.model("tasks", TaskSchema);
module.exports = TaskModel;
