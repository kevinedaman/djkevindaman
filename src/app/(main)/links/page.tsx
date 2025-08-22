import { ExternalLink, Music, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { BookNow } from '../components/book-now';

export default function LinksPage() {
  const links = [
    {
      title: 'Make a Request',
      description: 'Request songs for events',
      url: '/requests',
      icon: Music,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      isInternal: true,
    },
    {
      title: 'Instagram',
      description: 'Behind the scenes and event highlights',
      url: 'https://www.instagram.com/djkevindaman/',
      icon: ExternalLink,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      isInternal: false,
    },
    {
      title: 'Venmo',
      description: 'Easy payments for events and tips',
      url: 'https://account.venmo.com/u/Kevin-Daman',
      icon: CreditCard,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      isInternal: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Music className="h-16 w-16 text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Connect with
            <br className="md:hidden" />
            <span className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"> DJ Kevin Daman</span>
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
              const linkContent = (
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
              );

              return link.isInternal ? (
                <Link
                  key={index}
                  href={link.url}
                  className={`block p-6 rounded-lg border ${link.bgColor} ${link.borderColor} hover:scale-105 transition-all duration-300 group`}
                >
                  {linkContent}
                </Link>
              ) : (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-6 rounded-lg border ${link.bgColor} ${link.borderColor} hover:scale-105 transition-all duration-300 group`}
                >
                  {linkContent}
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
