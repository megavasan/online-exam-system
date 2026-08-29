require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/exam", require("./routes/exam"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/result", require("./routes/result"));
app.use("/api/special-tests", require("./routes/specialTest"));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 22020;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));