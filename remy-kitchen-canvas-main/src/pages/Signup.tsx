import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState(''); // currently unused
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('https://d28c-94-249-51-113.ngrok-free.app/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('kitchance_user', email);
        navigate('/remy-active');
      } else {
        alert(data.message || 'Signup failed. Try again with a different email.');
      }
    } catch (err) {
      alert('Server error during signup. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-kitchance-blue-pale/30 flex items-center justify-center px-4 relative">
      {/* Back button */}
      <Link
        to="/auth"
        className="absolute top-6 left-6 text-kitchance-navy-dark hover:underline text-sm font-medium"
      >
        ← Back
      </Link>

      {/* Signup card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-kitchance-navy-dark mb-4">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-kitchance-navy-dark text-white py-3 rounded-md hover:bg-kitchance-navy-deep transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
