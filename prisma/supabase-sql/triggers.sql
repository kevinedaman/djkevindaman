-- DJ Kevin Daman Database Triggers
-- This script creates database triggers for the DJ request application
-- Run this script after database migrations to enable automatic updates

-- =================================================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =================================================================================================

-- Create a reusable function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =================================================================================================
-- APPLY UPDATED_AT TRIGGERS TO ALL TABLES
-- =================================================================================================

-- Drop existing triggers first (safe to run multiple times)
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_dj_events_updated_at ON dj_events;
DROP TRIGGER IF EXISTS update_tracks_updated_at ON tracks;
DROP TRIGGER IF EXISTS update_song_requests_updated_at ON song_requests;
DROP TRIGGER IF EXISTS update_request_queue_updated_at ON request_queue;
DROP TRIGGER IF EXISTS update_event_stats_updated_at ON event_stats;

-- Create updated_at triggers for all tables
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dj_events_updated_at
  BEFORE UPDATE ON dj_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_song_requests_updated_at
  BEFORE UPDATE ON song_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_request_queue_updated_at
  BEFORE UPDATE ON request_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_stats_updated_at
  BEFORE UPDATE ON event_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =================================================================================================
-- EVENT STATISTICS AUTO-UPDATE TRIGGERS
-- =================================================================================================

-- Function to update event statistics when song requests change
CREATE OR REPLACE FUNCTION update_event_statistics()
RETURNS TRIGGER AS $$
DECLARE
  event_id INT;
  total_requests INT;
  total_unique_requesters INT;
  total_songs_played INT;
  most_requested_track_id INT;
  first_request_at TIMESTAMP;
  last_request_at TIMESTAMP;
BEGIN
  -- Get the event ID from the new or old record
  IF TG_OP = 'DELETE' THEN
    event_id := OLD.dj_event_id;
  ELSE
    event_id := NEW.dj_event_id;
  END IF;

  -- Calculate statistics for this event
  SELECT 
    COUNT(*),
    COUNT(DISTINCT requested_by) FILTER (WHERE requested_by IS NOT NULL),
    COUNT(*) FILTER (WHERE is_played = true)
  INTO total_requests, total_unique_requesters, total_songs_played
  FROM song_requests 
  WHERE dj_event_id = event_id;

  -- Find the most requested track
  SELECT track_id INTO most_requested_track_id
  FROM song_requests 
  WHERE dj_event_id = event_id
  GROUP BY track_id
  ORDER BY COUNT(*) DESC
  LIMIT 1;

  -- Get first and last request timestamps
  SELECT 
    MIN(requested_at),
    MAX(requested_at)
  INTO first_request_at, last_request_at
  FROM song_requests
  WHERE dj_event_id = event_id;

  -- Update or insert event statistics
  INSERT INTO event_stats (
    dj_event_id,
    total_requests,
    total_unique_requesters,
    total_songs_played,
    most_requested_track_id,
    first_request_at,
    last_request_at,
    created_at,
    updated_at
  ) VALUES (
    event_id,
    total_requests,
    total_unique_requesters,
    total_songs_played,
    most_requested_track_id,
    first_request_at,
    last_request_at,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
  ON CONFLICT (dj_event_id) DO UPDATE SET
    total_requests = EXCLUDED.total_requests,
    total_unique_requesters = EXCLUDED.total_unique_requesters,
    total_songs_played = EXCLUDED.total_songs_played,
    most_requested_track_id = EXCLUDED.most_requested_track_id,
    first_request_at = EXCLUDED.first_request_at,
    last_request_at = EXCLUDED.last_request_at,
    updated_at = CURRENT_TIMESTAMP;

  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Drop existing event statistics triggers
DROP TRIGGER IF EXISTS update_event_stats_on_song_request_change ON song_requests;

-- Create trigger to update event statistics when song requests change
CREATE TRIGGER update_event_stats_on_song_request_change
  AFTER INSERT OR UPDATE OR DELETE ON song_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_event_statistics();

-- =================================================================================================
-- USER PROFILE AUTO-CREATION TRIGGER
-- =================================================================================================

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER 
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing user profile trigger
DROP TRIGGER IF EXISTS create_user_profile_on_signup ON auth.users;

-- Create trigger to auto-create user profile on signup
-- Note: This trigger is on the auth.users table from Supabase Auth
CREATE TRIGGER create_user_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();
