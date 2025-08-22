# Spotify Integration Setup

This document explains how to set up Spotify integration for the DJ Request App.

## Overview

The app now includes full Spotify API integration that replaces the previous Cloudflare Worker implementation. This allows users to search for songs directly from Spotify's catalog when making requests.

## Prerequisites

1. A Spotify Developer Account
2. Environment variables configured

## Setup Steps

### 1. Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the app details:
   - **App Name**: DJ Kevin Daman Request App
   - **App Description**: Song request system for DJ events
   - **Website**: Your app URL (e.g., http://localhost:3000 for development)
   - **Redirect URI**: Not needed for Client Credentials flow
5. Accept the terms and create the app
6. Copy your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Create a `.env.local` file in your project root (or copy from `env-template`):

```bash
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Other required environment variables...
DATABASE_URL="postgresql://username:password@localhost:5432/dj_kevin_daman?schema=public"
```

**Important**: Never commit your `.env.local` file to version control. The `.gitignore` file already excludes `.env*` files.

### 3. Verify Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to an event's request page
3. Click "Request a Song"
4. Start typing a song name or artist
5. You should see real Spotify search results

## Features

### Token Management

- Automatic token generation using Client Credentials flow
- In-memory token caching with automatic renewal
- Graceful error handling and retry logic

### Search Functionality

- Real-time search as you type
- Search by song title, artist, or album
- Fallback to local database if Spotify API fails
- Rate limiting and error handling

### Data Storage

- Spotify track data is automatically stored in your local database
- Raw Spotify metadata preserved for future use
- Deduplication based on Spotify track ID

## API Endpoints Used

The integration uses Spotify's Web API with the following endpoints:

- **Token Endpoint**: `https://accounts.spotify.com/api/token`
  - Used to get access tokens via Client Credentials flow
- **Search Endpoint**: `https://api.spotify.com/v1/search`
  - Used to search for tracks
- **Track Endpoint**: `https://api.spotify.com/v1/tracks/{id}`
  - Used to get detailed track information

## Security Notes

1. **Client Credentials Flow**: We use the Client Credentials flow which doesn't require user authorization but only provides access to public Spotify data.

2. **Server-Side Only**: All Spotify API calls are made server-side to keep your client secret secure.

3. **Rate Limiting**: The integration respects Spotify's rate limits and includes retry logic.

## Troubleshooting

### Common Issues

1. **"Spotify credentials not configured"**

   - Make sure `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are set in your `.env.local` file
   - Restart your development server after adding environment variables

2. **"Failed to get Spotify access token"**

   - Verify your Client ID and Client Secret are correct
   - Check that your Spotify app is active in the developer dashboard

3. **Search returns no results**

   - The app will fallback to searching the local database
   - This is normal behavior when Spotify API is unavailable

4. **Token errors (401)**
   - The app automatically handles token renewal
   - If issues persist, check your Spotify app settings

### Development Tips

1. **Test with mock data**: If you don't have Spotify credentials yet, the app will fallback to local database search
2. **Monitor API usage**: Check the Spotify Developer Dashboard to monitor your API usage
3. **Error logging**: Check your server console for detailed error messages

## Migration from Cloudflare Worker

The previous Cloudflare Worker (`@spotify-token/`) functionality has been fully migrated to Next.js server actions. The worker is no longer needed and can be removed.

### What was migrated:

- Token management and caching
- CORS handling (now handled by Next.js)
- Error handling and retry logic
- Environment variable configuration

### Benefits of the migration:

- Simplified architecture (no external worker needed)
- Better error handling and logging
- Integrated with the app's existing infrastructure
- No additional deployment or maintenance overhead

## Support

If you encounter issues with the Spotify integration:

1. Check the console for error messages
2. Verify your environment variables
3. Test with a different search query
4. Check your internet connection

The app is designed to gracefully handle Spotify API failures by falling back to local database search.
