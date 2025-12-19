// BookingService.js - handles all booking-related business logic
// Labinot: this is the core service for managing student-professor appointments

const BookingRepository = require('../repositories/BookingRepository');
const AvailabilityRepository = require('../repositories/AvailabilityRepository');
const StudentRepository = require('../repositories/StudentRepository');
const ProfessorRepository = require('../repositories/ProfessorRepository');
const db = require('../models');

class BookingService {

    // Labinot: creates a new booking for a student
    // using transactions so if anything fails, nothing gets saved
    async createBooking(userId, data) {
        const transaction = await db.sequelize.transaction();

        try {
            // first check if the user is actually a student
            const student = await StudentRepository.findByUserId(userId);
            if (!student) {
                throw new Error('Student profile not found');
            }

            // lock the row so two students cant book the same slot at once
            // this prevents race conditions - from the concurrency lecture
            const availability = await db.Availability.findByPk(data.availabilityId, {
                lock: transaction.LOCK.UPDATE,
                transaction,
            });

            if (!availability) {
                throw new Error('Availability slot not found');
            }

            // someone already booked it
            if (availability.isBooked) {
                throw new Error('This slot is already booked');
            }

            // cant book something thats already passed
            if (new Date(availability.startTime) < new Date()) {
                throw new Error('Cannot book a slot in the past');
            }

            // all checks passed, create the booking
            const booking = await db.Booking.create({
                studentId: student.id,
                professorId: availability.professorId,
                availabilityId: data.availabilityId,
                courseId: data.courseId || null,
                status: 'PENDING',  // starts as pending until professor confirms
                notes: data.notes || null,
            }, { transaction });

            // save everything
            await transaction.commit();

            // return the full booking with all related data
            return await BookingRepository.findByIdWithDetails(booking.id);
        } catch (error) {
            // something went wrong, undo everything
            await transaction.rollback();
            throw error;
        }
    }

    // get all bookings for a student
    async getMyBookings(userId) {
        const student = await StudentRepository.findByUserId(userId);
        if (!student) {
            throw new Error('Student profile not found');
        }

        return await BookingRepository.findByStudentId(student.id);
    }

    // get all bookings for a professor so they can see whos booked them
    async getProfessorBookings(userId) {
        const professor = await ProfessorRepository.findByUserId(userId);
        if (!professor) {
            throw new Error('Professor profile not found');
        }

        return await BookingRepository.findByProfessorId(professor.id);
    }

    // Labinot: cancel a booking - both student and professor can do this
    async cancelBooking(userId, bookingId) {
        const transaction = await db.sequelize.transaction();

        try {
            // lock the booking row
            const booking = await db.Booking.findByPk(bookingId, {
                lock: transaction.LOCK.UPDATE,
                transaction,
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            // check if this user is allowed to cancel
            // we need to check both student and professor cause either can cancel
            const student = await StudentRepository.findByUserId(userId);
            const professor = await ProfessorRepository.findByUserId(userId);

            const isStudent = student && booking.studentId === student.id;
            const isProfessor = professor && booking.professorId === professor.id;

            if (!isStudent && !isProfessor) {
                throw new Error('Unauthorized');
            }

            // cant cancel completed or already canceled bookings
            if (booking.status === 'COMPLETED' || booking.status === 'CANCELED') {
                throw new Error('Cannot cancel this booking');
            }

            await booking.update({ status: 'CANCELED' }, { transaction });

            // important - free up the slot so others can book it
            await db.Availability.update(
                { isBooked: false },
                { where: { id: booking.availabilityId }, transaction }
            );

            await transaction.commit();

            return await BookingRepository.findByIdWithDetails(bookingId);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // professor confirms a booking request
    async confirmBooking(userId, bookingId) {
        const professor = await ProfessorRepository.findByUserId(userId);
        if (!professor) {
            throw new Error('Professor profile not found');
        }

        const booking = await db.Booking.findByPk(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        // only the professor who owns the booking can confirm it
        if (booking.professorId !== professor.id) {
            throw new Error('Unauthorized');
        }

        if (booking.status !== 'PENDING') {
            throw new Error('Only pending bookings can be confirmed');
        }

        await booking.update({ status: 'CONFIRMED' });

        // mark the slot as taken
        await db.Availability.update(
            { isBooked: true },
            { where: { id: booking.availabilityId } }
        );

        return await BookingRepository.findByIdWithDetails(bookingId);
    }

    // mark booking as done after the session
    async completeBooking(userId, bookingId) {
        const professor = await ProfessorRepository.findByUserId(userId);
        if (!professor) {
            throw new Error('Professor profile not found');
        }

        const booking = await db.Booking.findByPk(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.professorId !== professor.id) {
            throw new Error('Unauthorized');
        }

        // can only complete confirmed bookings
        if (booking.status !== 'CONFIRMED') {
            throw new Error('Only confirmed bookings can be completed');
        }

        await booking.update({ status: 'COMPLETED' });

        return await BookingRepository.findByIdWithDetails(bookingId);
    }
}

module.exports = new BookingService();
