'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import { getActiveEvents, getEventById, getAllPublicEvents, getUpcomingEvents } from '../actions';
import type { ActiveEventInfo, DjEventWithStats } from '../actions';

/**
 * Hook to fetch active events with realtime updates
 */
export function useActiveEvents() {
  const supabase = createClient();

  const { data, error, isLoading, mutate } = useSWR<ActiveEventInfo[]>('active-events', () => getActiveEvents(), {
    revalidateOnFocus: true,
    dedupingInterval: 10000, // Dedupe requests within 10 seconds
  });

  useEffect(() => {
    const channel = supabase
      .channel('active-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dj_events',
        },
        (payload) => {
          console.log('Active events INSERT:', payload);
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dj_events',
        },
        (payload) => {
          console.log('Active events UPDATE:', payload);
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'dj_events',
        },
        (payload) => {
          console.log('Active events DELETE:', payload);
          mutate(); // Trigger SWR revalidation
        },
      )
      .subscribe((status) => {
        console.log('Active events subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate, supabase]);

  return {
    events: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch a specific event by ID with realtime updates
 */
export function useEvent(eventId: number | null) {
  const supabase = createClient();

  const { data, error, isLoading, mutate } = useSWR<ActiveEventInfo | null>(
    eventId ? `event-${eventId}` : null,
    eventId ? () => getEventById(eventId) : null,
    {
      revalidateOnFocus: true,
    },
  );

  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel(`event-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dj_events',
          filter: `id=eq.${eventId}`,
        },
        (payload) => {
          console.log(`Event ${eventId} UPDATE:`, payload);
          mutate(); // Trigger SWR revalidation
        },
      )
      .subscribe((status) => {
        console.log(`Event ${eventId} subscription status:`, status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, mutate, supabase]);

  return {
    event: data,
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch all public events with realtime updates
 */
export function useAllEvents() {
  const supabase = createClient();

  const { data, error, isLoading, mutate } = useSWR<DjEventWithStats[]>('all-events', () => getAllPublicEvents(), {
    revalidateOnFocus: true,
  });

  useEffect(() => {
    const channel = supabase
      .channel('all-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dj_events',
        },
        (payload) => {
          console.log('All events INSERT:', payload);
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dj_events',
        },
        (payload) => {
          console.log('All events UPDATE:', payload);
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'dj_events',
        },
        (payload) => {
          console.log('All events DELETE:', payload);
          mutate(); // Trigger SWR revalidation
        },
      )
      .subscribe((status) => {
        console.log('All events subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate, supabase]);

  return {
    events: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch upcoming events with realtime updates
 */
export function useUpcomingEvents() {
  const supabase = createClient();

  const { data, error, isLoading, mutate } = useSWR<DjEventWithStats[]>('upcoming-events', () => getUpcomingEvents(), {
    revalidateOnFocus: true,
  });

  useEffect(() => {
    const channel = supabase
      .channel('upcoming-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dj_events',
        },
        (payload) => {
          console.log('Upcoming events INSERT:', payload);
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dj_events',
        },
        (payload) => {
          console.log('Upcoming events UPDATE:', payload);
          mutate(); // Trigger SWR revalidation
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'dj_events',
        },
        (payload) => {
          console.log('Upcoming events DELETE:', payload);
          mutate(); // Trigger SWR revalidation
        },
      )
      .subscribe((status) => {
        console.log('Upcoming events subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate, supabase]);

  return {
    events: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}
