import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MyReviewsList from '../Components/MyReviewsList';
import MyProjectsList from '../Components/MyProjectsList';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'reviews', or 'activity'

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>
        
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'projects' 
                  ? 'ring-1 ring-red-200 text-white' 
                  : 'ring-1 ring-gray-500 text-gray-400 hover:bg-gray-800'
              }`}
            >
              My Projects
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'reviews' 
                  ? 'ring-1 ring-red-200 text-white' 
                  : 'ring-1 ring-gray-500 text-gray-400 hover:bg-gray-800'
              }`}
            >
              My Reviews
            </button>
          </div>
          
          <button 
            onClick={() => navigate('/upload')} 
            className="px-4 py-2 ring-1 ring-red-200 text-white rounded-lg hover:bg-gray-200 hover:text-black"
          >
            Upload Project
          </button>
        </div>
        
        {activeTab === 'reviews' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">My Reviews</h2>
            <MyReviewsList />
          </section>
        )}
        
        {activeTab === 'projects' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">My Projects</h2>
            <MyProjectsList />
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
