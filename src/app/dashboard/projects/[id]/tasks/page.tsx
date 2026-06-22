import { getProjectById } from "@/app/actions/project";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProjectTasksManager } from "@/components/projects/ProjectTasksManager";

export default async function ProjectTasksPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await getProjectById(resolvedParams.id);
  
  if (!res || !res.success || !res.data) {
    notFound();
  }

  const project = res.data;
  const customer = project.opportunity?.lead?.customer;

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] p-6 space-y-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-600 flex items-center gap-2">
          Project Tasks: <span className="text-slate-800">PLTS {customer?.name || "Customer"}</span>
        </h1>
        <Link href={`/dashboard/projects/${project.id}`} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 w-fit">
          <ChevronLeft className="h-4 w-4" />
          Back to Project Detail
        </Link>
      </div>

      {/* FULL HEIGHT KANBAN AREA */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-0">
        <ProjectTasksManager 
          projectId={project.id} 
          tasks={project.tasks || []} 
          projectContext={`Customer: ${customer?.name}, Project Phase: ${project.status}, Value: ${project.opportunity?.value}, Location: ${customer?.address}`}
        />
      </div>
    </div>
  );
}
