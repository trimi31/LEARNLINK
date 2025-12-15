const express = require('express');
const { sequelize } = require('../config/db');

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * Database connection test endpoint
 * GET /api/db-ping
 * Tests database connectivity by running SELECT 1
 */
router.get('/db-ping', async (req, res, next) => {
  try {
    // Run SELECT 1 query to test database connection
    await sequelize.query('SELECT 1');
    
    res.json({
      status: 'ok',
      message: 'Database connection successful'
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = 'Database connection failed: ' + error.message;
    next(error);
  }
});

module.exports = router;

