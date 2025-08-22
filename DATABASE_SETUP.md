# Database Setup Guide

This project uses PostgreSQL with Prisma ORM for data management.

## Prerequisites

1. **PostgreSQL Database**
   - Install PostgreSQL locally, or
   - Use a cloud service like Supabase, PlanetScale, or Railway

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/dj_kevin_daman_db?schema=public"

# Replace with your actual database credentials
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Apply Database Schema

For development (creates/updates tables):

```bash
npm run db:push
```

For production (with migrations):

```bash
npm run db:migrate
```

### 5. Seed Database with Sample Data

```bash
npm run db:seed
```

## Database Commands

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `npm run db:generate` | Generate Prisma client            |
| `npm run db:push`     | Push schema changes to database   |
| `npm run db:migrate`  | Create and run migrations         |
| `npm run db:reset`    | Reset database and run migrations |
| `npm run db:studio`   | Open Prisma Studio (GUI)          |
| `npm run db:seed`     | Seed database with sample data    |

## Database Schema Overview

### Core Tables

- **`dj_events`** - DJ performances/shows where requests can be made
- **`tracks`** - Songs that can be requested (with Spotify metadata)
- **`song_requests`** - Individual song requests for events
- **`request_queue`** - Optional queue management for DJ
- **`event_stats`** - Analytics and statistics per event

### Key Features

- **Event Management**: Create events with start/end times, venue info
- **Song Requests**: Users can request songs during active events
- **Queue Management**: DJ can organize and prioritize requests
- **Analytics**: Track popular songs, request patterns, etc.
- **Spotify Integration**: Store rich track metadata from Spotify API

## Local Development with Docker (Optional)

If you prefer to use Docker for PostgreSQL:

```bash
# Start PostgreSQL container
docker run --name dj-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=dj_kevin_daman_db -p 5432:5432 -d postgres:15

# Update .env with:
DATABASE_URL="postgresql://postgres:password@localhost:5432/dj_kevin_daman_db?schema=public"
```

## Production Deployment

### Supabase (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string
4. Update your production `DATABASE_URL`

### Railway

1. Create a new project at [railway.app](https://railway.app)
2. Add a PostgreSQL service
3. Copy the connection string from the service variables
4. Update your production `DATABASE_URL`

## Troubleshooting

### Common Issues

1. **Connection Error**: Ensure PostgreSQL is running and credentials are correct
2. **Migration Issues**: Try `npm run db:reset` to start fresh
3. **Client Generation**: Run `npm run db:generate` after schema changes

### Checking Database

Use Prisma Studio to view your data:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can browse and edit your data.

## Schema Migrations

When you modify the schema:

1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate` (creates migration file)
3. The migration is automatically applied

For production, migrations should be run as part of your deployment process.
