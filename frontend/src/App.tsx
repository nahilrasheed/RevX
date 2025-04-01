import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Hero from './Components/Hero';
import Footer from './Components/Footer';
import ProjectGrid from './Components/ProjectGrid';
import Home from './Pages/Home';
import ForgetPassword from './Pages/ForgetPassword';
import LoginPage from './Pages/LoginPage';
import Upload from './Pages/Upload';
import Register from './Pages/Register';
import ProjectDescription from './Components/ProjectDescription';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Pages/Dashboard';
import About from './Pages/About';
import Explore from './Pages/Explore';
import Profile from './Pages/Profile';

function AppContent() {

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <Routes>
        <Route path="/" element={<>
          <Hero />
          <ProjectGrid />
        </>} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/upload" element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/project/:projectId" element={<ProjectDescription />} />
        {/* Add a catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
