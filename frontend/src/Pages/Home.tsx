import Hero from '../Components/Hero';
import ProjectGrid from '../Components/ProjectGrid';

const HomePage = () => {
  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
        <ProjectGrid />
      </div>
    </>
  );
};

export default HomePage;