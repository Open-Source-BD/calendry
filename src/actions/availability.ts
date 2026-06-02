"use server";

import { db } from "@/db";
import { availability } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function updateAvailability(data: {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  startTime: string;
  endTime: string;
  isActive: boolean;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await db.query.availability.findFirst({
    where: (a, { eq, and }) => and(eq(a.userId, userId), eq(a.day, data.day)),
  });

  if (existing) {
    await db
      .update(availability)
      .set({
        startTime: data.startTime,
        endTime: data.endTime,
        isActive: data.isActive,
      })
      .where(eq(availability.id, existing.id));
  } else {
    await db.insert(availability).values({
      id: nanoid(),
      userId,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive,
    });
  }

  revalidatePath("/dashboard/availability");
}
