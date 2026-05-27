import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn 
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
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
