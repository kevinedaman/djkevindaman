'use server';

import { prisma } from '../../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { upsertTrack, type SpotifyTrackInput } from './tracks';
import type { Prisma } from '../../../../generated/prisma';

// Use Prisma-generated types
export type SongRequestWithTrack = Prisma.SongRequestGetPayload<{
  include: {
    track: true;
  };
}>;

export type CreateSongRequestInput = {
  djEventId: number;
  spotifyTrack: SpotifyTrackInput;
  requestedBy?: string;
  notes?: string;
};

/**
 * Get all song requests for a specific event
 */
export async function getSongRequestsForEvent(eventId: number): Promise<SongRequestWithTrack[]> {
  try {
    const requests = await prisma.songRequest.findMany({
      where: {
        djEventId: eventId,
      },
      include: {
        track: true,
      },
      orderBy: [
        {
          isPlayed: 'asc', // Unplayed first
        },
        {
          priority: 'desc', // Higher priority first
        },
        {
          requestedAt: 'asc', // Older requests first within same priority
        },
      ],
    });

    return requests;
  } catch (error) {
    console.error('Error fetching song requests for event:', error);
    throw new Error('Failed to fetch song requests');
  }
}

/**
 * Get active (unplayed) song requests for an event
 */
export async function getActiveSongRequests(eventId: number): Promise<SongRequestWithTrack[]> {
  try {
    const requests = await prisma.songRequest.findMany({
      where: {
        djEventId: eventId,
        isPlayed: false,
      },
      include: {
        track: true,
      },
      orderBy: [
        {
          priority: 'desc',
        },
        {
          requestedAt: 'asc',
        },
      ],
    });

    return requests;
  } catch (error) {
    console.error('Error fetching active song requests:', error);
    throw new Error('Failed to fetch active song requests');
  }
}

/**
 * Get played song requests for an event
 */
export async function getPlayedSongRequests(eventId: number): Promise<SongRequestWithTrack[]> {
  try {
    const requests = await prisma.songRequest.findMany({
      where: {
        djEventId: eventId,
        isPlayed: true,
      },
      include: {
        track: true,
      },
      orderBy: {
        playedAt: 'desc', // Most recently played first
      },
    });

    return requests;
  } catch (error) {
    console.error('Error fetching played song requests:', error);
    throw new Error('Failed to fetch played song requests');
  }
}

/**
 * Create a new song request
 */
export async function createSongRequest(input: CreateSongRequestInput): Promise<SongRequestWithTrack> {
  try {
    // First, ensure the track exists in our database
    const track = await upsertTrack(input.spotifyTrack);

    // Check if this track is already requested for this event
    const existingRequest = await prisma.songRequest.findUnique({
      where: {
        djEventId_trackId: {
          djEventId: input.djEventId,
          trackId: track.id,
        },
      },
    });

    if (existingRequest) {
      throw new Error('This song has already been requested for this event');
    }

    // Create the song request
    const request = await prisma.songRequest.create({
      data: {
        djEventId: input.djEventId,
        trackId: track.id,
        requestedBy: input.requestedBy || null,
        notes: input.notes || null,
        priority: 0, // Default priority
      },
      include: {
        track: true,
      },
    });

    // Update event stats
    await updateEventStats(input.djEventId);

    // Revalidate the cache
    revalidatePath(`/requests/${input.djEventId}`);
    revalidatePath('/requests');

    return request;
  } catch (error) {
    console.error('Error creating song request:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create song request');
  }
}

/**
 * Mark a song request as played (DJ only - for future use)
 */
export async function markSongAsPlayed(requestId: number): Promise<SongRequestWithTrack> {
  try {
    const request = await prisma.songRequest.update({
      where: {
        id: requestId,
      },
      data: {
        isPlayed: true,
        playedAt: new Date(),
      },
      include: {
        track: true,
      },
    });

    // Update event stats
    await updateEventStats(request.djEventId);

    // Revalidate the cache
    revalidatePath(`/requests/${request.djEventId}`);

    return request;
  } catch (error) {
    console.error('Error marking song as played:', error);
    throw new Error('Failed to mark song as played');
  }
}

/**
 * Update song request priority (DJ only - for future use)
 */
