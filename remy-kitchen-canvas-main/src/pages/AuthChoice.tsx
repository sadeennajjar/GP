import { Link } from 'react-router-dom';

const AuthChoice = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-kitchance-blue-pale/30 flex items-center justify-center px-4 relative">

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-kitchance-navy-dark hover:underline text-sm font-medium"
      >
        ← Back to Home
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center border border-kitchance-blue-light">
        <h1 className="text-4xl font-bold text-kitchance-navy-dark font-cursive mb-4">
          Welcome to KitChance
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Your dream kitchen starts here. Let&apos;s begin!
        </p>

        <div className="flex flex-col space-y-4">
          <Link to="/login">
            <button className="w-full bg-kitchance-navy-dark text-white py-3 rounded-full text-lg hover:bg-kitchance-blue-deep transition">
              Log In
            </button>
          </Link>
          <Link to="/signup">
            <button className="w-full border border-kitchance-navy-dark text-kitchance-navy-dark py-3 rounded-full text-lg hover:bg-kitchance-blue-pale transition">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Optional: Remy floating */}
        <div className="mt-10">
          <img
            src="/images/remy-with-spoon.png"
            alt="Remy"
            className="w-28 mx-auto animate-float"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
