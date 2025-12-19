/**
 * PaymentService Unit Tests
 * 
 * Tests for payment processing.
 * CRITICAL per Security Profile - payment data never touches our database.
 */

beforeEach(() => {
    jest.resetModules();
});

describe('PaymentService', () => {
    let PaymentService;
    let mockDb;
    let mockTransaction;
    let mockBookingRepository;
    let mockCourseRepository;
    let mockPaymentRepository;
    let mockStudentRepository;
    let mockProfessorRepository;
    let mockAvailabilityRepository;
    let mockPaymentProvider;

    beforeEach(() => {
        mockTransaction = {
            commit: jest.fn().mockResolvedValue(undefined),
            rollback: jest.fn().mockResolvedValue(undefined),
        };

        mockDb = {
            sequelize: {
                transaction: jest.fn().mockResolvedValue(mockTransaction),
            },
        };

        mockBookingRepository = {
            findByIdWithDetails: jest.fn(),
        };

        mockCourseRepository = {
            findByIdWithDetails: jest.fn(),
        };

        mockPaymentRepository = {
            findPaidPayment: jest.fn(),
            create: jest.fn(),
            findByStudentId: jest.fn(),
        };

        mockStudentRepository = {
            findByUserId: jest.fn(),
        };

        mockProfessorRepository = {
            findById: jest.fn(),
        };

        mockAvailabilityRepository = {
            markAsBooked: jest.fn(),
        };

        mockPaymentProvider = {
            processPayment: jest.fn().mockResolvedValue({
                success: true,
                externalRef: 'mock_ref_123',
            }),
            getProviderName: jest.fn().mockReturnValue('mock'),
        };

        jest.doMock('../../../src/models', () => mockDb);
        jest.doMock('../../../src/repositories/BookingRepository', () => mockBookingRepository);
        jest.doMock('../../../src/repositories/CourseRepository', () => mockCourseRepository);
        jest.doMock('../../../src/repositories/PaymentRepository', () => mockPaymentRepository);
        jest.doMock('../../../src/repositories/StudentRepository', () => mockStudentRepository);
        jest.doMock('../../../src/repositories/ProfessorRepository', () => mockProfessorRepository);
        jest.doMock('../../../src/repositories/AvailabilityRepository', () => mockAvailabilityRepository);
        jest.doMock('../../../src/services/payment/MockPaymentProvider', () => {
            return jest.fn().mockImplementation(() => mockPaymentProvider);
        });

        PaymentService = require('../../../src/services/payment/PaymentService');
    });

    describe('processBookingPayment', () => {
        const mockStudent = { id: 1, userId: 10 };
        const mockBooking = {
            id: 1,
            studentId: 1,
            professorId: 2,
            availabilityId: 5,
            update: jest.fn().mockResolvedValue({}),
        };
        const mockProfessor = { id: 2, hourlyRate: 75.00 };

        it('should process booking payment successfully', async () => {
            mockBookingRepository.findByIdWithDetails.mockResolvedValue(mockBooking);
            mockStudentRepository.findByUserId.mockResolvedValue(mockStudent);
            mockPaymentRepository.findPaidPayment.mockResolvedValue(null);
            mockProfessorRepository.findById.mockResolvedValue(mockProfessor);
            mockPaymentRepository.create.mockResolvedValue({ id: 1, status: 'PAID' });

            const result = await PaymentService.processBookingPayment(10, 1);

            expect(result).toHaveProperty('status', 'PAID');
            expect(mockPaymentProvider.processPayment).toHaveBeenCalledWith(
                75.00,
                'USD',
                { bookingId: 1, studentId: 1 }
            );
            expect(mockBooking.update).toHaveBeenCalledWith({ status: 'CONFIRMED' });
            expect(mockAvailabilityRepository.markAsBooked).toHaveBeenCalledWith(5);
            expect(mockTransaction.commit).toHaveBeenCalled();
        });

        it('should throw error if booking not found', async () => {
            mockBookingRepository.findByIdWithDetails.mockResolvedValue(null);

            await expect(
                PaymentService.processBookingPayment(10, 999)
            ).rejects.toThrow('Booking not found');
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });

        it('should throw error if student does not own booking', async () => {
            mockBookingRepository.findByIdWithDetails.mockResolvedValue({ ...mockBooking, studentId: 99 });
            mockStudentRepository.findByUserId.mockResolvedValue(mockStudent);

            await expect(
                PaymentService.processBookingPayment(10, 1)
            ).rejects.toThrow('Unauthorized');
        });

        it('should throw error if already paid', async () => {
            mockBookingRepository.findByIdWithDetails.mockResolvedValue(mockBooking);
            mockStudentRepository.findByUserId.mockResolvedValue(mockStudent);
            mockPaymentRepository.findPaidPayment.mockResolvedValue({ id: 1, status: 'PAID' });

            await expect(
                PaymentService.processBookingPayment(10, 1)
            ).rejects.toThrow('Booking already paid');
        });

        it('should throw error if payment processing fails', async () => {
            mockBookingRepository.findByIdWithDetails.mockResolvedValue(mockBooking);
            mockStudentRepository.findByUserId.mockResolvedValue(mockStudent);
            mockPaymentRepository.findPaidPayment.mockResolvedValue(null);
            mockProfessorRepository.findById.mockResolvedValue(mockProfessor);
            mockPaymentProvider.processPayment.mockResolvedValue({ success: false });

            await expect(
                PaymentService.processBookingPayment(10, 1)
            ).rejects.toThrow('Payment processing failed');
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });
    });

    describe('processCoursePayment', () => {
        const mockStudent = { id: 1, userId: 10 };
        const mockCourse = {
            id: 1,
            professorId: 2,
            price: 199.99,
        };

        it('should process course payment successfully', async () => {
            mockCourseRepository.findByIdWithDetails.mockResolvedValue(mockCourse);
            mockStudentRepository.findByUserId.mockResolvedValue(mockStudent);
            mockPaymentRepository.findPaidPayment.mockResolvedValue(null);
            mockPaymentRepository.create.mockResolvedValue({ id: 1, status: 'PAID' });

            const result = await PaymentService.processCoursePayment(10, 1);

            expect(result).toHaveProperty('status', 'PAID');
            expect(mockPaymentProvider.processPayment).toHaveBeenCalledWith(
                199.99,
                'USD',
                { courseId: 1, studentId: 1 }
            );
            expect(mockTransaction.commit).toHaveBeenCalled();
        });

        it('should throw error if course not found', async () => {
            mockCourseRepository.findByIdWithDetails.mockResolvedValue(null);

            await expect(
                PaymentService.processCoursePayment(10, 999)
            ).rejects.toThrow('Course not found');
        });

        it('should throw error if student not found', async () => {
            mockCourseRepository.findByIdWithDetails.mockResolvedValue(mockCourse);
            mockStudentRepository.findByUserId.mockResolvedValue(null);

            await expect(
                PaymentService.processCoursePayment(999, 1)
            ).rejects.toThrow('Student not found');
        });

        it('should throw error if course already purchased', async () => {
            mockCourseRepository.findByIdWithDetails.mockResolvedValue(mockCourse);
            mockStudentRepository.findByUserId.mockResolvedValue(mockStudent);
            mockPaymentRepository.findPaidPayment.mockResolvedValue({ id: 1, status: 'PAID' });

            await expect(
                PaymentService.processCoursePayment(10, 1)
            ).rejects.toThrow('Course already purchased');
        });
    });

    describe('getStudentPayments', () => {
        it('should return student payments', async () => {
            mockStudentRepository.findByUserId.mockResolvedValue({ id: 1 });
            mockPaymentRepository.findByStudentId.mockResolvedValue([
                { id: 1, amount: 99.99 },
                { id: 2, amount: 49.99 },
            ]);

            const result = await PaymentService.getStudentPayments(10);

            expect(result).toHaveLength(2);
        });

        it('should throw error if student not found', async () => {
            mockStudentRepository.findByUserId.mockResolvedValue(null);

            await expect(
                PaymentService.getStudentPayments(999)
            ).rejects.toThrow('Student not found');
        });
    });

    describe('setPaymentProvider', () => {
        it('should allow switching payment providers (Strategy Pattern)', () => {
            const newProvider = {
                processPayment: jest.fn(),
                getProviderName: jest.fn().mockReturnValue('stripe'),
            };

            PaymentService.setPaymentProvider(newProvider);

            expect(PaymentService.paymentProvider.getProviderName()).toBe('stripe');
        });
    });
});
