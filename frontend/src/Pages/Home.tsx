// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';
import ProjectGrid from '../Components/ProjectGrid';

const Home = () => {
  const navigate = useNavigate();
  const username = 'Saumya';

  // Sample Project Data
  const projects = [
    {
      id: 1,
      title: 'Sample Project 1',
      description: 'Body text for whatever you’d like to say. Add main takeaways points, quotes, anecdotes, or even a very very short story.',
    },
    {
      id: 2,
      title: 'Sample Project 2',
      description: 'Body text for whatever you’d like to say. Add main takeaways points, quotes, anecdotes, or even a very very short story.',
    },
    {
      id: 3,
      title: 'Sample Project 3',
      description: 'Body text for whatever you’d like to say. Add main takeaways points, quotes, anecdotes, or even a very very short story.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="px-8 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to REV-X, {username}</h1>
        <p className="text-lg mb-8">explore your projects and more</p>

        <div className="space-x-4 mb-12">
          <button onClick={() => navigate('/upload')} className="p-2 bg-white text-black rounded-lg hover:bg-gray-300">
            Upload
          </button>
          <button onClick={() => navigate('/review')} className="p-2 bg-white text-black rounded-lg hover:bg-gray-300">
            Review
          </button>
        </div>

        {/* Placeholder Image Section
        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">📷</div>
          <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">📷</div>
        </div> */}

        {/* My Projects Section */}
        <section className="text-left">
          <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
          {projects.length === 0 ? (
            <p>(NO PROJECTS UPLOADED)</p>
          ) : (
            <div className="space-y-6">
              {projects.map((project) => (
                <ProjectGrid key={project.id} title={project.title} description={project.description} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
