const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log(connection.ping());
    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
};