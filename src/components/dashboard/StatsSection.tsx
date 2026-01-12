"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Utensils, Coffee, Receipt, DollarSign } from "lucide-react";
import { FilterPeriod } from "@/app/(dashboard)/dashboard/DashboardClient";

interface StatsSectionProps {
  activeFilter: FilterPeriod;
  onFilterChange: (filter: FilterPeriod) => void;
  data: {
    totalOmset: number;
    dailyOmset: number;
    foodOmset: number;
    drinkOmset: number;
    orderCount: number;
    totalTrend: number;
    orderTrend: number;
    foodTrend: number;
    drinkTrend: number;
    chartPoints: number[];
  };
}

// PINDAHKAN KE SINI (DI LUAR StatsSection) agar tidak error ESLint
const TrendBadge = ({ value }: { value: number }) => {
  const isPos = value >= 0;
  return (
    <div className={`flex items-center gap-1 mt-1 text-[10px] font-bold ${isPos ? 'text-emerald-500' : 'text-rose-500'}`}>
      {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      <span>{isPos ? '+' : ''}{value.toFixed(1)}%</span>
    </div>
  );
};

export function StatsSection({ data, activeFilter, onFilterChange }: StatsSectionProps) {
  const isPositive = data.totalTrend >= 0;
  const periods: FilterPeriod[] = ["HARI_INI", "MINGGU_INI", "BULAN_INI"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end gap-2">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => onFilterChange(period)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === period ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {period.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden h-full border-none shadow-xl">
          <div className="z-10">
            <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Total Pendapatan</p>
            <h2 className="text-4xl font-bold mt-2 tracking-tight">Rp {data.totalOmset.toLocaleString("id-ID")}</h2>
            <div className={`flex items-center gap-1 mt-4 text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-bold">{isPositive ? '+' : ''}{data.totalTrend.toFixed(1)}%</span>
              <span className="text-slate-500 ml-1 font-normal">vs kemarin</span>
            </div>
          </div>
          <div className="mt-8 h-20 w-full flex items-end gap-1">
            {data.chartPoints.map((point, i) => (
              <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm transition-all hover:bg-emerald-500/40" style={{ height: `${Math.max((point / (Math.max(...data.chartPoints) || 1)) * 100, 10)}%` }} />
            ))}
          </div>
        </Card>

        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <Card className="p-5 flex items-center gap-4 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><DollarSign className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Omset Hari Ini</p>
              <p className="text-xl font-bold text-slate-800">Rp {data.dailyOmset.toLocaleString("id-ID")}</p>
              <TrendBadge value={data.totalTrend} />
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="p-3 bg-orange-50 rounded-2xl text-orange-600"><Receipt className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Total Orderan</p>
              <p className="text-xl font-bold text-slate-800">{data.orderCount} Transaksi</p>
              <TrendBadge value={data.orderTrend} />
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Utensils className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Makanan</p>
              <p className="text-xl font-bold text-slate-800">Rp {data.foodOmset.toLocaleString("id-ID")}</p>
              <TrendBadge value={data.foodTrend} />
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600"><Coffee className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Minuman</p>
              <p className="text-xl font-bold text-slate-800">Rp {data.drinkOmset.toLocaleString("id-ID")}</p>
              <TrendBadge value={data.drinkTrend} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}