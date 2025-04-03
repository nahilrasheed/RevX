import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      // Call the API with proper error handling
      try {
        const response = await forgotPassword(email);
        setMessage(`Password reset instructions sent to ${email}. Please check your inbox.`);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('No account found with this email address.');
        } else {
          setError('Failed to send password reset email. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Forgot Password??</h1>
      <p className="mb-6 text-gray-400">Not an issue ;)</p>
      
      {message && (
        <div className="bg-green-600 text-white p-4 rounded-lg mb-6 max-w-md">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6 max-w-md">
          {error}
        </div>
      )}
      
      <form
        onSubmit={handleSubmit}
        className="ring-1 ring-gray-600 p-8 rounded-lg shadow-lg w-full max-w-md"
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
            className="w-full p-3 rounded-lg ring-1 bg-black ring-gray-400 text-white"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="p-3 ring-1 ring-gray-500 text-white rounded-lg hover:bg-gray-700"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`p-3 ${
              isLoading ? 'bg-gray-500' : 'bg-white text-black hover:bg-gray-300'
            } rounded-lg flex items-center justify-center min-w-[150px]`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
