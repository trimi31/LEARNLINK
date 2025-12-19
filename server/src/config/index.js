require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'learnlink_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },
};

