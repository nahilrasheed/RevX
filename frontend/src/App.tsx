import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminRoute from './Components/AdminRoute';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';

// Page imports
import Home from './Pages/Home';
import LoginPage from './Pages/LoginPage';
import ForgetPassword from './Pages/ForgetPassword';
import Upload from './Pages/Upload';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import About from './Pages/About';
import Explore from './Pages/Explore';
import Profile from './Pages/Profile';
import ProjectDescription from './Components/ProjectDescription';

// Admin page imports
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserManagement from './Pages/Admin/UserManagement';
import ProjectManagement from './Pages/Admin/ProjectManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Layout structure implemented directly */}
        <div className="min-h-screen bg-black text-white flex flex-col">
          <NavBar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/project/:projectId" element={<ProjectDescription />} />
              
              {/* Protected Routes */}
              <Route path="/upload" element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } />
              <Route path="/admin/projects" element={
                <AdminRoute>
                  <ProjectManagement />
                </AdminRoute>
              } />
              
              {/* Redirect all other routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
