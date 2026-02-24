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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Check service exists
    const serviceResult = await client.query(
      "SELECT * FROM services WHERE id = $1",
      [serviceId]
    );

    if (serviceResult.rows.length === 0) {
      throw new Error("Service not found");
    }

    const service = serviceResult.rows[0];

    // 2️⃣ Check expiry
    if (service.last_date && service.last_date < new Date()) {
      throw new Error("Service expired");
    }

    // 3️⃣ Check max applicants
    const countResult = await client.query(
      "SELECT COUNT(*) FROM applications WHERE service_id = $1",
      [serviceId]
    );

    const currentCount = parseInt(countResult.rows[0].count);

    if (
      service.max_applicants &&
      currentCount >= service.max_applicants
    ) {
      throw new Error("Maximum applicants reached");
    }

    // 4️⃣ Insert application
    const insertResult = await client.query(
      `INSERT INTO applications (user_id, service_id)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, serviceId]
    );

    await client.query("COMMIT");

    return insertResult.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};