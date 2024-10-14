// api/test-db-connection.js

const mysql = require('mysql2/promise');

module.exports = async (req, res) => {
  try {
    const connectionConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    };

    console.log('Attempting to connect to the database with config:', {
      host: connectionConfig.host,
      user: connectionConfig.user,
      database: connectionConfig.database,
      port: connectionConfig.port,
    });

    const connection = await mysql.createConnection(connectionConfig);

    console.log('Connected to the database successfully.');

    await connection.end();

    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
};
