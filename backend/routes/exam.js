const express = require("express");
const router = express.Router();

const Question = require("../models/Question");
const Result = require("../models/Result");


// =======================================
// ✅ START EXAM
// GET /api/exam/start/:userId/:subject
// =======================================
router.get("/start/:userId/:subject", async (req, res) => {
  try {
    const { subject } = req.params;

    const questions = await Question.find({ subject });

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        message: "No questions found for this subject"
      });
    }

    res.status(200).json(questions);

  } catch (err) {
    console.error("Start Exam Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =======================================
// ✅ SUBMIT EXAM
// POST /api/exam/submit
// =======================================
router.post("/submit", async (req, res) => {
  try {
    const { answers, userId, subject } = req.body;

    if (!userId || !subject || !answers) {
      return res.status(400).json({
        message: "Invalid submission data"
      });
    }

    const questions = await Question.find({ subject });

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        message: "No questions found"
      });
    }

    let score = 0;

    // Calculate score safely
    questions.forEach((q) => {
      const questionId = q._id.toString();

      if (
        answers.hasOwnProperty(questionId) &&
        answers[questionId] === q.answer
      ) {
        score++;
      }
    });

    // Save result (answers required in your model)
    const result = new Result({
      userId,
      subject,
      answers,
      score,
      total: questions.length,
    });

    await result.save();

    res.status(200).json({
      message: "Exam submitted successfully",
      score,
      total: questions.length
    });

  } catch (err) {
    console.error("Submit Exam Error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

module.exports = router;