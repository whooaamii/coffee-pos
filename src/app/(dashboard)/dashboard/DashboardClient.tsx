"use client";

import { StatsSection } from "@/components/dashboard/StatsSection";
import { useMemo, useState } from "react";
import { type OrderItem } from "@/lib/db";
import { Prisma } from "@prisma/client";

interface OrderFromCloud {
  id: string;
  createdAt: Date | string;
  total: number;
  items: Prisma.JsonValue;
}

interface DashboardClientProps {
  initialOrders: OrderFromCloud[];
}

export type FilterPeriod = "HARI_INI" | "MINGGU_INI" | "BULAN_INI";

export default function DashboardClient({ initialOrders }: DashboardClientProps) {
  const [filter, setFilter] = useState<FilterPeriod>("HARI_INI");

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    const parseItems = (items: Prisma.JsonValue): OrderItem[] => {
      return (typeof items === 'string' ? JSON.parse(items) : items) as OrderItem[];
    };

    // --- LOGIKA HARI INI ---
    const todayOrders = initialOrders.filter(o => new Date(o.createdAt).toDateString() === todayStr);
    const dailyRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const dailyOrderCount = todayOrders.length;
    let dailyFood = 0;
    let dailyDrink = 0;

    todayOrders.forEach(order => {
      parseItems(order.items).forEach(item => {
        const sub = (item.price || 0) * (item.qty || 0);
        if (item.categoryType === "FOOD") dailyFood += sub;
        if (item.categoryType === "DRINK") dailyDrink += sub;
      });
    });

    // --- LOGIKA KEMARIN (UNTUK TREN) ---
    const yestOrders = initialOrders.filter(o => new Date(o.createdAt).toDateString() === yesterdayStr);
    const yestRevenue = yestOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const yestOrderCount = yestOrders.length;
    let yestFood = 0;
    let yestDrink = 0;

    yestOrders.forEach(order => {
      parseItems(order.items).forEach(item => {
        const sub = (item.price || 0) * (item.qty || 0);
        if (item.categoryType === "FOOD") yestFood += sub;
        if (item.categoryType === "DRINK") yestDrink += sub;
      });
    });

    const calculateTrend = (curr: number, prev: number): number => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    const chartPoints = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return initialOrders
        .filter(o => new Date(o.createdAt).toDateString() === d.toDateString())
        .reduce((sum, o) => sum + (o.total || 0), 0);
    });

    return {
      lifeTimeRevenue: initialOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      dailyRevenue,
      dailyFood,
      dailyDrink,
      dailyOrderCount,
      revenueTrend: calculateTrend(dailyRevenue, yestRevenue),
      orderTrend: calculateTrend(dailyOrderCount, yestOrderCount),
      foodTrend: calculateTrend(dailyFood, yestFood),
      drinkTrend: calculateTrend(dailyDrink, yestDrink),
      chartPoints
    };
  }, [initialOrders]);

  return (
    <div className="flex flex-col gap-8">
      <StatsSection 
        activeFilter={filter}
        onFilterChange={setFilter}
        data={{
          totalOmset: stats.lifeTimeRevenue,
          dailyOmset: stats.dailyRevenue,
          foodOmset: stats.dailyFood,
          drinkOmset: stats.dailyDrink,
          orderCount: stats.dailyOrderCount,
          totalTrend: stats.revenueTrend,
          orderTrend: stats.orderTrend,
          foodTrend: stats.foodTrend,
          drinkTrend: stats.drinkTrend,
          chartPoints: stats.chartPoints
        }} 
      />
    </div>
  );
}