-- DJ Kevin Daman Realtime Publications Configuration
-- This script configures the realtime publications for tables used in the DJ request app
-- Run this script after database migrations to enable realtime functionality
-- This script is safe to run multiple times (idempotent)

-- Function to safely add tables to realtime publication
DO $$ 
DECLARE
    table_list text[] := ARRAY[
        'dj_events',        -- Used in: use-events.ts for event updates (active events, status changes)
        'song_requests',    -- Used in: use-song-requests.ts for live request updates 
        'request_queue',    -- Used for queue position changes
        'event_stats'       -- Used for live statistics updates
    ];
    table_name text;
    table_exists boolean;
BEGIN
    FOREACH table_name IN ARRAY table_list
    LOOP
        -- Check if table is already in the publication
        SELECT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND tablename = table_name
        ) INTO table_exists;
        
        -- Add table only if it's not already in the publication
        IF NOT table_exists THEN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', table_name);
            RAISE NOTICE 'Added table % to supabase_realtime publication', table_name;
        ELSE
            RAISE NOTICE 'Table % already exists in supabase_realtime publication', table_name;
        END IF;
    END LOOP;
END $$;

-- Verify the publication configuration (uncomment to check)
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' ORDER BY tablename; 