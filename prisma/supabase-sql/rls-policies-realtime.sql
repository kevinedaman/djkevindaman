-- DJ Kevin Daman RLS Policies - Realtime Compatible
-- This version allows realtime subscriptions while maintaining security

-- Grant basic permissions
GRANT USAGE ON SCHEMA "public" TO anon;
GRANT USAGE ON SCHEMA "public" TO authenticated;

-- Enable RLS on all tables
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename IN ('user_profiles', 'dj_events', 'tracks', 'song_requests', 'request_queue', 'event_stats')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_record.tablename);
        RAISE NOTICE 'Enabled RLS on table: %', table_record.tablename;
    END LOOP;
END
$$;

-- =================================================================================================
-- DJ EVENTS TABLE - Allow realtime subscriptions
-- =================================================================================================

DROP POLICY IF EXISTS "Anyone can view public events" ON dj_events;
DROP POLICY IF EXISTS "Admins can manage events" ON dj_events;
DROP POLICY IF EXISTS "Service role can manage all events" ON dj_events;

-- Very permissive policy for realtime to work
CREATE POLICY "Public events are viewable" ON dj_events
    FOR SELECT
    TO authenticated, anon
    USING (true); -- Allow all reads for realtime

-- Allow service role to manage all events (for server actions)
CREATE POLICY "Service role can manage all events" ON dj_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =================================================================================================
-- TRACKS TABLE - Allow realtime subscriptions
-- =================================================================================================

DROP POLICY IF EXISTS "Anyone can view tracks" ON tracks;
DROP POLICY IF EXISTS "Service role can manage all tracks" ON tracks;

-- Allow anyone to view tracks
CREATE POLICY "Tracks are viewable" ON tracks
    FOR SELECT
    TO authenticated, anon
    USING (true); -- Allow all reads for realtime

-- Allow service role to manage all tracks
CREATE POLICY "Service role can manage all tracks" ON tracks
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =================================================================================================
-- SONG REQUESTS TABLE - Allow realtime subscriptions
-- =================================================================================================

DROP POLICY IF EXISTS "Anyone can view song requests for public events" ON song_requests;
DROP POLICY IF EXISTS "Service role can manage all song requests" ON song_requests;

-- Very permissive policy for realtime to work
CREATE POLICY "Song requests are viewable" ON song_requests
    FOR SELECT
    TO authenticated, anon
    USING (true); -- Allow all reads for realtime

-- Allow service role to manage all song requests
CREATE POLICY "Service role can manage all song requests" ON song_requests
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =================================================================================================
-- REQUEST QUEUE TABLE - Allow realtime subscriptions
-- =================================================================================================

DROP POLICY IF EXISTS "Anyone can view queue for public events" ON request_queue;
DROP POLICY IF EXISTS "Service role can manage all queue entries" ON request_queue;

-- Allow anyone to view queue entries
CREATE POLICY "Queue entries are viewable" ON request_queue
    FOR SELECT
    TO authenticated, anon
    USING (true); -- Allow all reads for realtime

-- Allow service role to manage all queue entries
CREATE POLICY "Service role can manage all queue entries" ON request_queue
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =================================================================================================
-- EVENT STATS TABLE - Allow realtime subscriptions
-- =================================================================================================

DROP POLICY IF EXISTS "Anyone can view stats for public events" ON event_stats;
DROP POLICY IF EXISTS "Service role can manage all event stats" ON event_stats;

-- Allow anyone to view event stats
CREATE POLICY "Event stats are viewable" ON event_stats
    FOR SELECT
    TO authenticated, anon
    USING (true); -- Allow all reads for realtime

-- Allow service role to manage all event stats
CREATE POLICY "Service role can manage all event stats" ON event_stats
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =================================================================================================
-- USER PROFILES TABLE - Keep restrictive (not needed for realtime)
-- =================================================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON user_profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Allow users to update their own profile  
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow service role to manage all profiles
CREATE POLICY "Service role can manage all profiles" ON user_profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);