const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/examdb")
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

async function seedAdmin() {
  try {
    const existing = await User.findOne({ email: "admin@exam.com" });
    if (existing) {
      console.log("Admin already exists! Email: admin@exam.com | Password: Admin@123");
      mongoose.disconnect();
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);
    await User.create({
      name: "Admin",
      email: "admin@exam.com",
      password: hashedPassword,
      role: "admin",
      attempts: 0
    });
    console.log("✅ Admin user created!");
    console.log("   Email:    admin@exam.com");
    console.log("   Password: Admin@123");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

seedAdmin();
