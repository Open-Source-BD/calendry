import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookingsList } from "../bookings-list";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userEventTypes = await db.query.eventTypes.findMany({
    where: (et, { eq }) => eq(et.userId, userId),
  });

  const allBookings = await db.query.bookings.findMany({
    where: (b, { eq }) => eq(b.userId, userId),
    orderBy: (b, { desc }) => [desc(b.startTime)],
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-[#1f1f1f]">My Bookings</h1>
        <p className="text-sm text-[#5f6368]">View and manage all your scheduled meetings.</p>
      </div>

      <div className="google-card overflow-hidden">
        {allBookings.length === 0 ? (
          <div className="p-12 text-center bg-white">
            <Users className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-[#5f6368]">No bookings found yet.</p>
          </div>
        ) : (
          <BookingsList 
            initialBookings={allBookings} 
            eventTypes={userEventTypes.map(e => ({ id: e.id, name: e.name }))} 
          />
        )}
      </div>
    </div>
  );
}
