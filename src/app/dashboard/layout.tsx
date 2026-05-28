import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { RightSidebar } from "@/components/right-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-[256px] lg:mr-[56px] min-h-[calc(100vh-64px)] p-2">
          <div className="bg-white rounded-[24px] min-h-[calc(100vh-80px)] shadow-sm overflow-hidden">
            {children}
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
