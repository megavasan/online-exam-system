const router = require("express").Router();
const Question = require("../models/Question");
const User = require("../models/User");
const Result = require("../models/Result");

// Logging middleware
router.use((req, res, next) => {
  console.log(`[Admin Route] ${req.method} ${req.url}`);
  next();
});

// Add Question
router.post("/add", async (req, res) => {
  try {
    const q = new Question(req.body);
    await q.save();
    res.send("Question Added Successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get All Questions
router.get("/all", async (req, res) => {
  try {
    const q = await Question.find();
    res.json(q);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /api/admin/student-results
router.get("/student-results", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }, "name email");
    const results = await Result.find({});
    const questions = await Question.find({}, "subject");
    
    const subjectCounts = {};
    questions.forEach(q => {
      subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
    });

    const grouped = {};
    students.forEach(student => {
      grouped[student._id.toString()] = {
        _id: student._id,
        name: student.name,
        email: student.email,
        results: []
      };
    });

    results.forEach(resObj => {
      const uid = resObj.userId;
      if (grouped[uid]) {
        const fallbackTotal = subjectCounts[resObj.subject] || 5;
        grouped[uid].results.push({
          _id: resObj._id,
          subject: resObj.subject,
          score: resObj.score,
          total: resObj.total || fallbackTotal,
          date: resObj.date
        });
      }
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error("Error fetching student results:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/subjects
router.get("/subjects", async (req, res) => {
  try {
    const subjects = await Question.distinct("subject");
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;