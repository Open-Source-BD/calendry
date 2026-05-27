"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format, isSameDay, startOfDay } from "date-fns";
import { getAvailableSlotsAction } from "@/actions/availability-fetch";
import { createBookingAction } from "@/actions/bookings";
import { Loader2, ChevronLeft } from "lucide-react";

export function BookingForm({ eventType, hostId }: { eventType: any; hostId: string }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Details, 3: Success

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestNotes, setGuestNotes] = useState("");

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlots = async (date: Date) => {
    setIsLoading(true);
    console.log("Fetching slots for date:", date);
    try {
      const slots = await getAvailableSlotsAction(hostId, date.toISOString(), eventType.duration);
      console.log("Slots received:", slots.length);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Fetch slots error:", error);
      toast.error("Failed to fetch available slots");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;
    setIsLoading(true);
    try {
      await createBookingAction({
        eventTypeId: eventType.id,
        hostId,
        guestName,
        guestEmail,
        guestNotes,
        startTime: selectedSlot,
      });
      setStep(3);
      toast.success("Meeting booked successfully!");
    } catch (error) {
      toast.error("Failed to book meeting");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Confirmed!</h2>
        <p className="text-muted-foreground mb-6">
          You are scheduled with {eventType.name}. An invitation has been sent to your email.
        </p>
        <Button onClick={() => window.location.reload()}>Book another</Button>
      </div>
    );
  }

  return (
    <div>
      {step === 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">Select a Date</h3>
            <div className="flex justify-center lg:justify-start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border shadow"
                disabled={(date) => date < startOfDay(new Date())}
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {selectedDate ? format(selectedDate, "EEEE, MMMM do") : "Select a date"}
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? "default" : "outline"}
                    className="w-full"
                    onClick={() => {
                      setSelectedSlot(slot);
                      setStep(2);
                    }}
                  >
                    {format(new Date(slot), "h:mm a")}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-10">No available slots for this day.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <Button variant="ghost" size="sm" className="mb-4" onClick={() => setStep(1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h3 className="text-xl font-bold mb-6">Enter Details</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email *</Label>
              <Input
                id="email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={guestNotes}
                onChange={(e) => setGuestNotes(e.target.value)}
                placeholder="Anything else you'd like to share?"
              />
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleBooking}
              disabled={isLoading || !guestName || !guestEmail}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
