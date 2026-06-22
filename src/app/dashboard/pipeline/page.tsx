import { getPipeline } from "@/app/actions/pipeline";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";

export default async function PipelinePage() {
  const result = await getPipeline();
  const opportunities = (result.success && result.data) ? result.data : [];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Sales Pipeline</h1>
        <p className="text-sm text-slate-500 mt-1">
          Drag and drop opportunities to update their stage.
        </p>
      </div>
      
      <div className="flex-1 min-h-0">
        <KanbanBoard initialData={opportunities} />
      </div>
    </div>
  );
}
