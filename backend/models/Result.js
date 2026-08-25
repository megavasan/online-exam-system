const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: String, // can also be ObjectId if you prefer
  subject: String,
  answers: { type: Object, required: true }, // { questionId: "answer" }
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);