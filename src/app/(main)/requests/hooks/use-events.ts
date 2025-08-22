'use client';

import useSWR from 'swr';
import { getActiveEvents, getEventById, getAllPublicEvents, getUpcomingEvents } from '../actions';
import type { ActiveEventInfo, DjEventWithStats } from '../actions';

/**
 * Hook to fetch active events
 */
export function useActiveEvents() {
  const { data, error, isLoading, mutate } = useSWR<ActiveEventInfo[]>(
    'active-events',
    () => getActiveEvents(),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
    }
  );

  return {
    events: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch a specific event by ID
 */
export function useEvent(eventId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<ActiveEventInfo | null>(
    eventId ? `event-${eventId}` : null,
    () => eventId ? getEventById(eventId) : null,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  return {
    event: data,
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch all public events
 */
export function useAllEvents() {
  const { data, error, isLoading, mutate } = useSWR<DjEventWithStats[]>(
    'all-events',
    () => getAllPublicEvents(),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
    }
  );

  return {
    events: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch upcoming events
 */
export function useUpcomingEvents() {
  const { data, error, isLoading, mutate } = useSWR<DjEventWithStats[]>(
    'upcoming-events',
    () => getUpcomingEvents(),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
    }
  );

  return {
    events: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}
