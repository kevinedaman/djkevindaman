'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';
import { getAllPublicEvents } from '../../(main)/requests/actions/dj-events';
import { markSongAsPlayed } from '../../(main)/requests/actions/song-requests';
import { useSongRequests } from '../../(main)/requests/hooks/use-song-requests';
import { Calendar, LogOut, Plus, Music, CheckCircle, Clock, Copy, Settings, Edit, ExternalLink } from 'lucide-react';
import type { DjEventWithStats } from '../../(main)/requests/actions/dj-events';
import AddEventModal from './add-event-modal';
import EditEventModal from './edit-event-modal';

export default function AdminDashboard() {
  const [events, setEvents] = useState<DjEventWithStats[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DjEventWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  // Use the realtime hook for song requests
  const {
    requests: songRequests,
    isLoading: requestsLoading,
    refresh: refreshRequests,
  } = useSongRequests(selectedEvent?.id || null);

  // Debug: Log the selected event to verify realtime setup
  useEffect(() => {
    if (selectedEvent) {
      console.log(`Admin dashboard selected event changed to: ${selectedEvent.id} - ${selectedEvent.name}`);
    }
  }, [selectedEvent]);

  const loadEvents = useCallback(async () => {
    try {
      const eventsData = await getAllPublicEvents();
      setEvents(eventsData);
      if (eventsData.length > 0 && !selectedEvent) {
        setSelectedEvent(eventsData[0]);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedEvent]);

  useEffect(() => {
    loadEvents();
  }, [refreshKey, loadEvents]);

  const handleMarkAsPlayed = async (requestId: number) => {
    try {
      await markSongAsPlayed(requestId);
      // The realtime hook will automatically update the data
      refreshRequests();
    } catch (error) {
      console.error('Error marking song as played:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeRequests = songRequests.filter((request) => !request.isPlayed);
  const playedRequests = songRequests.filter((request) => request.isPlayed);

  if (loading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-purple-400 mr-3" />
              <h1 className="text-xl font-bold">DJ Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddEventModal(true)}
                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Events Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  Events
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full p-4 text-left hover:bg-gray-800 border-b border-gray-700 last:border-b-0 transition-colors ${
                      selectedEvent?.id === event.id ? 'bg-gray-800' : ''
                    }`}
                  >
                    <div className="font-medium text-white truncate">{event.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{formatDate(event.startDate)}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Music className="h-3 w-3" />
                        {event._count.songRequests}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          event.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {event.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </button>
                ))}
                {events.length === 0 && <div className="p-4 text-center text-gray-400">No events found</div>}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedEvent ? (
              <div className="space-y-6">
                {/* Event Header */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.name}</h2>
                      {selectedEvent.description && <p className="text-gray-300 mb-4">{selectedEvent.description}</p>}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Start:</span>
                          <span className="text-white ml-2">{formatDate(selectedEvent.startDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">End:</span>
                          <span className="text-white ml-2">{formatDate(selectedEvent.endDate)}</span>
                        </div>
                        {selectedEvent.venueName && (
                          <div className="md:col-span-2">
                            <span className="text-gray-400">Venue:</span>
                            <span className="text-white ml-2">{selectedEvent.venueName}</span>
                            {selectedEvent.venueAddress && (
                              <span className="text-gray-300 ml-1">• {selectedEvent.venueAddress}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedEvent.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {selectedEvent.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        <a
                          href={`/requests/${selectedEvent.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Event
                        </a>
                        <button
                          onClick={() => setShowEditEventModal(true)}
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                          Edit Event
                        </button>
                        <button
                          onClick={() => setShowAddEventModal(true)}
                          className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors"
                        >
                          <Copy className="h-3 w-3" />
                          Copy Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-900 rounded-lg">
                        <Music className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{songRequests.length}</div>
                        <div className="text-sm text-gray-400">Total Requests</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-900 rounded-lg">
                        <Clock className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{activeRequests.length}</div>
                        <div className="text-sm text-gray-400">Pending</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-900 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{playedRequests.length}</div>
                        <div className="text-sm text-gray-400">Played</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Song Requests */}
                <div className="bg-gray-900 rounded-lg border border-gray-700">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Music className="h-5 w-5 text-purple-400" />
                      Song Requests
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {songRequests.length > 0 ? (
                      songRequests.map((request) => (
                        <div key={request.id} className="p-4 hover:bg-gray-800 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                {request.track.imageUrl && (
                                  <img
                                    src={request.track.imageUrl}
                                    alt={request.track.title}
                                    className="w-12 h-12 rounded"
                                  />
                                )}
                                <div>
                                  <h4 className="font-medium text-white">{request.track.title}</h4>
                                  <p className="text-gray-400">{request.track.artists}</p>
                                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                    {request.requestedBy && <span>Requested by: {request.requestedBy}</span>}
                                    <span>{new Date(request.requestedAt).toLocaleString()}</span>
                                    {request.priority > 0 && (
                                      <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded">
                                        Priority: {request.priority}
                                      </span>
                                    )}
                                  </div>
                                  {request.notes && <p className="text-sm text-gray-300 mt-1">Note: {request.notes}</p>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {request.isPlayed ? (
                                <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Played
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleMarkAsPlayed(request.id)}
                                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                  Mark Played
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-400">No song requests for this event yet</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Event Selected</h3>
                <p className="text-gray-400">Select an event from the sidebar to view its details and song requests.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <AddEventModal
          isOpen={showAddEventModal}
          onClose={() => setShowAddEventModal(false)}
          onEventAdded={() => {
            setRefreshKey((prev) => prev + 1);
            setShowAddEventModal(false);
          }}
          copyFromEvent={selectedEvent}
        />
      )}

      {/* Edit Event Modal */}
      {showEditEventModal && selectedEvent && (
        <EditEventModal
          isOpen={showEditEventModal}
          onClose={() => setShowEditEventModal(false)}
          onEventUpdated={() => {
            setRefreshKey((prev) => prev + 1);
            setShowEditEventModal(false);
          }}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
