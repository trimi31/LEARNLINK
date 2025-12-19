import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { bookingApi } from '../api/bookingApi';
import { availabilityApi } from '../api/availabilityApi';
import { useAuth } from '../store/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';

const ProfessorDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionBookingId, setActionBookingId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [coursesRes, bookingsRes, availabilityRes] = await Promise.all([
        courseApi.getMyCourses(),
        bookingApi.getProfessorBookings(),
        availabilityApi.getMyAvailability(),
      ]);
      setCourses(coursesRes.data);
      setBookings(bookingsRes.data);
      setAvailability(availabilityRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    refreshUser();
  }, [loadData, refreshUser]);

  const getStatusVariant = (status) => {
    const variants = {
      'CONFIRMED': 'success', 'COMPLETED': 'success',
      'PENDING': 'warning',
      'CANCELLED': 'danger', 'CANCELED': 'danger'
    };
    return variants[status] || 'neutral';
  };

  const openSlots = availability.filter(a => !a.isBooked && new Date(a.startTime) > new Date()).length;
  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const displayName = user?.profile?.fullName?.split(' ')[0] || 'there';

  const handleConfirmBooking = async (bookingId) => {
    setActionBookingId(bookingId);
    try {
      await bookingApi.confirm(bookingId);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to confirm booking');
    } finally {
      setActionBookingId(null);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    setActionBookingId(bookingId);
    try {
      await bookingApi.complete(bookingId);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete booking');
    } finally {
      setActionBookingId(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setActionBookingId(bookingId);
    try {
      await bookingApi.cancel(bookingId);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setActionBookingId(null);
    }
  };

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Welcome Header - Clean Design */}
        <div style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'inline-block',
              marginBottom: '0.75rem'
            }}>Professor Dashboard</span>
            <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
              Welcome back, {displayName}! 👋
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
              Manage your courses, availability, and student sessions
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/professor/courses">
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
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
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Course
              </button>
            </Link>
            <Link to="/professor/availability">
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '0.75rem',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Set Availability
              </button>
            </Link>
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Stats Grid */}
        <div className="stats-grid">
          <Card className="stat-card card-elevated">
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{courses.length}</div>
              <div className="stat-label">Courses</div>
            </div>
          </Card>

          <Card className="stat-card card-elevated">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{openSlots}</div>
              <div className="stat-label">Open Slots</div>
            </div>
          </Card>

          <Card className="stat-card card-elevated">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{pendingBookings.length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </Card>

          <Card className="stat-card card-elevated">
            <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="quick-actions card-elevated">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Quick Actions
          </h2>
          <div className="actions-grid">
            <Link to="/professor/courses" className="action-card">
              <div className="action-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span>Manage Courses</span>
            </Link>
            <Link to="/professor/availability" className="action-card">
              <div className="action-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <span>Set Availability</span>
            </Link>
            <Link to="/messages" className="action-card">
              <div className="action-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span>Messages</span>
            </Link>
            <Link to="/profile" className="action-card">
              <div className="action-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span>Edit Profile</span>
            </Link>
          </div>
        </Card>

        {/* Recent Bookings */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Recent Bookings
            </h2>
            <span className="section-count">{bookings.length} total</span>
          </div>

          {bookings.length > 0 ? (
            <Card className="bookings-table card-elevated">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar">
                            {(booking.student?.user?.profile?.fullName || 'S')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="student-name">
                              {booking.student?.user?.profile?.fullName || 'Student'}
                            </div>
                            <div className="student-email">
                              {booking.student?.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="booking-datetime">
                        {new Date(booking.availability?.startTime).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {booking.status === 'PENDING' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleConfirmBooking(booking.id)}
                                disabled={actionBookingId === booking.id}
                              >
                                {actionBookingId === booking.id ? (
                                  <span className="btn-spinner" />
                                ) : (
                                  <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Confirm
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={actionBookingId === booking.id}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                Cancel
                              </Button>
                            </>
                          )}
                          {booking.status === 'CONFIRMED' && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleCompleteBooking(booking.id)}
                                disabled={actionBookingId === booking.id}
                              >
                                {actionBookingId === booking.id ? (
                                  <span className="btn-spinner" />
                                ) : (
                                  <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                      <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    Complete
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={actionBookingId === booking.id}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                Cancel
                              </Button>
                            </>
                          )}
                          {(booking.status === 'COMPLETED' || booking.status === 'CANCELED') && (
                            <Badge variant={getStatusVariant(booking.status)}>
                              {booking.status === 'COMPLETED' ? 'Done' : 'Cancelled'}
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : (
            <Card>
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <h3>No bookings yet</h3>
                <p>Add availability slots for students to book sessions with you</p>
                <Link to="/professor/availability">
                  <Button variant="primary">Set Availability</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Courses Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Your Courses
            </h2>
            <Link to="/professor/courses" className="view-all-link">
              Manage all →
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="courses-grid">
              {courses.slice(0, 3).map((course) => (
                <Card key={course.id} className="course-card card-interactive card-elevated">
                  <div className="course-header">
                    <Badge variant={course.published ? 'success' : 'warning'}>
                      {course.published ? 'Published' : 'Draft'}
                    </Badge>
                    <span className="course-price">${course.price}</span>
                  </div>
                  <h3>{course.tittle}</h3>
                  <p className="course-meta">
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {course.lessons?.length || 0} lessons
                    </span>
                    <span>
                      <Badge variant="info" className="badge-sm">{course.level}</Badge>
                    </span>
                  </p>
                  <Link to={`/courses/${course.id}`}>
                    <Button variant="ghost" size="sm" fullWidth>
                      View Details
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="empty-state">
                <div className="empty-state-icon">📚</div>
                <h3>No courses yet</h3>
                <p>Create your first course to start teaching and earning</p>
                <Link to="/professor/courses">
                  <Button variant="primary">Create Course</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      <style>{`
        .dashboard-page {
          padding-bottom: 3rem;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .welcome-section h1 {
          font-size: 2rem;
          margin: 0.375rem 0;
        }

        .welcome-section p {
          color: var(--text-secondary);
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        /* Stats Grid - Enhanced */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem !important;
          background: rgba(255, 255, 255, 0.9) !important;
          border-radius: 1rem !important;
          border: 1px solid rgba(255, 255, 255, 0.5) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
          transition: all 0.3s ease !important;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.375rem;
          background: linear-gradient(135deg, #1e293b, #475569);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* Quick Actions - Enhanced */
        .quick-actions {
          padding: 2rem !important;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.9) !important;
          border-radius: 1rem !important;
          border: 1px solid rgba(255, 255, 255, 0.5) !important;
        }

        .quick-actions h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          color: #1e293b;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 1rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8));
          border: 1px solid rgba(226, 232, 240, 0.6);
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .action-card:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08));
          border-color: rgba(99, 102, 241, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
        }

        .action-card:hover .action-icon {
          transform: scale(1.1);
        }

        .action-icon {
          width: 56px;
          height: 56px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .action-card span {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #334155;
        }

        /* Dashboard Sections */
        .dashboard-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          margin: 0;
        }

        .section-count {
          font-size: 0.875rem;
          color: var(--text-tertiary);
        }

        .view-all-link {
          font-size: 0.875rem;
          color: var(--brand-primary);
          text-decoration: none;
          font-weight: 500;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        /* Bookings Table */
        .bookings-table {
          padding: 0 !important;
          overflow: hidden;
        }

        .bookings-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .bookings-table th,
        .bookings-table td {
          padding: 1rem 1.25rem;
          text-align: left;
        }

        .bookings-table th {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-light);
        }

        .bookings-table td {
          border-bottom: 1px solid var(--border-light);
        }

        .bookings-table tr:last-child td {
          border-bottom: none;
        }

        .student-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .student-avatar {
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

        .student-name {
          font-weight: 600;
        }

        .student-email {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .booking-datetime {
          color: var(--text-secondary);
        }

        /* Courses Grid */
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .course-card {
          padding: 1.5rem !important;
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .course-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .course-card h3 {
          font-size: 1rem;
          margin: 0 0 0.5rem 0;
        }

        .course-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin: 0 0 1rem 0;
        }

        .course-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .courses-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
          }

          .welcome-section h1 {
            font-size: 1.5rem;
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }

          .bookings-table {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfessorDashboard;
