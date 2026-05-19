import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            🌾Farmora
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="hover:text-green-200">
                Dashboard
              </Link>
              <Link to="/weather-analysis" className="hover:text-green-200">
                Weather Analysis
              </Link>
              <Link to="/crop-analysis" className="hover:text-green-200">
                Crop Analysis
              </Link>
              <Link to="/market-analysis" className="hover:text-green-200">
                Market Analysis
              </Link>
              <Link to="/my-reports" className="hover:text-green-200">
                My Reports
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-green-200 font-semibold">
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center space-x-3">
                <span className="text-sm">👨‍🌾 {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;