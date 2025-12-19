import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { CourseCardSkeleton } from '../components/ui/Skeleton';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: '', level: '', search: '' });

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await courseApi.getAll(filters);
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleFilter = (e) => {
    e.preventDefault();
    loadCourses();
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      'var(--gradient-primary)',
      'var(--gradient-accent)',
      'var(--gradient-secondary)',
      'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    ];
    return gradients[index % gradients.length];
  };
  // Render skeleton loading grid
  const renderSkeletons = () => (
    <div className="container">
      <div className="page-header">
        <div className="section-eyebrow">Expand Your Knowledge</div>
        <h1 style={{ marginBottom: '0.375rem' }}>Browse Courses</h1>
        <p style={{ fontSize: '1rem' }}>
          Explore comprehensive courses designed by expert professors
        </p>
      </div>
      <Card className="filter-card card-elevated" style={{ marginBottom: '2rem', padding: '1.5rem', opacity: 0.6 }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 2, height: 38, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }} />
          <div style={{ flex: 1, height: 38, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }} />
          <div style={{ width: 100, height: 38, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }} />
        </div>
      </Card>
      <div className="grid-cards">
        {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
      </div>
    </div>
  );

  if (loading) return renderSkeletons();

  return (
    <div style={{ minHeight: '100vh', background: '#fafafb' }}>
      {/* Modern Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        padding: '4rem 1.5rem 6rem',
        marginBottom: '-3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '0.375rem 0.875rem',
            borderRadius: '2rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>📚 {courses.length} Courses Available</span>
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            margin: '0 0 0.75rem',
            letterSpacing: '-0.02em'
          }}>Explore Courses</h1>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '1.125rem',
            margin: 0,
            maxWidth: '500px'
          }}>Discover world-class courses taught by industry experts</p>
        </div>
      </div>

      <div className="container">
        {/* Modern Filter Bar */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 20
        }}>
          <form onSubmit={handleFilter} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: '250px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Search
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.875rem 0.75rem 2.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.625rem',
                    fontSize: '0.9375rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Category
              </label>
              <input
                type="text"
                placeholder="Any category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.875rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.625rem',
                  fontSize: '0.9375rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '140px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Level
              </label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.875rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.625rem',
                  fontSize: '0.9375rem',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.625rem',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Search
            </button>

            {(filters.category || filters.level || filters.search) && (
              <button
                type="button"
                onClick={() => setFilters({ category: '', level: '', search: '' })}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'transparent',
                  color: '#64748b',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.625rem',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Course Grid */}
        {courses.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '3rem'
          }}>
            {courses.map((course, index) => (
              <div
                key={course.id}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                }}
              >
                {/* Course Image/Banner */}
                <div style={{
                  height: '140px',
                  background: `linear-gradient(135deg, ${['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][index % 5]} 0%, ${['#8b5cf6', '#a855f7', '#f472b6', '#fbbf24', '#34d399'][index % 5]} 100%)`,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '3rem', opacity: 0.3 }}>📖</span>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.95)',
                      color: '#1e293b',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>{course.level}</span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'white',
                    color: '#6366f1',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 800,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    ${course.price}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem' }}>
                  {course.category && (
                    <span style={{
                      display: 'inline-block',
                      color: '#8b5cf6',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem'
                    }}>{course.category}</span>
                  )}
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    margin: '0 0 0.5rem',
                    lineHeight: 1.3
                  }}>{course.tittle}</h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    margin: '0 0 1rem',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{course.description || 'No description available.'}</p>

                  {/* Professor */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: getAvatarGradient(index),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8125rem',
                      fontWeight: 600
                    }}>
                      {(course.professor?.user?.profile?.fullName || 'P')[0]}
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
                      {course.professor?.user?.profile?.fullName || 'Professor'}
                    </span>
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: '#64748b' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {course.averageRating?.toFixed(1) || 'New'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: '#64748b' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        {course.lessons?.length || 0} lessons
                      </span>
                    </div>
                    <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: '#6366f1',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}>
                        View
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem' }}>
              No Courses Found
            </h3>
            <p style={{ color: '#64748b', margin: '0 0 1.5rem' }}>
              Try adjusting your filters or check back later
            </p>
            {(filters.category || filters.level || filters.search) && (
              <button
                onClick={() => setFilters({ category: '', level: '', search: '' })}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.625rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
