import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentApi } from '../api/paymentApi';
import { bookingApi } from '../api/bookingApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const loadBooking = useCallback(async () => {
    try {
      const response = await bookingApi.getMyBookings();
      // Find the booking by ID (convert to string for comparison)
      const foundBooking = response.data.find(b => String(b.id) === String(bookingId));
      setBooking(foundBooking || null);
    } catch (err) {
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      await paymentApi.checkout({ bookingId });
      setSuccess(true);
      // Redirect after success message
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) return <Loader message="Loading booking details..." />;
  
  if (!booking) {
    return (
      <div className="container">
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Card>
            <div className="empty-state">
              <div className="empty-state-icon">❌</div>
              <h3>Booking Not Found</h3>
              <p>The booking you're looking for doesn't exist or has been cancelled.</p>
              <Button variant="primary" onClick={() => navigate('/student/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const sessionDate = booking.availability?.startTime 
    ? new Date(booking.availability.startTime)
    : null;

  return (
    <div className="container">
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card>
          {success ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'var(--accent)', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                margin: '0 auto 1.5rem'
              }}>
                ✓
              </div>
              <h2 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Payment Successful!</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Your booking has been confirmed. Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ marginBottom: '0.5rem' }}>Complete Payment</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Review your booking and proceed to payment
              </p>

              {/* Booking Summary */}
              <div style={{ 
                padding: '1.5rem', 
                background: 'var(--background)', 
                borderRadius: '12px', 
                marginBottom: '1.5rem' 
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Booking Summary
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Professor
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {booking.professor?.user?.profile?.fullName || 'Professor'}
                  </div>
                </div>
                
                {sessionDate && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      Date & Time
                    </div>
                    <div style={{ fontWeight: 600 }}>
                      {sessionDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      {sessionDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}
                
                <div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Status
                  </div>
                  <Badge variant={booking.status === 'CONFIRMED' ? 'success' : 'warning'}>
                    {booking.status}
                  </Badge>
                </div>
              </div>

              {/* Price */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem 0',
                borderTop: '2px solid var(--border)',
                borderBottom: '2px solid var(--border)',
                marginBottom: '1.5rem'
              }}>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total Amount</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                  ${booking.professor?.hourlyRate || 50.00}
                </span>
              </div>

              {/* Mock Payment Notice */}
              <Alert variant="info" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <strong>🧪 Demo Payment</strong>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem' }}>
                    This is a mock payment system. Click "Pay Now" to simulate the payment process.
                  </p>
                </div>
              </Alert>

              {error && <Alert variant="error">{error}</Alert>}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button 
                  variant="ghost"
                  onClick={() => navigate('/student/dashboard')}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePayment} 
                  variant="success"
                  disabled={processing}
                  loading={processing}
                  fullWidth
                >
                  Pay Now
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Payment;
