import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers, toggleUserAdminStatus, deleteUser } from '../../api/admin';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  created_at: string;
  is_admin: boolean;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const { isAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    // Redirect non-admin users
    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error loading users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      setActionInProgress(userId);
      await toggleUserAdminStatus(userId, isAdmin);
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_admin: isAdmin } 
          : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error updating user');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setActionInProgress(userId);
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setConfirmDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error deleting user');
    } finally {
      setActionInProgress(null);
    }
  };

  // Format date to standard format
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Users</h1>
        </div>

        {/* Admin Nav */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => navigate('/admin')}
            className="px-4 py-2 rounded-lg ring-1 ring-gray-500 text-gray-400 hover:bg-gray-800"
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 rounded-lg ring-1 ring-red-200 text-white"
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

        {error && (
          <div className="bg-red-900/50 text-white p-4 rounded-lg mb-6">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* User List */}
        <div className="bg-gray-900 rounded-lg ring-1 ring-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Joined</th>
                  <th className="py-3 px-4 text-left">Admin</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-800/50">
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.full_name}</td>
                    <td className="py-3 px-4">{formatDate(user.created_at)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.is_admin ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                        {user.is_admin ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {/* Don't allow toggling admin status for the current user */}
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleToggleAdmin(user.id, !user.is_admin)}
                            disabled={actionInProgress === user.id}
                            className={`px-3 py-1 text-sm rounded ${actionInProgress === user.id ? 'bg-gray-700' : user.is_admin ? 'bg-red-700 hover:bg-red-600' : 'bg-green-700 hover:bg-green-600'}`}
                          >
                            {actionInProgress === user.id ? (
                              <span className="flex items-center">
                                <span className="animate-spin h-3 w-3 mr-1 border-t-2 border-white rounded-full"></span>
                                Processing...
                              </span>
                            ) : (
                              user.is_admin ? 'Remove Admin' : 'Make Admin'
                            )}
                          </button>
                        )}
                        
                        {/* Don't allow deleting the current user */}
                        {user.id !== currentUser?.id && (
                          <>
                            {confirmDelete === user.id ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={actionInProgress === user.id}
                                  className="px-3 py-1 text-sm rounded bg-red-700 hover:bg-red-600"
                                >
                                  {actionInProgress === user.id ? 'Deleting...' : 'Confirm'}
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(user.id)}
                                className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600"
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;