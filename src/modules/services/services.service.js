const pool = require("../../config/db");

exports.createService = async (data) => {
  const {
    title,
    description,
    location,
    last_date,
    max_applicants,
    organization_id,
    created_by
  } = data;

  const result = await pool.query(
    `INSERT INTO services 
    (title, description, location, last_date, max_applicants, organization_id, created_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [title, description, location, last_date, max_applicants, organization_id, created_by]
  );

  return result.rows[0];
};

exports.getAllServices = async () => {
  const result = await pool.query(
    `SELECT s.*, o.name as organization_name
     FROM services s
     LEFT JOIN organizations o ON s.organization_id = o.id
     ORDER BY s.created_at DESC`
  );

  return result.rows;
};
exports.applyToService = async (userId, serviceId) => {

  // Check max applicants
  const countResult = await pool.query(
    "SELECT COUNT(*) FROM applications WHERE service_id = $1",
    [serviceId]
  );

  const serviceResult = await pool.query(
    "SELECT max_applicants FROM services WHERE id = $1",
    [serviceId]
  );

  const currentCount = parseInt(countResult.rows[0].count);
  const maxApplicants = serviceResult.rows[0].max_applicants;

  if (maxApplicants && currentCount >= maxApplicants) {
    throw new Error("Maximum applicants reached");
  }

  const result = await pool.query(
    `INSERT INTO applications (user_id, service_id)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, serviceId]
  );

  return result.rows[0];
};