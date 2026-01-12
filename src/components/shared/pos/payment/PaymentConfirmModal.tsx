"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import type { PaymentMethod } from "./payment.types";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useReceiptStore } from "@/store/useReceiptStore";
import { generateOrderId } from "@/lib/generateOrderId";
import { saveOrder } from "@/lib/db";
import { syncOrderToCloud } from "@/app/(dashboard)/order/actions";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  method: PaymentMethod;
};

export function PaymentConfirmModal({ open, onClose, onSuccess, method }: Props) {
  const subtotal = useCartStore((s) => s.getSubtotal());
  const items = useCartStore((s) => s.items);
  const orderType = useCartStore((s) => s.orderType);
  const customerName = useCartStore((s) => s.customerName);
  const setReceipt = useReceiptStore((s) => s.setReceipt);

  const [cashReceived, setCashReceived] = useState<number | "">("");
  const [isProcessing, setIsProcessing] = useState(false); // Tambahkan state loading

  const paidAmount = typeof cashReceived === "number" ? cashReceived : subtotal;
  const change = typeof cashReceived === "number" ? cashReceived - subtotal : 0;
  const isCashEnough = typeof cashReceived === "number" && cashReceived >= subtotal;

  const snapshotCustomerName = customerName && customerName.trim() !== "" ? customerName : "Guest";

  async function onConfirm() {
    if (isProcessing) return;
    setIsProcessing(true);

    const orderId = generateOrderId("POS-");
    const createdAt = new Date().toISOString();

    const formattedItems = items.map((i) => ({
      name: i.name,
      qty: i.qty,
      price: i.price,
      categoryType: i.categoryType,
    }));

    const orderData = {
      id: orderId,
      createdAt,
      total: subtotal,
      paid: paidAmount,
      paymentMethod: method,
      customerName: snapshotCustomerName,
      orderType: orderType as "Dine In" | "Take Away",
      items: formattedItems,
    };

    // 1. Update UI Struk Segera
    setReceipt({
      orderId: orderId,
      createdAt,
      items: formattedItems,
      subtotal: subtotal,
      tax: 0,
      charge: 0,
      total: subtotal,
      paid: paidAmount,
      change: paidAmount - subtotal,
      customerName: snapshotCustomerName,
      cashierName: "Revangga",
      orderType,
      paymentMethod: method,
    });

    let syncSuccess = false;

    // 2. Coba kirim ke Cloud TERLEBIH DAHULU
    try {
      // Pastikan syncOrderToCloud benar-benar await proses upload
      await syncOrderToCloud(orderData);
      syncSuccess = true;
      console.log("Cloud Sync Success!");
    } catch (err) {
      console.error("Cloud Sync Failed, saving to local as pending", err);
      syncSuccess = false;
    }

    // 3. Simpan ke IndexedDB dengan status isSynced yang akurat
    // Jika Cloud Berhasil (syncSuccess = true), icon di Header akan langsung Hijau (0)
    // Jika Cloud Gagal (syncSuccess = false), icon di Header akan Oranye (1)
    await saveOrder({
      ...orderData,
      isSynced: syncSuccess
    });

    setIsProcessing(false);
    onClose();
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
        </DialogHeader>

        {method === "CASH" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Uang Diterima</p>
              <Input
                type="number"
                placeholder="Masukkan nominal"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value ? Number(e.target.value) : "")}
                autoFocus
                disabled={isProcessing}
              />
            </div>
            {typeof cashReceived === "number" && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400">Kembalian</p>
                <p className={cn("text-lg font-bold", change < 0 ? "text-red-500" : "text-green-600")}>
                  Rp {Math.max(change, 0).toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          className="w-full h-12"
          disabled={(method === "CASH" && !isCashEnough) || isProcessing}
          onClick={onConfirm}
        >
          {isProcessing ? "Memproses..." : "Konfirmasi & Cetak"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}