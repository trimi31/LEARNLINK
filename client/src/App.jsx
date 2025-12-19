import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProfessorList from './pages/ProfessorList';
import ProfessorDetail from './pages/ProfessorDetail';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import StudentDashboard from './pages/StudentDashboard';
import BookingCreate from './pages/BookingCreate';
import Payment from './pages/Payment';
import ProfessorDashboard from './pages/ProfessorDashboard';
import ProfessorCourses from './pages/ProfessorCourses';
import ProfessorAvailability from './pages/ProfessorAvailability';
import Messages from './pages/Messages';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/professors" element={<ProfessorList />} />
                <Route path="/professors/:id" element={<ProfessorDetail />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:id" element={<CourseDetail />} />

                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/messages"
                  element={
                    <PrivateRoute>
                      <Messages />
                    </PrivateRoute>
                  }
                />

                {/* Student Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <PrivateRoute requiredRole="STUDENT">
                      <StudentDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/student/bookings"
                  element={
                    <PrivateRoute requiredRole="STUDENT">
                      <StudentDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/student/book/:professorId"
                  element={
                    <PrivateRoute requiredRole="STUDENT">
                      <BookingCreate />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/student/payment/:bookingId"
                  element={
                    <PrivateRoute requiredRole="STUDENT">
                      <Payment />
                    </PrivateRoute>
                  }
                />

                {/* Professor Routes */}
                <Route
                  path="/professor/dashboard"
                  element={
                    <PrivateRoute requiredRole="PROFESSOR">
                      <ProfessorDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/professor/courses"
                  element={
                    <PrivateRoute requiredRole="PROFESSOR">
                      <ProfessorCourses />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/professor/availability"
                  element={
                    <PrivateRoute requiredRole="PROFESSOR">
                      <ProfessorAvailability />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/professor/bookings"
                  element={
                    <PrivateRoute requiredRole="PROFESSOR">
                      <ProfessorDashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
