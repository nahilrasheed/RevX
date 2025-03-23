import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement an API call to update the user profile
    // For now, we'll just simulate success
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
        <button
          onClick={() => navigate('/login')}
          className="p-3 bg-white text-black rounded-lg hover:bg-gray-300"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Profile</h1>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg">
              <div className="mb-6">
                <label htmlFor="username" className="block mb-2 text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="fullName" className="block mb-2 text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
                  disabled
                />
                <p className="text-sm text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="bio" className="block mb-2 text-sm font-medium">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none min-h-[100px]"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label htmlFor="profilePic" className="block mb-2 text-sm font-medium">
                  Profile Picture
                </label>
                <input
                  id="profilePic"
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
                  accept="image/*"
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-900 p-8 rounded-lg">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold">{user.full_name}</h2>
                  <p className="text-gray-400 mb-4">@{user.username}</p>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-gray-400">{user.email}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Bio</h3>
                    <p className="text-gray-400">{user.bio || 'No bio provided'}</p>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
            <div className="bg-gray-900 p-8 rounded-lg">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full md:w-auto"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
