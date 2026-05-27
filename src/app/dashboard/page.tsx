import { db } from "@/db";
import { users, bookings, eventTypes } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Clock, Video, Users } from "lucide-react";
import Link from "next/link";
import { CopyLinkButton } from "@/components/copy-link-button";
import { BookingsList } from "./bookings-list";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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

  const userEventTypes = await db.query.eventTypes.findMany({
    where: (et, { eq }) => eq(et.userId, userId),
  });

  const allBookings = await db.query.bookings.findMany({
    where: (b, { eq }) => eq(b.userId, userId),
    orderBy: (b, { desc }) => [desc(b.startTime)],
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and see who's joining.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/dashboard/events/new">
              <Plus className="mr-2 h-4 w-4" /> New Event Type
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Event Types Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Video className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Your Event Types</h2>
          </div>
          
          {userEventTypes.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center bg-white border-dashed">
              <p className="text-muted-foreground mb-4">You haven't created any event types yet.</p>
              <Button asChild variant="outline">
                <Link href="/dashboard/events/new">Create your first event</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userEventTypes.map((event) => (
                <Card key={event.id} className="relative overflow-hidden group shadow-sm">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{event.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Clock className="mr-2 h-4 w-4" />
                      {event.duration} minutes
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/dashboard/events/${event.id}`}>Edit</Link>
                      </Button>
                      <CopyLinkButton url={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${username}/${event.slug}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Bookings Section with Pagination and Modal Details */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Attendees & Bookings</h2>
          </div>

          {allBookings.length === 0 ? (
            <Card className="p-12 text-center bg-white border-dashed">
              <p className="text-muted-foreground">No bookings found yet. Your scheduled meetings will appear here.</p>
            </Card>
          ) : (
            <BookingsList 
              initialBookings={allBookings} 
              eventTypes={userEventTypes.map(e => ({ id: e.id, name: e.name }))} 
            />
          )}
        </section>
      </div>
    </div>
  );
}
