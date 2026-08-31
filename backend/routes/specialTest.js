const express = require("express");
const router = express.Router();

const SpecialTest = require("../models/SpecialTest");
const SpecialResult = require("../models/SpecialResult");

// =======================================
// ✅ CREATE SPECIAL TEST (ADMIN)
// POST /api/special-tests
// =======================================
router.post("/", async (req, res) => {
  try {
    const { name, scheduledTime, durationMinutes, assignedStudents, questions } = req.body;
    
    if (!name || !scheduledTime || !questions) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const test = new SpecialTest({
      name,
      scheduledTime,
      durationMinutes,
      assignedStudents,
      questions
    });

    await test.save();
    res.status(201).json({ message: "Special Test created successfully", test });
  } catch (err) {
    console.error("Create Special Test Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =======================================
// ✅ GET ALL SPECIAL TESTS (ADMIN)
// GET /api/special-tests
// =======================================
router.get("/", async (req, res) => {
  try {
    const tests = await SpecialTest.find().sort({ scheduledTime: -1 });
    res.status(200).json(tests);
  } catch (err) {
    console.error("Get Special Tests Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =======================================
// ✅ GET TEST RESULTS (ADMIN)
// GET /api/special-tests/:id/results
// =======================================
router.get("/:id/results", async (req, res) => {
  try {
    const { id } = req.params;
    const results = await SpecialResult.find({ testId: id }).sort({ score: -1, timeTaken: 1 });
    res.status(200).json(results);
  } catch (err) {
    console.error("Get Special Test Results Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =======================================
// ✅ GET ASSIGNED TESTS (STUDENT)
// GET /api/special-tests/student/:email
// =======================================
router.get("/student/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const tests = await SpecialTest.find({ assignedStudents: email }).sort({ scheduledTime: 1 });
    res.status(200).json(tests);
  } catch (err) {
    console.error("Get Assigned Tests Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =======================================
// ✅ START TEST (STUDENT) - FETCH QUESTIONS IF WITHIN WINDOW
// GET /api/special-tests/:id/start/:email
// =======================================
router.get("/:id/start/:email", async (req, res) => {
    try {
        const { id, email } = req.params;
        const test = await SpecialTest.findById(id);

        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        if (!test.assignedStudents.includes(email)) {
            return res.status(403).json({ message: "You are not assigned to this test" });
        }

        // Time window check: Entry is max 5 minutes from scheduled time
        const now = new Date();
        const scheduledTime = new Date(test.scheduledTime);
        const diffMs = now - scheduledTime;
        const diffMinutes = Math.floor(diffMs / 60000);

        if (diffMinutes < 0) {
            return res.status(403).json({ message: "Test has not started yet" });
        }
        if (diffMinutes > 5) {
             return res.status(403).json({ message: "Time is over. Entry window closed." });
        }
        
        // Remove answers from questions before sending to frontend
        const safeQuestions = test.questions.map((q, idx) => ({
            _id: q._id || idx,
            question: q.question,
            options: q.options
        }));

        res.status(200).json({ ...test.toObject(), questions: safeQuestions });
    } catch (err) {
        console.error("Start Special Test Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


// =======================================
// ✅ SUBMIT TEST (STUDENT)
// POST /api/special-tests/:id/submit
// =======================================
router.post("/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail, answers, timeTaken } = req.body;

    if (!userEmail || !answers) {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    const test = await SpecialTest.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Check if already submitted
    const existing = await SpecialResult.findOne({ testId: id, userEmail });
    if (existing) {
        return res.status(400).json({ message: "You have already submitted this test" });
    }

    let score = 0;
    
    // Calculate score
    test.questions.forEach((q, idx) => {
        const questionId = q._id ? q._id.toString() : idx.toString();
        if (answers[questionId] && answers[questionId] === q.answer) {
            score++;
        }
    });

    const result = new SpecialResult({
      testId: id,
      userEmail,
      answers,
      score,
      total: test.questions.length,
      timeTaken: timeTaken || 0
    });

    await result.save();
    res.status(200).json({ message: "Test submitted successfully", score, total: test.questions.length });
  } catch (err) {
    console.error("Submit Special Test Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// =======================================
// ✅ GET SUBMITTED RESULTS FOR A STUDENT
// GET /api/special-tests/results/student/:email
// =======================================
router.get("/results/student/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const results = await SpecialResult.find({ userEmail: email });
    res.status(200).json(results);
  } catch (err) {
    console.error("Get Student Special Results Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
