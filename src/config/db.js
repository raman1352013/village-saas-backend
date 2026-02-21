const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "village_saas",
  password: "Qwerty@123",
  port: 5433,
});

module.exports = pool;