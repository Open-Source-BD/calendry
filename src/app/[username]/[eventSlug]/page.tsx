import { db } from "@/db";
import { notFound } from "next/navigation";
import { BookingForm } from "./booking-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublicBookingPage({
  params,
}: {
  params: Promise<{ username: string; eventSlug: string }>;
}) {
  const { username, eventSlug } = await params;

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.username, username),
  });

  if (!user) {
    return notFound();
  }

  const eventType = await db.query.eventTypes.findFirst({
    where: (et, { eq, and }) => and(eq(et.userId, user.id), eq(et.slug, eventSlug), eq(et.isActive, true)),
  });

  if (!eventType) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3">
        <div className="p-8 border-r bg-white rounded-l-lg">
          <Avatar className="h-16 w-16 mb-4">
            <AvatarImage src={user.imageUrl || ""} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-sm font-medium text-muted-foreground mb-1">{user.name}</h2>
          <h1 className="text-2xl font-bold mb-4">{eventType.name}</h1>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Clock className="mr-2 h-4 w-4" />
            {eventType.duration} minutes
          </div>
          <p className="text-sm text-muted-foreground">
            {eventType.description || "Welcome to my scheduling page. Please select a time that works for you."}
          </p>
        </div>
        <div className="md:col-span-2 p-8">
          <BookingForm eventType={eventType} hostId={user.id} />
        </div>
      </Card>
    </div>
  );
}
