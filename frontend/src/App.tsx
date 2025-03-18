import React, { useState } from 'react';
import { Code2, Search, Menu, X } from 'lucide-react';
import NavBar from './Components/NavBar';
import Hero from './Components/Hero';
import Footer from './Components/Footer';
import ProjectGrid from './Components/ProjectGrid';


function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar/>
      <Hero/>
      <ProjectGrid/>
      <Footer/>
    </div>
  );
}

export default App;