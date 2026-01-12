import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const runtime = "nodejs";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  // Ambil data transaksi dari Prisma (Supabase)
  // Kita ambil data 30 hari terakhir agar grafik lebih lengkap
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: last30Days
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Kirim data ke Client Component
  return <DashboardClient initialOrders={orders} />;
}