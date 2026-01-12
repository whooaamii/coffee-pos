import { create } from "zustand";
import type { HoldOrder } from "./holdOrder.types";

type HoldOrderStore = {
  holds: HoldOrder[];

  addHold: (order: HoldOrder) => void;
  removeHold: (id: string) => void;
  getHold: (id: string) => HoldOrder | undefined;
  resumeHold: (id: string) => HoldOrder | undefined;

  mergeHolds: (ids: string[]) => HoldOrder;
  splitHold: (id: string, itemsGroups: HoldOrder["items"][]) => HoldOrder[];
};

export const useHoldOrderStore = create<HoldOrderStore>((set, get) => ({
  holds: [],

  addHold: (order) =>
    set((state) => ({
      holds: [...state.holds, order],
    })),

  removeHold: (id) =>
    set((state) => ({
      holds: state.holds.filter((h) => h.id !== id),
    })),

  getHold: (id) => get().holds.find((h) => h.id === id),

  mergeHolds: (ids) => {
    const holds = get().holds.filter((h) => ids.includes(h.id));

    const merged: HoldOrder = {
      id: crypto.randomUUID(),
      items: holds.flatMap((h) => h.items),
      customerName: holds.map((h) => h.customerName).join(" + "),
      orderType: holds[0].orderType,
      createdAt: new Date().toISOString(),
      mergedFrom: ids,
    };

    set((state) => ({
      holds: state.holds.filter((h) => !ids.includes(h.id)),
    }));

    return merged;
  },

  splitHold: (id, itemsGroups) => {
    const original = get().getHold(id);
    if (!original) return [];

    const splits = itemsGroups.map((items) => ({
      id: crypto.randomUUID(),
      items,
      customerName: original.customerName,
      orderType: original.orderType,
      createdAt: new Date().toISOString(),
      splitFrom: id,
    }));

    set((state) => ({
      holds: state.holds.filter((h) => h.id !== id),
    }));

    return splits;
  },

  resumeHold: (id) => {
    const hold = get().getHold(id);
    if (!hold) return undefined;

    set((state) => ({
      holds: state.holds.filter((h) => h.id !== id),
    }));

    return hold;
  },
}));
