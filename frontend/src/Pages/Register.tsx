import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register: registerUser, isLoading, error: authError } = useAuth();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Create full name from name and surname
    const fullName = `${name} ${surname}`.trim();
    
    try {
      const formData = {
        email,
        username,
        password,
        full_name: fullName,
        bio: '',
        avatar: ''
      };
      
      await registerUser(formData);
      // Navigation happens in the register function
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white py-8">
      <h1 className="text-4xl font-bold mb-8">Register for REV-X</h1>
      
      {(error || authError) && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6 max-w-md">
          {error || authError}
        </div>
      )}
      
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            First Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your First Name"
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="surname" className="block mb-2 text-sm font-medium">
            Last Name
          </label>
          <input
            id="surname"
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Your Last Name"
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
            required
            minLength={8}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="profilePic" className="block mb-2 text-sm font-medium">
            Profile Picture (optional)
          </label>
          <input
            id="profilePic"
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 mt-4 ${
            isLoading ? 'bg-gray-500' : 'bg-white text-black hover:bg-gray-300'
          } rounded-lg flex justify-center items-center`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
          ) : (
            'Register'
          )}
        </button>
        
        <div className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
