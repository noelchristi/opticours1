import React from 'react';

/**
 * Footer component for OptiCours application
 */
const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} OptiCours. Tous droits réservés.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-600">
              Une plateforme d'optimisation pédagogique par intelligence artificielle
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;