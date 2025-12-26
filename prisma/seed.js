import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const cashierPassword = await bcrypt.hash("kasir123", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Admin",
        email: "admin@coffee.com",
        password: adminPassword,
        role: "ADMIN",
      },
      {
        name: "Kasir",
        email: "kasir@coffee.com",
        password: cashierPassword,
        role: "CASHIER",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed user admin & kasir berhasil");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
