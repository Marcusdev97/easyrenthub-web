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

// Middleware helper function
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

module.exports = async (req, res) => {
  // Run CORS middleware
  await runMiddleware(req, res, cors(corsOptions));

  console.log('Request received at /api/properties');
  
  // Temporarily log database connection details
  console.log('Database connection details: ', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  if (req.method === 'GET') {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      });

      console.log('Database connection established successfully');

      // Rest of the code...
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
