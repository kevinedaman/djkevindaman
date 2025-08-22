-- DJ Kevin Daman RLS Policies
-- This configures Row Level Security for the DJ request application
-- Since we use server actions for all database operations, we lock down direct access
-- and only allow realtime subscriptions for the tables that need live updates

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
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_record.tablename);
        RAISE NOTICE 'Enabled RLS on table: %', table_record.tablename;
    END LOOP;
END
$$;

-- =================================================================================================
-- USER PROFILES TABLE
-- =================================================================================================

-- Drop existing policies
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

-- Allow service role to manage all profiles (for server actions)
CREATE POLICY "Service role can manage all profiles" ON user_profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =================================================================================================
-- DJ EVENTS TABLE 
-- =================================================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view public events" ON dj_events;
DROP POLICY IF EXISTS "Admins can manage events" ON dj_events;
DROP POLICY IF EXISTS "Service role can manage all events" ON dj_events;

-- Allow anyone to view public events (needed for realtime subscriptions)
CREATE POLICY "Anyone can view public events" ON dj_events
    FOR SELECT
    TO authenticated, anon
    USING (is_public = true);

-- Allow admin users to manage events
CREATE POLICY "Admins can manage events" ON dj_events
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Allow service role to manage all events (for server actions)
CREATE POLICY "Service role can manage all events" ON dj_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =================================================================================================
-- TRACKS TABLE
-- =================================================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view tracks" ON tracks;
DROP POLICY IF EXISTS "Service role can manage all tracks" ON tracks;

-- Allow anyone to view tracks (read-only for public use)
CREATE POLICY "Anyone can view tracks" ON tracks
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Allow service role to manage all tracks (for server actions)
CREATE POLICY "Service role can manage all tracks" ON tracks
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =================================================================================================
-- SONG REQUESTS TABLE
-- =================================================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view song requests for public events" ON song_requests;
DROP POLICY IF EXISTS "Service role can manage all song requests" ON song_requests;

-- Allow anyone to view song requests for public events (needed for realtime subscriptions)
CREATE POLICY "Anyone can view song requests for public events" ON song_requests
    FOR SELECT
    TO authenticated, anon
    USING (
        EXISTS (
            SELECT 1 FROM dj_events 
            WHERE id = dj_event_id 
            AND is_public = true
        )
    );

-- Allow service role to manage all song requests (for server actions)
CREATE POLICY "Service role can manage all song requests" ON song_requests
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =================================================================================================
-- REQUEST QUEUE TABLE
-- =================================================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view queue for public events" ON request_queue;
DROP POLICY IF EXISTS "Service role can manage all queue entries" ON request_queue;

-- Allow anyone to view queue for public events
CREATE POLICY "Anyone can view queue for public events" ON request_queue
    FOR SELECT
    TO authenticated, anon
    USING (
        EXISTS (
            SELECT 1 FROM dj_events 
            WHERE id = dj_event_id 
            AND is_public = true
        )
    );

-- Allow service role to manage all queue entries (for server actions)
CREATE POLICY "Service role can manage all queue entries" ON request_queue
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =================================================================================================
-- EVENT STATS TABLE
-- =================================================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view stats for public events" ON event_stats;
DROP POLICY IF EXISTS "Service role can manage all event stats" ON event_stats;

-- Allow anyone to view stats for public events
CREATE POLICY "Anyone can view stats for public events" ON event_stats
    FOR SELECT
    TO authenticated, anon
    USING (
        EXISTS (
            SELECT 1 FROM dj_events 
            WHERE id = dj_event_id 
            AND is_public = true
        )
    );

-- Allow service role to manage all event stats (for server actions)
CREATE POLICY "Service role can manage all event stats" ON event_stats
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);