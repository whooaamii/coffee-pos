import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: "Nama kategori wajib diisi" },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: { name },
  });

  return NextResponse.json(category);
}
