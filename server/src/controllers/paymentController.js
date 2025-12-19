const PaymentService = require('../services/payment/PaymentService');

class PaymentController {
  async checkout(req, res, next) {
    try {
      const { bookingId, courseId } = req.body;

      if (!bookingId && !courseId) {
        throw new Error('Either bookingId or courseId is required');
      }

      let payment;
      if (bookingId) {
        payment = await PaymentService.processBookingPayment(req.userId, bookingId);
      } else {
        payment = await PaymentService.processCoursePayment(req.userId, courseId);
      }

      res.status(201).json({
        message: 'Payment processed successfully',
        payment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyPayments(req, res, next) {
    try {
      const payments = await PaymentService.getStudentPayments(req.userId);
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();

