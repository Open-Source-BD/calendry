"use client";

import { Calendar, Lightbulb, CheckSquare, UserCircle, Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tools = [
  { icon: Calendar, color: "text-blue-600", name: "Google Calendar", href: "https://calendar.google.com" },
  { icon: Lightbulb, color: "text-yellow-500", name: "Keep", href: "https://keep.google.com" },
  { icon: CheckSquare, color: "text-blue-500", name: "Tasks", href: "https://tasks.google.com" },
  { icon: UserCircle, color: "text-blue-400", name: "Contacts", href: "https://contacts.google.com" },
];

export function RightSidebar() {
  const handleToolClick = (name: string) => {
    toast.info(`${name} integration coming soon!`);
  };

  return (
    <aside className="w-[56px] h-[calc(100vh-64px)] fixed right-0 top-16 bg-[#f8f9fa] border-l border-gray-200 hidden lg:flex flex-col items-center py-4 gap-6">
      <div className="flex flex-col items-center gap-6 flex-1">
        {tools.map((tool, index) => (
          <a
            key={index}
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "p-2 hover:bg-gray-200 rounded-full transition-colors",
              tool.color
            )}
            title={tool.name}
          >
            <tool.icon size={20} />
          </a>
        ))}
        
        <div className="w-5 border-t border-gray-300" />
        
        <button 
          onClick={() => handleToolClick("Add-ons")}
          className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <button 
        onClick={() => handleToolClick("Side panel")}
        className="mt-auto p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </aside>
  );
}
