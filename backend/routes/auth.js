// routes/auth.js

const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_here";


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user (role defaults to student)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      attempts: 0,
      role: "student"
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // send response
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,   // ⭐ IMPORTANT
        attempts: user.attempts
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {

    res.status(401).json({ message: "Token is not valid" });

  }
};


// ================= PROTECTED ROUTE =================
router.get("/me", authMiddleware, async (req, res) => {

  const user = await User.findById(req.user.id).select("-password");

  res.json(user);

});


module.exports = router;