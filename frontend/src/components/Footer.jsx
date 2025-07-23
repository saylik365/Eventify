import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">Eventify</span>
          <span className="text-gray-400 text-sm">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-4 text-gray-600 text-sm">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/features" className="hover:text-blue-600">Features</Link>
          <Link to="/events" className="hover:text-blue-600">Events</Link>
        </div>
      </div>
    </footer>
  );
} 