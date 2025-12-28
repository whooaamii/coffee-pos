import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-current-user";
import { AuthProvider } from "@/context/auth-context";
import { Sidebar } from "@/components/shared/sidebar/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AuthProvider user={user}>
      <div className="flex h-screen">
        <Sidebar role={user.role} />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
