const { Pool } = require("pg");
const AppError = require("../utils/AppError");

let pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

// Middleware to handle PostgreSQL errors
pool.on("error", (err) => {
  if (err.code === "23505") {
    throw new AppError("Duplicate key error", 409);
  }
  throw new AppError(err.message, 500);
});

module.exports = pool;