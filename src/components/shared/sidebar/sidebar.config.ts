import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  ShoppingCart,
  History,
  FileText,
  User,
  Settings,
  CreditCard,
  Printer,
  Dot,
} from "lucide-react";
import type { Role } from "@prisma/client";

/* ======================
   TYPES
====================== */

export type SidebarItemType = {
  label: string;
  href?: string;
  icon: LucideIcon;
  roles?: Role[]; // ✅ ARRAY
  children?: SidebarItemType[];
};

export type SidebarSectionType = {
  title: string;
  items: SidebarItemType[];
};

/* ======================
   CONFIG (MATCH ROUTES)
====================== */

export const SIDEBAR_CONFIG: SidebarSectionType[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["ADMIN", "CASHIER"], // ✅ FIX
      },
    ],
  },

  {
    title: "DATA",
    items: [
      {
        label: "Kategori",
        href: "/categories",
        icon: FolderKanban,
        roles: ["ADMIN"], // ✅ ADMIN only
      },
      {
        label: "Produk",
        href: "/products",
        icon: Package,
        roles: ["ADMIN"],
      },
    ],
  },

  {
    title: "TRANSAKSI",
    items: [
      {
        label: "POS",
        href: "/pos",
        icon: ShoppingCart,
        roles: ["ADMIN", "CASHIER"],
      },
      {
        label: "Riwayat Transaksi",
        href: "/transactions",
        icon: History,
        roles: ["ADMIN", "CASHIER"],
      },
    ],
  },

  {
    title: "LAPORAN",
    items: [
      {
        label: "Laporan",
        icon: FileText,
        roles: ["ADMIN"],
        children: [
          {
            label: "Harian",
            href: "/reports/daily",
            icon: Dot,
            roles: ["ADMIN"],
          },
          {
            label: "Bulanan",
            href: "/reports/monthly",
            icon: Dot,
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },

  {
    title: "USER & SETTINGS",
    items: [
      {
        label: "User",
        href: "/user",
        icon: User,
        roles: ["ADMIN"],
      },
      {
        label: "Settings",
        icon: Settings,
        roles: ["ADMIN"],
        children: [
          {
            label: "Payment",
            href: "/settings/payment",
            icon: CreditCard,
            roles: ["ADMIN"],
          },
          {
            label: "Printer",
            href: "/settings/printer",
            icon: Printer,
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },
];
