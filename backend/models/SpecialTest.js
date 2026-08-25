const mongoose = require("mongoose");

const specialTestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  durationMinutes: { type: Number, default: 30 },
  assignedStudents: { type: [String], default: [] }, // Array of emails
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      answer: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SpecialTest", specialTestSchema);
