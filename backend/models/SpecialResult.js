const mongoose = require("mongoose");

const specialResultSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'SpecialTest', required: true },
  userEmail: { type: String, required: true },
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 }, // in seconds
  answers: { type: Object, required: true }, // { index/questionId: "answer" }
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SpecialResult", specialResultSchema);
