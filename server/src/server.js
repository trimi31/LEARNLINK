require('dotenv').config();
const app = require('./app');
const config = require('./config');
const db = require('./models');

const PORT = config.port;

// Test database connection
db.sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`🌍 Environment: ${config.env}`);
    });
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  db.sequelize.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  db.sequelize.close();
  process.exit(0);
});

