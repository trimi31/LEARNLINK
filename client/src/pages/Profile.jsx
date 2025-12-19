import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../api/profileApi';
import { professorApi } from '../api/professorApi';
import { useAuth } from '../store/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';

const Profile = () => {
  const { user, refreshUser, isProfessor, isStudent } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    phone: '',
    location: '',
    education: '',
  });
  const [professorData, setProfessorData] = useState({
    headline: '',
    subjects: '',
    hourlyRate: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      const response = await profileApi.getMyProfile();
      setProfile(response.data);
      setFormData({
        fullName: response.data.fullName || '',
        bio: response.data.bio || '',
        phone: response.data.phone || '',
        location: response.data.location || '',
        education: response.data.education || '',
      });

      if (user?.professorProfile) {
        setProfessorData({
          headline: user.professorProfile.headline || '',
          subjects: Array.isArray(user.professorProfile.subjects)
            ? user.professorProfile.subjects.join(', ')
            : '',
          hourlyRate: user.professorProfile.hourlyRate || '',
        });
      }
    } catch (err) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user?.professorProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      await profileApi.updateMyProfile(formData);

      if (isProfessor) {
        const subjectsArray = professorData.subjects
          .split(',')
          .map(s => s.trim())
          .filter(s => s);

        await professorApi.updateMyProfile({
          headline: professorData.headline,
          subjects: subjectsArray,
          hourlyRate: parseFloat(professorData.hourlyRate) || 0,
        });
      }

      setMessage('Profile updated successfully');
      setEditing(false);
      await refreshUser();
      await loadProfile();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const isProfileIncomplete = !profile?.fullName || !profile?.bio;
  const displayName = profile?.fullName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) return <Loader message="Loading profile..." />;

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header - Clean Design */}
        <div style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginBottom: '2rem',
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
                }}>{isProfessor ? 'Professor' : 'Student'}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', opacity: 0.9 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {user?.email}
                </span>
                {profile?.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {profile.location}
                  </span>
                )}
                {isProfessor && user?.professorProfile?.hourlyRate > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    ${user.professorProfile.hourlyRate}/hr
                  </span>
                )}
              </div>
              {isProfessor && user?.professorProfile?.headline && (
                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9375rem' }}>{user.professorProfile.headline}</p>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {!editing ? (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    style={{
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
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Edit Profile
                  </button>
                  <Link to={isProfessor ? '/professor/dashboard' : '/student/dashboard'}>
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
                      cursor: 'pointer'
                    }}>
                      Go to Dashboard
                    </button>
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => { setEditing(false); setError(''); setMessage(''); }}
                  style={{
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
                    cursor: 'pointer'
                  }}
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {isProfileIncomplete && !editing && (
          <Card className="completion-banner">
            <div className="completion-banner-content">
              <div className="completion-banner-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <strong>Complete your profile</strong>
                <p>Add your name and bio to help others know you better and build trust.</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setEditing(true)}>
              Complete Now
            </Button>
          </Card>
        )}

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="error">{error}</Alert>}

        {/* Main Content */}
        <div className="profile-content">
          {!editing ? (
            <>
              {/* About Section */}
              <Card className="profile-section card-elevated">
                <div className="section-header">
                  <h2>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    About
                  </h2>
                </div>
                <div className="profile-bio">
                  {profile?.bio || <span className="empty-text">No bio added yet. Tell others about yourself!</span>}
                </div>
              </Card>

              {/* Details Section */}
              <Card className="profile-section card-elevated">
                <div className="section-header">
                  <h2>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Details
                  </h2>
                </div>
                <div className="profile-details-grid">
                  <ProfileField
                    label="Phone"
                    value={profile?.phone}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>}
                  />
                  <ProfileField
                    label="Location"
                    value={profile?.location}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>}
                  />
                  <ProfileField
                    label="Education"
                    value={profile?.education}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>}
                    fullWidth
                  />
                </div>
              </Card>

              {/* Professor-specific Section */}
              {isProfessor && (
                <Card className="profile-section card-elevated">
                  <div className="section-header">
                    <h2>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      Teaching Info
                    </h2>
                  </div>
                  <div className="profile-details-grid">
                    <ProfileField
                      label="Headline"
                      value={user?.professorProfile?.headline}
                      fullWidth
                      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>}
                    />
                    <ProfileField
                      label="Hourly Rate"
                      value={user?.professorProfile?.hourlyRate ? `$${user.professorProfile.hourlyRate}` : null}
                      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                    />
                    <div className="profile-field profile-field-full">
                      <div className="field-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="8" y1="6" x2="21" y2="6" />
                          <line x1="8" y1="12" x2="21" y2="12" />
                          <line x1="8" y1="18" x2="21" y2="18" />
                          <line x1="3" y1="6" x2="3.01" y2="6" />
                          <line x1="3" y1="12" x2="3.01" y2="12" />
                          <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                        Subjects
                      </div>
                      <div className="field-value">
                        {Array.isArray(user?.professorProfile?.subjects) && user.professorProfile.subjects.length > 0 ? (
                          <div className="subjects-list">
                            {user.professorProfile.subjects.map((subject, i) => (
                              <Badge key={i} variant="neutral" className="subject-badge">{subject}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="empty-text">No subjects added</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </>
          ) : (
            /* Edit Form */
            <Card className="profile-edit-form card-elevated">
              <form onSubmit={handleSubmit}>
                <div className="section-header">
                  <h2>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Edit Profile
                  </h2>
                </div>

                <Input
                  label="Full Name"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your full name"
                />

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    className="input"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Your phone number"
                  />

                  <Input
                    label="Location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="education">Education</label>
                  <textarea
                    id="education"
                    className="input"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="Your educational background..."
                    rows="2"
                  />
                </div>

                {isProfessor && (
                  <div className="professor-fields">
                    <div className="form-divider">
                      <span>Teaching Information</span>
                    </div>

                    <Input
                      label="Headline"
                      type="text"
                      value={professorData.headline}
                      onChange={(e) => setProfessorData({ ...professorData, headline: e.target.value })}
                      placeholder="e.g., Expert Mathematics Tutor with 10+ years experience"
                    />

                    <div className="form-row">
                      <Input
                        label="Subjects (comma-separated)"
                        type="text"
                        value={professorData.subjects}
                        onChange={(e) => setProfessorData({ ...professorData, subjects: e.target.value })}
                        placeholder="e.g., Math, Physics, Computer Science"
                      />

                      <Input
                        label="Hourly Rate ($)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={professorData.hourlyRate}
                        onChange={(e) => setProfessorData({ ...professorData, hourlyRate: e.target.value })}
                        placeholder="50.00"
                      />
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="btn-spinner" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setError('');
                      setMessage('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>

      <style>{`
        .profile-page {
          min-height: calc(100vh - 200px);
          padding-bottom: 3rem;
        }

        .profile-header {
          position: relative;
          margin-bottom: 2rem;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          background: var(--bg-primary);
          border: 1px solid var(--border-light);
        }

        .profile-header-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: var(--gradient-primary);
        }

        .profile-header-content {
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 1.5rem;
          padding: 0 2rem 2rem;
          padding-top: 60px;
          flex-wrap: wrap;
        }

        .profile-avatar-large {
          width: 120px;
          height: 120px;
          border-radius: var(--radius-2xl);
          background: var(--gradient-secondary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          border: 4px solid var(--bg-primary);
          flex-shrink: 0;
        }

        .profile-header-info {
          flex: 1;
          min-width: 200px;
        }

        .profile-header-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }

        .profile-header-name h1 {
          font-size: 1.75rem;
          margin: 0;
        }

        .profile-header-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .meta-item.highlight {
          color: var(--accent-primary);
          font-weight: 600;
        }

        .profile-headline {
          color: var(--text-secondary);
          font-size: 0.9375rem;
          margin: 0.5rem 0 0 0;
          max-width: 500px;
        }

        .profile-header-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .completion-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.25rem 1.5rem !important;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%) !important;
          border: 1px solid rgba(245, 158, 11, 0.3) !important;
          flex-wrap: wrap;
        }

        .completion-banner-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .completion-banner-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          background: rgba(245, 158, 11, 0.2);
          color: #D97706;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .completion-banner-content strong {
          display: block;
          font-size: 0.9375rem;
          margin-bottom: 0.25rem;
        }

        .completion-banner-content p {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-section {
          padding: 1.75rem !important;
        }

        .section-header {
          margin-bottom: 1.25rem;
        }

        .section-header h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
          color: var(--text-primary);
        }

        .profile-bio {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        .empty-text {
          color: var(--text-tertiary);
          font-style: italic;
        }

        .profile-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
        }

        .profile-field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .profile-field-full {
          grid-column: 1 / -1;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .field-value {
          font-size: 0.9375rem;
          color: var(--text-primary);
        }

        .subjects-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .subject-badge {
          font-size: 0.8125rem;
        }

        /* Edit Form */
        .profile-edit-form {
          padding: 2rem !important;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
        }

        .form-divider::before,
        .form-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-light);
        }

        .form-divider span {
          padding: 0 1rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        @media (max-width: 768px) {
          .profile-header-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 0 1.5rem 1.5rem;
            padding-top: 40px;
          }

          .profile-avatar-large {
            width: 100px;
            height: 100px;
            font-size: 2rem;
          }

          .profile-header-name {
            justify-content: center;
          }

          .profile-header-meta {
            justify-content: center;
          }

          .profile-header-actions {
            width: 100%;
            justify-content: center;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .completion-banner {
            flex-direction: column;
            text-align: center;
          }

          .completion-banner-content {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

const ProfileField = ({ label, value, icon, fullWidth }) => (
  <div className={`profile-field ${fullWidth ? 'profile-field-full' : ''}`}>
    <div className="field-label">
      {icon}
      {label}
    </div>
    <div className="field-value">
      {value || <span className="empty-text">Not set</span>}
    </div>
  </div>
);

export default Profile;
