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
