/**
 * CourseService Unit Tests
 * 
 * Tests for course CRUD operations.
 * Critical for Course Management module per SAD.
 */

beforeEach(() => {
    jest.resetModules();
});

describe('CourseService', () => {
    let CourseService;
    let mockCourseRepository;
    let mockProfessorRepository;

    beforeEach(() => {
        mockCourseRepository = {
            findAllPublished: jest.fn(),
            findByIdWithDetails: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            findByProfessorId: jest.fn(),
        };

        mockProfessorRepository = {
            findByUserId: jest.fn(),
        };

        jest.doMock('../../../src/repositories/CourseRepository', () => mockCourseRepository);
        jest.doMock('../../../src/repositories/ProfessorRepository', () => mockProfessorRepository);

        CourseService = require('../../../src/services/CourseService');
    });

    describe('getAllCourses', () => {
        it('should return all published courses', async () => {
            const mockCourses = [
                { id: 1, tittle: 'Course 1', published: true },
                { id: 2, tittle: 'Course 2', published: true },
            ];
            mockCourseRepository.findAllPublished.mockResolvedValue(mockCourses);

            const result = await CourseService.getAllCourses();

            expect(result).toHaveLength(2);
            expect(mockCourseRepository.findAllPublished).toHaveBeenCalledWith({});
        });

        it('should pass filters to repository', async () => {
            const filters = { category: 'Programming', level: 'BEGINNER' };
            mockCourseRepository.findAllPublished.mockResolvedValue([]);

            await CourseService.getAllCourses(filters);

            expect(mockCourseRepository.findAllPublished).toHaveBeenCalledWith(filters);
        });
    });

    describe('getCourseById', () => {
        it('should return course with calculated average rating', async () => {
            const mockCourse = {
                id: 1,
                tittle: 'Test Course',
                reviews: [
                    { rating: 5 },
                    { rating: 4 },
                    { rating: 3 },
                ],
                toJSON: function () { return { ...this }; },
            };
            mockCourseRepository.findByIdWithDetails.mockResolvedValue(mockCourse);

            const result = await CourseService.getCourseById(1);

            expect(result.averageRating).toBe(4); // (5+4+3)/3 = 4
        });

        it('should return 0 rating for courses with no reviews', async () => {
            const mockCourse = {
                id: 1,
                tittle: 'Test Course',
                reviews: [],
                toJSON: function () { return { ...this }; },
            };
            mockCourseRepository.findByIdWithDetails.mockResolvedValue(mockCourse);

            const result = await CourseService.getCourseById(1);

            expect(result.averageRating).toBe(0);
        });

        it('should throw error if course not found', async () => {
            mockCourseRepository.findByIdWithDetails.mockResolvedValue(null);

            await expect(CourseService.getCourseById(999)).rejects.toThrow('Course not found');
        });
    });

    describe('createCourse', () => {
        it('should create course for valid professor', async () => {
            const professor = { id: 1, userId: 10 };
            mockProfessorRepository.findByUserId.mockResolvedValue(professor);
            mockCourseRepository.create.mockResolvedValue({ id: 1, tittle: 'New Course' });

            const courseData = { tittle: 'New Course', price: 99.99 };
            const result = await CourseService.createCourse(10, courseData);

            expect(mockCourseRepository.create).toHaveBeenCalledWith({
                professorId: 1,
                ...courseData,
            });
            expect(result).toHaveProperty('id');
        });

        it('should throw error if professor not found', async () => {
            mockProfessorRepository.findByUserId.mockResolvedValue(null);

            await expect(
                CourseService.createCourse(999, { tittle: 'Test' })
            ).rejects.toThrow('Professor profile not found');
        });
    });

    describe('updateCourse', () => {
        let mockCourse;

        beforeEach(() => {
            mockCourse = {
                id: 1,
                professorId: 1,
                tittle: 'Old Title',
                update: jest.fn().mockResolvedValue({ id: 1, tittle: 'New Title' }),
            };
        });

        it('should update course with allowed fields', async () => {
            mockCourseRepository.findById.mockResolvedValue(mockCourse);
            mockProfessorRepository.findByUserId.mockResolvedValue({ id: 1, userId: 10 });

            await CourseService.updateCourse(10, 1, { tittle: 'New Title', price: 199.99 });

            expect(mockCourse.update).toHaveBeenCalledWith({
                tittle: 'New Title',
                price: 199.99,
            });
        });

        it('should throw error if course not found', async () => {
            mockCourseRepository.findById.mockResolvedValue(null);

            await expect(
                CourseService.updateCourse(10, 999, { tittle: 'New' })
            ).rejects.toThrow('Course not found');
        });

        it('should throw unauthorized if professor does not own course', async () => {
            mockCourseRepository.findById.mockResolvedValue({ ...mockCourse, professorId: 2 });
            mockProfessorRepository.findByUserId.mockResolvedValue({ id: 1, userId: 10 });

            await expect(
                CourseService.updateCourse(10, 1, { tittle: 'New' })
            ).rejects.toThrow('Unauthorized');
        });
    });

    describe('deleteCourse', () => {
        it('should delete course owned by professor', async () => {
            mockCourseRepository.findById.mockResolvedValue({ id: 1, professorId: 1 });
            mockProfessorRepository.findByUserId.mockResolvedValue({ id: 1 });
            mockCourseRepository.delete.mockResolvedValue(true);

            const result = await CourseService.deleteCourse(10, 1);

            expect(result).toBe(true);
            expect(mockCourseRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw error if course not found', async () => {
            mockCourseRepository.findById.mockResolvedValue(null);

            await expect(CourseService.deleteCourse(10, 999)).rejects.toThrow('Course not found');
        });

        it('should throw unauthorized if not owner', async () => {
            mockCourseRepository.findById.mockResolvedValue({ id: 1, professorId: 2 });
            mockProfessorRepository.findByUserId.mockResolvedValue({ id: 1 });

            await expect(CourseService.deleteCourse(10, 1)).rejects.toThrow('Unauthorized');
        });
    });

    describe('getMyCourses', () => {
        it('should return courses for professor', async () => {
            mockProfessorRepository.findByUserId.mockResolvedValue({ id: 1 });
            mockCourseRepository.findByProfessorId.mockResolvedValue([
                { id: 1, tittle: 'My Course 1' },
                { id: 2, tittle: 'My Course 2' },
            ]);

            const result = await CourseService.getMyCourses(10);

            expect(result).toHaveLength(2);
        });

        it('should throw error if professor not found', async () => {
            mockProfessorRepository.findByUserId.mockResolvedValue(null);

            await expect(CourseService.getMyCourses(999)).rejects.toThrow('Professor profile not found');
        });
    });
});
