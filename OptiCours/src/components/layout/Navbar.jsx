import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar component for OptiCours application
 * Provides navigation links and authentication status
 */
const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">OptiCours</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/upload" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Importer un cours
                </Link>
                <div className="ml-4 flex items-center">
                  <span className="mr-4 text-sm">
                    {currentUser.name || currentUser.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-600"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-600"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;