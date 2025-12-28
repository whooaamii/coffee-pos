"use client";

import { LogOut } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { sidebarConfig } from "./sidebar.config";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth";

type SidebarProps = {
  role: "ADMIN" | "CASHIER";
};

export function Sidebar({ role }: SidebarProps) {
  const filteredMenu =
  role === "ADMIN"
    ? sidebarConfig
    : sidebarConfig.filter(
        (item) => !item.roles || item.roles.includes(role)
      );


  return (
    <aside className="w-64 border-r bg-background flex flex-col">
      <div className="p-4 font-semibold text-lg">Coffee POS</div>

      <nav className="flex-1 px-3 space-y-1">
        {filteredMenu.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>

      <form action={logoutAction} className="p-4 border-t">
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </form>
    </aside>
  );
}
