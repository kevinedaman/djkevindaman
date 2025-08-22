'use server';

export interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifySearchResponse {
  tracks: {
    href: string;
    items: SpotifyTrack[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

// In-memory token cache
let tokenCache: SpotifyToken | null = null;

/**
 * Get Spotify client credentials token
 */
async function getSpotifyToken(): Promise<SpotifyToken> {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expires_at > Date.now()) {
    return tokenCache;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.',
    );
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Spotify token request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Create token with expiration timestamp
    const token: SpotifyToken = {
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      expires_at: Date.now() + data.expires_in * 1000 - 60000, // Subtract 1 minute for safety margin
    };

    // Cache the token
    tokenCache = token;

    return token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw new Error('Failed to get Spotify access token');
  }
}

/**
 * Search for tracks on Spotify
 */
export async function searchSpotifyTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const token = await getSpotifyToken();

    // URL encode the query
    const encodedQuery = encodeURIComponent(query.trim());

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=${Math.min(limit, 50)}`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, clear cache and retry once
        tokenCache = null;
        const newToken = await getSpotifyToken();

        const retryResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=${Math.min(limit, 50)}`,
          {
            headers: {
              Authorization: `Bearer ${newToken.access_token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!retryResponse.ok) {
          throw new Error(`Spotify search failed: ${retryResponse.status} ${retryResponse.statusText}`);
        }

        const retryData: SpotifySearchResponse = await retryResponse.json();
        return retryData.tracks.items;
      }

      throw new Error(`Spotify search failed: ${response.status} ${response.statusText}`);
    }

    const data: SpotifySearchResponse = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);
    throw new Error('Failed to search Spotify tracks');
  }
}

/**
 * Get track details by Spotify ID
 */
export async function getSpotifyTrack(trackId: string): Promise<SpotifyTrack> {
  try {
    const token = await getSpotifyToken();

    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, clear cache and retry once
        tokenCache = null;
        const newToken = await getSpotifyToken();

        const retryResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
          headers: {
            Authorization: `Bearer ${newToken.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!retryResponse.ok) {
          throw new Error(`Spotify track fetch failed: ${retryResponse.status} ${retryResponse.statusText}`);
        }

        return await retryResponse.json();
      }

      throw new Error(`Spotify track fetch failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Spotify track:', error);
    throw new Error('Failed to fetch Spotify track');
  }
}

/**
 * Convert Spotify track to our internal format
 */
export async function spotifyTrackToInternal(spotifyTrack: SpotifyTrack) {
  return {
    spotifyId: spotifyTrack.id,
    title: spotifyTrack.name,
    artists: spotifyTrack.artists.map((artist) => artist.name).join(', '),
    album: spotifyTrack.album.name,
    imageUrl: spotifyTrack.album.images[0]?.url || null,
    durationMs: spotifyTrack.duration_ms,
    previewUrl: spotifyTrack.preview_url,
    spotifyUrl: spotifyTrack.external_urls.spotify,
    rawSpotifyData: JSON.parse(JSON.stringify(spotifyTrack)), // Convert to plain JSON object
  };
}
