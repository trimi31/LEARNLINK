import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { professorApi } from '../api/professorApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import Loader from '../components/ui/Loader';

const ProfessorList = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ subject: '', search: '' });

  const loadProfessors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await professorApi.getAll(filters);
      setProfessors(response.data);
    } catch (err) {
      setError('Failed to load professors');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProfessors();
  }, [loadProfessors]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProfessors();
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
      'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    ];
    return gradients[index % gradients.length];
  };

  if (loading) return <Loader message="Loading professors..." />;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
            Find Your Instructor
          </div>
          <h1 className="text-4xl font-bold mb-3">Expert Professors</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Connect with verified experts who can help you achieve your learning goals
          </p>
        </div>

        {/* Search & Filter */}
        <Card className="card-elevated mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                id="search"
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="Search by name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <div className="min-w-[180px]">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="e.g., Mathematics"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              />
            </div>

            <div className="flex gap-2 items-end">
              <Button type="submit" variant="primary">
                Search
              </Button>
              {(filters.search || filters.subject) && (
                <Button type="button" variant="ghost" onClick={() => setFilters({ subject: '', search: '' })}>
                  Clear
                </Button>
              )}
            </div>
          </form>
        </Card>

        {error && <Alert variant="error" className="mb-8">{error}</Alert>}

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {professors.length} Professor{professors.length !== 1 ? 's' : ''} Found
          </h2>
          {professors.length > 0 && (
            <p className="text-gray-600 mt-1">Browse profiles and book sessions with expert instructors</p>
          )}
        </div>

        {professors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professors.map((professor, index) => (
              <Card key={professor.id} className="card-interactive card-elevated flex flex-col p-6 gap-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-14 h-14 rounded-xl text-white flex items-center justify-center text-2xl font-bold flex-shrink-0"
                    style={{ background: getAvatarGradient(index) }}
                  >
                    {(professor.user?.profile?.fullName || 'P')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold">{professor.user?.profile?.fullName || 'Professor'}</h3>
                    {professor.headline && (
                      <p className="text-sm text-gray-600 line-clamp-2">{professor.headline}</p>
                    )}
                  </div>
                </div>

                {/* Subjects */}
                {professor.subjects && professor.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {professor.subjects.slice(0, 3).map((subject, i) => (
                      <Badge key={i} variant="neutral">
                        {subject}
                      </Badge>
                    ))}
                    {professor.subjects.length > 3 && (
                      <Badge variant="neutral">+{professor.subjects.length - 3}</Badge>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex justify-between items-center py-3 border-t border-b border-gray-100">
                  <div className="flex items-center gap-1 text-sm">
                    <span>⭐</span>
                    <span className="font-semibold">{professor.rating?.toFixed(1) || 'New'}</span>
                    <span className="text-gray-500">({professor.totalReviews || 0})</span>
                  </div>
                  {professor.hourlyRate && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-indigo-600">${professor.hourlyRate}</div>
                      <div className="text-xs text-gray-500">/hour</div>
                    </div>
                  )}
                </div>

                {/* Bio Preview */}
                {professor.user?.profile?.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {professor.user.profile.bio}
                  </p>
                )}

                {/* Action */}
                <Link to={`/professors/${professor.id}`} className="mt-auto">
                  <Button variant="primary" fullWidth>
                    View Profile
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-elevated">
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No Professors Found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfessorList;
