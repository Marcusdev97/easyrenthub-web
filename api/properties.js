const mysql = require('mysql2/promise');
const cors = require('cors');

const corsOptions = {
  origin: ['https://myeasyrenthub.com'], // 允许的前端域名
  methods: ['GET', 'POST', 'OPTIONS'], // 允许的方法
  credentials: true, // 允许发送cookie等凭据
};

app.use(cors(corsOptions));

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
    ? 'SELECT * FROM properties WHERE agent IS NULL'  // Fetch unrented properties in localhost
    : 'SELECT * FROM properties';  // Fetch all properties in production
};

module.exports = async (req, res) => {
  // Log request information for debugging
  console.log('Request method:', req.method);
  console.log('Request query:', req.query);
  console.log('Environment:', process.env.NODE_ENV);

  // Run CORS middleware
  await runMiddleware(req, res, cors);

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Log database connection attempt
      console.log('Attempting to connect to the database...');

      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      });

      console.log('Database connection established.');

      if (id) {
        // Fetch single property by ID
        console.log('Fetching property by ID:', id);
        const [propertyResults] = await connection.execute('SELECT * FROM properties WHERE id = ?', [id]);
        
        // Log the property data for debugging
        console.log('Property with ID:', id, 'Data:', propertyResults);

        if (propertyResults.length === 0) {
          return res.status(404).json({ error: 'Property not found' });
        }
        
        const property = propertyResults[0];

        // Parse images as JSON, with error handling
        try {
          property.images = JSON.parse(property.images).map((image) => {
            return `${process.env.IMAGE_BASE_URL || req.protocol + '://' + req.get('host')}/uploads/${image}`;
          });
        } catch (e) {
          console.error('Error parsing images:', e);
          property.images = [];
        }

        // Fetch partner details related to property sources
        const [partnerResults] = await connection.execute('SELECT * FROM partners WHERE partner_id = ?', [property.sources]);
        property.sources = partnerResults.length > 0 ? partnerResults[0] : null;

        res.setHeader('Content-Type', 'application/json');
        res.json(property);

      } else {
        // Fetch all properties
        console.log('Fetching all properties...');
        const [propertyResults] = await connection.execute(getPropertiesQuery());

        // Log results for debugging
        console.log('Fetched Properties:', propertyResults);

        const propertiesWithPartners = await Promise.all(propertyResults.map(async (property) => {
          // Parse images as JSON, with error handling
          try {
            property.images = JSON.parse(property.images).map((image) => {
              return `${process.env.IMAGE_BASE_URL || req.protocol + '://' + req.get('host')}/uploads/${image}`;
            });
          } catch (e) {
            console.error('Error parsing images:', e);
            property.images = [];
          }

          const [partnerResults] = await connection.execute('SELECT * FROM partners WHERE partner_id = ?', [property.sources]);
          property.sources = partnerResults.length > 0 ? partnerResults[0] : { name: 'undefined', company: 'undefined' };
          return property;
        }));

        // Log final properties with partner data
        console.log('Properties with Partner Info:', propertiesWithPartners);

        res.setHeader('Content-Type', 'application/json');
        res.json(propertiesWithPartners);
      }

      await connection.end(); // Close connection
      console.log('Database connection closed.');
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};