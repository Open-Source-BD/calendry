"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Mail, Calendar, Clock, MessageSquare, User, Video } from "lucide-react";

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestNotes: string | null;
  startTime: Date | number;
  endTime: Date | number;
  eventTypeId: string;
}

interface EventType {
  id: string;
  name: string;
}

export function BookingsList({ 
  initialBookings, 
  eventTypes 
}: { 
  initialBookings: any[], 
  eventTypes: EventType[] 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic
  const totalPages = Math.ceil(initialBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = initialBookings.slice(startIndex, startIndex + itemsPerPage);

  const getEventName = (id: string) => eventTypes.find(e => e.id === id)?.name || "Unknown Event";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {currentBookings.map((booking) => (
          <Dialog key={booking.id}>
            <DialogTrigger asChild>
              <Card className="shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-l-primary group">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                      {booking.guestName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{booking.guestName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-gray-500">
                          {getEventName(booking.eventTypeId)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right sm:text-left flex flex-col sm:items-end">
                    <div className="text-sm font-medium">
                      {format(new Date(booking.startTime), "MMM do, yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(booking.startTime), "h:mm a")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Booking Details
                </DialogTitle>
                <DialogDescription>
                  Full information for the scheduled meeting.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-lg">
                      <Video className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Event Type</p>
                      <p className="text-base font-semibold">{getEventName(booking.eventTypeId)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-lg">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Guest</p>
                      <p className="text-base font-semibold">{booking.guestName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-lg">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-base">{booking.guestEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-lg">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date</p>
                      <p className="text-base">{format(new Date(booking.startTime), "EEEE, MMMM do, yyyy")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-lg">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Time</p>
                      <p className="text-base">
                        {format(new Date(booking.startTime), "h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-lg">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Guest Notes</p>
                      <p className="text-base italic text-gray-600 bg-gray-50 p-3 rounded-md border mt-1">
                        {booking.guestNotes || "No notes provided by the guest."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Booking ID: {booking.id}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
