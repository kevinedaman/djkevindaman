'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useActiveEvents } from './hooks/use-events';
import type { ActiveEventInfo } from './actions';

export default function RequestsPage() {
  const { events: activeEvents, isLoading, error } = useActiveEvents();
  const [activeEvent, setActiveEvent] = useState<ActiveEventInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Only process events when loading is complete
    if (isLoading) return;

    if (activeEvents.length === 1) {
      // If there's only one active event, redirect directly to it
      router.push(`/requests/${activeEvents[0].id}`);
      return;
    }

    if (activeEvents.length > 0) {
      // Get the first active event that can accept requests
      const canAcceptRequestsEvent = activeEvents.find((event) => event.canAcceptRequests);
      setActiveEvent(canAcceptRequestsEvent || activeEvents[0]);
    } else {
      setActiveEvent(null);
    }
  }, [activeEvents, router, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Error Loading Events</h1>
          <p className="text-gray-400 mb-4">Unable to load events. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
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
          <h1 className="text-3xl font-bold">Song Requests</h1>
          <p className="text-gray-400 mt-2">Request songs for DJ Kevin Daman&apos;s events</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!isLoading && activeEvent ? (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-green-400">🎵 Live Event</h2>
                <h3 className="text-xl font-semibold mt-2">{activeEvent.name}</h3>
              </div>
              <div className="text-right">
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ACCEPTING REQUESTS
                </div>
              </div>
            </div>

            <div className="text-gray-400 mb-6">
              <p>
                Event Time: {new Date(activeEvent.startDate).toLocaleString()} -{' '}
                {new Date(activeEvent.endDate).toLocaleString()}
              </p>
              <p className="text-sm mt-1">
                {activeEvent.canAcceptRequests
                  ? 'Requests are open now!'
                  : `Requests open at ${new Date(activeEvent.requestsOpenAt).toLocaleTimeString()}`}
              </p>
              {activeEvent.venueName && <p className="text-sm mt-1">📍 {activeEvent.venueName}</p>}
            </div>

            <div className="space-y-4">
              <Link
                href={`/requests/${activeEvent.id}`}
                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                <span className="mr-2">🎤</span>
                Make a Request
              </Link>
              
              {/* Debug: Test realtime by triggering a manual update */}
              <button
                onClick={async () => {
                  console.log('Testing realtime by updating event...');
                  try {
                    const response = await fetch('/api/test-realtime', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ eventId: activeEvent.id })
                    });
                    console.log('Test update response:', await response.json());
                  } catch (error) {
                    console.error('Test update failed:', error);
                  }
                }}
                className="block text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded transition-colors"
              >
                🧪 Test Realtime (Debug)
              </button>
            </div>
          </div>
        ) : !isLoading ? (
          <div className="text-center py-16">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎧</div>
              <h2 className="text-2xl font-bold mb-4">No Active Events</h2>
              <p className="text-gray-400 mb-6">
                There are currently no events accepting song requests. Check back later or follow{' '}
                <a
                  href="https://www.instagram.com/djkevindaman/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 transition-colors underline"
                >
                  DJ Kevin Daman on Instagram
                </a>{' '}
                for event updates!
              </p>
              <div className="mt-4">
                <Link
                  href="/links"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm"
                >
                  View all social links →
                </Link>
              </div>

              {activeEvents.length > 0 && (
                <div className="text-left">
                  <h3 className="text-lg font-semibold mb-3 text-center">Available Events:</h3>
                  <div className="space-y-2">
                    {activeEvents.map((event) => (
                      <div key={event.id} className="bg-gray-800 p-3 rounded border border-gray-700">
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(event.startDate).toLocaleDateString()} at{' '}
                          {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {event.canAcceptRequests ? (
                            <span className="text-green-400">✓ Accepting requests now</span>
                          ) : (
                            `Requests open at ${new Date(event.requestsOpenAt).toLocaleTimeString()}`
                          )}
                        </div>
                        {event.venueName && <div className="text-xs text-gray-500 mt-1">📍 {event.venueName}</div>}
                        <div className="text-xs text-gray-500 mt-1">{event._count.songRequests} requests so far</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
