"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateAvailability } from "@/actions/availability";
import { toast } from "sonner";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

interface AvailabilityRowProps {
  day: (typeof DAYS)[number];
  initialData?: {
    startTime: string;
    endTime: string;
    isActive: boolean;
  };
}

function AvailabilityRow({ day, initialData }: AvailabilityRowProps) {
  const [isActive, setIsActive] = useState(initialData?.isActive ?? (day !== "saturday" && day !== "sunday"));
  const [startTime, setStartTime] = useState(initialData?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(initialData?.endTime ?? "17:00");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateAvailability({
        day,
        startTime,
        endTime,
        isActive,
      });
      toast.success(`${day.charAt(0).toUpperCase() + day.slice(1)} updated`);
    } catch (error) {
      toast.error("Failed to update availability");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0">
      <div className="flex items-center gap-4 w-32">
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <span className="capitalize font-medium">{day}</span>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          disabled={!isActive}
          className="w-32"
        />
        <span>-</span>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          disabled={!isActive}
          className="w-32"
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

export function AvailabilityForm({ initialData }: { initialData: any[] }) {
  return (
    <div className="flex flex-col">
      {DAYS.map((day) => {
        const data = initialData.find((d) => d.day === day);
        return <AvailabilityRow key={day} day={day} initialData={data} />;
      })}
    </div>
  );
}
