import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add registration logic here
    console.log('Name:', name, 'Surname:', surname, 'Email:', email, 'Password:', password, 'Profile Pic:', profilePic);
    navigate('/dashboard'); // Navigate to dashboard after registration
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">Register for REV-X</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Name
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
            Surname
          </label>
          <input
            id="surname"
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Your Surname"
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
          />
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
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 mt-4 bg-white text-black rounded-lg hover:bg-gray-300"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
