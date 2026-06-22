import { getProjectById } from "@/app/actions/project";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, Clock, Circle, AlertTriangle, ListTodo, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectTasksManager } from "@/components/projects/ProjectTasksManager";

export default async function ProjectDeliveryCenter({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await getProjectById(resolvedParams.id);
  
  if (!res || !res.success || !res.data) {
    notFound();
  }

  const project = res.data;
  const lead = project.opportunity?.lead;
  const customer = lead?.customer;
  const pm = lead?.assignee;

  const formatCurrency = (val: number | null) => {
    if (!val) return "-";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Stepper Logic Mocking based on standard stages
  const stages = [
    { id: "PLANNING", label: "Engineering" },
    { id: "PROCUREMENT", label: "Procurement" },
    { id: "INSTALLATION", label: "Installation" },
    { id: "COMMISSIONING", label: "Commissioning" },
    { id: "COMPLETED", label: "Handover" },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === project.status);
  
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-6 space-y-6 w-full">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-600">5. Project Delivery Center</h1>
        <Link href="/dashboard/projects" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 w-fit">
          <ChevronLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      {/* TOP CARD: Title & PM */}
      <Card className="shadow-sm border-slate-100 overflow-hidden">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">PLTS {customer?.name || "Customer"}</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Clock className="h-3 w-3 mr-1" />
              {project.status === "COMPLETED" ? "Completed" : "In Progress"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <Avatar className="h-10 w-10">
              <AvatarImage src={pm?.image || ""} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                {pm?.name ? pm.name.charAt(0) : "PM"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">Project Manager</span>
              <span className="text-sm font-bold text-slate-800">{pm?.name || "Rudi Hermawan"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TIMELINE STEPPER CARD */}
      <Card className="shadow-sm border-slate-100 overflow-visible relative z-0">
        <CardContent className="p-8">
          <div className="flex items-center justify-between relative">
            {/* Connecting line background */}
            <div className="absolute left-[10%] right-[10%] top-6 h-1 bg-slate-200 -z-10" />
            
            {/* Connecting line progress (mocked based on index) */}
            <div 
              className="absolute left-[10%] top-6 h-1 bg-emerald-500 -z-10 transition-all duration-500" 
              style={{ width: `${Math.max(0, currentStageIndex * 20)}%` }}
            />

            {stages.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              
              let Icon = Circle;
              let iconColor = "text-slate-300";
              let bgColor = "bg-white";
              let labelColor = "text-slate-400";
              let statusText = "Pending";

              if (isCompleted) {
                Icon = CheckCircle2;
                iconColor = "text-emerald-500";
                labelColor = "text-emerald-600";
                statusText = "Selesai";
                bgColor = "bg-emerald-50";
              } else if (isCurrent) {
                Icon = Wrench;
                iconColor = "text-white";
                bgColor = "bg-blue-600";
                labelColor = "text-slate-800 font-bold";
                statusText = "In Progress";
              }

              return (
                <div key={stage.id} className="flex flex-col items-center gap-3 relative z-10 w-32">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${bgColor} ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
                    <Icon className={`h-6 w-6 ${iconColor} ${isCompleted ? 'fill-emerald-100' : ''}`} />
                  </div>
                  <div className="text-center">
                    <p className={`text-sm ${labelColor}`}>{stage.label}</p>
                    <p className={`text-xs font-semibold ${isCurrent ? 'text-blue-600' : (isCompleted ? 'text-emerald-500' : 'text-slate-400')}`}>{statusText}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* THREE COLUMNS BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Progress Overview */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              Progress Overview
            </h3>
            
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-slate-500">Overall Progress</span>
                <span className="text-xl font-bold text-slate-800">{project.progress}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${project.progress}%` }} 
                />
              </div>
            </div>

            <div className="space-y-4 mt-auto">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Start Date</span>
                <span className="font-semibold text-slate-800">10 Mei 2025</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Target Finish</span>
                <span className="font-semibold text-slate-800">20 Juni 2025</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500">Project Value</span>
                <span className="font-bold text-slate-800">{formatCurrency(project.opportunity?.value)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Column 2: Task List Summary */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-blue-600" />
              Tasks Summary
            </h3>
            
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-sm font-medium text-slate-600">Total Tasks</span>
                <span className="text-lg font-bold text-slate-800">{project.tasks?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center bg-amber-50 p-3 rounded-lg border border-amber-100">
                <span className="text-sm font-medium text-amber-700">In Progress</span>
                <span className="text-lg font-bold text-amber-700">
                  {project.tasks?.filter((t: any) => t.status === "IN_PROGRESS").length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <span className="text-sm font-medium text-emerald-700">Completed</span>
                <span className="text-lg font-bold text-emerald-700">
                  {project.tasks?.filter((t: any) => t.status === "DONE").length || 0}
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-center">
              <Link href={`/dashboard/projects/${project.id}/tasks`} className="block w-full text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg transition-colors">
                Open Kanban Board &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Column 3: Issues / Alerts */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              Issues / Alerts
            </h3>
            
            <div className="space-y-3 flex-1">
              {[
                { text: "Kabel DC belum diterima di lokasi", date: "11 Jun 2025" },
                { text: "Commissioning diperkirakan mundur 2 hari", date: "11 Jun 2025" },
              ].map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-orange-100 bg-orange-50/50">
                  <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">{issue.text}</span>
                    <span className="text-xs text-slate-500 mt-1">{issue.date}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-center">
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All Issues</button>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
