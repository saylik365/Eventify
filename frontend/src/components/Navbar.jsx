import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dashboard route by role
  const dashboardRoute =
    role === 'admin' ? '/dashboard/admin'
    : role === 'owner' ? '/dashboard/owner'
    : role === 'cohost' ? '/dashboard/cohost'
    : role === 'guest' ? '/dashboard/guest'
    : '/dashboard/user';

  // Show My Events for user, owner, cohost
  const showMyEvents = ['user', 'owner', 'cohost'].includes(role);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition">
          Eventify
        </Link>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Public nav */}
          {!isAuthenticated && (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition font-medium">About</Link>
              <Link to="/features" className="text-gray-700 hover:text-blue-600 transition font-medium">Features</Link>
              <Link to="/events" className="text-gray-700 hover:text-blue-600 transition font-medium">Events</Link>
              <Link to="/users" className="text-gray-700 hover:text-blue-600 transition font-medium">User Directory</Link>
              <Link to="/login" className="ml-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition font-medium">Sign In</Link>
              <Link to="/register" className="ml-2 bg-gray-200 text-blue-700 px-4 py-1 rounded hover:bg-blue-100 transition font-medium">Register</Link>
            </>
          )}
          {/* Private nav */}
          {isAuthenticated && (
            <>
              <Link to="/events" className="text-gray-700 hover:text-blue-600 transition font-medium">Events</Link>
              <Link to="/users" className="text-gray-700 hover:text-blue-600 transition font-medium">User Directory</Link>
              <Link to={dashboardRoute} className="text-gray-700 hover:text-blue-600 transition font-medium">Dashboard</Link>
              {showMyEvents && <Link to="/my-events" className="text-gray-700 hover:text-blue-600 transition font-medium">My Events</Link>}
              <div className="relative">
                <button onClick={() => setDropdown(!dropdown)} className="flex items-center gap-2 text-blue-700 font-semibold focus:outline-none">
                  <FaUserCircle className="text-2xl" />
                  {user?.name || 'Profile'}
                </button>
                {dropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-blue-50">Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-red-600">Logout</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl text-blue-700" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          {/* Public nav */}
          {!isAuthenticated && (
            <>
              <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link to="/about" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">About</Link>
              <Link to="/features" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Features</Link>
              <Link to="/events" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Events</Link>
              <Link to="/users" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">User Directory</Link>
              <Link to="/login" className="block py-2 bg-blue-500 text-white rounded my-2 text-center">Sign In</Link>
              <Link to="/register" className="block py-2 bg-gray-200 text-blue-700 rounded text-center">Register</Link>
            </>
          )}
          {/* Private nav */}
          {isAuthenticated && (
            <>
              <Link to="/events" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Events</Link>
              <Link to="/users" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">User Directory</Link>
              <Link to={dashboardRoute} className="block py-2 text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
              {showMyEvents && <Link to="/my-events" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">My Events</Link>}
              <Link to="/profile" className="block py-2 text-blue-700 font-semibold">Profile</Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
