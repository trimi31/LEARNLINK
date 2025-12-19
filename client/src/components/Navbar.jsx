import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import Button from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  GraduationCap
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isStudent, isProfessor, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getDisplayName = () => {
    if (user?.profile?.fullName) return user.profile.fullName;
    const emailName = user?.email?.split('@')[0] || '';
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  const getInitials = () => {
    const name = user?.profile?.fullName;
    if (name && name.trim()) {
      const parts = name.trim().split(' ').filter(p => p);
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      } else if (parts.length === 1 && parts[0]) {
        return parts[0][0].toUpperCase();
      }
    }
    // Fallback to first letter of email
    const email = user?.email;
    if (email && email.includes('@')) {
      return email[0].toUpperCase();
    }
    return '?';
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ to, children, icon }) => (
    <Link to={to} className={`navbar-link flex items-center gap-2 ${isActive(to) ? 'active' : ''}`}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </Link>
  );

  return (
    <nav className={`navbar-glass transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="container h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap size={20} />
          </div>
          <span className="font-display">LearnLink</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/professors">Find Professors</NavLink>
          <NavLink to="/courses">Courses</NavLink>

          {!loading && user ? (
            <div className="flex items-center ml-4 pl-4 border-l border-gray-200 gap-4">
              {isStudent && (
                <NavLink to="/student/dashboard" icon={<LayoutDashboard size={16} />}>
                  Dashboard
                </NavLink>
              )}

              {isProfessor && (
                <NavLink to="/professor/dashboard" icon={<LayoutDashboard size={16} />}>
                  Dashboard
                </NavLink>
              )}

              <Link to="/messages" className={`p-2 rounded-full hover:bg-gray-100 relative ${isActive('/messages') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}>
                <MessageSquare size={20} />
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full border border-transparent hover:border-gray-200 transition-all"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {getInitials()}
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden z-50 origin-top-right"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="p-1">
                        <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          <User size={16} /> Profile
                        </Link>
                        <Link to={isProfessor ? '/professor/dashboard' : '/student/dashboard'} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        {isProfessor && (
                          <Link to="/professor/availability" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                            <Calendar size={16} /> Availability
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100 p-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut size={16} /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : !loading && (
            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden shadow-lg"
          >
            <div className="p-4 space-y-3">
              <Link to="/professors" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Find Professors</Link>
              <Link to="/courses" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Courses</Link>
              {user ? (
                <>
                  <Link to={isProfessor ? '/professor/dashboard' : '/student/dashboard'} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                  <Link to="/messages" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Messages</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
                </>
              ) : (
                <div className="grid gap-2 pt-2">
                  <Link to="/login"><Button fullWidth variant="secondary">Log in</Button></Link>
                  <Link to="/register"><Button fullWidth variant="primary">Get Started</Button></Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
