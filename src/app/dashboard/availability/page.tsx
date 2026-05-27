import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailabilityForm } from "./availability-form";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userAvailability = await db.query.availability.findMany({
    where: (a, { eq }) => eq(a.userId, userId),
  });

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Availability</h1>
        <p className="text-muted-foreground">Set your weekly recurring schedule.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Hours</CardTitle>
          <CardDescription>
            Configure the days and times you are available for bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityForm initialData={userAvailability} />
        </CardContent>
      </Card>
    </div>
  );
}
