import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { eventId } = await request.json();
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    // Update the event with a timestamp to trigger realtime
    const updatedEvent = await prisma.djEvent.update({
      where: { id: parseInt(eventId) },
      data: {
        updatedAt: new Date(),
        // Add a small description update to make the change more visible
        description: `Test update at ${new Date().toISOString()}`
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Event updated for realtime test',
      eventId: updatedEvent.id,
      updatedAt: updatedEvent.updatedAt
    });
  } catch (error) {
    console.error('Test realtime error:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}