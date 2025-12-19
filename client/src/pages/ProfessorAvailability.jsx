import React, { useState, useEffect, useCallback } from 'react';
import { availabilityApi } from '../api/availabilityApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  History,
  CalendarClock,
  Globe2,
  AlertCircle
} from 'lucide-react';

const ProfessorAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAvailability = useCallback(async () => {
    try {
      const response = await availabilityApi.getMyAvailability();
      setAvailability(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load availability slots');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);
    const now = new Date();

    if (startDate < now) {
      setError('Start time cannot be in the past');
      return;
    }

    if (endDate <= startDate) {
      setError('End time must be after start time');
      return;
    }

    setSubmitting(true);

    try {
      await availabilityApi.create({
        startTime: formData.startTime,
        endTime: formData.endTime,
        timezone: formData.timezone,
      });
      setSuccess('Time slot added successfully!');
      setShowForm(false);
      setFormData({
        startTime: '',
        endTime: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      await loadAvailability();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create time slot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this time slot?')) return;

    setDeletingId(id);
    try {
      await availabilityApi.delete(id);
      setSuccess('Time slot deleted successfully!');
      await loadAvailability();
    } catch (err) {
      setError('Failed to delete time slot');
    } finally {
      setDeletingId(null);
    }
  };

  const upcomingSlots = availability.filter(a => new Date(a.startTime) > new Date());
  const pastSlots = availability.filter(a => new Date(a.startTime) <= new Date());
  const openSlots = upcomingSlots.filter(a => !a.isBooked);
  const bookedSlots = upcomingSlots.filter(a => a.isBooked);

  if (loading) return <Loader message="Loading availability..." />;

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div className="page-header-content">
          <div className="section-eyebrow">Schedule Management</div>
          <h1 className="page-title">Availability</h1>
          <p className="page-description">
            Manage your teaching schedule and available time slots for student bookings.
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setError('');
              setSuccess('');
            }}
            variant={showForm ? 'outline' : 'primary'}
            size="lg"
          >
            {showForm ? (
              <>
                <XCircle size={18} />
                Cancel
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Time Slot
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)' }}>
            <CalendarClock size={24} />
          </div>
          <div className="stat-value">{upcomingSlots.length}</div>
          <div className="stat-label">Upcoming Slots</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-value">{openSlots.length}</div>
          <div className="stat-label">Open for Booking</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-value">{bookedSlots.length}</div>
          <div className="stat-label">Booked Sessions</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(100, 116, 139, 0.1)', color: 'var(--text-tertiary)' }}>
            <History size={24} />
          </div>
          <div className="stat-value">{pastSlots.length}</div>
          <div className="stat-label">Past Slots</div>
        </div>
      </div>

      {error && <Alert variant="error" className="animate-pulse-soft">{error}</Alert>}
      {success && <Alert variant="success" className="fade-in">{success}</Alert>}

      {showForm && (
        <Card className="card-glass fade-in" style={{ marginBottom: '2rem', padding: '2rem', border: '1px solid var(--brand-primary)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--gradient-primary)', borderRadius: '0.5rem', color: 'white' }}>
              <Plus size={20} />
            </div>
            Add New Time Slot
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="startTime"
                    type="datetime-local"
                    className="input"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    min={getMinDateTime()}
                    required
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Calendar size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="endTime"
                    type="datetime-local"
                    className="input"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    min={formData.startTime || getMinDateTime()}
                    required
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Clock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="timezone">Timezone</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="timezone"
                    type="text"
                    className="input"
                    value={formData.timezone}
                    readOnly
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', paddingLeft: '2.5rem' }}
                  />
                  <Globe2 size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="btn-spinner" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Slot
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Upcoming Slots */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="section-header">
          <div className="section-header-content">
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CalendarClock size={28} className="text-gradient" />
              Upcoming Time Slots
            </h2>
            <p className="section-description">Manage your upcoming availability schedule.</p>
          </div>
        </div>

        {upcomingSlots.length > 0 ? (
          <div className="grid-cards">
            {upcomingSlots.map((slot) => (
              <Card key={slot.id} className="card-interactive" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '1rem',
                    background: slot.isBooked
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2))'
                      : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2))',
                    color: slot.isBooked ? 'var(--warning)' : 'var(--success)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${slot.isBooked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {new Date(slot.startTime).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }}>
                      {new Date(slot.startTime).getDate()}
                    </span>
                  </div>
                  <Badge variant={slot.isBooked ? 'warning' : 'success'} className="badge-sm">
                    {slot.isBooked ? 'Booked' : 'Open'}
                  </Badge>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {new Date(slot.startTime).toLocaleDateString('en-US', { weekday: 'long' })}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9375rem',
                    background: 'var(--bg-secondary)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <Clock size={14} />
                    {new Date(slot.startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric', minute: '2-digit'
                    })} - {new Date(slot.endTime).toLocaleTimeString('en-US', {
                      hour: 'numeric', minute: '2-digit'
                    })}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-tertiary)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  paddingLeft: '0.25rem'
                }}>
                  <Globe2 size={12} />
                  {slot.timezone}
                </div>

                {!slot.isBooked && (
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleDelete(slot.id)}
                    disabled={deletingId === slot.id}
                    style={{
                      color: 'var(--danger)',
                      borderColor: 'rgba(239, 68, 68, 0.2)',
                      background: 'rgba(239, 68, 68, 0.05)'
                    }}
                  >
                    {deletingId === slot.id ? (
                      <>
                        <span className="btn-spinner" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} />
                        Remove Slot
                      </>
                    )}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="empty-state-enhanced">
            <div className="empty-icon">
              <Calendar size={40} className="text-gradient" />
            </div>
            <h3>No upcoming time slots</h3>
            <p>Add availability to your schedule so students can book sessions with you.</p>
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)} style={{ marginTop: '1rem' }}>
                <Plus size={18} />
                Add Time Slot
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Past Slots */}
      {pastSlots.length > 0 && (
        <div style={{ opacity: 0.8 }}>
          <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
            <History size={20} />
            Past Time Slots
          </h2>
          <div className="grid-cards">
            {pastSlots.slice(0, 4).map((slot) => (
              <Card key={slot.id} style={{ padding: '1.25rem', background: 'var(--gray-50)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {new Date(slot.startTime).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric'
                    })}
                  </span>
                  <Badge variant="neutral" className="badge-sm">
                    {slot.isBooked ? 'Was Booked' : 'Expired'}
                  </Badge>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Clock size={12} />
                  {new Date(slot.startTime).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: '2-digit'
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorAvailability;
