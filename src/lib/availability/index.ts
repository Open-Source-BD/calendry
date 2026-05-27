import { db } from "@/db";
import { availability as availabilityTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { addMinutes, format, isAfter, isBefore, parse, set, startOfDay, endOfDay } from "date-fns";

export async function getAvailableSlots(userId: string, date: Date, duration: number, busySlots: { start?: string | null; end?: string | null }[]) {
  const dayOfWeek = format(date, "eeee").toLowerCase() as "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

  const dayAvailability = await db.query.availability.findFirst({
    where: (a, { eq, and }) => and(eq(a.userId, userId), eq(a.day, dayOfWeek), eq(a.isActive, true)),
  });

  console.log(`Availability for ${dayOfWeek}:`, dayAvailability);

  if (!dayAvailability) {
    return [];
  }

  const slots: Date[] = [];
  const [startHour, startMinute] = dayAvailability.startTime.split(":").map(Number);
  const [endHour, endMinute] = dayAvailability.endTime.split(":").map(Number);

  let currentSlot = set(date, { hours: startHour, minutes: startMinute, seconds: 0, milliseconds: 0 });
  const dayEnd = set(date, { hours: endHour, minutes: endMinute, seconds: 0, milliseconds: 0 });

  while (isBefore(currentSlot, dayEnd)) {
    const slotEnd = addMinutes(currentSlot, duration);
    
    if (isAfter(slotEnd, dayEnd)) break;

    const isBusy = busySlots.some((busy) => {
      const busyStart = new Date(busy.start!).getTime();
      const busyEnd = new Date(busy.end!).getTime();
      const slotStart = currentSlot.getTime();
      const slotEndTs = slotEnd.getTime();
      
      // Overlap logic: 
      // A slot is busy if it starts before a busy period ends AND ends after a busy period starts
      return slotStart < busyEnd && slotEndTs > busyStart;
    });

    if (!isBusy) {
      slots.push(new Date(currentSlot));
    }

    currentSlot = addMinutes(currentSlot, duration);
  }

  console.log(`Generated ${slots.length} slots for ${dayOfWeek}`);
  return slots;
}
