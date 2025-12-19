const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LearnLink API',
      version: '1.0.0',
      description: 'API documentation for LearnLink - A platform connecting students with professors',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Profiles', description: 'User profile management' },
      { name: 'Professors', description: 'Professor listing and details' },
      { name: 'Courses', description: 'Course management' },
      { name: 'Lessons', description: 'Lesson management' },
      { name: 'Availability', description: 'Professor availability management' },
      { name: 'Bookings', description: 'Booking management' },
      { name: 'Payments', description: 'Payment processing' },
      { name: 'Messaging', description: 'Messaging between students and professors' },
      { name: 'Reviews', description: 'Course and professor reviews' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

