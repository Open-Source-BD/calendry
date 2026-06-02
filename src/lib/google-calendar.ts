import { google } from "googleapis";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getGoogleCalendarClient(targetUserId?: string) {
  let userId = targetUserId;

  if (!userId) {
    const { userId: authUserId } = await auth();
    userId = authUserId || undefined;
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const client = await clerkClient();
  const token = await client.users.getUserOauthAccessToken(
    userId,
    "oauth_google"
  );

  if (token.data.length === 0 || !token.data[0].token) {
    // If it's a target user and they haven't connected Google, we just return null or handle gracefully
    if (targetUserId) return null;
    throw new Error("No Google access token found. Please sign in with Google.");
  }

  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: token.data[0].token });

  return google.calendar({ version: "v3", auth: authClient });
}

export async function getBusySlots(userId: string, start: Date, end: Date) {
  const calendar = await getGoogleCalendarClient(userId);

  if (!calendar) return [];

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: "primary" }],
      },
    });

    return response.data.calendars?.primary?.busy || [];
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error) {
      const err = error as { code?: number; message?: string };
      if (err.code === 403 || err.message?.includes("insufficient authentication scopes")) {
        console.error("Insufficient Google Scopes. Please ensure 'https://www.googleapis.com/auth/calendar.readonly' is enabled in Clerk.");
      }
    }
    throw error;
  }
}
