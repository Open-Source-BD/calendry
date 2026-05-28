import { db } from "@/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TrashPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Sync user if needed
  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  const username = existingUser?.username || user.emailAddresses[0].emailAddress.split("@")[0];

  const deletedEvents = await db.query.eventTypes.findMany({
    where: (et, { eq, and }) => and(eq(et.userId, userId), eq(et.isDeleted, true)),
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-[#1f1f1f]">Trash</h1>
        <p className="text-sm text-[#5f6368]">Items in trash will be kept until permanently deleted.</p>
      </div>

      {deletedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
          <Trash2 className="h-12 w-12 text-gray-200 mb-4" />
          <p className="text-[#5f6368]">Your trash is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deletedEvents.map((event) => (
            <EventCard key={event.id} event={event} username={username} isTrashView={true} />
          ))}
        </div>
      )}
    </div>
  );
}
