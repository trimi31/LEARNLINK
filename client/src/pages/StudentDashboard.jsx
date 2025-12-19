import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { paymentApi } from '../api/paymentApi';
import { useAuth } from '../store/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';

const StudentDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingsRes, paymentsRes] = await Promise.all([
        bookingApi.getMyBookings(),
        paymentApi.getMyPayments(),
      ]);
      setBookings(bookingsRes.data);
      setPayments(paymentsRes.data);
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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;

    setCancellingId(bookingId);
    try {
      await bookingApi.cancel(bookingId);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      'CONFIRMED': 'success', 'PAID': 'success', 'COMPLETED': 'success',
      'PENDING': 'warning',
      'CANCELLED': 'danger', 'CANCELED': 'danger'
    };
    return variants[status] || 'neutral';
  };

  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const displayName = user?.profile?.fullName?.split(' ')[0] || 'there';

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
            }}>Student Dashboard</span>
            <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
              Welcome back, {displayName}! 👋
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
              Here's what's happening with your learning journey
            </p>
          </div>
          <Link to="/professors">
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Find a Professor
            </button>
          </Link>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Stats Grid */}
        <div className="stats-grid">
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
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{confirmedBookings.length}</div>
              <div className="stat-label">Confirmed</div>
            </div>
          </Card>

          <Card className="stat-card card-elevated">
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{payments.length}</div>
              <div className="stat-label">Payments</div>
            </div>
          </Card>

          <Card className="stat-card card-elevated">
            <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">Total Sessions</div>
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
            <Link to="/professors" className="action-card">
              <div className="action-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span>Browse Professors</span>
            </Link>
            <Link to="/courses" className="action-card">
              <div className="action-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span>Explore Courses</span>
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

        {/* Bookings Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Your Bookings
            </h2>
            <span className="section-count">{bookings.length} total</span>
          </div>

          {bookings.length > 0 ? (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <Card key={booking.id} className="booking-card card-elevated">
                  <div className="booking-header">
                    <div className="booking-professor">
                      <div className="professor-avatar">
                        {(booking.professor?.user?.profile?.fullName || 'P')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="professor-name">
                          {booking.professor?.user?.profile?.fullName || 'Professor'}
                        </div>
                        <div className="booking-time">
                          {new Date(booking.availability?.startTime).toLocaleString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                  </div>

                  {booking.notes && (
                    <p className="booking-notes">{booking.notes}</p>
                  )}

                  <div className="booking-actions">
                    {booking.status === 'PENDING' && (
                      <>
                        <Link to={`/student/payment/${booking.id}`} style={{ flex: 1 }}>
                          <Button variant="success" size="sm" fullWidth>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                              <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                            Pay Now
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                        >
                          {cancellingId === booking.id ? (
                            <span className="btn-spinner" />
                          ) : (
                            'Cancel'
                          )}
                        </Button>
                      </>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        fullWidth
                      >
                        Cancel Booking
                      </Button>
                    )}
                    {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === 'CANCELED') && (
                      <Button variant="ghost" size="sm" fullWidth disabled>
                        {booking.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <h3>No bookings yet</h3>
                <p>Find a professor and book your first session to get started</p>
                <Link to="/professors">
                  <Button variant="primary">Browse Professors</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Payments Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Payment History
            </h2>
          </div>

          {payments.length > 0 ? (
            <Card className="payments-table card-elevated">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <span className="payment-type">
                          {payment.bookingId ? '📅 Session' : '📚 Course'}
                        </span>
                      </td>
                      <td className="payment-amount">${payment.amount}</td>
                      <td><Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge></td>
                      <td className="payment-date">
                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : (
            <Card>
              <div className="empty-state">
                <div className="empty-state-icon">💳</div>
                <h3>No payments yet</h3>
                <p>Your payment history will appear here after your first booking or course purchase</p>
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

        /* Bookings Grid */
        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .booking-card {
          padding: 1.25rem !important;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .booking-professor {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .professor-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-lg);
          background: var(--gradient-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .professor-name {
          font-weight: 600;
          margin-bottom: 0.125rem;
        }

        .booking-time {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .booking-notes {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 1rem 0;
          padding: 0.75rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .booking-actions {
          display: flex;
          gap: 0.5rem;
        }

        /* Payments Table */
        .payments-table {
          padding: 0 !important;
          overflow: hidden;
        }

        .payments-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .payments-table th,
        .payments-table td {
          padding: 1rem 1.25rem;
          text-align: left;
        }

        .payments-table th {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-light);
        }

        .payments-table td {
          border-bottom: 1px solid var(--border-light);
        }

        .payments-table tr:last-child td {
          border-bottom: none;
        }

        .payment-type {
          font-weight: 500;
        }

        .payment-amount {
          font-weight: 600;
          color: var(--accent-primary);
        }

        .payment-date {
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .actions-grid {
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

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .bookings-grid {
            grid-template-columns: 1fr;
          }

          .payments-table {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
