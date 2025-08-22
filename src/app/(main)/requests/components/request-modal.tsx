'use client';

import { useState, useEffect } from 'react';
import { searchSpotifyTracks } from '../actions';
import type { SpotifyTrackInput } from '../actions';

interface RequestModalProps {
  onDismiss: (track: SpotifyTrackInput | null) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function RequestModal({ onDismiss, onClose, isSubmitting = false }: RequestModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrackInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      searchTracks(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchTracks = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const results = await searchSpotifyTracks(query, 20);
      setSearchResults(results);

      if (results.length === 0) {
        setError('No songs found. Try a different search term.');
      }
    } catch (error) {
      console.error('Error searching tracks:', error);
      setSearchResults([]);
      setError('Failed to search for songs. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSelect = (track: SpotifyTrackInput) => {
    if (isSubmitting) return;
    onDismiss(track);
  };

  const handleClose = () => {
    onDismiss(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Request a Song</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-700">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              autoFocus
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto max-h-96">
          {error ? (
            <div className="p-8 text-center text-red-400">
              <div className="text-4xl mb-4">⚠️</div>
              <p>{error}</p>
              <button
                onClick={() => searchTracks(searchQuery)}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-4">
              {searchResults.map((track) => (
                <div
                  key={track.spotifyId}
                  onClick={() => handleTrackSelect(track)}
                  className={`flex items-center p-3 hover:bg-gray-800 rounded-lg transition-colors ${
                    isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <div className="w-12 h-12 mr-4 flex-shrink-0">
                    <img
                      src={track.imageUrl || 'https://via.placeholder.com/48x48?text=♪'}
                      alt={track.title}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/48x48?text=♪';
                      }}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-medium truncate">{track.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{track.artists}</p>
                    {track.album && <p className="text-gray-500 text-xs truncate">{track.album}</p>}
                  </div>
                  <div className="text-purple-400 ml-4 flex items-center">{isSubmitting ? '⏳' : '→'}</div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim().length > 2 && !loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-4xl mb-4">🔍</div>
              <p>No songs found for &quot;{searchQuery}&quot;</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          ) : loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-4xl mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              </div>
              <p>Searching Spotify...</p>
              <p className="text-sm mt-2">Finding the perfect songs for you</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <div className="text-4xl mb-4">🎵</div>
              <p>Start typing to search for songs</p>
              <p className="text-sm mt-2">Search by song title or artist name</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
          <div className="text-center text-gray-400 text-sm">
            <p>🎧 Powered by Spotify • Search millions of songs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
