// DJ Event Types
export interface DjEvent {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  placeId?: number;
  createdById?: string;
  createdDate?: string;
}

// Song Request Types
export interface SongRequest {
  id: number;
  track: Track;
  trackId: number;
  requestedById?: string;
  djEventId: number;
  createdDate: string;
  createdById?: string;
  played: boolean;
}

export interface Track {
  id: number;
  spotifyId: string;
  album: string;
  artists: string;
  title: string;
  rawSpotifyTrack?: string;
  image: string;
}

// Spotify Types
export interface SpotifyTrack {
  id: string;
  label: string;
  artists: string;
  album?: string;
  image?: string;
  original?: any;
}

// Loading States
export enum LoadingState {
  INIT = 'INIT',
  LOADED = 'LOADED',
  LOADING = 'LOADING',
}

export interface ErrorState {
  error: any;
}

export type CallState = LoadingState | ErrorState;
