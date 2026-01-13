"use client";

import { useOrderHistory } from "@/features/order-history/useOrderHistory";
import { Card, CardContent } from "@/components/ui/card";
import {
  Coffee,
  UtensilsCrossed,
  TrendingUp,
  Wallet,
  Banknote,
  CreditCard,
  QrCode,
  BarChart3,
  Calendar,
  LayoutDashboard
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { PremiumHeader } from "@/components/shared/header/PremiumHeader";
import { cn } from "@/lib/utils";

export default function DailyReportPage() {
  const { orders = [], loading } = useOrderHistory();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === selectedDate;
    });
  }, [orders, selectedDate]);

  const reportData = useMemo(() => {
    let foodRevenue = 0;
    let drinkRevenue = 0;
    let totalRevenue = 0;
    let foodQty = 0;
    let drinkQty = 0;
    let cashTotal = 0;
    let qrisTotal = 0;
    let bcaTotal = 0;
    let danaTotal = 0;

    filteredOrders.forEach((order) => {
      totalRevenue += (order.total || 0);

      if (order.paymentMethod === "CASH") cashTotal += (order.total || 0);
      else if (order.paymentMethod === "QRIS") qrisTotal += (order.total || 0);
      else if (order.paymentMethod === "BCA") bcaTotal += (order.total || 0);
      else if (order.paymentMethod === "DANA") danaTotal += (order.total || 0);

      order.items?.forEach((item) => {
        const itemTotal = (item.price || 0) * (item.qty || 0);
        if (item.categoryType === "FOOD") {
          foodRevenue += itemTotal;
          foodQty += (item.qty || 0);
        } else if (item.categoryType === "DRINK") {
          drinkRevenue += itemTotal;
          drinkQty += (item.qty || 0);
        }
      });
    });

    const getPercentage = (amount: number) => {
      return totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(0) : "0";
    };

    return {
      foodRevenue, drinkRevenue, totalRevenue,
      foodQty, drinkQty, count: filteredOrders.length,
      cashTotal, qrisTotal, bcaTotal, danaTotal,
      percentages: {
        cash: getPercentage(cashTotal),
        qris: getPercentage(qrisTotal),
        bca: getPercentage(bcaTotal),
        dana: getPercentage(danaTotal)
      }
    };
  }, [filteredOrders]);

  const chartData = useMemo(() => {
    const hourly: Record<string, { name: string; Makanan: number; Minuman: number }> = {};
    for (let i = 0; i <= 23; i++) {
      const hour = `${i.toString().padStart(2, '0')}:00`;
      hourly[hour] = { name: hour, Makanan: 0, Minuman: 0 };
    }
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const hour = `${date.getHours().toString().padStart(2, '0')}:00`;
      if (hourly[hour]) {
        order.items?.forEach(item => {
          if (item.categoryType === "FOOD") hourly[hour].Makanan += (item.price * item.qty);
          if (item.categoryType === "DRINK") hourly[hour].Minuman += (item.price * item.qty);
        });
      }
    });
    return Object.values(hourly);
  }, [filteredOrders]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] gap-4">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mengkalkulasi Laporan...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] gap-4 animate-in fade-in duration-700 overflow-hidden pr-2">
      {/* 1. PREMIUM HEADER */}
      <div className="shrink-0">
        <PremiumHeader
          title="LAPORAN HARIAN"
          subtitle="RINGKASAN PERFORMA PENJUALAN REAL-TIME"
          icon={BarChart3}
          actions={
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white shadow-sm">
              <Calendar size={16} className="text-cyan-600" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase leading-none tracking-tighter">Pilih Tanggal</span>
                <input
                  type="date"
                  className="bg-transparent border-none p-0 text-[11px] font-bold text-slate-700 outline-none focus:ring-0 cursor-pointer"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          }
        />
      </div>

      {/* 2. MAIN STATISTICS CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <Card className="rounded-4xl border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden group hover:shadow-orange-100 transition-all duration-500">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <UtensilsCrossed size={80} className="text-orange-600" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Omset Makanan</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              Rp {reportData.foodRevenue.toLocaleString("id-ID")}
            </h3>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-[10px] font-bold text-orange-600 border border-orange-100/50">
              {reportData.foodQty} Item Terjual
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-4xl border-none shadow-xl shadow-slate-200/50 bg-white overflow-hidden group hover:shadow-cyan-100 transition-all duration-500">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Coffee size={80} className="text-cyan-600" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Omset Minuman</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              Rp {reportData.drinkRevenue.toLocaleString("id-ID")}
            </h3>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 text-[10px] font-bold text-cyan-600 border border-cyan-100/50">
              {reportData.drinkQty} Item Terjual
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-4xl border-none shadow-2xl shadow-cyan-200/30 bg-slate-900 overflow-hidden group transition-all duration-500">
          <CardContent className="p-6 relative">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-600/20 to-transparent opacity-50" />
            <p className="text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.15em] mb-1 relative z-10">Total Omset Bersih</p>
            <h3 className="text-2xl font-black text-white tracking-tight relative z-10">
              Rp {reportData.totalRevenue.toLocaleString("id-ID")}
            </h3>
            <div className="mt-3 inline-flex items-center gap-2 relative z-10">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reportData.count} Transaksi Sukses</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. PAYMENT METHODS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {[
          { label: 'Tunai', value: reportData.cashTotal, percent: reportData.percentages.cash, icon: Banknote, color: 'emerald' },
          { label: 'DANA', value: reportData.danaTotal, percent: reportData.percentages.dana, icon: Wallet, color: 'blue' },
          { label: 'BCA', value: reportData.bcaTotal, percent: reportData.percentages.bca, icon: CreditCard, color: 'indigo' },
          { label: 'QRIS', value: reportData.qrisTotal, percent: reportData.percentages.qris, icon: QrCode, color: 'rose' },
        ].map((pm) => (
          <div key={pm.label} className="bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-white shadow-sm flex items-center gap-4 group hover:bg-white transition-all duration-300">
            <div className={cn("p-2.5 rounded-xl transition-colors", {
              'bg-emerald-50 text-emerald-600': pm.color === 'emerald',
              'bg-blue-50 text-blue-600': pm.color === 'blue',
              'bg-indigo-50 text-indigo-600': pm.color === 'indigo',
              'bg-rose-50 text-rose-600': pm.color === 'rose',
            })}>
              <pm.icon size={18} />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{pm.label}</span>
                {/* Badge Persentase */}
                <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded-md", {
                  'bg-emerald-100 text-emerald-700': pm.color === 'emerald',
                  'bg-blue-100 text-blue-700': pm.color === 'blue',
                  'bg-indigo-100 text-indigo-700': pm.color === 'indigo',
                  'bg-rose-100 text-rose-700': pm.color === 'rose',
                })}>
                  {pm.percent}%
                </span>
              </div>
              <span className="text-[13px] font-black text-slate-700 tracking-tight">Rp {pm.value.toLocaleString("id-ID")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. LUXURY AREA CHART AREA */}
      <div className="flex-1 min-h-0 bg-white rounded-4xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col p-8 relative group">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
              <LayoutDashboard size={18} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Tren Penjualan Per Jam</h3>
          </div>
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" /> <span className="text-slate-500">Makanan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" /> <span className="text-slate-500">Minuman</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMakanan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMinuman" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                fontFamily="inherit"
                fontWeight={800}
                tick={{ fill: '#cbd5e1' }}
                interval={1}
              />
              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                fontFamily="inherit"
                fontWeight={800}
                tick={{ fill: '#cbd5e1' }}
                domain={[0, 1000000]}
                ticks={[0, 200000, 400000, 600000, 800000, 1000000]}
                tickFormatter={(val) => `Rp ${val / 1000}k`}
                width={90}
              />
              <Tooltip
                cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '6 6' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-50 flex flex-col gap-2 min-w-35">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-1">{label} WIB</p>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-[10px] font-bold text-slate-600 uppercase">{entry.name}</span>
                            </div>
                            <span className="text-[11px] font-black text-slate-800">Rp {Number(entry.value).toLocaleString("id-ID")}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="Makanan"
                stroke="#f97316"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorMakanan)"
                animationDuration={2000}
              />
              <Area
                type="monotone"
                dataKey="Minuman"
                stroke="#06b6d4"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorMinuman)"
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {filteredOrders.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] z-10">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center gap-2 scale-90">
              <LayoutDashboard size={24} className="text-slate-300" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Belum ada data penjualan<br />untuk tanggal ini
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.3em] shrink-0 pt-2 pb-1">
        2026 Padhe Coffee POS System • Arsitektur Global Store v2.0
      </p>
    </div>
  );
}