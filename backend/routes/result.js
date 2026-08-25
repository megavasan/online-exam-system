const router = require("express").Router();
const User = require("../models/User");
const Question = require("../models/Question");
const Result = require("../models/Result");

// POST /api/submit
router.post("/", async (req, res) => {
  try {
    const { userId, subject, answers } = req.body;

    console.log("Submit Request Body:", req.body);

    // 1️⃣ Basic validation
    if (!userId || !subject || !answers) {
      return res.status(400).json({ message: "userId, subject, and answers are required" });
    }

    // 2️⃣ Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3️⃣ Validate answers format
    if (typeof answers !== "object" || Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an object with questionId: answer" });
    }

    // 4️⃣ Fetch questions for the subject
    const questions = await Question.find({ subject });

    // 5️⃣ Calculate score
    let score = 0;
    questions.forEach((q) => {
      // q._id is a string like "fsd1"
      if (answers[q._id] && answers[q._id] === q.answer) {
        score++;
      }
    });

    const total = questions.length;

    // 6️⃣ Save or update result
    const result = await Result.findOneAndUpdate(
      { userId, subject },
      { answers, score, total, date: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Exam submitted successfully", result });

  } catch (error) {
    console.error("Submit Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;