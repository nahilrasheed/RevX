import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Hero from './Components/Hero';
import Footer from './Components/Footer';
import ProjectGrid from './Components/ProjectGrid';
// import HomePage from './Components/HomePage';
import ForgetPassword from './Components/ForgetPassword';
import LoginPage from './Components/LoginPage';

function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <Routes>
          <Route path="/" element={<>
            <Hero />
            <ProjectGrid />
          </>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
