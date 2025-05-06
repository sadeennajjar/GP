import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(' https://35b9-86-108-13-69.ngrok-free.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('kitchance_user', email);
        navigate('/remy-active');
      } else {
        if (data.message?.toLowerCase().includes('invalid')) {
          const goToSignup = window.confirm("Account not found. Would you like to sign up?");
          if (goToSignup) navigate('/signup');
        } else {
          alert(data.message || 'Login failed.');
        }
      }
    } catch (error) {
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-kitchance-blue-pale/30 flex items-center justify-center px-4 relative">
      {/* 🔙 Back button */}
      <Link
        to="/auth"
        className="absolute top-6 left-6 text-kitchance-navy-dark hover:underline text-sm font-medium"
      >
        ← Back
      </Link>

      {/* 🔐 Login card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-kitchance-navy-dark mb-4">Log In</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
