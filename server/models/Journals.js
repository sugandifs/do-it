const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  user_email: String,
  title: String,
  entry: String,
  date: {
    type: Date,
    default: new Date(),
  },
});

const JournalModel = new mongoose.model("journals", JournalSchema);
module.exports = JournalModel;
