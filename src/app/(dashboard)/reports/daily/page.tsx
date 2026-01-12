"use client";

import { useOrderHistory } from "@/features/order-history/useOrderHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, UtensilsCrossed, TrendingUp, Wallet, Banknote, CreditCard, QrCode } from "lucide-react";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DailyReportPage() {
  const { orders = [], loading } = useOrderHistory();

  // 1. State untuk Tanggal yang Dipilih
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 2. Filter data berdasarkan tanggal yang dipilih
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === selectedDate;
    });
  }, [orders, selectedDate]);

  // 3. Hitung Statistik (Revenue, Qty, dan Metode Pembayaran)
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

      // Hitung Metode Pembayaran
      if (order.paymentMethod === "CASH") cashTotal += (order.total || 0);
      else if (order.paymentMethod === "QRIS") qrisTotal += (order.total || 0);
      else if (order.paymentMethod === "BCA") bcaTotal += (order.total || 0);
      else if (order.paymentMethod === "DANA") danaTotal += (order.total || 0);

      order.items?.forEach((item) => {
        const itemTotal = (item.price || 0) * (item.qty || 0);
        if (item.categoryType === "FOOD") {
          foodRevenue += itemTotal;
          foodQty += (item.qty || 0); // Tambahkan kuantitas makanan
        } else if (item.categoryType === "DRINK") {
          drinkRevenue += itemTotal;
          drinkQty += (item.qty || 0); // Tambahkan kuantitas minuman
        }
      });
    });

    return {
      foodRevenue, drinkRevenue, totalRevenue,
      foodQty, drinkQty, count: filteredOrders.length,
      cashTotal, qrisTotal, bcaTotal, danaTotal
    };
  }, [filteredOrders]);

  // 4. Data untuk Grafik (24 Jam)
  const chartData = useMemo(() => {
    const hourly: Record<string, { name: string; Makanan: number; Minuman: number }> = {};
    for (let i = 0; i <= 23; i++) {
      const hour = `${i.toString().padStart(2, '0')}:00`;
      hourly[hour] = { name: hour, Makanan: 0, Minuman: 0 };
    }
    // Initialize hourly data
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

  if (loading) return <div className="p-8 italic text-muted-foreground">Menghitung omset...</div>;

  const cardHover = "transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default";

  return (
    <div className="lg:h-[calc(100vh-64px)] h-auto lg:overflow-hidden overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
      {/* Header dengan Filter Tanggal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0">        <div>
        <h1 className="text-3xl font-bold tracking-tight">Laporan Harian</h1>
        <p className="text-muted-foreground">Ringkasan performa penjualan harian.</p>
      </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Pilih Tanggal</label>
          <input
            type="date"
            className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Kartu Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <Card className={`border-l-4 border-l-orange-500 shadow-lg ${cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Omset Makanan</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {reportData.foodRevenue.toLocaleString("id-ID")}</div>
            <p className="text-xs mt-1 text-orange-600 font-medium">Total item: {reportData.foodQty}</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 border-l-blue-500 shadow-lg ${cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Omset Minuman</CardTitle>
            <Coffee className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {reportData.drinkRevenue.toLocaleString("id-ID")}</div>
            <p className="text-xs mt-1 text-blue-600 font-medium">Total item: {reportData.drinkQty}</p>
          </CardContent>
        </Card>

        <Card className={`bg-coffee-dark text-white shadow-xl ${cardHover}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-80">Total Omset</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-coffee-primary">
              Rp {reportData.totalRevenue.toLocaleString("id-ID")}
            </div>
            <p className="text-xs opacity-70 mt-1">Dari {reportData.count} transaksi sukses</p>
          </CardContent>
        </Card>
      </div>

      {/* Ringkasan Metode Pembayaran - Grid 4 Kolom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {/* Kartu CASH */}
        <div className={`p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col gap-1 ${cardHover}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Tunai</span>
            <Banknote size={16} className="text-emerald-500" />
          </div>
          <p className="text-lg font-bold text-slate-800">Rp {reportData.cashTotal.toLocaleString("id-ID")}</p>
          <div className="h-1 w-full bg-emerald-100 rounded-full mt-1">
            <div className="h-1 bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Kartu DANA */}
        <div className={`p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col gap-1 ${cardHover}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">DANA</span>
            <Wallet size={16} className="text-blue-500" />
          </div>
          <p className="text-lg font-bold text-slate-800">Rp {reportData.danaTotal.toLocaleString("id-ID")}</p>
          <div className="h-1 w-full bg-blue-100 rounded-full mt-1">
            <div className="h-1 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Kartu BCA */}
        <div className={`p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col gap-1 ${cardHover}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">BCA</span>
            <CreditCard size={16} className="text-indigo-700" />
          </div>
          <p className="text-lg font-bold text-slate-800">Rp {reportData.bcaTotal.toLocaleString("id-ID")}</p>
          <div className="h-1 w-full bg-indigo-100 rounded-full mt-1">
            <div className="h-1 bg-indigo-700 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Kartu QRIS */}
        <div className={`p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col gap-1 ${cardHover}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">QRIS</span>
            <QrCode size={16} className="text-rose-500" />
          </div>
          <p className="text-lg font-bold text-slate-800">Rp {reportData.qrisTotal.toLocaleString("id-ID")}</p>
          <div className="h-1 w-full bg-rose-100 rounded-full mt-1">
            <div className="h-1 bg-rose-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div className="flex-1 min-h-100 lg:min-h-0 w-full p-4 md:p-6 bg-white rounded-xl border shadow-sm relative flex flex-col">
        <h3 className="font-semibold mb-4 text-slate-800">Tren Penjualan Per Jam (Omset)</h3>

        <div className="w-full h-75 lg:h-full lg:flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
                tickFormatter={(val) => `Rp ${(val || 0) / 1000}k`}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
                formatter={(value: number | string | undefined) => {
                  if (value === undefined) return ["Rp 0", ""];
                  return [`Rp ${Number(value).toLocaleString("id-ID")}`, ""];
                }}
              />
              <Legend verticalAlign="top" align="right" height={36} />
              <Bar dataKey="Makanan" fill="#f97316" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="Minuman" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {filteredOrders.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded-xl backdrop-blur-[1px]">
            <p className="text-muted-foreground italic text-xs md:text-sm bg-white px-4 py-2 rounded-full border shadow-sm">
              Belum ada data penjualan pada tanggal ini
            </p>
          </div>
        )}
      </div>
    </div> // Penutup container utama
  ); // Penutup return
} // Penutup function DailyReportPage