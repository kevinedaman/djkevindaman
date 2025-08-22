'use client';

import useSWR from 'swr';
import { 
  getSongRequestsForEvent, 
  getActiveSongRequests, 
  getPlayedSongRequests,
  getSongRequestStats,
} from '../actions';
import type { SongRequestWithTrack } from '../actions';

/**
 * Hook to fetch all song requests for an event
 */
export function useSongRequests(eventId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<SongRequestWithTrack[]>(
    eventId ? `song-requests-${eventId}` : null,
    () => eventId ? getSongRequestsForEvent(eventId) : null,
    {
      refreshInterval: 15000, // Refresh every 15 seconds
      revalidateOnFocus: true,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  return {
    requests: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch active (unplayed) song requests for an event
 */
export function useActiveSongRequests(eventId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<SongRequestWithTrack[]>(
    eventId ? `active-requests-${eventId}` : null,
    () => eventId ? getActiveSongRequests(eventId) : null,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: true,
      dedupingInterval: 3000,
    }
  );

  return {
    activeRequests: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch played song requests for an event
 */
export function usePlayedSongRequests(eventId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<SongRequestWithTrack[]>(
    eventId ? `played-requests-${eventId}` : null,
    () => eventId ? getPlayedSongRequests(eventId) : null,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    playedRequests: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch song request statistics for an event
 */
export function useSongRequestStats(eventId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<{
    totalRequests: number;
    activeRequests: number;
    playedRequests: number;
    uniqueRequesters: number;
  }>(
    eventId ? `request-stats-${eventId}` : null,
    () => eventId ? getSongRequestStats(eventId) : null,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  return {
    stats: data,
    isLoading,
    error,
    refresh: mutate,
  };
}
