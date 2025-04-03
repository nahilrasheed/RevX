import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(email, password);
      // Navigation happens in the login function
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">Sign In to REV-X</h1>
      
      {(error || authError) && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6 max-w-md">
          {error || authError}
        </div>
      )}
      
      <form
        onSubmit={handleSubmit}
        className=" p-8 rounded-lg shadow-lg w-full max-w-md ring-1 ring-gray-600 text-white "
      >
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
            className="w-full p-3 rounded-lg ring-1 ring-gray-600 bg-black text-white hover:ring-1 hover:ring-red-200"
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
            className="w-full p-3 rounded-lg bg-black ring-1 ring-gray-600 text-white"
            required
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
            'Sign In'
          )}
        </button>
        
        <div className="mt-4 text-sm flex justify-between">
          <Link to="/forgetpassword" className="text-red-200 hover:underline hover:text-gray-400">
            Forgot password?
          </Link>
          <Link to="/register" className="text-red-200 hover:underline hover:text-gray-400">
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
