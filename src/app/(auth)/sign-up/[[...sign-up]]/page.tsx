import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp 
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        // @ts-ignore
        additionalOAuthScopes={{
          google: [
            "https://www.googleapis.com/auth/calendar.readonly",
            "https://www.googleapis.com/auth/calendar.events"
          ]
        }}
      />
    </div>
  );
}
