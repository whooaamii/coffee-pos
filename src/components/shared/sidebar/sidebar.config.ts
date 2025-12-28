import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  User
} from "lucide-react";

export type Role = "ADMIN" | "CASHIER";

export type SidebarItemConfig = {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: Role[];
};

export const sidebarConfig: SidebarItemConfig[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
    roles: ["ADMIN"],
  },
  {
    label: "POS",
    href: "/pos",
    icon: ShoppingCart,
    roles: ["ADMIN", "CASHIER"],
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];
