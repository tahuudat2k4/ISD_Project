import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TeacherPage from './pages/TeacherPage';
import TeacherAssignmentsPage from './pages/TeacherAssignmentsPage';
import TeacherSchedulePage from './pages/TeacherSchedulePage';
import TeacherEvaluationPage from './pages/TeacherEvaluationPage';
import StudentPage from './pages/StudentPage';
import StudentAssignClassPage from './pages/StudentAssignClassPage';
import StudentRecordsPage from './pages/StudentRecordsPage';
import StudentHealthPage from './pages/StudentHealthPage';
import GermClassPage from './pages/GermClassPage';
import BudClassPage from './pages/BudClassPage';
import LeafClassPage from './pages/LeafClassPage';
import AttendancePage from './pages/AttendancePage';
import LessonsPage from './pages/LessonsPage';
import EvaluationPage from './pages/EvaluationPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Main application 
function App() {
  return ( 
  <>
    <Toaster richColors/>
    <BrowserRouter>
        <Routes>
          {/* Public routes*/}
          <Route path="/" element={<LoginPage/>} />
          {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage/>
              </ProtectedRoute>
            } />
            <Route path="/teachers" element={
              <ProtectedRoute>
                <TeacherPage/>
              </ProtectedRoute>
            } />
            <Route path="/teachers/assignments" element={
              <ProtectedRoute>
                <TeacherAssignmentsPage />
              </ProtectedRoute>
            } />
            <Route path="/teachers/schedule" element={
              <ProtectedRoute>
                <TeacherSchedulePage />
              </ProtectedRoute>
            } />
            <Route path="/teachers/evaluation" element={
              <ProtectedRoute>
                <TeacherEvaluationPage />
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute>
                <StudentPage />
              </ProtectedRoute>
            } />
            <Route path="/students/assign-class" element={
              <ProtectedRoute>
                <StudentAssignClassPage />
              </ProtectedRoute>
            } />
            <Route path="/students/records" element={
              <ProtectedRoute>
                <StudentRecordsPage />
              </ProtectedRoute>
            } />
            <Route path="/students/health" element={
              <ProtectedRoute>
                <StudentHealthPage />
              </ProtectedRoute>
            } />
            <Route path="/classes/germ" element={
              <ProtectedRoute>
                <GermClassPage />
              </ProtectedRoute>
            } />
            <Route path="/classes/choi" element={
              <ProtectedRoute>
                <BudClassPage />
              </ProtectedRoute>
            } />
            <Route path="/classes/la" element={
              <ProtectedRoute>
                <LeafClassPage />
              </ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            } />
            <Route path="/lessons" element={
              <ProtectedRoute>
                <LessonsPage />
              </ProtectedRoute>
            } />
            <Route path="/evaluation" element={
              <ProtectedRoute>
                <EvaluationPage />
              </ProtectedRoute>
            } />
        </Routes>
    </BrowserRouter>
  </>
  )
}

export default App