import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { EditEventTypeForm } from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const eventType = await db.query.eventTypes.findFirst({
    where: (et, { eq, and }) => and(eq(et.id, id), eq(et.userId, userId)),
  });

  if (!eventType) {
    return notFound();
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-[#1f1f1f]">Edit Event Type</h1>
        <p className="text-sm text-[#5f6368]">Modify your meeting settings.</p>
      </div>

      <div className="google-card p-6">
        <EditEventTypeForm eventType={eventType} />
      </div>
    </div>
  );
}
