"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateEventType, deleteEventType } from "@/actions/event-types";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventType {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  slug: string;
  isActive: boolean;
}

export function EditEventTypeForm({ eventType }: { eventType: EventType }) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: eventType.name,
      description: eventType.description || "",
      duration: eventType.duration,
      slug: eventType.slug,
      isActive: eventType.isActive,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await updateEventType(eventType.id, values);
      toast.success("Event type updated!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  async function onDelete() {
    try {
      await deleteEventType(eventType.id);
      toast.success("Event type deleted");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event type");
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-[#f8f9fa]">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    Toggle if this event type is visible to others.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1f1f1f]">Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="30 Minute Meeting" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1f1f1f]">URL Slug</FormLabel>
                <FormControl>
                  <Input placeholder="30-min" {...field} />
                </FormControl>
                <FormDescription className="text-xs text-[#5f6368]">
                  This will be used in your booking URL: calendra.com/username/slug
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1f1f1f]">Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1f1f1f]">Description</FormLabel>
                <FormControl>
                  <Input placeholder="Brief description of the meeting" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col md:flex-row justify-between gap-4 pt-6 border-t border-gray-100">
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="rounded-full" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-full bg-[#1a73e8] hover:bg-[#1557b0]">
                Save Changes
              </Button>
            </div>

            <Dialog>
              <DialogTrigger render={
                <Button type="button" variant="ghost" className="rounded-full text-[#d93025] hover:bg-red-50 hover:text-[#d93025]" />
              }>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Event Type
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Event Type</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this event type? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-3 sm:justify-end">
                  <DialogTrigger render={<Button variant="outline" className="rounded-full" />}>
                    Cancel
                  </DialogTrigger>
                  <Button variant="destructive" className="rounded-full" onClick={onDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </Form>
    </div>
  );
}
