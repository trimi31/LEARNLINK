import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { lessonApi } from '../api/lessonApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';

const ProfessorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    tittle: '',
    description: '',
    price: '',
    category: '',
    level: 'BEGINNER',
    published: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Lesson Management
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessonFormData, setLessonFormData] = useState({
    title: '', description: '', contentUrl: '', durationMinutes: '',
  });
  const [submittingLesson, setSubmittingLesson] = useState(false);

  const loadCourses = useCallback(async () => {
    try {
      const response = await courseApi.getMyCourses();
      setCourses(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // Always create as draft - can only publish after adding lessons
      await courseApi.create({
        tittle: formData.tittle,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        level: formData.level,
        published: false, // Always start as draft
      });
      setSuccess('Course created successfully!');
      setShowForm(false);
      setFormData({
        tittle: '',
        description: '',
        price: '',
        category: '',
        level: 'BEGINNER',
        published: false,
      });
      await loadCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    setDeletingId(id);
    try {
      await courseApi.delete(id);
      setSuccess('Course deleted successfully!');
      await loadCourses();
    } catch (err) {
      setError('Failed to delete course');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenLessonModal = (course) => {
    setSelectedCourse(course);
    setShowLessonModal(true);
    setLessonFormData({ title: '', description: '', contentUrl: '', durationMinutes: '' });
  };

  const handleAddLessonSubmit = async (e) => {
    e.preventDefault();
    setSubmittingLesson(true);
    setError('');
    setSuccess('');
    try {
      await courseApi.addLesson(selectedCourse.id, {
        title: lessonFormData.title,
        description: lessonFormData.description,
        contentUrl: lessonFormData.contentUrl,
        durationMinutes: parseInt(lessonFormData.durationMinutes) || 0,
      });
      setSuccess('Lesson added successfully!');
      setShowLessonModal(false);
      await loadCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add lesson');
    } finally {
      setSubmittingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await lessonApi.delete(lessonId);
      setSuccess('Lesson deleted!');
      await loadCourses();
    } catch (err) {
      setError('Failed to delete lesson');
    }
  };

  // Add state for tracking publish action
  const [publishingId, setPublishingId] = useState(null);

  const handleTogglePublish = async (course) => {
    // Validate: can't publish without lessons
    if (!course.published && (!course.lessons || course.lessons.length === 0)) {
      setError('Cannot publish a course without lessons. Add at least one lesson first.');
      return;
    }

    const confirmMsg = course.published
      ? 'Unpublish this course? It will no longer be visible to students.'
      : 'Publish this course? It will be visible to all students.';

    if (!window.confirm(confirmMsg)) return;

    setPublishingId(course.id);
    setError('');
    try {
      await courseApi.update(course.id, { published: !course.published });
      setSuccess(course.published ? 'Course unpublished!' : 'Course published successfully!');
      await loadCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update course');
    } finally {
      setPublishingId(null);
    }
  };

  const publishedCount = courses.filter(c => c.published).length;
  const draftCount = courses.filter(c => !c.published).length;
  const totalLessons = courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0);

  if (loading) return <Loader message="Loading courses..." />;

  return (
    <div className="professor-courses-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
      paddingBottom: '3rem'
    }}>
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <div className="section-eyebrow">Course Management</div>
            <h1 style={{ marginBottom: '0.375rem' }}>My Courses</h1>
            <p style={{ fontSize: '1rem' }}>Create, edit, and manage your courses</p>
          </div>
          <div className="page-header-actions">
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setError('');
                setSuccess('');
              }}
              variant={showForm ? 'outline' : 'primary'}
            >
              {showForm ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create Course
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats - Enhanced with Icons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '0.875rem',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6366F1'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, #1e293b, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{courses.length}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Total Courses</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '0.875rem',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{publishedCount}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Published</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '0.875rem',
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F59E0B'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, #F59E0B, #D97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{draftCount}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Drafts</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '0.875rem',
              background: 'rgba(37, 99, 235, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{totalLessons}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Total Lessons</div>
            </div>
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Create Course Form */}
        {showForm && (
          <Card className="create-form card-elevated" style={{ marginBottom: '2rem', padding: '2rem', borderTop: '4px solid var(--brand-primary)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              Create New Course
            </h3>

            <form onSubmit={handleSubmit}>
              {/* Course Title */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Course Title <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <Input
                  value={formData.tittle}
                  onChange={(e) => setFormData({ ...formData, tittle: e.target.value })}
                  placeholder="e.g., Introduction to JavaScript"
                  required
                />
              </div>

              {/* Price and Category Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                    Price ($) <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="49.99"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Category</label>
                  <select
                    className="input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ height: '45px' }}
                  >
                    <option value="">Select a category</option>
                    <option value="Programming">💻 Programming</option>
                    <option value="Web Development">🌐 Web Development</option>
                    <option value="Data Science">📊 Data Science</option>
                    <option value="Design">🎨 Design</option>
                    <option value="Business">💼 Business</option>
                    <option value="Marketing">📈 Marketing</option>
                    <option value="Languages">🗣️ Languages</option>
                    <option value="Music">🎵 Music</option>
                    <option value="Other">📚 Other</option>
                  </select>
                </div>
              </div>

              {/* Level Selection - Visual Cards */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'block' }}>Difficulty Level</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {[
                    { value: 'BEGINNER', label: 'Beginner', icon: '🌱', color: '#22C55E' },
                    { value: 'INTERMEDIATE', label: 'Intermediate', icon: '📈', color: '#F59E0B' },
                    { value: 'ADVANCED', label: 'Advanced', icon: '🚀', color: '#EF4444' }
                  ].map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, level: level.value })}
                      style={{
                        padding: '1rem',
                        border: formData.level === level.value ? `2px solid ${level.color}` : '2px solid var(--border-light)',
                        borderRadius: 'var(--radius-lg)',
                        background: formData.level === level.value ? `${level.color}10` : 'var(--bg-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{level.icon}</span>
                      <span style={{ fontWeight: formData.level === level.value ? 600 : 500, color: formData.level === level.value ? level.color : 'var(--text-primary)' }}>
                        {level.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Description</label>
                <textarea
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what students will learn in this course..."
                  rows="4"
                  style={{ resize: 'vertical' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                  {formData.description.length}/500 characters
                </div>
              </div>

              {/* Publish Notice - New courses start as drafts */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '1rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.08))',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.125rem'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>
                    Courses start as drafts
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
                    Add at least one lesson before publishing. This ensures students get quality content when they purchase your course.
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="primary" disabled={submitting || !formData.tittle || !formData.price} fullWidth size="lg">
                {submitting ? (
                  <>
                    <span className="btn-spinner" />
                    Creating Course...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Create Course
                  </>
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="courses-grid">
            {courses.map((course) => (
              <Card key={course.id} className="course-card card-elevated">
                <div className="course-header">
                  <div className="course-badges">
                    <Badge variant={course.published ? 'success' : 'warning'}>
                      {course.published ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge variant="info">{course.level}</Badge>
                  </div>
                  <span className="course-price">${course.price}</span>
                </div>

                <h3>{course.tittle}</h3>

                <p className="course-description">
                  {course.description?.substring(0, 80) || 'No description'}
                  {course.description?.length > 80 ? '...' : ''}
                </p>

                <div className="course-stats">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {course.lessons?.length || 0} lessons
                  </span>
                  {course.category && (
                    <Badge variant="neutral" className="badge-sm">{course.category}</Badge>
                  )}
                </div>

                {/* Warning for drafts without lessons */}
                {!course.published && (!course.lessons || course.lessons.length === 0) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 0.875rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '0.5rem',
                    marginTop: '0.75rem',
                    fontSize: '0.75rem',
                    color: '#B45309'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Add lessons to publish
                  </div>
                )}

                <div className="course-actions" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <Link to={`/courses/${course.id}`}>
                    <Button variant="ghost" size="sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      View
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenLessonModal(course)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Lesson
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(course)}
                    disabled={publishingId === course.id}
                    style={{
                      color: course.published ? '#F59E0B' : '#10B981',
                      opacity: (!course.published && (!course.lessons || course.lessons.length === 0)) ? 0.5 : 1
                    }}
                  >
                    {publishingId === course.id ? (
                      <span className="btn-spinner" />
                    ) : course.published ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                        Unpublish
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Publish
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(course.id)}
                    disabled={deletingId === course.id}
                    style={{ color: 'var(--danger)' }}
                  >
                    {deletingId === course.id ? (
                      <span className="btn-spinner" />
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3>No courses yet</h3>
              <p>Create your first course to start teaching and earning</p>
              {!showForm && (
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  Create Course
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Add Lesson Modal */}
        <Modal
          isOpen={showLessonModal}
          onClose={() => setShowLessonModal(false)}
          title={`Add Lesson to "${selectedCourse?.tittle || ''}"`}
        >
          <form onSubmit={handleAddLessonSubmit}>
            <Input
              label="Lesson Title"
              type="text"
              value={lessonFormData.title}
              onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
              required
            />
            <div className="form-group">
              <label htmlFor="lesson-description">Description</label>
              <textarea
                id="lesson-description"
                className="input"
                value={lessonFormData.description}
                onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
                rows="3"
              />
            </div>
            <Input
              label="Content URL (YouTube, Vimeo, etc.)"
              type="text"
              value={lessonFormData.contentUrl}
              onChange={(e) => setLessonFormData({ ...lessonFormData, contentUrl: e.target.value })}
              placeholder="e.g., https://youtube.com/watch?v=..."
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={lessonFormData.durationMinutes}
              onChange={(e) => setLessonFormData({ ...lessonFormData, durationMinutes: e.target.value })}
              required
            />
            <Button type="submit" variant="primary" fullWidth disabled={submittingLesson} style={{ marginTop: '1rem' }}>
              {submittingLesson ? (
                <>
                  <span className="btn-spinner" />
                  Adding...
                </>
              ) : (
                'Add Lesson'
              )}
            </Button>
          </form>
        </Modal>
      </div>

      <style>{`
        .professor-courses-page {
          padding-bottom: 3rem;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }

        .course-card {
          padding: 1.5rem !important;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .course-badges {
          display: flex;
          gap: 0.5rem;
        }

        .course-price {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .course-card h3 {
          font-size: 1.125rem;
          margin: 0;
        }

        .course-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .course-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-top: 1px solid var(--border-light);
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .course-stats span {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .course-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: normal;
        }

        .checkbox-label input {
          width: 1.125rem;
          height: 1.125rem;
        }
      `}</style>
    </div>
  );
};

export default ProfessorCourses;
