import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminMetrics } from '../../api/admin';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboardMetrics } from '../../api/admin';
import { User, MessageSquareText , ChartBar, ShieldUser  } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect non-admin users
    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchMetrics();
  }, [isAdmin, navigate]);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminMetrics();
      setMetrics(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error loading admin metrics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Admin Dashboard</h1>
        <p className="text-gray-400">{error}</p>
        <button
          onClick={() => fetchMetrics()}
          className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold flex items-center">
            <ShieldUser className="h-8 w-8 mr-2" />Admin Dashboard
            </h1>
        </div>

        {/* Admin Nav */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => navigate('/admin')}
            className="px-4 py-2 rounded-lg ring-1 ring-red-200 text-white"
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 rounded-lg ring-1 ring-gray-500 text-gray-400 hover:bg-gray-800"
          >
            Manage Users
          </button>
          <button 
            onClick={() => navigate('/admin/projects')}
            className="px-4 py-2 rounded-lg ring-1 ring-gray-500 text-gray-400 hover:bg-gray-800"
          >
            Manage Projects
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg ring-1 ring-gray-600">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 mr-2 text-blue-400" />
              <h2 className="text-xl font-semibold">Total Users</h2>
            </div>
            <p className="text-4xl font-bold text-white">{metrics?.total_users || 0}</p>
            <p className="text-gray-400 mt-2">
              <span className="text-green-400">+{metrics?.recent_users || 0}</span> new in last 30 days
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg ring-1 ring-gray-600">
            <div className="flex items-center mb-2">
              <ChartBar className="h-5 w-5 mr-2 text-purple-400" />
              <h2 className="text-xl font-semibold">Total Projects</h2>
            </div>
            <p className="text-4xl font-bold text-white">{metrics?.total_projects || 0}</p>
            <p className="text-gray-400 mt-2">
              <span className="text-green-400">+{metrics?.recent_projects || 0}</span> new in last 30 days
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg ring-1 ring-gray-600">
            <div className="flex items-center mb-2">
              <MessageSquareText className="h-5 w-5 mr-2 text-yellow-400" />
              <h2 className="text-xl font-semibold">Total Reviews</h2>
            </div>
            <p className="text-4xl font-bold text-white">{metrics?.total_reviews || 0}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;