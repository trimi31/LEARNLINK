import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { paymentApi } from '../api/paymentApi';
import { lessonApi } from '../api/lessonApi';
import { reviewApi } from '../api/reviewApi';
import { useAuth } from '../store/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Toggle from '../components/ui/Toggle';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import LevelSelector from '../components/ui/LevelSelector';
import Breadcrumb from '../components/ui/Breadcrumb';
import { useToast } from '../components/ui/Toast';
import AuthPrompt from '../components/AuthPrompt';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent, isProfessor, isAuthenticated } = useAuth();
  const toast = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('lessons');

  // Modals & Forms
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [editCourseFormData, setEditCourseFormData] = useState({
    tittle: '', description: '', price: '', category: '', level: '', published: false,
  });
  const [addLessonFormData, setAddLessonFormData] = useState({
    title: '', description: '', contentUrl: '', durationMinutes: '', price: '',
  });
  const [submittingCourse, setSubmittingCourse] = useState(false);
  const [submittingLesson, setSubmittingLesson] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showPurchaseConfirmModal, setShowPurchaseConfirmModal] = useState(false);

  const loadCourse = useCallback(async () => {
    try {
      const response = await courseApi.getById(id);
      setCourse(response.data);
      setEditCourseFormData({
        tittle: response.data.tittle,
        description: response.data.description || '',
        price: response.data.price,
        category: response.data.category || '',
        level: response.data.level,
        published: response.data.published,
      });

      if (isStudent && user?.studentProfile?.id) {
        try {
          const paymentsRes = await paymentApi.getMyPayments();
          const purchased = paymentsRes.data.some(p => p.courseId === id && p.status === 'PAID');
          setHasPurchased(purchased);

          const reviewed = response.data.reviews?.some(r => r.studentId === user.studentProfile.id);
          setHasReviewed(reviewed);
        } catch (err) {
          console.error('Error checking purchase status:', err);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [id, isStudent, user]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const isCourseOwner = isProfessor && user?.professorProfile?.id === course?.professorId;

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowPurchaseConfirmModal(true);
  };

  const handleConfirmPurchase = async () => {
    setPurchasing(true);
    setMessage('');
    setError('');
    setShowPurchaseConfirmModal(false);

    try {
      await paymentApi.checkout({ courseId: id });
      toast.success('You now have full access to all lessons!', 'Course Purchased! 🎉');
      setHasPurchased(true);
      await loadCourse();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleEditCourseSubmit = async (e) => {
    e.preventDefault();
    setSubmittingCourse(true);
    setError('');
    setMessage('');
    try {
      await courseApi.update(id, {
        ...editCourseFormData,
        price: parseFloat(editCourseFormData.price),
      });
      toast.success('Your changes have been saved', 'Course Updated ✓');
      setShowEditCourseModal(false);
      await loadCourse();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update course');
    } finally {
      setSubmittingCourse(false);
    }
  };

  const handleAddLessonSubmit = async (e) => {
    e.preventDefault();
    setSubmittingLesson(true);
    setError('');
    setMessage('');
    try {
      await courseApi.addLesson(id, {
        ...addLessonFormData,
        durationMinutes: parseInt(addLessonFormData.durationMinutes) || 0,
        price: parseFloat(addLessonFormData.price) || 0,
      });
      toast.success(`"${addLessonFormData.title}" added to course`, 'Lesson Added ✓');
      setShowAddLessonModal(false);
      setAddLessonFormData({ title: '', description: '', contentUrl: '', durationMinutes: '', price: '' });
      await loadCourse();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add lesson');
    } finally {
      setSubmittingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    setError('');
    setMessage('');
    try {
      await lessonApi.delete(lessonId);
      toast.success('Lesson has been removed', 'Lesson Deleted');
      await loadCourse();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete lesson');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewFormData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    setSubmittingReview(true);
    setError('');
    setMessage('');
    try {
      await reviewApi.create({
        courseId: id,
        professorId: course.professorId,
        rating: reviewFormData.rating,
        comment: reviewFormData.comment,
      });
      setMessage('Review submitted successfully!');
      setReviewFormData({ rating: 0, comment: '' });
      setHasReviewed(true);
      await loadCourse();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader message="Loading course details..." />;

  if (!course) {
    return (
      <div className="container">
        <Card>
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>Course Not Found</h3>
            <p>The course you're looking for doesn't exist</p>
            <Button variant="primary" onClick={() => navigate('/courses')}>
              Browse Courses
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const professorName = course.professor?.user?.profile?.fullName || 'Professor';

  return (
    <div className="course-detail-page">
      <div className="container">
        {/* Course Header */}
        <div className="course-detail-header">
          <div className="course-detail-header-content">
            <div className="course-detail-info">
              {/* Badges */}
              <div className="course-detail-badges">
                <Badge variant="info">{course.level}</Badge>
                {course.category && <Badge variant="neutral">{course.category}</Badge>}
                {course.published ? (
                  <Badge variant="success">Published</Badge>
                ) : (
                  <Badge variant="warning">Draft</Badge>
                )}
              </div>

              <h1>{course.tittle}</h1>

              <p className="course-detail-description">{course.description}</p>

              {/* Professor */}
              <Link to={`/professors/${course.professorId}`} className="course-detail-professor">
                <div className="professor-avatar">
                  {professorName[0].toUpperCase()}
                </div>
                <div>
                  <span className="professor-label">Created by</span>
                  <span className="professor-name">{professorName}</span>
                </div>
              </Link>

              {/* Stats */}
              <div className="course-detail-stats">
                <div className="stat">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="stat-value">{course.averageRating?.toFixed(1) || 'New'}</span>
                  <span className="stat-label">({course.reviews?.length || 0} reviews)</span>
                </div>
                <div className="stat">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="stat-value">{course.lessons?.length || 0}</span>
                  <span className="stat-label">lessons</span>
                </div>
              </div>
            </div>

            {/* Purchase Card */}
            <Card className="course-purchase-card card-elevated">
              <div className="purchase-price">
                <span className="price-value">${course.price}</span>
                <span className="price-label">Full course access</span>
              </div>

              {isCourseOwner ? (
                <div className="owner-actions">
                  <Button variant="primary" fullWidth onClick={() => setShowEditCourseModal(true)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Edit Course
                  </Button>
                  <Button variant="success" fullWidth onClick={() => setShowAddLessonModal(true)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Lesson
                  </Button>
                </div>
              ) : isStudent ? (
                hasPurchased ? (
                  <Button variant="secondary" size="lg" fullWidth disabled>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Already Purchased
                  </Button>
                ) : (
                  <Button
                    onClick={handlePurchaseClick}
                    variant="success"
                    size="lg"
                    disabled={purchasing}
                    fullWidth
                  >
                    {purchasing ? (
                      <>
                        <span className="btn-spinner" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        Purchase Course
                      </>
                    )}
                  </Button>
                )
              ) : !isAuthenticated ? (
                <Link to="/login" style={{ width: '100%' }}>
                  <Button variant="primary" size="lg" fullWidth>
                    Login to Purchase
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" size="lg" fullWidth disabled>
                  Professors can't purchase
                </Button>
              )}

              <div className="purchase-includes">
                <div className="include-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Full lifetime access
                </div>
                <div className="include-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Access on all devices
                </div>
                <div className="include-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Certificate of completion
                </div>
              </div>
            </Card>
          </div>
        </div>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="error">{error}</Alert>}

        {/* Tabs */}
        <div className="course-tabs">
          <button
            className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Lessons ({course.lessons?.length || 0})
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Reviews ({course.reviews?.length || 0})
          </button>
        </div>

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="tab-content">
            {/* Access notice for non-purchasers */}
            {!hasPurchased && !isCourseOwner && course.lessons?.length > 0 && (
              <div className="access-notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Purchase this course to unlock all lesson content</span>
              </div>
            )}

            {course.lessons && course.lessons.length > 0 ? (
              <div className="lessons-list">
                {course.lessons.map((lesson, index) => {
                  const canAccessContent = hasPurchased || isCourseOwner;

                  return (
                    <Card key={lesson.id} className={`lesson-card card-elevated ${!canAccessContent ? 'lesson-locked' : ''}`}>
                      <div className="lesson-number">{index + 1}</div>
                      <div className="lesson-content">
                        <h3>{lesson.title}</h3>
                        <p>{lesson.description || 'No description provided.'}</p>

                        {/* Only show content link if user has access */}
                        {canAccessContent ? (
                          lesson.contentUrl && (
                            <a
                              href={lesson.contentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="lesson-link"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                              Watch Lesson
                            </a>
                          )
                        ) : (
                          <div className="lesson-locked-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Locked
                          </div>
                        )}
                      </div>
                      <div className="lesson-meta">
                        <Badge variant="neutral">{lesson.durationMinutes} min</Badge>
                        {lesson.price > 0 && (
                          <span className="lesson-price">${lesson.price}</span>
                        )}
                        {isCourseOwner && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLesson(lesson.id)}
                            style={{ color: 'var(--danger)' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <h3>No Lessons Yet</h3>
                  <p>The instructor is still preparing the course content.</p>
                  {isCourseOwner && (
                    <Button variant="primary" onClick={() => setShowAddLessonModal(true)}>
                      Add First Lesson
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="tab-content">
            {/* Review Form for Students */}
            {isStudent && hasPurchased && !hasReviewed && (
              <Card className="review-form-card card-elevated">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Write a Review
                </h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="rating-selector">
                    <label>Rating</label>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          className={`star ${reviewFormData.rating >= num ? 'active' : ''}`}
                          onClick={() => setReviewFormData({ ...reviewFormData, rating: num })}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="comment">Comment (optional)</label>
                    <textarea
                      id="comment"
                      className="input"
                      value={reviewFormData.comment}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, comment: e.target.value })}
                      rows="4"
                      placeholder="Share your experience with this course..."
                    />
                  </div>
                  <Button type="submit" variant="primary" disabled={submittingReview}>
                    {submittingReview ? (
                      <>
                        <span className="btn-spinner" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </form>
              </Card>
            )}

            {/* Reviews List */}
            {course.reviews && course.reviews.length > 0 ? (
              <div className="reviews-list">
                {course.reviews.map((review) => (
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
                        <span className="stars">{'⭐'.repeat(review.rating)}</span>
                        <span className="rating-text">{review.rating}/5</span>
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
                  <p>Be the first to purchase and review this course!</p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Edit Course Modal - Enhanced */}
        <Modal isOpen={showEditCourseModal} onClose={() => setShowEditCourseModal(false)} title="Edit Course">
          <form onSubmit={handleEditCourseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Section: Basic Info */}
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03), rgba(139, 92, 246, 0.03))',
              borderRadius: '0.75rem',
              border: '1px solid rgba(99, 102, 241, 0.1)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                📝 Basic Information
              </div>
              <Input
                label="Course Title"
                type="text"
                value={editCourseFormData.tittle}
                onChange={(e) => setEditCourseFormData({ ...editCourseFormData, tittle: e.target.value })}
                placeholder="e.g., Introduction to Web Development"
                required
              />
            </div>

            {/* Description with character counter */}
            <Textarea
              label="Description"
              value={editCourseFormData.description}
              onChange={(e) => setEditCourseFormData({ ...editCourseFormData, description: e.target.value })}
              placeholder="Describe what students will learn in this course..."
              maxLength={500}
              minRows={4}
              hint="A good description helps students understand the value of your course"
            />

            {/* Price & Category Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.375rem' }}>
                  Price
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                    fontWeight: 600,
                  }}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editCourseFormData.price}
                    onChange={(e) => setEditCourseFormData({ ...editCourseFormData, price: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem 1rem 0.625rem 1.75rem',
                      fontSize: '0.9375rem',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.625rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
              <Select
                label="Category"
                value={editCourseFormData.category}
                onChange={(val) => setEditCourseFormData({ ...editCourseFormData, category: val })}
                placeholder="Select category"
                options={[
                  { value: 'Programming', label: 'Programming', icon: '💻' },
                  { value: 'Web Development', label: 'Web Development', icon: '🌐' },
                  { value: 'Data Science', label: 'Data Science', icon: '📊' },
                  { value: 'Design', label: 'Design', icon: '🎨' },
                  { value: 'Business', label: 'Business', icon: '💼' },
                  { value: 'Marketing', label: 'Marketing', icon: '📈' },
                  { value: 'Music', label: 'Music', icon: '🎵' },
                  { value: 'Photography', label: 'Photography', icon: '📷' },
                  { value: 'Other', label: 'Other', icon: '📚' },
                ]}
              />
            </div>

            {/* Level Selector */}
            <LevelSelector
              label="Difficulty Level"
              value={editCourseFormData.level}
              onChange={(val) => setEditCourseFormData({ ...editCourseFormData, level: val })}
            />

            {/* Published Toggle */}
            <div style={{
              padding: '1rem',
              background: editCourseFormData.published ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))' : '#F8FAFC',
              borderRadius: '0.75rem',
              border: `1px solid ${editCourseFormData.published ? 'rgba(16, 185, 129, 0.2)' : '#E2E8F0'}`,
              transition: 'all 0.2s ease',
            }}>
              <Toggle
                checked={editCourseFormData.published}
                onChange={(val) => setEditCourseFormData({ ...editCourseFormData, published: val })}
                label={editCourseFormData.published ? '✅ Published' : 'Draft Mode'}
                description={editCourseFormData.published
                  ? 'This course is visible to all students'
                  : 'Only you can see this course'}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="primary" fullWidth disabled={submittingCourse} size="lg">
              {submittingCourse ? (
                <>
                  <span className="btn-spinner" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Modal>

        {/* Add Lesson Modal - Enhanced */}
        <Modal isOpen={showAddLessonModal} onClose={() => setShowAddLessonModal(false)} title="Add New Lesson">
          <form onSubmit={handleAddLessonSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Lesson Info Section */}
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03), rgba(5, 150, 105, 0.03))',
              borderRadius: '0.75rem',
              border: '1px solid rgba(16, 185, 129, 0.1)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                🎬 Lesson Details
              </div>
              <Input
                label="Lesson Title"
                type="text"
                value={addLessonFormData.title}
                onChange={(e) => setAddLessonFormData({ ...addLessonFormData, title: e.target.value })}
                placeholder="e.g., Introduction to Components"
                required
              />
            </div>

            {/* Description */}
            <Textarea
              label="Description"
              value={addLessonFormData.description}
              onChange={(e) => setAddLessonFormData({ ...addLessonFormData, description: e.target.value })}
              placeholder="What will students learn in this lesson?"
              maxLength={300}
              minRows={3}
            />

            {/* Content URL with preview hint */}
            <div>
              <Input
                label="Content URL"
                type="url"
                value={addLessonFormData.contentUrl}
                onChange={(e) => setAddLessonFormData({ ...addLessonFormData, contentUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
              <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.375rem' }}>
                💡 Supports YouTube, Vimeo, or any video URL
              </p>
            </div>

            {/* Duration & Price Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.375rem' }}>
                  Duration
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="1"
                    value={addLessonFormData.durationMinutes}
                    onChange={(e) => setAddLessonFormData({ ...addLessonFormData, durationMinutes: e.target.value })}
                    required
                    placeholder="30"
                    style={{
                      width: '100%',
                      padding: '0.625rem 3rem 0.625rem 1rem',
                      fontSize: '0.9375rem',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.625rem',
                      outline: 'none',
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                    fontSize: '0.875rem',
                  }}>min</span>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.375rem' }}>
                  Price <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                    fontWeight: 600,
                  }}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addLessonFormData.price}
                    onChange={(e) => setAddLessonFormData({ ...addLessonFormData, price: e.target.value })}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '0.625rem 1rem 0.625rem 1.75rem',
                      fontSize: '0.9375rem',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.625rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.6875rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                  Leave at 0 for free with course
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="success" fullWidth disabled={submittingLesson} size="lg">
              {submittingLesson ? (
                <>
                  <span className="btn-spinner" />
                  Adding Lesson...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Lesson
                </>
              )}
            </Button>
          </form>
        </Modal>

        {/* Purchase Confirmation Modal */}
        <Modal
          isOpen={showPurchaseConfirmModal}
          onClose={() => setShowPurchaseConfirmModal(false)}
          title="Confirm Purchase"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Course Summary */}
            <div style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))',
              borderRadius: '0.75rem',
              border: '1px solid rgba(16, 185, 129, 0.15)',
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', color: '#1E293B' }}>
                {course?.tittle}
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B' }}>
                by {professorName}
              </p>
            </div>

            {/* Price Display */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10B981' }}>
                ${course?.price}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.25rem' }}>
                One-time payment • Full lifetime access
              </div>
            </div>

            {/* What You'll Get */}
            <div style={{
              padding: '1rem',
              background: '#F8FAFC',
              borderRadius: '0.75rem',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                ✨ What you'll get
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
                  <span style={{ color: '#10B981' }}>✓</span> {course?.lessons?.length || 0} lessons
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
                  <span style={{ color: '#10B981' }}>✓</span> Full lifetime access
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
                  <span style={{ color: '#10B981' }}>✓</span> Certificate of completion
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button
                variant="ghost"
                onClick={() => setShowPurchaseConfirmModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={handleConfirmPurchase}
                disabled={purchasing}
                style={{ flex: 2 }}
              >
                {purchasing ? (
                  <>
                    <span className="btn-spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Confirm Purchase
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      <style>{`
        .course-detail-page {
          padding-bottom: 3rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        .course-detail-header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
          margin: -2rem -2rem 2rem -2rem;
          padding: 3.5rem 2rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .course-detail-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .course-detail-header::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: 5%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
          border-radius: 50%;
        }

        .course-detail-header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 3rem;
          align-items: start;
          position: relative;
          z-index: 10;
        }

        .course-detail-info {
          color: white;
        }

        .course-detail-info h1 {
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 800;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .course-detail-badges {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .course-detail-info h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }

        .course-detail-description {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 1.5rem 0;
          line-height: 1.6;
          max-width: 600px;
        }

        .course-detail-professor {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: white;
          margin-bottom: 1.5rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          transition: all 0.2s ease;
        }

        .course-detail-professor:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .course-detail-professor .professor-avatar {
          width: 44px;
          height: 44px;
          border-radius: 0.625rem;
          background: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
        }

        .course-detail-professor .professor-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          display: block;
        }

        .course-detail-professor .professor-name {
          font-weight: 600;
        }

        .course-detail-stats {
          display: flex;
          gap: 2rem;
        }

        .course-detail-stats .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.9;
        }

        .course-detail-stats .stat-value {
          font-weight: 600;
          font-size: 1.125rem;
        }

        .course-detail-stats .stat-label {
          opacity: 0.7;
        }

        /* Purchase Card - Glassmorphism */
        .course-purchase-card {
          padding: 2rem !important;
          position: sticky;
          top: 100px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        }

        .purchase-price {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .price-value {
          display: block;
          font-size: 2.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .price-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .owner-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .purchase-includes {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-light);
        }

        .include-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .include-item svg {
          color: var(--success);
        }

        /* Tabs */
        .course-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.75rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
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
          font-weight: 600;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: rgba(99, 102, 241, 0.1);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }


        /* Lessons */
        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .lesson-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem !important;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          transition: all 0.2s ease;
        }

        .lesson-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .lesson-number {
          width: 40px;
          height: 40px;
          border-radius: 0.625rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .lesson-content {
          flex: 1;
          min-width: 0;
        }

        .lesson-content h3 {
          font-size: 1rem;
          margin: 0 0 0.25rem 0;
        }

        .lesson-content p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .lesson-link {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--brand-primary);
          text-decoration: none;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .lesson-link:hover {
          text-decoration: underline;
        }

        .lesson-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .lesson-price {
          font-weight: 600;
          color: var(--accent-primary);
        }

        /* Access Control Styling */
        .access-notice {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1));
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          color: var(--warning);
          font-weight: 500;
        }

        .access-notice svg {
          flex-shrink: 0;
        }

        .lesson-locked {
          opacity: 0.75;
          background: var(--bg-secondary);
        }

        .lesson-locked-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--text-tertiary);
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .lesson-locked-badge svg {
          color: var(--text-tertiary);
        }

        /* Reviews */
        .review-form-card {
          padding: 1.75rem !important;
          margin-bottom: 1.5rem;
        }

        .review-form-card h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1.25rem 0;
          font-size: 1.125rem;
        }

        .rating-selector {
          margin-bottom: 1rem;
        }

        .rating-selector label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .rating-selector .stars {
          display: flex;
          gap: 0.25rem;
        }

        .rating-selector .star {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem;
          opacity: 0.3;
          transition: opacity var(--duration-fast) var(--ease-out);
        }

        .rating-selector .star:hover,
        .rating-selector .star.active {
          opacity: 1;
        }

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

        .review-rating .stars {
          font-size: 0.875rem;
        }

        .review-rating .rating-text {
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

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 1.125rem;
          height: 1.125rem;
        }

        @media (max-width: 900px) {
          .course-detail-header {
            padding: 2rem 1.5rem;
          }

          .course-detail-header-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .course-detail-info h1 {
            font-size: 1.75rem;
          }

          .course-purchase-card {
            position: static;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseDetail;
