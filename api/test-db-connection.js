const startTime = Date.now();

try {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
  const endTime = Date.now();
  console.log(`Database connection time: ${endTime - startTime}ms`);

  await connection.ping(); // Test the connection
  await connection.end();

  res.status(200).json({ message: 'Database connection successful' });
} catch (error) {
  console.error('Database connection failed:', error);
  res.status(500).json({ error: 'Database connection failed', details: error.message });
}
