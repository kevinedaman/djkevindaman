-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "public"."user_profiles" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dj_events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "venue_name" TEXT,
    "venue_address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dj_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tracks" (
    "id" SERIAL NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artists" TEXT NOT NULL,
    "album" TEXT,
    "image_url" TEXT,
    "duration_ms" INTEGER,
    "preview_url" TEXT,
    "spotify_url" TEXT,
    "raw_spotify_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."song_requests" (
    "id" SERIAL NOT NULL,
    "dj_event_id" INTEGER NOT NULL,
    "track_id" INTEGER NOT NULL,
    "requested_by" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_played" BOOLEAN NOT NULL DEFAULT false,
    "played_at" TIMESTAMP(3),
    "notes" TEXT,
    "dj_notes" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "song_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."request_queue" (
    "id" SERIAL NOT NULL,
    "dj_event_id" INTEGER NOT NULL,
    "song_request_id" INTEGER NOT NULL,
    "queue_position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_stats" (
    "id" SERIAL NOT NULL,
    "dj_event_id" INTEGER NOT NULL,
    "total_requests" INTEGER NOT NULL DEFAULT 0,
    "total_unique_requesters" INTEGER NOT NULL DEFAULT 0,
    "total_songs_played" INTEGER NOT NULL DEFAULT 0,
    "most_requested_track_id" INTEGER,
    "first_request_at" TIMESTAMP(3),
    "last_request_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "public"."user_profiles"("email");

-- CreateIndex
CREATE INDEX "user_profiles_email_idx" ON "public"."user_profiles"("email");

-- CreateIndex
CREATE INDEX "user_profiles_role_idx" ON "public"."user_profiles"("role");

-- CreateIndex
CREATE INDEX "dj_events_start_date_end_date_idx" ON "public"."dj_events"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "dj_events_is_active_is_public_idx" ON "public"."dj_events"("is_active", "is_public");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_spotify_id_key" ON "public"."tracks"("spotify_id");

-- CreateIndex
CREATE INDEX "tracks_spotify_id_idx" ON "public"."tracks"("spotify_id");

-- CreateIndex
CREATE INDEX "tracks_title_artists_idx" ON "public"."tracks"("title", "artists");

-- CreateIndex
CREATE INDEX "song_requests_dj_event_id_is_played_idx" ON "public"."song_requests"("dj_event_id", "is_played");

-- CreateIndex
CREATE INDEX "song_requests_requested_at_idx" ON "public"."song_requests"("requested_at");

-- CreateIndex
CREATE INDEX "song_requests_priority_requested_at_idx" ON "public"."song_requests"("priority", "requested_at");

-- CreateIndex
CREATE UNIQUE INDEX "song_requests_dj_event_id_track_id_key" ON "public"."song_requests"("dj_event_id", "track_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_queue_song_request_id_key" ON "public"."request_queue"("song_request_id");

-- CreateIndex
CREATE INDEX "request_queue_dj_event_id_queue_position_idx" ON "public"."request_queue"("dj_event_id", "queue_position");

-- CreateIndex
CREATE UNIQUE INDEX "request_queue_dj_event_id_queue_position_key" ON "public"."request_queue"("dj_event_id", "queue_position");

-- CreateIndex
CREATE UNIQUE INDEX "event_stats_dj_event_id_key" ON "public"."event_stats"("dj_event_id");

-- AddForeignKey
ALTER TABLE "public"."song_requests" ADD CONSTRAINT "song_requests_dj_event_id_fkey" FOREIGN KEY ("dj_event_id") REFERENCES "public"."dj_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."song_requests" ADD CONSTRAINT "song_requests_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_queue" ADD CONSTRAINT "request_queue_dj_event_id_fkey" FOREIGN KEY ("dj_event_id") REFERENCES "public"."dj_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_queue" ADD CONSTRAINT "request_queue_song_request_id_fkey" FOREIGN KEY ("song_request_id") REFERENCES "public"."song_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_stats" ADD CONSTRAINT "event_stats_dj_event_id_fkey" FOREIGN KEY ("dj_event_id") REFERENCES "public"."dj_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_stats" ADD CONSTRAINT "event_stats_most_requested_track_id_fkey" FOREIGN KEY ("most_requested_track_id") REFERENCES "public"."tracks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
