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
const servicesRoutes = require("./modules/services/services.routes");
app.use("/api/services", servicesRoutes);

const AppError = require("./utils/AppError");

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!"
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});