const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  _id: String, // custom string IDs like "fsd1"
  subject: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true }
});

module.exports = mongoose.model("Question", questionSchema);