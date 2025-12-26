import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function POSPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "CASHIER") {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">POS Screen</h1>
    </div>
  );
}
