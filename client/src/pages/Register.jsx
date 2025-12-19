import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowRight, UserCircle2, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const user = await register(formData.fullName, formData.email, formData.password, formData.role);

      if (user.role === 'PROFESSOR') {
        navigate('/professor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Side: Branding */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <GraduationCap size={28} />
            </div>
            <span className="text-2xl font-bold font-display text-gray-900">LearnLink</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Start your journey <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              with experts.
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md">
            Join thousands of learners and educators transforming the future of education.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-white/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-indigo-100/50 flex items-center justify-center text-indigo-600 shrink-0">
                <UserCircle2 size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">For Students</h3>
                <p className="text-sm text-gray-500">Access world-class education from verified experts.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-white/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-purple-100/50 flex items-center justify-center text-purple-600 shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">For Professors</h3>
                <p className="text-sm text-gray-500">Share your knowledge and grow your audience.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-panel p-8 md:p-10 shadow-2xl border-white/50 backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="text-gray-500 mt-2">Join us in seconds</p>
            </div>

            {error && <Alert variant="error" className="mb-6">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${formData.role === 'STUDENT'
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <UserCircle2 size={24} className={formData.role === 'STUDENT' ? 'text-indigo-600' : 'text-gray-400'} />
                  <span className={`text-sm font-semibold ${formData.role === 'STUDENT' ? 'text-indigo-900' : 'text-gray-600'}`}>Student</span>
                  {formData.role === 'STUDENT' && (
                    <div className="absolute top-2 right-2 text-indigo-600">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'PROFESSOR' })}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${formData.role === 'PROFESSOR'
                    ? 'border-purple-500 bg-purple-50/50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <GraduationCap size={24} className={formData.role === 'PROFESSOR' ? 'text-purple-600' : 'text-gray-400'} />
                  <span className={`text-sm font-semibold ${formData.role === 'PROFESSOR' ? 'text-purple-900' : 'text-gray-600'}`}>Professor</span>
                  {formData.role === 'PROFESSOR' && (
                    <div className="absolute top-2 right-2 text-purple-600">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <Input
                  label="Full Name"
                  type="text"
                  icon={<UserCircle2 size={18} />}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="Email address"
                  type="email"
                  icon={<Mail size={18} />}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  icon={<Lock size={18} />}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="Confirm Password"
                  type="password"
                  icon={<Lock size={18} />}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={<ArrowRight size={18} />}
                  className="w-full justify-center shadow-indigo-500/25 shadow-lg"
                >
                  Create Account
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200/60 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>

      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Register;
