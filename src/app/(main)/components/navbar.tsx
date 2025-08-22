'use client';

import { useState } from 'react';
import { Menu, X, User, Headphones, Phone, Music, LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
              DJ Kevin Daman
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/#about"
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <User className="h-4 w-4" />
                About
              </Link>
              <Link
                href="/#services"
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Headphones className="h-4 w-4" />
                Services
              </Link>
              <Link
                href="/requests"
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Music className="h-4 w-4" />
                Song Requests
              </Link>
              <Link
                href="/links"
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <LinkIcon className="h-4 w-4" />
                Links
              </Link>
              <Link
                href="/#contact"
                className="bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-600 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-purple-400 focus:outline-none focus:text-purple-400 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/#about"
              onClick={toggleMenu}
              className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              About
            </Link>
            <Link
              href="/#services"
              onClick={toggleMenu}
              className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors flex items-center gap-2"
            >
              <Headphones className="h-4 w-4" />
              Services
            </Link>
            <Link
              href="/requests"
              onClick={toggleMenu}
              className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors flex items-center gap-2"
            >
              <Music className="h-4 w-4" />
              Song Requests
            </Link>
            <Link
              href="/links"
              onClick={toggleMenu}
              className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors flex items-center gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              Links
            </Link>
            <Link
              href="/#contact"
              onClick={toggleMenu}
              className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
