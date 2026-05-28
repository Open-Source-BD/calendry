import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 h-16 flex items-center border-b border-gray-100">
        <Link className="flex items-center gap-2" href="/">
          <div className="bg-[#1a73e8] p-1.5 rounded-lg text-white">
            <CalendarIcon size={20} />
          </div>
          <span className="text-[22px] font-normal text-[#5f6368]">Calendra</span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link className="text-sm font-medium text-[#5f6368] hover:text-[#1a73e8] transition-colors" href="/sign-in">
            Sign In
          </Link>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-[#1f1f1f]">
                  Scheduling made simple
                </h1>
                <p className="mx-auto max-w-[600px] text-[#5f6368] text-lg md:text-xl font-light">
                  Calendra helps you schedule meetings without the back-and-forth emails. Connect your calendar and let people book time with you.
                </p>
              </div>
              <div className="flex gap-4">
                <Button asChild size="lg" className="rounded-full bg-[#1a73e8] hover:bg-[#1557b0] px-8">
                  <Link href="/dashboard">Try Calendra for free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-6 border-t border-gray-100">
        <p className="text-sm text-[#5f6368]">© 2026 Calendra. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-6">
          <Link className="text-sm text-[#5f6368] hover:underline underline-offset-4" href="#">
            Terms
          </Link>
          <Link className="text-sm text-[#5f6368] hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
