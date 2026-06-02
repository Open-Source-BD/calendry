"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

export function ConnectGoogleButton() {
  const { user } = useUser();

  const handleConnect = async () => {
    if (!user) return;
    
    try {
      // Find the Google account among user's external accounts
      const googleAccount = user.externalAccounts.find(
        (acc) => acc.provider === "google"
      );

      if (googleAccount) {
        // In Clerk v5, we use reauthorize to request new scopes for an existing account
        await googleAccount.reauthorize({
          redirectUrl: "/dashboard",
          additionalScopes: [
            "https://www.googleapis.com/auth/calendar.readonly",
            "https://www.googleapis.com/auth/calendar.events"
          ],
        });
      } else {
        // Link a new Google account
        await user.createExternalAccount({
          strategy: "oauth_google",
          redirectUrl: "/dashboard",
          additionalScopes: [
            "https://www.googleapis.com/auth/calendar.readonly",
            "https://www.googleapis.com/auth/calendar.events"
          ],
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect Google Calendar");
    }
  };

  return (
    <Button variant="outline" onClick={handleConnect} className="w-full sm:w-auto">
      <Calendar className="mr-2 h-4 w-4" />
      Sync Google Calendar
    </Button>
  );
}
