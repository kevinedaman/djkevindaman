'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import { getSongRequestsForEvent, getActiveSongRequests, getPlayedSongRequests, getSongRequestStats } from '../actions';
import type { SongRequestWithTrack } from '../actions';

/**
 * Hook to fetch all song requests for an event with realtime updates
 */
export function useSongRequests(eventId: number | null) {
  const supabase = createClient();

  const { data, error, isLoading, mutate } = useSWR<SongRequestWithTrack[]>(
    eventId ? `song-requests-${eventId}` : null,
    eventId ? () => getSongRequestsForEvent(eventId) : null,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    },
  );

  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel(`all-song-requests-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, mutate, supabase]);

  return {
    requests: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch active (unplayed) song requests for an event with realtime updates
 */
export function useActiveSongRequests(eventId: number | null) {
  const supabase = createClient();

  const { data, error, isLoading, mutate } = useSWR<SongRequestWithTrack[]>(
    eventId ? `active-requests-${eventId}` : null,
    eventId ? () => getActiveSongRequests(eventId) : null,
    {
      revalidateOnFocus: true,
      dedupingInterval: 3000,
    },
  );

  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel(`active-song-requests-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, mutate, supabase]);

  return {
    activeRequests: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch played song requests for an event with realtime updates
 */
export function usePlayedSongRequests(eventId: number | null) {
  const supabase = createClient();

  const { data, error, isLoading, mutate } = useSWR<SongRequestWithTrack[]>(
    eventId ? `played-requests-${eventId}` : null,
    eventId ? () => getPlayedSongRequests(eventId) : null,
    {
      revalidateOnFocus: true,
    },
  );

  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel(`played-song-requests-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, mutate, supabase]);

  return {
    playedRequests: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch song request statistics for an event with realtime updates
 */
export function useSongRequestStats(eventId: number | null) {
  const supabase = createClient();

  const { data, error, isLoading, mutate } = useSWR<{
    totalRequests: number;
    activeRequests: number;
    playedRequests: number;
    uniqueRequesters: number;
  }>(eventId ? `request-stats-${eventId}` : null, eventId ? () => getSongRequestStats(eventId) : null, {
    revalidateOnFocus: true,
  });

  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel(`request-stats-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        (payload) => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'song_requests',
          filter: `dj_event_id=eq.${eventId}`,
        },
        () => {
          mutate(); // Trigger SWR revalidation
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, mutate, supabase]);

  return {
    stats: data,
    isLoading,
    error,
    refresh: mutate,
  };
}
