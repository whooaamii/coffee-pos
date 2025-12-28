"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SidebarItemType } from "./sidebar.config";
import { SidebarItem } from "./SidebarItem";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


type Props = {
  item: SidebarItemType;
  collapsed: boolean;
  pathname: string;
};


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


export function SidebarExpandable({ item, collapsed, pathname }: Props) {
  const isRouteActive = item.children?.some(
    (child) => pathname.startsWith(child.href ?? "")
  );

  // 👉 hanya untuk MANUAL toggle
  const [manualExpanded, setManualExpanded] = useState(false);

  // 👉 derived state (AMAN & DISUKAI REACT)
  const expanded = isRouteActive || manualExpanded;

  const Header = (
    <button
      onClick={() => setManualExpanded((p) => !p)}
      className={cn(
        "flex items-center rounded-xl w-full transition-colors",
        collapsed
          ? "justify-center h-11 w-11 mx-auto"
          : "px-3 py-3 gap-3",
        isRouteActive
          ? "bg-emerald-500/20 text-emerald-400"
          : "text-slate-300 hover:bg-white/10"
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />

      {!collapsed && (
        <>
          <span className="flex-1 text-left font-medium">
            {item.label}
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-90"
            )}
          />
        </>
      )}
    </button>
  );

  return (
  <div className="space-y-1">
    {collapsed ? (
      <Popover>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                {Header}
              </TooltipTrigger>
            </PopoverTrigger>

            <TooltipContent side="right">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PopoverContent
          side="right"
          align="start"
          className="w-56 p-2 bg-slate-800 border border-white/10"
        >
          <p className="px-3 py-2 text-xs font-semibold text-slate-400">
            {item.label}
          </p>

          <div className="space-y-1">
            {item.children?.map((child) => (
              <SidebarItem
                key={child.label}
                item={child}
                collapsed={false}
                active={pathname === child.href}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    ) : (
      <>
        {Header}

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-6 space-y-1 overflow-hidden"
            >
              {item.children?.map((child) => (
                <SidebarItem
                  key={child.label}
                  item={child}
                  collapsed={false}
                  active={pathname === child.href}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )}
  </div>
);  
}
