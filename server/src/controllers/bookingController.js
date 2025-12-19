const BookingService = require('../services/BookingService');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const booking = await BookingService.createBooking(req.userId, req.body);
      res.status(201).json({
        message: 'Booking created successfully',
        booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req, res, next) {
    try {
      const bookings = await BookingService.getMyBookings(req.userId);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }

  async getProfessorBookings(req, res, next) {
    try {
      const bookings = await BookingService.getProfessorBookings(req.userId);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const booking = await BookingService.cancelBooking(req.userId, req.params.id);
      res.json({
        message: 'Booking canceled successfully',
        booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmBooking(req, res, next) {
    try {
      const booking = await BookingService.confirmBooking(req.userId, req.params.id);
      res.json({
        message: 'Booking confirmed successfully',
        booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async completeBooking(req, res, next) {
    try {
      const booking = await BookingService.completeBooking(req.userId, req.params.id);
      res.json({
        message: 'Booking completed successfully',
        booking,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();

