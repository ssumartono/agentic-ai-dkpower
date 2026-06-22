import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between px-6 bg-white border-b border-slate-100 shrink-0">
      <div className="flex w-full max-w-sm items-center relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input 
          type="search" 
          placeholder="Search anything.." 
          className="w-full bg-transparent border-0 shadow-none pl-10 focus-visible:ring-0 placeholder:text-slate-400 text-slate-600"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            12
          </span>
        </div>
        
        <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <span className="flex h-5 w-5 items-center justify-center bg-slate-100 rounded text-slate-500 mr-1 text-xs">
            📅
          </span>
          This Month
          <ChevronDown className="h-4 w-4 text-slate-400 ml-2" />
        </button>
      </div>
    </header>
  );
}
