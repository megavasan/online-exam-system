const router = require("express").Router();
const Question = require("../models/Question");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { userId, subject, answers } = req.body;

    if (!userId || !subject || !answers) {
      return res.status(400).json({
        message: "userId, subject and answers are required"
      });
    }

    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all questions of that subject
    const questions = await Question.find({ subject });

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    // Calculate score
    let score = 0;

    questions.forEach((q) => {
      if (answers[q._id] && answers[q._id] === q.answer) {
        score++;
      }
    });

    const total = questions.length;

    // Just return result (DO NOT SAVE)
    res.status(200).json({
      message: "Exam submitted successfully",
      score,
      total
    });

  } catch (error) {
    console.error("Submit Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;