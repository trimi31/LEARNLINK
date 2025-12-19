// AuthService.js - handles user registration and login
// Leutrim: this is the main authentication service for the app

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const UserRepository = require('../repositories/UserRepository');
const ProfileRepository = require('../repositories/ProfileRepository');
const StudentRepository = require('../repositories/StudentRepository');
const ProfessorRepository = require('../repositories/ProfessorRepository');
const db = require('../models');

class AuthService {
  // Leutrim: register a new user (student or professor)
  async register(fullName, email, password, role) {
    // check if user already exists with this email
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // only allow student or professor roles
    if (!['STUDENT', 'PROFESSOR'].includes(role)) {
      throw new Error('Invalid role');
    }

    // hash the password so we dont store it in plain text
    // 10 is the salt rounds - good balance between security and speed
    const passwordHash = await bcrypt.hash(password, 10);

    // use transaction so all records are created together or none at all
    const transaction = await db.sequelize.transaction();

    try {
      // create the base user record
      const user = await db.User.create({
        email,
        passwordHash,
        role,
      }, { transaction });

      // every user needs a profile for their display name and bio
      await db.Profile.create({
        userId: user.id,
        fullName,
      }, { transaction });

      // create the role-specific record
      // students and professors have different fields so they need separate tables
      if (role === 'STUDENT') {
        await db.Student.create({
          userId: user.id,
        }, { transaction });
      } else {
        await db.Professor.create({
          userId: user.id,
        }, { transaction });
      }

      await transaction.commit();

      // get the full user object with all relations
      const completeUser = await UserRepository.findByIdWithRelations(user.id);
      const token = this.generateToken(completeUser);
      return { user: completeUser, token };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Leutrim: login with email and password
  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // dont tell them if email exists for security
      throw new Error('Invalid credentials');
    }

    // compare the password with the stored hash
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // get full user data including profile and role
    const completeUser = await UserRepository.findByIdWithRelations(user.id);
    const token = this.generateToken(completeUser);
    return { user: completeUser, token };
  }

  // create a JWT token for the user
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  // verify a JWT token is valid
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = new AuthService();
