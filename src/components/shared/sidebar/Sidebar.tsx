"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, LogOut, ChevronLeft, ChevronRight } from "lucide-react"; import { SIDEBAR_CONFIG } from "./sidebar.config";
import type { SidebarSectionType } from "./sidebar.config";
import { SidebarItem } from "./SidebarItem";
import { SidebarExpandable } from "./SidebarExpandable";
import { SidebarUser } from "./SidebarUser";
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
  const router = useRouter(); //
  const isTablet = useIsTablet();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsCollapsed(isTablet);
  }, [isTablet]);

  const collapsed = isCollapsed;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const filteredSections = SIDEBAR_CONFIG
    .map((section) => {
      const filteredItems = section.items.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(role);
      });
      return { ...section, items: filteredItems };
    })
    .filter((section) => section.items.length > 0);

  return (
    <motion.aside
      className={cn(
        /* WARNA: Menggunakan bg-sidebar (Putih) dan border-r halus */
        "relative h-screen bg-sidebar text-foreground border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/*  TOGGLE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!collapsed)}
        className="absolute -right-3 top-10 z-100 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-white shadow-md hover:scale-110 transition-all cursor-pointer"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
        )}
      </button>

      {/* HEADER: Aksen Branding dengan Logo Hitam */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-sm">
          <Coffee className="h-5 w-5" />
        </div>

        {!collapsed && (
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight leading-none text-primary">Padhe Coffee</h1>
            <p className="text-[10px] font-medium uppercase tracking-widest mt-1 text-muted-foreground">Point of Sale</p>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-sidebar-scroll">
        {filteredSections.map((section: SidebarSectionType, index: number) => (
          <div
            key={section.title}
            className={cn(
              "space-y-1",
              /* 1. Tambahkan Border Top sebagai Divider jika bukan seksi pertama */
              index !== 0 && "pt-4 mt-4 border-t border-slate-200/60"
            )}
          >
            {!collapsed && (
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50 mb-2 px-4">
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
                    active={pathname === item.href || pathname.startsWith(item.href + "/")}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* USER SECTION: Bersih tanpa glassmorphism berlebih agar minimalis */}
      <div className="mt-auto p-4 border-t border-sidebar-border space-y-2">
        <div className="rounded-xl hover:bg-accent transition-colors">
          <SidebarUser collapsed={collapsed} />
        </div>

        <button
          onClick={handleLogout}
          onMouseEnter={(e) => {
            const icon = e.currentTarget.querySelector('svg');
            const text = e.currentTarget.querySelector('span');
            if (icon) icon.style.color = '#ef4444'; // Warna merah destructive
            if (text) text.style.color = '#ef4444';
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            const icon = e.currentTarget.querySelector('svg');
            const text = e.currentTarget.querySelector('span');
            if (icon) icon.style.color = ''; // Kembali ke awal
            if (text) text.style.color = '';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer text-muted-foreground"
        >
          <LogOut className="h-4 w-4 mr-3 transition-colors duration-300" />

          {!collapsed && (
            <span className="text-xs font-bold uppercase tracking-wider transition-colors duration-300">
              Keluar
            </span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}