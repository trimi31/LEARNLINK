const { body, param, query } = require('express-validator');

const registerValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['STUDENT', 'PROFESSOR'])
    .withMessage('Role must be STUDENT or PROFESSOR'),
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const profileUpdateValidator = [
  body('fullName').optional().isString(),
  body('bio').optional().isString(),
  body('avatarUrl').optional().isURL().withMessage('Must be a valid URL'),
  body('phone').optional().isString(),
  body('location').optional().isString(),
  body('education').optional().isString(),
];

const courseCreateValidator = [
  body('tittle').notEmpty().withMessage('Tittle is required'),
  body('description').optional().isString(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category').optional().isString(),
  body('level')
    .optional()
    .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    .withMessage('Level must be BEGINNER, INTERMEDIATE, or ADVANCED'),
  body('published').optional().isBoolean(),
];

// For updates - all fields optional
const courseUpdateValidator = [
  body('tittle').optional().isString(),
  body('description').optional().isString(),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isString(),
  body('level')
    .optional()
    .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    .withMessage('Level must be BEGINNER, INTERMEDIATE, or ADVANCED'),
  body('published').optional().isBoolean(),
];

const lessonCreateValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('contentUrl').optional().isString(), // Allow any string for URL
  body('durationMinutes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Duration must be a positive integer'),
];

const availabilityCreateValidator = [
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
  body('timezone').optional().isString(),
];

const bookingCreateValidator = [
  body('availabilityId').isUUID().withMessage('Valid availability ID is required'),
  body('courseId').optional().isUUID(),
  body('notes').optional().isString(),
];

const paymentCheckoutValidator = [
  body('bookingId').optional().isUUID(),
  body('courseId').optional().isUUID(),
];

const reviewCreateValidator = [
  body('professorId').optional().isUUID(),
  body('courseId').optional().isUUID(),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString(),
];

const messageCreateValidator = [
  body('content').notEmpty().withMessage('Message content is required'),
];

const conversationCreateValidator = [
  body('professorId').isUUID().withMessage('Valid professor ID is required'),
];

const uuidParamValidator = [
  param('id').isUUID().withMessage('Valid ID is required'),
];

module.exports = {
  registerValidator,
  loginValidator,
  profileUpdateValidator,
  courseCreateValidator,
  courseUpdateValidator,
  lessonCreateValidator,
  availabilityCreateValidator,
  bookingCreateValidator,
  paymentCheckoutValidator,
  reviewCreateValidator,
  messageCreateValidator,
  conversationCreateValidator,
  uuidParamValidator,
};
