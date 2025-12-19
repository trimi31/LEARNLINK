import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { professorApi } from '../api/professorApi';
import { availabilityApi } from '../api/availabilityApi';
import { bookingApi } from '../api/bookingApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';

const BookingCreate = () => {
  const { professorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [professorRes, availabilityRes] = await Promise.all([
        professorApi.getById(professorId),
        availabilityApi.getByProfessor(professorId),
      ]);

      setProfessor(professorRes.data);

      // Filter for future, unbooked slots
      const availableSlots = availabilityRes.data.filter(
        slot => new Date(slot.startTime) > new Date() && !slot.isBooked
      );
      setAvailability(availableSlots);

      // Check for pre-selected slot from URL
      const preSelectedSlotId = searchParams.get('slot');
      if (preSelectedSlotId) {
        const slot = availableSlots.find(s => s.id === preSelectedSlotId);
        if (slot) setSelectedSlot(slot);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [professorId, searchParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await bookingApi.create({
        availabilityId: selectedSlot.id,
        notes: notes.trim() || undefined,
      });

      navigate('/student/dashboard', {
        state: { message: 'Booking created successfully! Please complete payment to confirm.' }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading booking options..." />;

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

  const professorName = professor.user?.profile?.fullName || 'Professor';

  return (
    <div className="booking-page">
      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <div className="section-eyebrow">Book a Session</div>
          <h1 style={{ marginBottom: '0.375rem' }}>Schedule with {professorName}</h1>
          <p style={{ fontSize: '1rem' }}>Select an available time slot to book your session</p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <div className="booking-layout">
          {/* Professor Info */}
          <Card className="professor-info-card card-elevated">
            <div className="professor-header">
              <div className="professor-avatar">
                {professorName[0].toUpperCase()}
              </div>
              <div>
                <h3>{professorName}</h3>
                {professor.headline && (
                  <p className="professor-headline">{professor.headline}</p>
                )}
              </div>
            </div>

            {professor.hourlyRate && (
              <div className="rate-info">
                <span className="rate-label">Session Rate</span>
                <span className="rate-value">${professor.hourlyRate}/hour</span>
              </div>
            )}

            {professor.subjects && professor.subjects.length > 0 && (
              <div className="subjects-section">
                <span className="subjects-label">Subjects</span>
                <div className="subjects-list">
                  {professor.subjects.map((subject, i) => (
                    <Badge key={i} variant="neutral">{subject}</Badge>
                  ))}
                </div>
              </div>
            )}

            {professor.user?.profile?.bio && (
              <div className="bio-section">
                <span className="bio-label">About</span>
                <p className="bio-text">{professor.user.profile.bio}</p>
              </div>
            )}
          </Card>

          {/* Booking Form */}
          <div className="booking-form-section">
            <Card className="card-elevated" style={{ padding: '1.75rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Select Time Slot
              </h2>

              {availability.length > 0 ? (
                <div className="slots-grid">
                  {availability.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      className={`slot-option ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div className="slot-date">
                        <span className="day">
                          {new Date(slot.startTime).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="date">
                          {new Date(slot.startTime).getDate()}
                        </span>
                        <span className="month">
                          {new Date(slot.startTime).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                      <div className="slot-time">
                        {new Date(slot.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit', minute: '2-digit'
                        })} - {new Date(slot.endTime).toLocaleTimeString('en-US', {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                      {selectedSlot?.id === slot.id && (
                        <div className="slot-check">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-slots">
                  <div className="empty-icon">📅</div>
                  <h3>No Available Slots</h3>
                  <p>This professor doesn't have any available time slots right now. Check back later!</p>
                  <Button variant="outline" onClick={() => navigate(`/professors/${professorId}`)}>
                    View Professor Profile
                  </Button>
                </div>
              )}
            </Card>

            {availability.length > 0 && (
              <Card className="card-elevated" style={{ padding: '1.75rem', marginTop: '1.25rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Additional Notes
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="notes">Notes for the professor (optional)</label>
                    <textarea
                      id="notes"
                      className="input"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="4"
                      placeholder="Tell the professor what you'd like to focus on, any questions you have, or topics you want to cover..."
                    />
                  </div>

                  {selectedSlot && (
                    <div className="booking-summary">
                      <h3>Booking Summary</h3>
                      <div className="summary-row">
                        <span>Professor</span>
                        <span>{professorName}</span>
                      </div>
                      <div className="summary-row">
                        <span>Date</span>
                        <span>
                          {new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
                            weekday: 'long', month: 'long', day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span>Time</span>
                        <span>
                          {new Date(selectedSlot.startTime).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit'
                          })} - {new Date(selectedSlot.endTime).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {professor.hourlyRate && (
                        <div className="summary-row total">
                          <span>Session Rate</span>
                          <span>${professor.hourlyRate}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <Button
                      type="submit"
                      variant="success"
                      size="lg"
                      disabled={submitting || !selectedSlot}
                      style={{ flex: 1 }}
                    >
                      {submitting ? (
                        <>
                          <span className="btn-spinner" />
                          Creating Booking...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Confirm Booking
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/professors/${professorId}`)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .booking-page {
          padding-bottom: 3rem;
        }

        .booking-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        /* Professor Info Card */
        .professor-info-card {
          padding: 1.5rem !important;
          position: sticky;
          top: 100px;
        }

        .professor-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .professor-avatar {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-xl);
          background: var(--gradient-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .professor-header h3 {
          font-size: 1.125rem;
          margin: 0 0 0.25rem 0;
        }

        .professor-headline {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .rate-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
        }

        .rate-label {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .rate-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .subjects-section,
        .bio-section {
          margin-bottom: 1rem;
        }

        .subjects-label,
        .bio-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          margin-bottom: 0.5rem;
        }

        .subjects-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .bio-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Slots Grid */
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.75rem;
        }

        .slot-option {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 2px solid var(--border-light);
          border-radius: var(--radius-lg);
          background: var(--bg-primary);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .slot-option:hover {
          border-color: var(--brand-primary);
          background: var(--bg-secondary);
        }

        .slot-option.selected {
          border-color: var(--brand-primary);
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
        }

        .slot-date {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .slot-date .day {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
        }

        .slot-date .date {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--brand-primary);
        }

        .slot-date .month {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
        }

        .slot-time {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          text-align: center;
        }

        .slot-check {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--brand-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-slots {
          text-align: center;
          padding: 2rem;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-slots h3 {
          margin: 0 0 0.5rem 0;
        }

        .empty-slots p {
          color: var(--text-secondary);
          margin: 0 0 1.5rem 0;
        }

        /* Booking Summary */
        .booking-summary {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          margin-top: 1.5rem;
        }

        .booking-summary h3 {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.9375rem;
        }

        .summary-row span:first-child {
          color: var(--text-secondary);
        }

        .summary-row span:last-child {
          font-weight: 500;
        }

        .summary-row.total {
          border-top: 1px solid var(--border-light);
          margin-top: 0.5rem;
          padding-top: 1rem;
        }

        .summary-row.total span:last-child {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        @media (max-width: 900px) {
          .booking-layout {
            grid-template-columns: 1fr;
          }

          .professor-info-card {
            position: static;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingCreate;
