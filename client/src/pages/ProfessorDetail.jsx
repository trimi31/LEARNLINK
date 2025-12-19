import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { professorApi } from '../api/professorApi';
import { availabilityApi } from '../api/availabilityApi';
import { useAuth } from '../store/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import AuthPrompt from '../components/AuthPrompt';

const ProfessorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isStudent, isAuthenticated } = useAuth();
  const [professor, setProfessor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');

  const loadProfessor = useCallback(async () => {
    try {
      const response = await professorApi.getById(id);
      setProfessor(response.data);
    } catch (err) {
      setError('Failed to load professor details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadAvailability = useCallback(async () => {
    try {
      const response = await availabilityApi.getByProfessor(id);
      const upcoming = response.data.filter(
        slot => new Date(slot.startTime) > new Date() && !slot.isBooked
      );
      setAvailability(upcoming);
    } catch (err) {
      console.error('Failed to load availability', err);
    }
  }, [id]);

  useEffect(() => {
    loadProfessor();
    loadAvailability();
  }, [loadProfessor, loadAvailability]);

  if (loading) return <Loader message="Loading professor..." />;

  if (!professor) {
    return (
      <div className="container">
        <Card>
          <div className="empty-state">
            <div className="empty-state-icon">👨‍🏫</div>
            <h3>Professor Not Found</h3>
            <p>The professor you're looking for doesn't exist</p>
            <Button variant="primary" onClick={() => navigate('/professors')}>
              Browse Professors
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const displayName = professor.user?.profile?.fullName || 'Professor';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const reviews = professor.reviews || [];

  return (
    <div className="professor-detail-page">
      <div className="container">
        {error && <Alert variant="error">{error}</Alert>}

        {/* Profile Header - Clean Design */}
        <div style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '1.5rem',
          color: 'white',
          boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {/* Avatar */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '1rem',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              border: '3px solid rgba(255,255,255,0.3)',
              flexShrink: 0
            }}>
              {initials}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>{displayName}</h1>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Professor</span>
              </div>

              {professor.headline && (
                <p style={{ margin: '0 0 0.75rem 0', opacity: 0.9, fontSize: '1rem' }}>{professor.headline}</p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                {professor.hourlyRate > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, fontSize: '1rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    ${professor.hourlyRate}/hour
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', opacity: 0.9 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {professor.rating?.toFixed(1) || 'New'} ({professor.totalReviews || 0} reviews)
                </span>
              </div>

              {/* Subjects */}
              {professor.subjects && professor.subjects.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {professor.subjects.map((subject, i) => (
                    <span key={i} style={{
                      background: 'rgba(255,255,255,0.15)',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8125rem'
                    }}>{subject}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {isStudent && (
                <Link to={`/student/book/${id}`}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    background: 'white',
                    color: '#6366F1',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Book Session
                  </button>
                </Link>
              )}
              {!isAuthenticated && (
                <Link to="/login">
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    background: 'white',
                    color: '#6366F1',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                  }}>
                    Login to Book
                  </button>
                </Link>
              )}
              <Link to={`/messages?recipientId=${professor.id}`}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Message
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="professor-tabs">
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            About
          </button>
          <button
            className={`tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Availability ({availability.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Reviews ({reviews.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Courses ({professor.courses?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="professor-content">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="tab-content">
              <Card className="content-card card-elevated">
                <h2>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  About
                </h2>
                <p className="bio-text">
                  {professor.user?.profile?.bio || 'No bio available.'}
                </p>
              </Card>

              {professor.user?.profile?.education && (
                <Card className="content-card card-elevated">
                  <h2>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    Education
                  </h2>
                  <p>{professor.user.profile.education}</p>
                </Card>
              )}
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div className="tab-content">
              {!isAuthenticated ? (
                <AuthPrompt action="book a session" message="Create a free account to book sessions with professors and start learning!" />
              ) : availability.length > 0 ? (
                <div className="availability-grid">
                  {availability.map((slot) => (
                    <Card key={slot.id} className="slot-card card-elevated">
                      <div className="slot-date">
                        <div className="slot-day">
                          {new Date(slot.startTime).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="slot-num">
                          {new Date(slot.startTime).getDate()}
                        </div>
                        <div className="slot-month">
                          {new Date(slot.startTime).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      <div className="slot-info">
                        <div className="slot-time">
                          {new Date(slot.startTime).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit'
                          })} - {new Date(slot.endTime).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                        <div className="slot-timezone">{slot.timezone}</div>
                      </div>
                      {isStudent && (
                        <Link to={`/student/book/${id}?slot=${slot.id}`}>
                          <Button variant="primary" size="sm">Book</Button>
                        </Link>
                      )}
                      {!isStudent && isAuthenticated && (
                        <Button variant="outline" size="sm" disabled>
                          Students Only
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="empty-state">
                    <div className="empty-state-icon">📅</div>
                    <h3>No Available Slots</h3>
                    <p>This professor doesn't have any available time slots right now. Check back later!</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="tab-content">
              {reviews.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <Card key={review.id} className="review-card card-elevated">
                      <div className="review-header">
                        <div className="review-author">
                          <div className="review-avatar">
                            {(review.student?.user?.profile?.fullName || 'S')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="review-name">
                              {review.student?.user?.profile?.fullName || 'Student'}
                            </div>
                            <div className="review-date">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                month: 'long', day: 'numeric', year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="review-rating">
                          <span className="rating-stars">{'⭐'.repeat(review.rating)}</span>
                          <span className="rating-value">{review.rating}/5</span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="empty-state">
                    <div className="empty-state-icon">⭐</div>
                    <h3>No Reviews Yet</h3>
                    <p>Be the first to book a session and leave a review!</p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="tab-content">
              {professor.courses && professor.courses.length > 0 ? (
                <div className="courses-grid">
                  {professor.courses.filter(c => c.published).map((course) => (
                    <Card key={course.id} className="course-card card-interactive card-elevated">
                      <div className="course-badges">
                        <Badge variant="info">{course.level}</Badge>
                        {course.category && <Badge variant="neutral">{course.category}</Badge>}
                      </div>
                      <h3>{course.tittle}</h3>
                      <p className="course-desc">
                        {course.description?.substring(0, 100)}
                        {course.description?.length > 100 ? '...' : ''}
                      </p>
                      <div className="course-meta">
                        <span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          {course.lessons?.length || 0} lessons
                        </span>
                        <span className="course-price">${course.price}</span>
                      </div>
                      <Link to={`/courses/${course.id}`}>
                        <Button variant="primary" fullWidth>View Course</Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <h3>No Courses Yet</h3>
                    <p>This professor hasn't published any courses yet.</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .professor-detail-page {
          padding-bottom: 3rem;
        }

        .professor-header {
          position: relative;
          overflow: hidden;
          padding: 0 !important;
          margin-bottom: 1.5rem;
        }

        .professor-header-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: var(--gradient-primary);
        }

        .professor-header-content {
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 1.5rem;
          padding: 0 2rem 2rem;
          padding-top: 2.5rem;
          flex-wrap: wrap;
        }

        .professor-avatar-large {
          width: 100px;
          height: 100px;
          border-radius: var(--radius-2xl);
          background: var(--gradient-accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          border: 4px solid var(--bg-primary);
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        }

        .professor-header-info {
          flex: 1;
          min-width: 250px;
        }

        .professor-name-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }

        .professor-name-row h1 {
          font-size: 1.75rem;
          margin: 0;
        }

        .professor-headline {
          font-size: 1rem;
          color: var(--text-secondary);
          margin: 0 0 0.75rem 0;
          max-width: 500px;
        }

        .professor-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .professor-meta .meta-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .professor-meta .meta-item.highlight {
          color: var(--accent-primary);
          font-weight: 600;
        }

        .professor-subjects {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .professor-header-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        /* Tabs */
        .professor-tabs {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
          padding: 0.25rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          overflow-x: auto;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.9375rem;
          font-weight: 500;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--bg-tertiary);
        }

        .tab-btn.active {
          background: var(--bg-primary);
          color: var(--brand-primary);
          box-shadow: var(--shadow-sm);
        }

        /* Content */
        .content-card {
          padding: 1.75rem !important;
          margin-bottom: 1rem;
        }

        .content-card h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          margin: 0 0 1rem 0;
        }

        .bio-text {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Availability */
        .availability-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .slot-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1rem 1.25rem !important;
        }

        .slot-date {
          width: 60px;
          text-align: center;
          flex-shrink: 0;
        }

        .slot-day {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
        }

        .slot-num {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--brand-primary);
        }

        .slot-month {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
        }

        .slot-info {
          flex: 1;
        }

        .slot-time {
          font-weight: 600;
          font-size: 0.9375rem;
          margin-bottom: 0.125rem;
        }

        .slot-timezone {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        /* Reviews */
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .review-card {
          padding: 1.5rem !important;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .review-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .review-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: var(--gradient-secondary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .review-name {
          font-weight: 600;
          font-size: 0.9375rem;
        }

        .review-date {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .review-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .rating-stars {
          font-size: 0.875rem;
        }

        .rating-value {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .review-comment {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Courses */
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .course-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.5rem !important;
        }

        .course-badges {
          display: flex;
          gap: 0.5rem;
        }

        .course-card h3 {
          font-size: 1.125rem;
          margin: 0;
        }

        .course-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }

        .course-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-light);
        }

        .course-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .course-price {
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--accent-primary);
        }

        @media (max-width: 768px) {
          .professor-header-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 0 1.5rem 1.5rem;
            padding-top: 60px;
          }

          .professor-avatar-large {
            width: 100px;
            height: 100px;
            font-size: 2rem;
          }

          .professor-name-row {
            justify-content: center;
          }

          .professor-meta {
            justify-content: center;
          }

          .professor-subjects {
            justify-content: center;
          }

          .professor-header-actions {
            width: 100%;
            justify-content: center;
          }

          .professor-tabs {
            justify-content: flex-start;
          }

          .slot-card {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfessorDetail;