export async function updateSongRequestPriority(requestId: number, priority: number): Promise<SongRequestWithTrack> {
  try {
    const request = await prisma.songRequest.update({
      where: {
        id: requestId,
      },
      data: {
        priority,
      },
      include: {
        track: true,
      },
    });

    // Revalidate the cache
    revalidatePath(`/requests/${request.djEventId}`);

    return request;
  } catch (error) {
    console.error('Error updating song request priority:', error);
    throw new Error('Failed to update priority');
  }
}

/**
 * Add DJ notes to a song request (DJ only - for future use)
 */
export async function addDjNotes(requestId: number, djNotes: string): Promise<SongRequestWithTrack> {
  try {
    const request = await prisma.songRequest.update({
      where: {
        id: requestId,
      },
      data: {
        djNotes,
      },
      include: {
        track: true,
      },
    });

    // Revalidate the cache
    revalidatePath(`/requests/${request.djEventId}`);

    return request;
  } catch (error) {
    console.error('Error adding DJ notes:', error);
    throw new Error('Failed to add DJ notes');
  }
}

/**
 * Delete a song request (admin only - for future use)
 */
export async function deleteSongRequest(requestId: number): Promise<void> {
  try {
    const request = await prisma.songRequest.findUnique({
      where: { id: requestId },
      select: { djEventId: true },
    });

    if (!request) {
      throw new Error('Song request not found');
    }

    await prisma.songRequest.delete({
      where: {
        id: requestId,
      },
    });

    // Update event stats
    await updateEventStats(request.djEventId);

    // Revalidate the cache
    revalidatePath(`/requests/${request.djEventId}`);
  } catch (error) {
    console.error('Error deleting song request:', error);
    throw new Error('Failed to delete song request');
  }
}

/**
 * Get song request statistics for an event
 */
export async function getSongRequestStats(eventId: number) {
  try {
    const [totalRequests, activeRequests, playedRequests, uniqueRequesters] = await Promise.all([
      prisma.songRequest.count({
        where: { djEventId: eventId },
      }),
      prisma.songRequest.count({
        where: { djEventId: eventId, isPlayed: false },
      }),
      prisma.songRequest.count({
        where: { djEventId: eventId, isPlayed: true },
      }),
      prisma.songRequest.findMany({
        where: { djEventId: eventId },
        select: { requestedBy: true },
        distinct: ['requestedBy'],
      }),
    ]);

    return {
      totalRequests,
      activeRequests,
      playedRequests,
      uniqueRequesters: uniqueRequesters.filter((r) => r.requestedBy).length,
    };
  } catch (error) {
    console.error('Error fetching song request stats:', error);
    throw new Error('Failed to fetch statistics');
  }
}

/**
 * Update event statistics (internal helper)
 */
async function updateEventStats(eventId: number): Promise<void> {
  try {
    const stats = await getSongRequestStats(eventId);

    const mostRequestedTrack = await prisma.songRequest.groupBy({
      by: ['trackId'],
      where: { djEventId: eventId },
      _count: { trackId: true },
      orderBy: { _count: { trackId: 'desc' } },
      take: 1,
    });

    const [firstRequest, lastRequest] = await Promise.all([
      prisma.songRequest.findFirst({
        where: { djEventId: eventId },
        orderBy: { requestedAt: 'asc' },
      }),
      prisma.songRequest.findFirst({
        where: { djEventId: eventId },
        orderBy: { requestedAt: 'desc' },
      }),
    ]);

    await prisma.eventStats.upsert({
      where: { djEventId: eventId },
      update: {
        totalRequests: stats.totalRequests,
        totalUniqueRequesters: stats.uniqueRequesters,
        totalSongsPlayed: stats.playedRequests,
        mostRequestedTrackId: mostRequestedTrack[0]?.trackId || null,
        firstRequestAt: firstRequest?.requestedAt || null,
        lastRequestAt: lastRequest?.requestedAt || null,
      },
      create: {
        djEventId: eventId,
        totalRequests: stats.totalRequests,
        totalUniqueRequesters: stats.uniqueRequesters,
        totalSongsPlayed: stats.playedRequests,
        mostRequestedTrackId: mostRequestedTrack[0]?.trackId || null,
        firstRequestAt: firstRequest?.requestedAt || null,
        lastRequestAt: lastRequest?.requestedAt || null,
      },
    });
  } catch (error) {
    console.error('Error updating event stats:', error);
    // Don't throw here as this is a background operation
  }
}
