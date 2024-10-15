const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();


const app = express();
const router = express.Router();

// CORS options
const corsOptions = {
  origin: '*', // Adjust as needed
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));
console.log('Loaded DB_HOST:', process.env.DB_HOST);

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

// API Endpoint: /api/properties
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to connect to the database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      // Include SSL options if necessary
    });

    console.log('Database connected');

    const { id } = req.query;
    if (id) {
      console.log(`Fetching property with id: ${id}`);
      const [propertyResults] = await connection.execute(
        'SELECT * FROM properties WHERE id = ?',
        [id]
      );
      if (propertyResults.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      return res.status(200).json(propertyResults[0]);
    } else {
      console.log('Fetching all properties');
      const [propertyResults] = await connection.execute('SELECT * FROM properties');
      return res.status(200).json(propertyResults);
    }
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Use the router under the /api/properties path
app.use('/api/properties', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
