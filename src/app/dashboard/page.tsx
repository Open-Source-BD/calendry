import { CopyLinkButton } from "@/components/copy-link-button";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Clock, Users, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookingsList } from "./bookings-list";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: searchQuery } = await searchParams;
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Sync user
  let existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  const email = user.emailAddresses[0].emailAddress;
  const defaultUsername = email.split("@")[0];

  if (!existingUser) {
    await db.insert(users).values({
      id: userId,
      email: email,
      username: defaultUsername,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
    });
    existingUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });
  }

  const username = existingUser?.username || defaultUsername;

  let userEventTypes = await db.query.eventTypes.findMany({
    where: (et, { eq }) => eq(et.userId, userId),
  });

  let allBookings = await db.query.bookings.findMany({
    where: (b, { eq }) => eq(b.userId, userId),
    orderBy: (b, { desc }) => [desc(b.startTime)],
  });

  // Filter based on search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    userEventTypes = userEventTypes.filter(
      (et) =>
        et.name.toLowerCase().includes(query) ||
        (et.description && et.description.toLowerCase().includes(query)),
    );
    allBookings = allBookings.filter(
      (b) =>
        b.guestName.toLowerCase().includes(query) ||
        b.guestEmail.toLowerCase().includes(query) ||
        (b.guestNotes && b.guestNotes.toLowerCase().includes(query)),
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-normal text-[#1f1f1f]">
            Welcome to Calendra
          </h1>
        </div>
      </div>

      <div className="space-y-12">
        {/* Event Types Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-base font-medium text-[#444746]">
              Suggested Event Types
            </h2>
          </div>
          {userEventTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
              <p className="text-[#5f6368] mb-4">
                You haven&apos;t created any event types yet.
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/dashboard/events/new">
                  Create your first event
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userEventTypes.map((event) => (
                <div
                  key={event.id}
                  className="google-card p-6 flex flex-col h-full bg-white border border-gray-200"
                >
                  <div className="mb-6">
                    <div className="h-12 w-12 rounded-full bg-[#e8f1fe] flex items-center justify-center text-[#1a73e8]">
                      <Video size={24} />
                    </div>
                  </div>

                  <h3 className="text-xl font-medium text-[#1f1f1f] mb-1">
                    {event.name}
                  </h3>
                  <p className="text-sm text-[#5f6368] line-clamp-1 mb-4">
                    {event.description || "No description provided."}
                  </p>

                  <div className="flex items-center text-sm text-[#5f6368] mb-8">
                    <Clock className="mr-2 h-4 w-4" />
                    {event.duration} minutes
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-6 rounded-full text-[#1a73e8] hover:bg-[#f8f9fa] font-medium"
                      asChild
                    >
                      <Link href={`/dashboard/events/${event.id}`}>Edit</Link>
                    </Button>
                    <CopyLinkButton
                      url={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${username}/${event.slug}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bookings Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-[#1a73e8]" />
            <h2 className="text-lg font-medium text-[#1f1f1f]">
              Attendees & Bookings
            </h2>
          </div>

          {allBookings.length === 0 ? (
            <div className="p-12 text-center bg-white border border-dashed border-gray-300 rounded-2xl">
              <p className="text-[#5f6368]">
                No bookings found yet. Your scheduled meetings will appear here.
              </p>
            </div>
          ) : (
            <div className="google-card overflow-hidden">
              <BookingsList
                initialBookings={allBookings}
                eventTypes={userEventTypes.map((e) => ({
                  id: e.id,
                  name: e.name,
                }))}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
