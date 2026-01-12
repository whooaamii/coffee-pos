"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SidebarItemType } from "./sidebar.config";

type Props = {
  item: SidebarItemType;
  collapsed: boolean;
  active: boolean;
};

export function SidebarItem({ item, collapsed, active }: Props) {
  const Icon = item.icon;

  const ItemContent = (
    <motion.div
      whileHover={{ x: collapsed ? 0 : 4 }}
      className={cn(
        "relative flex items-center gap-2 rounded-xl transition-all duration-200 group",
        collapsed
          ? "justify-center h-11 w-11 mx-auto"
          : "px-4 py-3", // Padding sedikit lebih lebar agar terlihat lega
        /* WARNA: Jika Aktif gunakan Hitam Pekat (#030213), jika tidak gunakan Abu-abu */
        active
          ? "bg-primary text-white shadow-lg shadow-black/10" 
          : "text-muted-foreground hover:bg-accent/70 hover:text-primary"
      )}
    >
      {/* 1. IKON: Putih saat aktif, Abu-abu saat pasif */}
      <Icon className={cn(
        "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
        active ? "text-white" : "text-muted-foreground group-hover:text-primary"
      )} />

      {/* 2. LABEL: Font Bold Modern sesuai Figma whitespace-nowrap  */}
      {!collapsed && (
        <span className={cn(
          "font-bold text-sm tracking-tight transition-colors",
          active ? "text-white" : "text-muted-foreground group-hover:text-primary"
        )}>
          {item.label}
        </span>
      )}

      {/* 3. INDIKATOR DROPDOWN (Optional) */}
      {active && !collapsed && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href ?? "#"}>{ItemContent}</Link>
          </TooltipTrigger>
          {/* Tooltip juga disesuaikan menjadi Gelap */}
          <TooltipContent side="right" className="bg-primary border-none text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1.5">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <Link href={item.href ?? "#"}>{ItemContent}</Link>;
}