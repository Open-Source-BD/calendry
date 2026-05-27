"use server";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import { nanoid } from "nanoid";
import { getGoogleCalendarClient } from "@/lib/google-calendar";
import { addMinutes } from "date-fns";
import { eq } from "drizzle-orm";

export async function createBookingAction(data: {
  eventTypeId: string;
  hostId: string;
  guestName: string;
  guestEmail: string;
  guestNotes?: string;
  startTime: string;
}) {
  const startTime = new Date(data.startTime);
  
  // Fetch event type for duration
  const eventType = await db.query.eventTypes.findFirst({
    where: (et, { eq }) => eq(et.id, data.eventTypeId),
  });

  if (!eventType) throw new Error("Event type not found");

  const endTime = addMinutes(startTime, eventType.duration);

  // 1. Create in local DB
  const bookingId = nanoid();
  await db.insert(bookings).values({
    id: bookingId,
    eventTypeId: data.eventTypeId,
    userId: data.hostId,
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    guestNotes: data.guestNotes,
    startTime: startTime,
    endTime: endTime,
  });

  // 2. Add to Google Calendar (Host's)
  const calendar = await getGoogleCalendarClient(data.hostId);
  if (calendar) {
    try {
      const response = await calendar.events.insert({
        calendarId: "primary",
        sendUpdates: "all", // This sends an email invitation to the guest
        requestBody: {
          summary: `${eventType.name}: ${data.guestName}`,
          description: `Meeting scheduled via Calendra.\n\nGuest: ${data.guestName} (${data.guestEmail})\nNotes: ${data.guestNotes || "None"}`,
          start: { 
            dateTime: startTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: { 
            dateTime: endTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          attendees: [
            { email: data.guestEmail, displayName: data.guestName }
          ],
          reminders: {
            useDefault: true,
          },
        },
      });

      if (response.data.id) {
        await db.update(bookings).set({ googleEventId: response.data.id }).where(eq(bookings.id, bookingId));
      }
    } catch (error) {
      console.error("Failed to add to Google Calendar", error);
    }
  }

  return { success: true };
}
