import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateUsername, validateFileSize, validateFileType } from '../utils/formValidation';

const Register = () => {
  const { register: registerUser, isLoading, error: authError } = useAuth();
  const [fullname, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [profilePicError, setProfilePicError] = useState("");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const handleDelete = ()=>{
    setProfilePic(null);
  }

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  // Password validation function
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setPasswordError("Password must contain at least one special character");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  // Fullname validation
  const validateName = (name: string) => {
    if (!name) {
      setNameError("Full name is required");
      return false;
    } else if (name.length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

  // Username validation
  const validateUsernameField = (username: string) => {
    const result = validateUsername(username);
    setUsernameError(result.error);
    return result.isValid;
  };

  // Profile pic validation
  const validateProfilePic = (file: File | null) => {
    if (!file) return true; // Optional field
    
    const sizeValidation = validateFileSize(file, 5); // 5MB max
    if (!sizeValidation.isValid) {
      setProfilePicError(sizeValidation.error);
      return false;
    }
    
    const typeValidation = validateFileType(file, ['jpeg', 'jpg', 'png', 'gif']);
    if (!typeValidation.isValid) {
      setProfilePicError(typeValidation.error);
      return false;
    }
    
    setProfilePicError("");
    return true;
  };

  // First name validation
  const validateFirstName = (name: string) => {
    if (!name) {
      setFirstNameError("First name is required");
      return false;
    } else if (name.length < 2) {
      setFirstNameError("First name must be at least 2 characters");
      return false;
    } else {
      setFirstNameError("");
      return true;
    }
  };

  // Last name validation
  const validateLastName = (name: string) => {
    if (!name) {
      setLastNameError("Last name is required");
      return false;
    } else if (name.length < 2) {
      setLastNameError("Last name must be at least 2 characters");
      return false;
    } else {
      setLastNameError("");
      return true;
    }
  };

  // Combined name validation for API submission
  const validateCombinedName = () => {
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    
    if (isFirstNameValid && isLastNameValid) {
      // Set the fullname for API submission
      setName(`${firstName} ${lastName}`);
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate and combine first and last name
    const isNameValid = validateCombinedName();
    const isUsernameValid = validateUsernameField(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isProfilePicValid = validateProfilePic(profilePic);
    
    if (isNameValid && isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isProfilePicValid) {
      try {
        const formData = {
          email,
          username,
          password,
          full_name: `${firstName} ${lastName}`,
          bio: '',
          avatar: ''
        };
        
        await registerUser(formData);
        // Navigation happens in the register function
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfilePic(file);
      validateProfilePic(file);
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
        className="ring-1 ring-gray-500 p-8 rounded-lg shadow-lg w-full max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (firstNameError) validateFirstName(e.target.value);
                  }}
                  onBlur={() => validateFirstName(firstName)}
                  placeholder="John"
                  className={`w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none ring-1 ${
                    firstNameError ? "ring-red-500" : "ring-gray-700"
                  }`}
                  required
                />
                {firstNameError && <p className="mt-1 text-sm text-red-500">{firstNameError}</p>}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (lastNameError) validateLastName(e.target.value);
                  }}
                  onBlur={() => validateLastName(lastName)}
                  placeholder="Doe"
                  className={`w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none ring-1 ${
                    lastNameError ? "ring-red-500" : "ring-gray-700"
                  }`}
                  required
                />
                {lastNameError && <p className="mt-1 text-sm text-red-500">{lastNameError}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="username" className="block mb-2 text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (usernameError) validateUsernameField(e.target.value);
                }}
                onBlur={() => validateUsernameField(username)}
                placeholder="johndoe123"
                className={`w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none ring-1 ${
                  usernameError ? "ring-red-500" : "ring-gray-700"
                }`}
                required
              />
              {usernameError && <p className="mt-1 text-sm text-red-500">{usernameError}</p>}
              <p className="mt-1 text-xs text-gray-400">
                This will be your public username visible to other users
              </p>
            </div>

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
                onBlur={() => validateEmail(email)}
                placeholder="you@example.com"
                className={`w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none ring-1 ${
                  emailError ? "ring-red-500" : "ring-gray-700"
                }`}
                required
              />
              {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
              <p className="mt-1 text-xs text-gray-400">
                We'll never share your email with anyone else
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="profilePic" className="block mb-2 text-sm font-medium">
                Profile Picture (optional)
              </label>
              <input
                id="profilePic"
                type="file"
                onChange={handleFileChange}
                className="w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => document.getElementById('profilePic')?.click()}
                className={`w-full p-3 rounded-lg ring-1 ${
                  profilePicError ? "ring-red-500" : "ring-gray-400"
                } bg-gray-800 text-white font-medium hover:bg-black focus:outline-none flex items-center justify-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                Upload Profile Picture
              </button>
              {profilePic && (
                <div className='mt-2 text-sm text-gray-300 flex justify-between items-center'>
                  <p className='truncate'>{profilePic.name}</p>
                  <button 
                    type="button"
                    onClick={handleDelete}
                    className='ring-1 ring-red-600 hover:bg-red-700 rounded-lg px-3 py-1 text-xs transition-colors duration-200'>
                    Remove
                  </button>
                </div>
              )}
              {profilePicError && <p className="mt-1 text-sm text-red-500">{profilePicError}</p>}
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Security</h2>
            
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                  if (confirmPassword) validateConfirmPassword(confirmPassword);
                }}
                onBlur={() => validatePassword(password)}
                placeholder="********"
                className={`w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none ring-1 ${
                  passwordError ? "ring-red-500" : "ring-gray-700"
                }`}
                required
                minLength={8}
              />
              {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
              {!passwordError && password && (
                <p className="mt-1 text-sm text-green-500">Password meets requirements</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Password must be at least 8 characters long and include uppercase, lowercase, 
                number, and special character.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) validateConfirmPassword(e.target.value);
                }}
                onBlur={() => validateConfirmPassword(confirmPassword)}
                placeholder="********"
                className={`w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none ring-1 ${
                  confirmPasswordError ? "ring-red-500" : "ring-gray-700"
                }`}
                required
              />
              {confirmPasswordError && (
                <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p>
              )}
            </div>
            
            <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <h3 className="text-md font-medium mb-2">By registering, you agree to:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Our Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Code of Conduct</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col items-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full md:w-2/3 p-3 ${
              isLoading ? 'bg-gray-500' : 'bg-white text-black hover:bg-gray-300'
            } rounded-lg flex justify-center items-center transition-colors duration-200`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
            ) : (
              'Create Account'
            )}
          </button>
          
          <div className="mt-4 text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
