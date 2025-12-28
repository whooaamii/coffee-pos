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
        "flex items-center gap-3 rounded-xl transition-colors",
        collapsed
          ? "justify-center h-11 w-11 mx-auto"
          : "px-3 py-3",
        active
          ? "bg-emerald-500/15 text-emerald-400"
          : "text-slate-300 hover:bg-white/5"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <span className="font-medium whitespace-nowrap">
          {item.label}
        </span>
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
          <TooltipContent side="right">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <Link href={item.href ?? "#"}>{ItemContent}</Link>;
}
