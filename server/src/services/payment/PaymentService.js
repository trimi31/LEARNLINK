// PaymentService.js - handles all payment processing
// Dren: this connects to the payment provider and records transactions

const PaymentRepository = require('../../repositories/PaymentRepository');
const BookingRepository = require('../../repositories/BookingRepository');
const CourseRepository = require('../../repositories/CourseRepository');
const AvailabilityRepository = require('../../repositories/AvailabilityRepository');
const StudentRepository = require('../../repositories/StudentRepository');
const ProfessorRepository = require('../../repositories/ProfessorRepository');
const MockPaymentProvider = require('./MockPaymentProvider');
const db = require('../../models');

class PaymentService {
  constructor() {
    // Dren: we use the strategy pattern here so we can swap payment providers later
    // right now we use mock but could switch to Stripe easily
    this.paymentProvider = new MockPaymentProvider();
  }

  // setter so we can change providers without modifying the class
  setPaymentProvider(provider) {
    this.paymentProvider = provider;
  }

  // Dren: process payment for a booking (time slot with professor)
  async processBookingPayment(userId, bookingId) {
    const transaction = await db.sequelize.transaction();

    try {
      // get the booking first
      const booking = await BookingRepository.findByIdWithDetails(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // make sure the person paying actually owns this booking
      const student = await StudentRepository.findByUserId(userId);
      if (!student || booking.studentId !== student.id) {
        throw new Error('Unauthorized');
      }

      // check if theyve already paid so we dont charge twice
      const existingPayment = await PaymentRepository.findPaidPayment(
        student.id,
        bookingId
      );
      if (existingPayment) {
        throw new Error('Booking already paid');
      }

      // get the professors rate to know how much to charge
      const professor = await ProfessorRepository.findById(booking.professorId);
      const amount = professor.hourlyRate || 50.00; // default to 50 if not set

      // actually process the payment through our provider
      const paymentResult = await this.paymentProvider.processPayment(
        amount,
        'USD',
        { bookingId, studentId: student.id }
      );

      if (!paymentResult.success) {
        throw new Error('Payment processing failed');
      }

      // save the payment record to our database
      const payment = await PaymentRepository.create({
        studentId: student.id,
        professorId: booking.professorId,
        bookingId: booking.id,
        amount,
        currency: 'USD',
        provider: this.paymentProvider.getProviderName(),
        status: 'PAID',
        externalRef: paymentResult.externalRef, // reference from stripe/paypal/etc
      });

      // payment successful, confirm the booking automatically
      await booking.update({ status: 'CONFIRMED' });

      // mark the time slot as taken
      await AvailabilityRepository.markAsBooked(booking.availabilityId);

      await transaction.commit();

      return payment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Dren: process payment for buying a course
  async processCoursePayment(userId, courseId) {
    const transaction = await db.sequelize.transaction();

    try {
      // get course info including price
      const course = await CourseRepository.findByIdWithDetails(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // verify the buyer is a student
      const student = await StudentRepository.findByUserId(userId);
      if (!student) {
        throw new Error('Student not found');
      }

      // prevent duplicate purchases
      const existingPayment = await PaymentRepository.findPaidPayment(
        student.id,
        null,
        courseId
      );
      if (existingPayment) {
        throw new Error('Course already purchased');
      }

      // charge the student
      const paymentResult = await this.paymentProvider.processPayment(
        course.price,
        'USD',
        { courseId, studentId: student.id }
      );

      if (!paymentResult.success) {
        throw new Error('Payment processing failed');
      }

      // record the purchase
      const payment = await PaymentRepository.create({
        studentId: student.id,
        professorId: course.professorId,
        courseId: course.id,
        amount: course.price,
        currency: 'USD',
        provider: this.paymentProvider.getProviderName(),
        status: 'PAID',
        externalRef: paymentResult.externalRef,
      });

      await transaction.commit();

      return payment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // get all payments made by a student for their history page
  async getStudentPayments(userId) {
    const student = await StudentRepository.findByUserId(userId);
    if (!student) {
      throw new Error('Student not found');
    }

    return await PaymentRepository.findByStudentId(student.id);
  }
}

module.exports = new PaymentService();
