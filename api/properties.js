const mysql = require('mysql2/promise');
const cors = require('cors');

// CORS options
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? 'https://myeasyrenthub.com'
      : 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
};

// Run middleware helper function
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Query helper function based on environment
const getPropertiesQuery = () => {
  return process.env.LOCALHOST === 'true'
    ? 'SELECT * FROM properties WHERE agent IS NULL'
    : 'SELECT * FROM properties';
};

// Function to establish a database connection
const connectToDatabase = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
};

// Check database connection health
const checkDatabaseHealth = async (req, res) => {
  try {
    const connection = await connectToDatabase();
    await connection.end();
    res.status(200).json({ status: 'Database connected successfully!' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ status: 'Database connection failed', error: error.message });
  }
};

// Main API handler
module.exports = async (req, res) => {
  // Run CORS middleware
  await runMiddleware(req, res, cors(corsOptions));

  console.log('Request received at /api/properties');
  console.log('Environment Variables:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
  });

  // Check if the request is for the database health check
  if (req.url === '/api/db-health') {
    return checkDatabaseHealth(req, res); // Call the health check function
  }

  if (req.method === 'GET') {
    try {
      const connection = await connectToDatabase();

      const { id } = req.query;

      if (id) {
        const [propertyResults] = await connection.execute(
          'SELECT * FROM properties WHERE id = ?',
          [id]
        );

        if (propertyResults.length === 0) {
          res.status(404).json({ error: 'Property not found' });
        } else {
          const property = propertyResults[0];
          res.status(200).json(property);
        }
      } else {
        const [propertyResults] = await connection.execute(getPropertiesQuery());
        res.status(200).json(propertyResults);
      }

      await connection.end();
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
