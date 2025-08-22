import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample tracks
  const tracks = await Promise.all([
    prisma.track.upsert({
      where: { spotifyId: '4iV5W9uYEdYUVa79Axb7Rh' },
      update: {},
      create: {
        spotifyId: '4iV5W9uYEdYUVa79Axb7Rh',
        title: 'Best Song Ever',
        artists: 'One Direction',
        album: 'Midnight Memories',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273d8856d19e1f5cd7a0a0b0f2b',
        durationMs: 185000,
      },
    }),
    prisma.track.upsert({
      where: { spotifyId: '1301WleyT98MSxVHPZCA6M' },
      update: {},
      create: {
        spotifyId: '1301WleyT98MSxVHPZCA6M',
        title: 'Shape of You',
        artists: 'Ed Sheeran',
        album: '÷ (Deluxe)',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
        durationMs: 233712,
      },
    }),
    prisma.track.upsert({
      where: { spotifyId: '7qiZfU4dY1lWllzX7mPBI3' },
      update: {},
      create: {
        spotifyId: '7qiZfU4dY1lWllzX7mPBI3',
        title: 'Blinding Lights',
        artists: 'The Weeknd',
        album: 'After Hours',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        durationMs: 200040,
      },
    }),
    prisma.track.upsert({
      where: { spotifyId: '0VjIjW4GlULA8pIelVxe4V' },
      update: {},
      create: {
        spotifyId: '0VjIjW4GlULA8pIelVxe4V',
        title: 'As It Was',
        artists: 'Harry Styles',
        album: "Harry's House",
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273919e163019c2f1a7ca68b39f',
        durationMs: 167303,
      },
    }),
  ]);

  console.log(`✅ Created ${tracks.length} tracks`);

  // Create sample events
  const now = new Date();
  const upcomingEvent = await prisma.djEvent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Saturday Night Dance Party',
      description: 'High-energy dance party with the latest hits and classic favorites',
      startDate: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      endDate: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
      venueName: 'The Underground Club',
      venueAddress: '123 Music Street, Party City, PC 12345',
      isActive: true,
      isPublic: true,
    },
  });

  const futureEvent = await prisma.djEvent.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Sunday Chill Session',
      description: 'Relaxed vibes with smooth beats and chill music',
      startDate: new Date(now.getTime() + 25 * 60 * 60 * 1000), // Tomorrow
      endDate: new Date(now.getTime() + 29 * 60 * 60 * 1000),
      venueName: 'Sunset Lounge',
      venueAddress: '456 Chill Avenue, Relax City, RC 67890',
      isActive: false,
      isPublic: true,
    },
  });

  console.log('✅ Created sample events');

  // Create sample song requests for the active event
  const sampleRequests = await Promise.all([
    prisma.songRequest.upsert({
      where: { djEventId_trackId: { djEventId: upcomingEvent.id, trackId: tracks[0].id } },
      update: {},
      create: {
        djEventId: upcomingEvent.id,
        trackId: tracks[0].id,
        requestedBy: 'Anonymous Music Lover',
        notes: 'Please play this early in the set!',
        priority: 1,
        requestedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      },
    }),
    prisma.songRequest.upsert({
      where: { djEventId_trackId: { djEventId: upcomingEvent.id, trackId: tracks[2].id } },
      update: {},
      create: {
        djEventId: upcomingEvent.id,
        trackId: tracks[2].id,
        requestedBy: 'Party Starter',
        notes: 'This always gets everyone dancing!',
        priority: 2,
        requestedAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
      },
    }),
  ]);

  // Create a played request
  const playedRequest = await prisma.songRequest.create({
    data: {
      djEventId: upcomingEvent.id,
      trackId: tracks[1].id,
      requestedBy: 'Early Bird',
      isPlayed: true,
      playedAt: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
      requestedAt: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
      djNotes: 'Great opener!',
    },
  });

  console.log(`✅ Created ${sampleRequests.length + 1} song requests`);

  // Create event statistics
  const eventStats = await prisma.eventStats.upsert({
    where: { djEventId: upcomingEvent.id },
    update: {},
    create: {
      djEventId: upcomingEvent.id,
      totalRequests: 3,
      totalUniqueRequesters: 3,
      totalSongsPlayed: 1,
      mostRequestedTrackId: tracks[0].id,
      firstRequestAt: new Date(now.getTime() - 60 * 60 * 1000),
      lastRequestAt: new Date(now.getTime() - 15 * 60 * 1000),
    },
  });

  console.log('✅ Created event statistics');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
