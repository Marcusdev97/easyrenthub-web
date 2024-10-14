const mysql = require('mysql2/promise');
const cors = require('cors');

// CORS options
const corsOptions = {
  origin: '*', // Adjust as needed
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
  console.log('CORS middleware passed');

  console.log('Function invoked');

  // Log environment variables (avoid logging sensitive data in production)
  console.log('Environment Variables:', { host: process.env.DB_HOST, user: process.env.DB_USER });

  console.log('HTTP Method:', req.method);

  if (req.method === 'GET') {
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
      console.log('Request query:', req.query);

      if (id) {
        console.log(`Fetching property with id: ${id}`);
        const [propertyResults] = await connection.execute(
          'SELECT * FROM properties WHERE id = ?',
          [id]
        );
        console.log('Property results:', propertyResults);

        if (propertyResults.length === 0) {
          console.log('Property not found');
          res.status(404).json({ error: 'Property not found' });
        } else {
          const property = propertyResults[0];
          console.log('Returning property:', property);
          res.status(200).json(property);
        }
      } else {
        console.log('Fetching all properties');

        // Ensure your query is correct
        const query = 'SELECT * FROM properties'; // Replace with your actual query
        const [propertyResults] = await connection.execute(query);
        console.log('Property results:', propertyResults);

        res.status(200).json(propertyResults);
      }

      await connection.end();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Database query error:', error);
      // Ensure that you send a response only once
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
