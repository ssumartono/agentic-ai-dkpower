"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  LineChart, 
  Zap, 
  FileText, 
  Ticket, 
  CreditCard, 
  Wrench, 
  User,
  Circle,
  CheckCircle2,
  FileDown
} from "lucide-react";

export default function CustomerPortalPage() {
  const portalMenus = [
    { name: "Dashboard", icon: LayoutDashboard, active: true },
    { name: "Project Status", icon: LineChart, active: false },
    { name: "Energy Dashboard", icon: Zap, active: false },
    { name: "Documents", icon: FileText, active: false },
    { name: "Tickets", icon: Ticket, active: false },
    { name: "Invoices", icon: CreditCard, active: false },
    { name: "Maintenance", icon: Wrench, active: false },
    { name: "Profile", icon: User, active: false },
  ];

  const stages = [
    { label: "Engineering", status: "Selesai", date: "10 Mei 2025" },
    { label: "Procurement", status: "Selesai", date: "20 Mei 2025" },
    { label: "Installation", status: "In Progress", date: "31 Mei 2025" },
    { label: "Commissioning", status: "Pending", date: "18 Juni 2025" },
    { label: "Handover", status: "Pending", date: "20 Juni 2025" },
  ];
  const currentStageIndex = 2; // Installation

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-6 space-y-6 w-full">
      {/* HEADER */}
      <h1 className="text-2xl font-bold tracking-tight text-emerald-700">7. Customer Portal (View)</h1>

      {/* PORTAL CONTAINER */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* INTERNAL SIDEBAR */}
        <Card className="w-full md:w-64 shrink-0 shadow-sm border-slate-100 h-fit">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {portalMenus.map((menu, i) => {
                const Icon = menu.icon;
                return (
                  <button 
                    key={i}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      menu.active 
                        ? 'bg-[#275294] text-white shadow-md' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${menu.active ? 'text-white' : 'text-slate-400'}`} />
                    {menu.name}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Welcome Text */}
          <div>
            <p className="text-sm text-slate-500 font-medium">Selamat datang,</p>
            <h2 className="text-2xl font-bold text-slate-800">PT Maju Bersama</h2>
          </div>

          {/* METRICS ROW (5 Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            
            <Card className="shadow-sm border-slate-100">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <span className="text-xs font-semibold text-slate-500 mb-1">Project Status</span>
                <div className="flex items-end justify-between mb-2">
                  <span className="font-bold text-slate-800">In Progress</span>
                  <span className="text-sm font-bold text-slate-700">78%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-100">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <span className="text-xs font-semibold text-slate-500 mb-1">Total Installed</span>
                <span className="text-xl font-bold text-slate-800">50 kWp</span>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-100">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <span className="text-xs font-semibold text-slate-500 mb-1">Today Production</span>
                <span className="text-xl font-bold text-slate-800">256 kWh</span>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-100">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <span className="text-xs font-semibold text-slate-500 mb-1">This Month</span>
                <span className="text-xl font-bold text-slate-800">7.2 MWh</span>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-100">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <span className="text-xs font-semibold text-slate-500 mb-1">Total Saving</span>
                <span className="text-xl font-bold text-slate-800">Rp 17.5 Jt</span>
              </CardContent>
            </Card>

          </div>

          {/* BOTTOM AREA (Timeline + Documents) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Timeline Stepper */}
            <Card className="lg:col-span-2 shadow-sm border-slate-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-800 mb-8">Project Timeline</h3>
                
                <div className="flex items-start justify-between relative mt-4">
                  {/* Connecting line background */}
                  <div className="absolute left-[10%] right-[10%] top-3 h-0.5 bg-slate-200 -z-10" />
                  
                  {/* Connecting line progress */}
                  <div 
                    className="absolute left-[10%] top-3 h-0.5 bg-emerald-500 -z-10" 
                    style={{ width: `${currentStageIndex * 25}%` }}
                  />

                  {stages.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    
                    let Icon = Circle;
                    let iconColor = "text-slate-300";
                    let statusColor = "text-slate-400";

                    if (isCompleted) {
                      Icon = CheckCircle2;
                      iconColor = "text-emerald-500 fill-white";
                      statusColor = "text-emerald-500";
                    } else if (isCurrent) {
                      Icon = Circle;
                      iconColor = "text-blue-600 fill-blue-600 ring-4 ring-blue-100 rounded-full";
                      statusColor = "text-blue-600 font-bold";
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 relative z-10 w-24">
                        <div className="h-6 w-6 bg-white flex items-center justify-center">
                          <Icon className={`h-5 w-5 ${iconColor}`} />
                        </div>
                        <div className="text-center mt-2">
                          <p className="text-xs font-bold text-slate-800 leading-tight mb-1">{stage.label}</p>
                          <p className={`text-[10px] ${statusColor} mb-1`}>{stage.status}</p>
                          <p className="text-[10px] text-slate-500">{stage.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </CardContent>
            </Card>

            {/* Recent Documents */}
            <Card className="shadow-sm border-slate-100">
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="font-bold text-slate-800 mb-4">Recent Documents</h3>
                
                <div className="space-y-3 flex-1">
                  {[
                    "Proposal Final",
                    "Kontrak Kerjasama",
                    "SLD System",
                    "Manual Book"
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-100 transition-colors">
                          <FileDown className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{doc}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">PDF</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 text-center">
                  <button className="text-sm font-bold text-blue-600 hover:text-blue-800">View All Documents</button>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>

    </div>
  );
}
