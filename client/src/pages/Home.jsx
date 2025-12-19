import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Shield,
  Star,
  Users
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Home = () => {
  const { user, isStudent, isProfessor } = useAuth();

  const features = [
    {
      icon: <GraduationCap className="text-white" size={24} />,
      title: 'Expert Professors',
      description: 'Learn from verified professionals with years of teaching experience.',
      link: '/professors',
      linkText: 'Browse Experts',
      gradient: 'from-indigo-500 to-purple-500',
      span: 'col-span-12 md:col-span-8'
    },
    {
      icon: <Calendar className="text-white" size={24} />,
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your life.',
      link: '/professors',
      linkText: 'Book Now',
      gradient: 'from-pink-500 to-rose-500',
      span: 'col-span-12 md:col-span-4'
    },
    {
      icon: <BookOpen className="text-white" size={24} />,
      title: 'Curated Courses',
      description: 'Structured learning paths from beginner to master level.',
      link: '/courses',
      linkText: 'View Courses',
      gradient: 'from-cyan-500 to-blue-500',
      span: 'col-span-12 md:col-span-4'
    },
    {
      icon: <MessageSquare className="text-white" size={24} />,
      title: 'Direct Chat',
      description: 'Get help when you need it with instant messaging.',
      link: user ? '/messages' : '/register',
      linkText: user ? 'Open Messages' : 'Sign Up to Connect',
      gradient: 'from-emerald-500 to-teal-500',
      span: 'col-span-12 md:col-span-8'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 1.5rem 4rem',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #fdf2f8 100%)',
          zIndex: 0
        }}>
          {/* Floating Orbs */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite reverse'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            left: '30%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 10s ease-in-out infinite'
          }} />

          {/* Grid Pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.08) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '2rem',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <span style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.875rem' }}>
                🚀 Now live: Connect with 500+ experts
              </span>
            </div>

            {/* Main Heading */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em'
            }}>
              <span style={{ color: '#1e293b' }}>Master any skill,</span>
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                one-on-one.
              </span>
            </h1>

            {/* Subheading */}
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7
            }}>
              Accelerate your growth with personalized sessions, structured courses,
              and direct mentorship from industry leaders.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
              {!user ? (
                <>
                  <Link to="/register">
                    <button style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.875rem',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}>
                      Start Learning Free
                      <ArrowRight size={18} />
                    </button>
                  </Link>
                  <Link to="/professors">
                    <button style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2rem',
                      background: 'white',
                      color: '#1e293b',
                      border: '2px solid #e2e8f0',
                      borderRadius: '0.875rem',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                      transition: 'border-color 0.2s'
                    }}>
                      Browse Mentors
                    </button>
                  </Link>
                </>
              ) : (
                <Link to={isStudent ? '/student/dashboard' : '/professor/dashboard'}>
                  <button style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.875rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)'
                  }}>
                    Go to Dashboard
                    <ArrowRight size={18} />
                  </button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}>
              {[
                { value: '10k+', label: 'Active Learners' },
                { value: '500+', label: 'Expert Mentors' },
                { value: '4.9/5', label: 'Avg Rating' }
              ].map((stat, i) => (
                <div key={i} style={{
                  textAlign: 'center',
                  padding: '1.25rem 2rem',
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.25rem'
                  }}>{stat.value}</div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    fontWeight: 500
                  }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
          }
        `}</style>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section className="py-24 bg-gray-50/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to grow</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A complete platform designed to help you achieve your learning goals faster.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className={`${feature.span} relative group overflow-hidden rounded-3xl`}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="p-8 h-full flex flex-col justify-between relative z-10">
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>
                  <Link to={feature.link} className="inline-flex items-center text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {feature.linkText} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Decorative Gradient Blob */}
                <div className={`absolute -right-10 -bottom-10 w-64 h-64 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS & SOCIAL PROOF --- */}
      <section className="py-20 border-t border-gray-100 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            {[
              { label: 'Active Learners', value: '10k+', icon: <Users className="text-indigo-500" /> },
              { label: 'Expert Mentors', value: '500+', icon: <GraduationCap className="text-purple-500" /> },
              { label: 'Sessions Booking', value: '50k+', icon: <Calendar className="text-pink-500" /> },
              { label: 'Average Rating', value: '4.9/5', icon: <Star className="text-yellow-500" /> }
            ].map((stat, i) => (
              <div key={i} className="px-4">
                <div className="flex justify-center mb-4 opacity-80">{stat.icon}</div>
                <div className="text-4xl font-extrabold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div className="container">
          <div style={{
            position: 'relative',
            borderRadius: '2rem',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
            padding: '5rem 2rem',
            textAlign: 'center'
          }}>
            {/* Animated Glow Effects */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0 }}>
              <div style={{
                position: 'absolute',
                top: '-20%',
                left: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'pulse 4s ease-in-out infinite'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '10%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'pulse 4s ease-in-out infinite 2s'
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)'
              }} />
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                color: 'white',
                marginBottom: '1.5rem',
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}>
                Ready to transform your future?
              </h2>
              <p style={{
                fontSize: '1.125rem',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '2.5rem',
                maxWidth: '500px',
                margin: '0 auto 2.5rem'
              }}>
                Join thousands of students and mentors on LearnLink today.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {!user ? (
                  <Link to="/register">
                    <button style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2.5rem',
                      background: 'white',
                      color: '#4f46e5',
                      border: 'none',
                      borderRadius: '1rem',
                      fontWeight: 700,
                      fontSize: '1.0625rem',
                      cursor: 'pointer',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}>
                      Get Started Now
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </Link>
                ) : (
                  <Link to="/professors">
                    <button style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 2.5rem',
                      background: 'white',
                      color: '#4f46e5',
                      border: 'none',
                      borderRadius: '1rem',
                      fontWeight: 700,
                      fontSize: '1.0625rem',
                      cursor: 'pointer',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}>
                      Explore Professors
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </Link>
                )}
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                  ✨ Free to get started • No credit card required
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default Home;
