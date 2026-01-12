"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  categoryType: string;
}

interface CreateOrderParams {
  id: string;
  createdAt: string;
  total: number;
  paid: number;
  paymentMethod: string;
  customerName: string;
  orderType: string;
  items: OrderItem[];
}

export async function syncOrderToCloud(data: CreateOrderParams) {
  try {
    await prisma.order.create({
      data: {
        id: data.id,
        createdAt: new Date(data.createdAt),
        total: data.total,
        paid: data.paid,
        paymentMethod: data.paymentMethod,
        customerName: data.customerName,
        orderType: data.orderType,
        // Gunakan Prisma.InputJsonValue untuk memberitahu TS bahwa ini data input yang valid
        items: data.items as unknown as Prisma.InputJsonValue,
      },
    });

    revalidatePath("/");
    revalidatePath("/order");
    
    return { success: true };
  } catch (error) {
    console.error("Database Sync Error:", error);
    return { success: false };
  }
}

// Di actions.ts
export async function syncBulkOrders(orders: CreateOrderParams[]) {
  try {
    const results = await Promise.all(
      orders.map((order) =>
        prisma.order.upsert({
          where: { id: order.id },
          update: {}, // Jangan timpa jika sudah ada
          create: {
            id: order.id,
            customerName: order.customerName,
            total: order.total,
            paid: order.paid,
            paymentMethod: order.paymentMethod,
            orderType: order.orderType,
            items: order.items as unknown as Prisma.InputJsonValue,
            createdAt: new Date(order.createdAt),
          },
        })
      )
    );
    revalidatePath("/");
    return { success: true, count: results.length };
  } catch (error) {
    console.error("Bulk Sync Error:", error);
    return { success: false };
  }
}