"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  FolderKanban, 
  Settings,
  Calculator,
  LineChart,
  Activity,
  CreditCard,
  PieChart,
  BrainCircuit,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/dashboard/leads", icon: Users },
    { name: "Calculator", href: "/dashboard/calculator", icon: Calculator },
    { name: "Proposal", href: "/dashboard/proposal", icon: FileText },
    { name: "Pipeline", href: "/dashboard/pipeline", icon: Briefcase },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Monitoring", href: "/dashboard/monitoring", icon: Activity },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Finance", href: "/dashboard/finance", icon: CreditCard },
    { name: "Reports", href: "/dashboard/reports", icon: PieChart },
    { name: "AI Insights", href: "/dashboard/insights", icon: BrainCircuit },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className={cn(
      "flex h-screen flex-col bg-[#161d2d] text-slate-300 transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-[#275294] text-white shadow-md z-50 hover:bg-blue-600 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className={cn("flex h-14 items-center border-b border-white/5", isCollapsed ? "justify-center px-0" : "px-6")}>
        <Link href="/dashboard" className="flex flex-col items-center">
          <div className="text-xl font-bold tracking-tight flex items-center">
            {isCollapsed ? (
              <span className="text-[#3ed072]">DK</span>
            ) : (
              <>
                <span className="text-[#3ed072]">DK</span> <span className="text-white ml-1">POWER</span>
              </>
            )}
          </div>
          {!isCollapsed && <span className="text-[10px] tracking-widest text-[#3ed072] mt-0.5">ENERGY SOLUTIONS</span>}
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-6 px-3 scrollbar-hide">
        <nav className="grid gap-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={index}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center px-0" : "gap-3 px-3",
                  isActive 
                    ? "bg-[#275294] text-white" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={cn("p-4 mt-auto border-t border-white/5 flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
        <div className="h-9 w-9 shrink-0 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
          <span className="text-white text-xs">YT</span>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">Yanto</span>
            <span className="text-xs text-slate-400 truncate">CEO</span>
          </div>
        )}
      </div>
    </div>
  );
}
