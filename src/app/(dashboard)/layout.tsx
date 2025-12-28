import { Sidebar } from "@/components/shared/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-background">
        {children}
      </main>
    </div>
  );
}
