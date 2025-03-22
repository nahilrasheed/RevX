import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          <Route path="/Home" element={<Home/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/Upload" element={<Upload/> }/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/project/:projectId" element={<ProjectDescription />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
