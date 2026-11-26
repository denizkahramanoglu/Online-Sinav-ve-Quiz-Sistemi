import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExamsPage from './pages/ExamsPage';
import ExamFormPage from './pages/ExamFormPage';
import TakeExamPage from './pages/TakeExamPage';
import MySubmissionsPage from './pages/MySubmissionsPage';
import DashboardPage from './pages/DashboardPage';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/exams" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/exams" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/exams" element={<ExamsPage />} />

          <Route
            path="/exams/new"
            element={
              <ProtectedRoute role="Teacher">
                <ExamFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/:id/edit"
            element={
              <ProtectedRoute role="Teacher">
                <ExamFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="Teacher">
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/:id/take"
            element={
              <ProtectedRoute role="Student">
                <TakeExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-submissions"
            element={
              <ProtectedRoute role="Student">
                <MySubmissionsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
