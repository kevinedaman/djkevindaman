'use client';

import { useState } from 'react';
import { Users, Building, Briefcase, Menu, X, Link as LinkIcon, User, Headphones, Phone } from 'lucide-react';
import Link from 'next/link';
import { BookNow } from '../components/book-now';

export default function DJWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gray-900 shadow-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-white">DJ Kevin Daman</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#about"
                  className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  About
                </a>
                <a
                  href="#services"
                  className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <Headphones className="h-4 w-4" />
                  Services
                </a>
                <Link
                  href="/links"
                  className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <LinkIcon className="h-4 w-4" />
                  Links
                </Link>
                <a
                  href="#contact"
                  className="bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-600 transition-colors"
                >
                  Contact
                </a>
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
              <a
                href="#about"
                onClick={toggleMenu}
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                About
              </a>
              <a
                href="#services"
                onClick={toggleMenu}
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors flex items-center gap-2"
              >
                <Headphones className="h-4 w-4" />
                Services
              </a>
              <Link
                href="/links"
                onClick={toggleMenu}
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Links
              </Link>
              <a
                href="#contact"
                onClick={toggleMenu}
                className="text-gray-300 hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 md:py-28">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Just here for the
                <span className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"> music</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Twin Cities DJ • Weddings • Nightclubs • Private Events
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="bg-purple-500 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">About</h2>
          </div>
          <div className="prose prose-lg mx-auto text-gray-300 leading-relaxed">
            <p className="text-xl mb-6">
              I&apos;ve been DJing for over 15 years, starting in 2010 when I realized the bar business paid better than
              finishing my masters in music. That career pivot helped me realize I could live without playing trumpet,
              but I couldn&apos;t live without music.
            </p>
            <p className="text-xl mb-6">
              I built my foundation DJing at bars and nightclubs 4-5 nights per week. I expanded into weddings in 2012,
              and currently DJ at various Twin Cities venues while doing the occasional wedding.
            </p>
            <p className="text-xl">
              My musical training, technical proficiency, and thousands of hours behind the decks means I can read any
              room and solve any problem that comes up. At the end of the day, though, I&apos;m just here for the music.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Services</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Wedding Section - Featured */}
            <div className="md:col-span-2 bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700">
              <div className="flex items-center mb-6">
                <Users className="h-8 w-8 text-purple-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Weddings</h3>
              </div>
              <div className="prose prose-lg text-gray-300 leading-relaxed">
                <p className="text-lg mb-4">
                  Your wedding day deserves a DJ who understands that it&apos;s about you, not them. No cheesy games, no
                  over-the-top announcements, no making myself the center of attention. Just seamless music that keeps
                  your celebration flowing exactly how you envisioned it.
                </p>
                <p className="text-lg mb-4">
                  With over a decade of wedding experience, I focus on reading the room, flawless transitions, and
                  creating the perfect soundtrack for each moment of your day. From ceremony to last dance, I let the
                  music do the talking.
                </p>
                <p className="text-lg font-medium text-purple-400">
                  Every wedding is different. Your music should be too.
                </p>
              </div>
            </div>

            {/* Other Services */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <Building className="h-6 w-6 text-cyan-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Bars & Nightclubs</h3>
              </div>
              <p className="text-gray-300">
                Top 40 with an electronic twist. I play exactly what your venue needs to keep the dance floor packed.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <Briefcase className="h-6 w-6 text-pink-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Corporate & Private Events</h3>
              </div>
              <p className="text-gray-300">
                Professional atmosphere with the right soundtrack for networking events, parties, and celebrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="pb-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookNow />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">DJ Kevin Daman</p>
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
