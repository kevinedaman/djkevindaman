'use server';

import { prisma } from '../../../../lib/prisma';
import type { Prisma, Track } from '../../../../generated/prisma';

// Use Prisma-generated types
export type TrackData = Track;

export type TrackWithRequestCount = Prisma.TrackGetPayload<{
  include: {
    _count: {
      select: {
        songRequests: true;
      };
    };
  };
}>;

export type SpotifyTrackInput = Prisma.TrackCreateInput;

/**
 * Search for tracks by title or artist
 */
export async function searchTracks(query: string, limit: number = 20): Promise<TrackData[]> {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const tracks = await prisma.track.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            artists: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            album: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: [
        {
          title: 'asc',
        },
        {
          artists: 'asc',
        },
      ],
      take: limit,
    });

    return tracks;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw new Error('Failed to search tracks');
  }
}

/**
 * Get track by Spotify ID
 */
export async function getTrackBySpotifyId(spotifyId: string): Promise<TrackData | null> {
  try {
    const track = await prisma.track.findUnique({
      where: {
        spotifyId,
      },
    });

    return track;
  } catch (error) {
    console.error('Error fetching track by Spotify ID:', error);
    throw new Error('Failed to fetch track');
  }
}

/**
 * Get track by database ID
 */
export async function getTrackById(trackId: number): Promise<TrackData | null> {
  try {
    const track = await prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });

    return track;
  } catch (error) {
    console.error('Error fetching track by ID:', error);
    throw new Error('Failed to fetch track');
  }
}

/**
 * Create or update a track from Spotify data
 */
export async function upsertTrack(trackData: SpotifyTrackInput): Promise<TrackData> {
  try {
    const track = await prisma.track.upsert({
      where: {
        spotifyId: trackData.spotifyId,
      },
      update: {
        title: trackData.title,
        artists: trackData.artists,
        album: trackData.album || null,
        imageUrl: trackData.imageUrl || null,
        durationMs: trackData.durationMs || null,
        previewUrl: trackData.previewUrl || null,
        spotifyUrl: trackData.spotifyUrl || null,
        rawSpotifyData: trackData.rawSpotifyData || undefined,
      },
      create: {
        spotifyId: trackData.spotifyId,
        title: trackData.title,
        artists: trackData.artists,
        album: trackData.album || null,
        imageUrl: trackData.imageUrl || null,
        durationMs: trackData.durationMs || null,
        previewUrl: trackData.previewUrl || null,
        spotifyUrl: trackData.spotifyUrl || null,
        rawSpotifyData: trackData.rawSpotifyData || undefined,
      },
    });

    return track;
  } catch (error) {
    console.error('Error upserting track:', error);
    throw new Error('Failed to save track');
  }
}

/**
 * Get popular tracks (most requested)
 */
export async function getPopularTracks(limit: number = 50): Promise<TrackWithRequestCount[]> {
  try {
    const tracksWithCounts = await prisma.track.findMany({
      include: {
        _count: {
          select: {
            songRequests: true,
          },
        },
      },
      orderBy: {
        songRequests: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return tracksWithCounts;
  } catch (error) {
    console.error('Error fetching popular tracks:', error);
    throw new Error('Failed to fetch popular tracks');
  }
}

/**
 * Get recently added tracks
 */
export async function getRecentTracks(limit: number = 20): Promise<TrackData[]> {
  try {
    const tracks = await prisma.track.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return tracks;
  } catch (error) {
    console.error('Error fetching recent tracks:', error);
    throw new Error('Failed to fetch recent tracks');
  }
}

/**
 * Search Spotify API for tracks
 */
export async function searchSpotifyTracks(query: string, limit: number = 20): Promise<SpotifyTrackInput[]> {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    // Import Spotify functions
    const { searchSpotifyTracks: searchSpotify, spotifyTrackToInternal } = await import('./spotify');

    // Search Spotify API
    const spotifyTracks = await searchSpotify(query, limit);

    // Convert to our internal format
    const results: SpotifyTrackInput[] = await Promise.all(spotifyTracks.map(spotifyTrackToInternal));

    return results;
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);

    // Fallback to database search if Spotify API fails
    try {
      const existingTracks = await searchTracks(query, limit);
      return existingTracks.map((track) => ({
        spotifyId: track.spotifyId,
        title: track.title,
        artists: track.artists,
        album: track.album || '',
        imageUrl: track.imageUrl || '',
        durationMs: track.durationMs || undefined,
        previewUrl: track.previewUrl || undefined,
        spotifyUrl: track.spotifyUrl || undefined,
      }));
    } catch (fallbackError) {
      console.error('Database fallback also failed:', fallbackError);
      throw new Error('Failed to search tracks');
    }
  }
}
