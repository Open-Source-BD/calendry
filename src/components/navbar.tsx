import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Calendar as CalendarIcon, LayoutDashboard, Clock } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg text-white group-hover:rotate-6 transition-transform">
              <CalendarIcon size={20} />
            </div>
            <span className="text-xl font-medium tracking-tight text-gray-900">
              Calendra
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link 
              href="/dashboard/availability" 
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Clock size={16} />
              Availability
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-1 rounded-full border border-gray-200">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
