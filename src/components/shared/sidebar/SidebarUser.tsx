import { User } from "lucide-react";

export function SidebarUser({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur">
      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
        <User className="h-5 w-5 text-white" />
      </div>

      {!collapsed && (
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">Admin</p>
          <p className="text-xs text-slate-300">Kasir</p>
        </div>
      )}
    </div>
  );
}
