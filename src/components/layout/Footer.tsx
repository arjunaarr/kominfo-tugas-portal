
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Kominfo Intern Portal</h3>
            <p className="text-gray-300">
              A task management system for Kominfo interns. Upload, track, and manage assignments with ease.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/login" className="text-gray-300 hover:text-white transition-colors">Login</a></li>
              <li><a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <address className="text-gray-300 not-italic">
              <p>Kementerian Komunikasi dan Informatika</p>
              <p>Jl. Medan Merdeka Barat No. 9</p>
              <p>Jakarta 10110 Indonesia</p>
              <p className="mt-2">Email: contact@kominfo-intern.com</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; {currentYear} Kominfo Intern Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
