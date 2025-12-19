const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Resource already exists',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize foreign key errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Invalid reference',
      message: 'Referenced resource does not exist',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: err.message,
    });
  }

  // Custom application errors
  if (err.message) {
    // Determine status code based on error message
    let statusCode = err.statusCode || 500;
    const msg = err.message.toLowerCase();
    
    if (msg.includes('not found')) {
      statusCode = 404;
    } else if (msg.includes('unauthorized') || msg.includes('invalid credentials')) {
      statusCode = 401;
    } else if (msg.includes('forbidden') || msg.includes('insufficient permissions')) {
      statusCode = 403;
    } else if (msg.includes('already') || msg.includes('already exists') || msg.includes('already booked') || msg.includes('already paid') || msg.includes('already purchased')) {
      statusCode = 409;
    } else if (msg.includes('invalid') || msg.includes('required') || msg.includes('cannot') || msg.includes('must be')) {
      statusCode = 400;
    }
    
    return res.status(statusCode).json({
      error: err.message,
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
};

module.exports = {
  errorHandler,
  notFound,
};

