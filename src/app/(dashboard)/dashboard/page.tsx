import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboarddd</h1>
    </div>
  );
}

