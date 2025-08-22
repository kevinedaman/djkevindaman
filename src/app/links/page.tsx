'use client';

import { useState } from 'react';
import { ExternalLink, Music, CreditCard, Menu, X, Home, User, Headphones } from 'lucide-react';
import Link from 'next/link';
import BookNow from '../../components/book-now';

export default function LinksPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const links = [
    {
      title: 'Instagram',
      description: 'Behind the scenes and event highlights',
      url: 'https://www.instagram.com/djkevindaman/',
      icon: ExternalLink,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
    },
    {
      title: 'Venmo',
      description: 'Easy payments for events and tips',
      url: 'https://account.venmo.com/u/Kevin-Daman',
      icon: CreditCard,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gray-900 shadow-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
                Your DJ Name
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
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
                href="/"
                onClick={toggleMenu}
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
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
                href="/#contact"
                onClick={toggleMenu}
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Music className="h-16 w-16 text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Connect with
            <span className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"> DJ Kevin</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Find me across the web - from playlists and mixes to event updates and behind-the-scenes content
          </p>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {links.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-6 rounded-lg border ${link.bgColor} ${link.borderColor} hover:scale-105 transition-all duration-300 group`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 ${link.color}`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">{link.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Contact CTA */}
          <BookNow />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Your DJ Name</p>
            <p className="text-gray-400">Just here for the music</p>
            <div className="mt-6 flex justify-center space-x-6">
              <a href="tel:+19528560353" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                (952) 856-0353
              </a>
              <a href="mailto:djkevindaman@gmail.com" className="text-pink-400 hover:text-pink-300 transition-colors">
                djkevindaman@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
