"use server";

import { db } from "@/db";
import { eventTypes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function createEventType(values: {
  name: string;
  description?: string;
  duration: number;
  slug: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.insert(eventTypes).values({
    id: nanoid(),
    userId,
    name: values.name,
    description: values.description,
    duration: values.duration,
    slug: values.slug,
  });

  revalidatePath("/dashboard");
}

export async function updateEventType(id: string, values: {
  name: string;
  description?: string;
  duration: number;
  slug: string;
  isActive: boolean;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.update(eventTypes)
    .set({
      name: values.name,
      description: values.description,
      duration: values.duration,
      slug: values.slug,
      isActive: values.isActive,
    })
    .where((et, { eq, and }) => and(eq(et.id, id), eq(et.userId, userId)));

  revalidatePath("/dashboard");
}

export async function deleteEventType(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Soft delete
  await db.update(eventTypes)
    .set({ isDeleted: true })
    .where((et, { eq, and }) => and(eq(et.id, id), eq(et.userId, userId)));

  revalidatePath("/dashboard");
}

export async function toggleStarEventType(id: string, isStarred: boolean) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.update(eventTypes)
    .set({ isStarred })
    .where((et, { eq, and }) => and(eq(et.id, id), eq(et.userId, userId)));

  revalidatePath("/dashboard");
}

export async function restoreEventType(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.update(eventTypes)
    .set({ isDeleted: false })
    .where((et, { eq, and }) => and(eq(et.id, id), eq(et.userId, userId)));

  revalidatePath("/dashboard");
}

export async function permanentlyDeleteEventType(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.delete(eventTypes)
    .where((et, { eq, and }) => and(eq(et.id, id), eq(et.userId, userId)));

  revalidatePath("/dashboard");
}
