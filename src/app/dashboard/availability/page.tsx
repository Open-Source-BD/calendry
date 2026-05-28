import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-[#1f1f1f]">Availability</h1>
        <p className="text-sm text-[#5f6368]">Set your weekly recurring schedule.</p>
      </div>

      <div className="google-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-[#1f1f1f]">Weekly Hours</h2>
          <p className="text-sm text-[#5f6368]">
            Configure the days and times you are available for bookings.
          </p>
        </div>
        <AvailabilityForm initialData={userAvailability} />
      </div>
    </div>
  );
}
