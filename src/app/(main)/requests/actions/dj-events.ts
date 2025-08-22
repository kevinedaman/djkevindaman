'use server';

import { prisma } from '../../../../lib/prisma';
import { isAfter, isBefore, subHours } from 'date-fns';
import { revalidatePath } from 'next/cache';
import type { Prisma } from '../../../../generated/prisma';

// Use Prisma-generated types
export type DjEventWithStats = Prisma.DjEventGetPayload<{
  include: {
    _count: {
      select: {
        songRequests: true;
      };
    };
  };
}>;

export type ActiveEventInfo = DjEventWithStats & {
  canAcceptRequests: boolean;
  requestsOpenAt: Date;
  requestsCloseAt: Date;
};

/**
 * Get all public DJ events with request counts
 */
export async function getAllPublicEvents(): Promise<DjEventWithStats[]> {
  try {
    const events = await prisma.djEvent.findMany({
      where: {
        isPublic: true,
      },
      include: {
        _count: {
          select: {
            songRequests: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    return events;
  } catch (error) {
    console.error('Error fetching public events:', error);
    throw new Error('Failed to fetch events');
  }
}

/**
 * Get currently active events (within request window)
 */
export async function getActiveEvents(): Promise<ActiveEventInfo[]> {
  try {
    const now = new Date();

    const events = await prisma.djEvent.findMany({
      where: {
        isPublic: true,
        AND: [
          {
            // Request window opens 1 hour before start
            startDate: {
              lte: new Date(now.getTime() + 60 * 60 * 1000), // now + 1 hour
            },
          },
          {
            // Request window closes when event ends
            endDate: {
              gte: now,
            },
          },
        ],
      },
      include: {
        _count: {
          select: {
            songRequests: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    // Add request window information
    return events.map((event: DjEventWithStats) => {
      const requestsOpenAt = subHours(new Date(event.startDate), 1);
      const requestsCloseAt = new Date(event.endDate);
      const canAcceptRequests = isAfter(now, requestsOpenAt) && isBefore(now, requestsCloseAt);

      return {
        ...event,
        canAcceptRequests,
        requestsOpenAt,
        requestsCloseAt,
      };
    });
  } catch (error) {
    console.error('Error fetching active events:', error);
    throw new Error('Failed to fetch active events');
  }
}

/**
 * Get a specific event by ID with detailed info
 */
export async function getEventById(eventId: number): Promise<ActiveEventInfo | null> {
  try {
    const event = await prisma.djEvent.findUnique({
      where: {
        id: eventId,
      },
      include: {
        _count: {
          select: {
            songRequests: true,
          },
        },
      },
    });

    if (!event) {
      return null;
    }

    const now = new Date();
    const requestsOpenAt = subHours(new Date(event.startDate), 1);
    const requestsCloseAt = new Date(event.endDate);
    const canAcceptRequests = isAfter(now, requestsOpenAt) && isBefore(now, requestsCloseAt);

    return {
      ...event,
      canAcceptRequests,
      requestsOpenAt,
      requestsCloseAt,
    };
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw new Error('Failed to fetch event');
  }
}

/**
 * Create a new DJ event (admin only - for future use)
 */
export async function createDjEvent(data: Prisma.DjEventCreateInput): Promise<DjEventWithStats> {
  try {
    const event = await prisma.djEvent.create({
      data: {
        ...data,
        isPublic: data.isPublic ?? true,
      },
      include: {
        _count: {
          select: {
            songRequests: true,
          },
        },
      },
    });

    revalidatePath('/requests');
    return event;
  } catch (error) {
    console.error('Error creating DJ event:', error);
    throw new Error('Failed to create event');
  }
}

/**
 * Update event status (admin only - for future use)
 */
export async function updateEventStatus(
  eventId: number,
  updates: Prisma.DjEventUpdateInput,
): Promise<DjEventWithStats> {
  try {
    const event = await prisma.djEvent.update({
      where: {
        id: eventId,
      },
      data: updates,
      include: {
        _count: {
          select: {
            songRequests: true,
          },
        },
      },
    });

    revalidatePath('/requests');
    revalidatePath(`/requests/${eventId}`);

    return event;
  } catch (error) {
    console.error('Error updating event status:', error);
    throw new Error('Failed to update event');
  }
}

/**
 * Get upcoming events (events that haven't started yet)
 */
export async function getUpcomingEvents(): Promise<DjEventWithStats[]> {
  try {
    const now = new Date();

    const events = await prisma.djEvent.findMany({
      where: {
        isPublic: true,
        startDate: {
          gt: now,
        },
      },
      include: {
        _count: {
          select: {
            songRequests: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 10, // Limit to next 10 events
    });

    return events;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw new Error('Failed to fetch upcoming events');
  }
}
