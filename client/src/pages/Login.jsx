import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'PROFESSOR') {
        navigate('/professor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Side: Branding & Info */}
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
            Welcome back to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Future Learning
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md">
            Your personal gateway to world-class education. Connect with mentors, track your progress, and achieve your goals.
          </p>

          <div className="space-y-4">
            {[
              "Access to 500+ Expert Mentors",
              "Personalized Learning Paths",
              "Direct Messaging & Support"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                <CheckCircle2 className="text-indigo-500" size={20} />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-panel p-8 md:p-10 shadow-2xl border-white/50 backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
              <p className="text-gray-500 mt-2">Enter your details to proceed</p>
            </div>

            {error && <Alert variant="error" className="mb-6">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your password"
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
                  Sign In
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200/60 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Create free account
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

export default Login;
