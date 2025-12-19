'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Hash passwords
    const studentPasswordHash = await bcrypt.hash('student123', 10);
    const professorPasswordHash = await bcrypt.hash('professor123', 10);

    // Create users
    const studentUserId = uuidv4();
    const professorUserId = uuidv4();

    await queryInterface.bulkInsert('users', [
      {
        id: studentUserId,
        email: 'student@test.com',
        passwordHash: studentPasswordHash,
        role: 'STUDENT',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: professorUserId,
        email: 'professor@test.com',
        passwordHash: professorPasswordHash,
        role: 'PROFESSOR',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Create profiles
    await queryInterface.bulkInsert('profiles', [
      {
        id: uuidv4(),
        userId: studentUserId,
        fullName: 'John Student',
        bio: 'Eager to learn new things!',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        phone: '+1234567890',
        location: 'New York, USA',
        education: 'High School Graduate',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        userId: professorUserId,
        fullName: 'Dr. Sarah Professor',
        bio: 'Experienced educator with 10+ years in teaching',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        phone: '+0987654321',
        location: 'Boston, USA',
        education: 'PhD in Computer Science',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Create student and professor
    const studentId = uuidv4();
    const professorId = uuidv4();

    await queryInterface.bulkInsert('students', [
      {
        id: studentId,
        userId: studentUserId,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert('professors', [
      {
        id: professorId,
        userId: professorUserId,
        headline: 'Expert Web Developer & Computer Science Teacher',
        subjects: JSON.stringify(['JavaScript', 'Python', 'Web Development', 'Data Structures']),
        hourlyRate: 50.00,
        verified: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Create courses
    const courseId1 = uuidv4();
    const courseId2 = uuidv4();

    await queryInterface.bulkInsert('courses', [
      {
        id: courseId1,
        professorId: professorId,
        tittle: 'Introduction to JavaScript',
        description: 'Learn JavaScript from scratch with hands-on projects',
        price: 99.99,
        category: 'Programming',
        level: 'BEGINNER',
        published: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: courseId2,
        professorId: professorId,
        tittle: 'Advanced React Development',
        description: 'Master React with advanced patterns and best practices',
        price: 149.99,
        category: 'Web Development',
        level: 'ADVANCED',
        published: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Create lessons
    await queryInterface.bulkInsert('lessons', [
      {
        id: uuidv4(),
        courseId: courseId1,
        title: 'Variables and Data Types',
        description: 'Understanding JavaScript variables, let, const, and data types',
        contentUrl: 'https://example.com/videos/js-lesson-1',
        durationMinutes: 30,
        price: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        courseId: courseId1,
        title: 'Functions and Scope',
        description: 'Deep dive into JavaScript functions and scope',
        contentUrl: 'https://example.com/videos/js-lesson-2',
        durationMinutes: 45,
        price: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        courseId: courseId2,
        title: 'React Hooks Mastery',
        description: 'Advanced patterns with useState, useEffect, and custom hooks',
        contentUrl: 'https://example.com/videos/react-lesson-1',
        durationMinutes: 60,
        price: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Create availability slots
    const availabilityId1 = uuidv4();
    const availabilityId2 = uuidv4();

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(11, 0, 0, 0);

    const dayAfter = new Date(now);
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(14, 0, 0, 0);

    const dayAfterEnd = new Date(dayAfter);
    dayAfterEnd.setHours(15, 0, 0, 0);

    await queryInterface.bulkInsert('availability', [
      {
        id: availabilityId1,
        professorId: professorId,
        startTime: tomorrow,
        endTime: tomorrowEnd,
        timezone: 'America/New_York',
        isBooked: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: availabilityId2,
        professorId: professorId,
        startTime: dayAfter,
        endTime: dayAfterEnd,
        timezone: 'America/New_York',
        isBooked: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    console.log('✅ Seeded demo data successfully!');
    console.log('📧 Student Login: student@test.com / student123');
    console.log('📧 Professor Login: professor@test.com / professor123');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('messages', null, {});
    await queryInterface.bulkDelete('conversations', null, {});
    await queryInterface.bulkDelete('payments', null, {});
    await queryInterface.bulkDelete('bookings', null, {});
    await queryInterface.bulkDelete('availability', null, {});
    await queryInterface.bulkDelete('lessons', null, {});
    await queryInterface.bulkDelete('courses', null, {});
    await queryInterface.bulkDelete('professors', null, {});
    await queryInterface.bulkDelete('students', null, {});
    await queryInterface.bulkDelete('profiles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};

