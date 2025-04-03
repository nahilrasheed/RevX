
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, changePassword } from '../api/user';

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Password change fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };
  const handleDelete = () => {
    setProfilePic(null); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      // Convert profilePic to base64 if it exists
      let avatarBase64 = undefined;
      if (profilePic) {
        const reader = new FileReader();
        avatarBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(profilePic);
        });
        // Remove the data:image prefix
        avatarBase64 = avatarBase64.split(',')[1];
      }
      
      const userData = {
        username: username !== user?.username ? username : undefined,
        full_name: fullName !== user?.full_name ? fullName : undefined,
        bio: bio !== user?.bio ? bio : undefined,
        avatar: avatarBase64
      };
      
      // Only make API call if there are changes
      if (Object.values(userData).some(val => val !== undefined)) {
        const response = await updateUserProfile(userData);
        
        if (response.status === 'success') {
          // Update local storage with updated user data
          const updatedUser = {
            ...user,
            ...userData
          };
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
          setSuccess('Profile updated successfully!');
          
          // Update UI with new data
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        setSuccess('No changes to save');
      }
      
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error updating profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await changePassword(currentPassword, newPassword);
      
      if (response.status === 'success') {
        setSuccess('Password changed successfully!');
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Close the password change form after a delay
        setTimeout(() => {
          setIsChangingPassword(false);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
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
          
          {success && (
            <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
              {success}
            </div>
          )}
          
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="ring-1 ring-gray-600 p-8 rounded-lg mb-8">
              <div className="mb-6">
                <label htmlFor="username" className="block mb-2 text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-lg ring-1 ring-gray-600 text-white bg-black focus:outline-blue-100"
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
                  className="w-full p-3 rounded-lg ring-1 ring-gray-600 text-white bg-black focus:outline-blue-100"
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
                  className="w-full p-3 rounded-lg ring-1 ring-gray-600 text-white bg-black focus:outline-blue-100"
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
                  className="w-full p-3 rounded-lg bring-1 ring-1 ring-gray-600 text-white bg-black focus:outline-blue-100 min-h-[100px]"
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
                  className="w-full p-3 rounded-lg ring-1 ring-gray-600 text-white bg-black focus:outline-blue-100 hidden"
                  accept="image/*"
                />
                <button
                    type="button"
                    onClick={() => document.getElementById('profilePic')?.click()}
                    className="w-200 p-3 rounded-lg ring-1 ring-gray-500 text-white font-medium hover:bg-slate-800"
                  >
                    Upload Profile Picture
                    </button>
                    {profilePic && (
                      <div className="mt-2 text-sm text-gray-300">
                        <p className="truncate">{profilePic.name}</p>

                        <button 
                          type="button"
                          onClick={handleDelete}
                          className='ring-1 ring-red-600 hover:bg-red-700 rounded-lg w-10'>
                            Delete
                        </button>
                      </div>
                    )}
                    
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg ring-1 ring-gray-600 text-white bg-black hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 ${
                    isSubmitting ? 'bg-gray-500' : 'bg-white text-black hover:bg-gray-300'
                  } rounded-lg flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          ) : isChangingPassword ? (
            <form onSubmit={handlePasswordChange} className="ring-1 ring-gray-300 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
              
              <div className="mb-6">
                <label htmlFor="currentPassword" className="block mb-2 text-sm font-medium">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="newPassword" className="block mb-2 text-sm font-medium">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none"
                  required
                  minLength={8}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 ${
                    isSubmitting ? 'bg-gray-500' : 'ring-1 ring-red-200 hover:underline'
                  } rounded-lg text-white flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className=" ring-1 ring-gray-600 p-8 rounded-lg mb-8">
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
                      className="px-4 py-2 ring-1 ring-gray-100 text-white rounded-lg hover:bg-gray-100 hover:text-black"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="ring-1 ring-gray-600 p-8 rounded-lg">
                <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 ring-1 ring-red-600 text-white rounded-lg hover:bg-red-600 w-full md:w-auto"
                >
                  Change Password
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
