"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, LogOut } from "lucide-react";
import { SIDEBAR_CONFIG } from "./sidebar.config";
import type { SidebarSectionType } from "./sidebar.config";
import { SidebarItem } from "./SidebarItem";
import { SidebarExpandable } from "./SidebarExpandable";
import { SidebarUser } from "./SidebarUser";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Role } from "@prisma/client";
import { useAuth } from "@/context/auth-context";

export function ProfilePage() {
  const { user, role } = useAuth();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Role: {role}</p>
    </div>
  );
}


function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");
    const handler = () => setIsTablet(media.matches);
    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return isTablet;
}

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const isTablet = useIsTablet();
  const collapsed = isTablet;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const filteredSections = SIDEBAR_CONFIG
    .map((section) => {
      const filteredItems = section.items.filter((item) => {
        // kalau tidak ada roles → semua boleh lihat
        if (!item.roles) return true;

        // ✅ FIX FINAL (NO STRING CONVERSION)
        return item.roles.includes(role);
      });

      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter((section) => section.items.length > 0);

  return (
    <motion.aside
      className={cn(
        "h-screen bg-zinc-900 text-slate-100 border-r border-white/5 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
          <Coffee className="h-5 w-5 text-emerald-400" />
        </div>

        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold">Padhe Coffee</h1>
            <p className="text-xs text-slate-300">Point of Sale</p>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {filteredSections.map((section: SidebarSectionType) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 px-3">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map((item) =>
                item.children ? (
                  <SidebarExpandable
                    key={item.label}
                    item={item}
                    collapsed={collapsed}
                    pathname={pathname}
                  />
                ) : (
                  <SidebarItem
                    key={item.label}
                    item={item}
                    collapsed={collapsed}
                    active={
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                    }
                  />
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* USER */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <SidebarUser collapsed={collapsed} />

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-white hover:bg-white/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Keluar"}
        </Button>
      </div>
    </motion.aside>
  );
}
