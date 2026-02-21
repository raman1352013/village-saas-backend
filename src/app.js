const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());   

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);
module.exports = app;