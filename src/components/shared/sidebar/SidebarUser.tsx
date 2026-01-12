import { User } from "lucide-react";

export function SidebarUser({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors group">      
    <div className="w-10 h-10 bg-accent text-primary rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
      <User className="h-4.5 w-4.5" />
    </div>

      {!collapsed && (
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-primary truncate tracking-tight leading-none mb-0.5">{User.name}</p>
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Admin</p>
        </div>
      )}
    </div>
  );
}