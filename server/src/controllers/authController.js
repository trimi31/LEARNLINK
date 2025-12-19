const AuthService = require('../services/AuthService');

class AuthController {
  async register(req, res, next) {
    try {
      const { fullName, email, password, role } = req.body;
      const result = await AuthService.register(fullName, email, password, role);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
          profile: result.user.profile,
          studentProfile: result.user.studentProfile,
          professorProfile: result.user.professorProfile,
        },
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
          profile: result.user.profile,
          studentProfile: result.user.studentProfile,
          professorProfile: result.user.professorProfile,
        },
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      res.json({
        success: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          profile: req.user.profile,
          studentProfile: req.user.studentProfile,
          professorProfile: req.user.professorProfile,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

