// api/properties.js
const mysql = require('mysql2/promise');
const cors = require('cors');

// CORS options
const corsOptions = {
  origin: '*', // Allow all origins in development
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

module.exports = async (req, res) => {
  // Run CORS middleware
  await runMiddleware(req, res, cors(corsOptions));

  console.log('Environment Variables:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    // Be cautious with logging sensitive data
  });  

  if (req.method === 'GET') {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : null,
      });      

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
          // Parse images, fetch partner details, etc.
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
