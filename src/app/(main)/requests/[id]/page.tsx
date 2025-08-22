'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Instagram, CreditCard } from 'lucide-react';

import { format } from 'date-fns';
import RequestModal from '../components/request-modal';
import SongRequestListItem from '../components/song-request-listItem';
import { useEvent, useActiveEvents } from '../hooks/use-events';
import { useActiveSongRequests, usePlayedSongRequests } from '../hooks/use-song-requests';
import { createSongRequest } from '../actions';
import type { SpotifyTrackInput } from '../actions';

export default function EventRequestsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data using SWR hooks
  const { event, isLoading: eventLoading, error: eventError } = useEvent(eventId ? parseInt(eventId) : null);
  const { events: activeEvents } = useActiveEvents();
  const {
    activeRequests,
    isLoading: activeLoading,
    refresh: refreshActive,
  } = useActiveSongRequests(eventId ? parseInt(eventId) : null);
  const {
    playedRequests,
    isLoading: playedLoading,
    refresh: refreshPlayed,
  } = usePlayedSongRequests(eventId ? parseInt(eventId) : null);

  const isLoading = eventLoading || activeLoading || playedLoading;

  const canRequest = (): boolean => {
    return event?.canAcceptRequests || false;
  };

  const getBackNavigation = () => {
    // If there's only one active event, go back to links page
    if (activeEvents.length === 1) {
      return {
        url: '/links',
        text: 'Back to Links',
      };
    }
    // Otherwise go back to events list
    return {
      url: '/requests',
      text: 'Back to Events',
    };
  };

  const handleRequestSubmit = async (track: SpotifyTrackInput | null) => {
    if (!track || !event) {
      setShowRequestModal(false);
      return;
    }

    if (!canRequest()) {
      showError(
        'Unable to make requests yet',
        event ? `You can start making requests at ${format(new Date(event.requestsOpenAt), 'p')}.` : '',
      );
      setShowRequestModal(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await createSongRequest({
        djEventId: event.id,
        spotifyTrack: track,
        requestedBy: 'Anonymous User', // Replace with actual user identification
        notes: undefined,
      });

      // Refresh the requests data
      await Promise.all([refreshActive(), refreshPlayed()]);

      setShowRequestModal(false);
      setError(null);
    } catch (err) {
      console.error('Error creating song request:', err);
      setError(err instanceof Error ? err.message : 'Failed to create request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showError = (title: string, message?: string) => {
    setError(message || title);
    setTimeout(() => setError(null), 5000);
  };

  const handlePresentRequest = () => {
    if (canRequest()) {
      setShowRequestModal(true);
    } else {
      showError(
        'Unable to make requests yet',
        event ? `You can start making requests at ${format(new Date(event.requestsOpenAt), 'p')}.` : '',
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading event...</p>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-gray-400 mb-4">The requested event could not be found.</p>
          <button
            onClick={() => router.push(getBackNavigation().url)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            {getBackNavigation().text}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push(getBackNavigation().url)}
            className="text-purple-400 hover:text-purple-300 mb-4 flex items-center"
          >
            ← {getBackNavigation().text}
          </button>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-gray-400 mt-2">
            {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}
          </p>
          {event.venueName && <p className="text-gray-400 text-sm mt-1">📍 {event.venueName}</p>}
          {event.description && <p className="text-gray-300 text-sm mt-2">{event.description}</p>}

          {/* Social Media Links */}
          <div className="flex items-center space-x-4 mt-3">
            <a
              href="https://www.instagram.com/djkevindaman/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors text-sm"
            >
              <Instagram className="h-4 w-4" />
              <span>@djkevindaman</span>
            </a>
            <a
              href="https://account.venmo.com/u/Kevin-Daman"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <CreditCard className="h-4 w-4" />
              <span>@Kevin-Daman</span>
            </a>
          </div>

          <div className="mt-4">
            {canRequest() ? (
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                🎵 ACCEPTING REQUESTS
              </span>
            ) : (
              <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ⏰ REQUESTS CLOSED
              </span>
            )}
            <span className="ml-4 text-gray-400 text-sm">
              {activeRequests.length} active • {playedRequests.length} played
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-600 text-white p-4 text-center">{error}</div>}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Request Input */}
        <div className="mb-8">
          <div
            className="bg-gray-800 border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors flex items-center"
            onClick={handlePresentRequest}
          >
            <span className="text-gray-400 mr-3">🔍</span>
            <span className="text-gray-400">Make a request...</span>
          </div>
        </div>

        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Requested Songs</h2>
            <div className="space-y-2">
              {activeRequests.map((request) => (
                <SongRequestListItem
                  key={request.id}
                  request={{
                    id: request.id,
                    track: {
                      id: request.track.id,
                      spotifyId: request.track.spotifyId,
                      title: request.track.title,
                      artists: request.track.artists,
                      album: request.track.album || '',
                      image: request.track.imageUrl ?? '',
                    },
                    trackId: request.trackId,
                    requestedById: request.requestedBy || undefined,
                    djEventId: request.djEventId,
                    createdDate: request.requestedAt.toISOString(),
                    played: request.isPlayed,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Played Songs */}
        {playedRequests.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Played Songs</h2>
            <div className="space-y-2">
              {playedRequests.map((request) => (
                <SongRequestListItem
                  key={request.id}
                  request={{
                    id: request.id,
                    track: {
                      id: request.track.id,
                      spotifyId: request.track.spotifyId,
                      title: request.track.title,
                      artists: request.track.artists,
                      album: request.track.album || '',
                      image: request.track.imageUrl ?? '',
                    },
                    trackId: request.trackId,
                    requestedById: request.requestedBy || undefined,
                    djEventId: request.djEventId,
                    createdDate: request.requestedAt.toISOString(),
                    played: request.isPlayed,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeRequests.length === 0 && playedRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold mb-4">No Requests Yet</h2>
            <p className="text-gray-400 mb-6">Be the first to request a song for this event!</p>
            {canRequest() && (
              <button
                onClick={handlePresentRequest}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Make the First Request
              </button>
            )}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal
          onDismiss={handleRequestSubmit}
          onClose={() => setShowRequestModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
