const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());   

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);
module.exports = app;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});