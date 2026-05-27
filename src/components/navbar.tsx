import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          Calendra
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
            Dashboard
          </Link>
          <Link href="/dashboard/availability" className="text-sm font-medium hover:text-primary">
            Availability
          </Link>
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
