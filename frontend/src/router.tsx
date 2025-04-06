import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Email validation function with more detailed messages
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address (e.g., user@example.com)");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  // Password validation - more descriptive for login
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 1) {
      setPasswordError("Please enter your password");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  // Handle focus to password field
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const isValid = validateEmail(email);
      if (isValid && passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }
  };

  // Validate email on blur or when moving to password field
  const handleEmailBlur = () => {
    validateEmail(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      try {
        await login(email, password);
        // Navigation will happen in the login function
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white py-8">
      <h1 className="text-4xl font-bold mb-8">Sign in to REV-X</h1>
      
      {(error || authError) && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6 max-w-md">
          {error || authError}
        </div>
      )}
      
      <form
        onSubmit={handleSubmit}
        className="ring-1 ring-gray-500 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value);
            }}
            onBlur={handleEmailBlur}
            onKeyDown={handleEmailKeyDown}
            placeholder="you@example.com"
            className={`w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none ring-1 ${
              emailError ? "ring-red-500" : "ring-gray-700"
            }`}
            required
          />
          {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
          <p className="mt-1 text-xs text-gray-400">
            Enter the email address you used during registration
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            ref={passwordInputRef}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) validatePassword(e.target.value);
            }}
            onFocus={() => {
              // Validate email again when focusing on password
              validateEmail(email);
            }}
            onBlur={() => validatePassword(password)}
            placeholder="********"
            className={`w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none ring-1 ${
              passwordError ? "ring-red-500" : "ring-gray-700"
            }`}
            required
          />
          {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
          <p className="mt-1 text-xs text-gray-400">
            Enter your password with proper capitalization
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <div className="text-sm">
            <Link to="/forgot-password" className="text-gray-400 hover:underline hover:text-gray-200">
              Forgot your password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !!emailError || !!passwordError}
          className={`w-full p-3 ${
            isLoading || emailError || passwordError ? 'bg-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-300'
          } rounded-lg flex justify-center items-center`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
          ) : (
            'Sign in'
          )}
        </button>
        
        <div className="mt-4 text-sm text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-gray-400 hover:underline hover:text-gray-200">
            Register now
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;