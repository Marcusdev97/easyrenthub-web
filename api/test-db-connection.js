// api/test-db-connection.js
const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    await connection.ping(); // Test the connection
    await connection.end();

    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
};
