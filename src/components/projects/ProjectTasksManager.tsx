"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Clock, Sparkles, Trash2, Plus, ListTodo } from "lucide-react";
import { generateProjectTasksAI, deleteTask, updateTask } from "@/app/actions/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TaskKanbanBoard } from "./TaskKanbanBoard";

export function ProjectTasksManager({ projectId, tasks, projectContext }: { projectId: string, tasks: any[], projectContext: string }) {
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const res = await generateProjectTasksAI(projectId, projectContext);
    setIsGenerating(false);
    if (!res.success) {
      alert("Gagal memanggil AI: " + res.error);
    }
  };

  const handleToggleStatus = (task: any) => {
    const newStatus = task.status === "DONE" ? "TODO" : "DONE";
    startTransition(async () => {
      await updateTask(task.id, projectId, { status: newStatus });
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus tugas ini?")) {
      startTransition(async () => {
        await deleteTask(id, projectId);
      });
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === "HIGH") return "bg-orange-100 text-orange-700";
    if (p === "MEDIUM") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-blue-600" />
            Task List
          </h3>
          
          <div className="flex bg-slate-100 p-1 rounded-md">
            <button 
              onClick={() => setViewMode("list")}
              className={`text-xs px-3 py-1 font-medium rounded-sm transition-colors ${viewMode === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              List
            </button>
            <button 
              onClick={() => setViewMode("board")}
              className={`text-xs px-3 py-1 font-medium rounded-sm transition-colors ${viewMode === "board" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Board
            </button>
          </div>
        </div>

        <Button 
          onClick={handleGenerateAI} 
          disabled={isGenerating || isPending}
          size="sm" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          {isGenerating ? <Clock className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isGenerating ? "AI thinking..." : "Auto-Generate AI"}
        </Button>
      </div>
      
      {viewMode === "list" ? (
        <div className="space-y-3 flex-1 overflow-auto pr-2">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="font-medium text-slate-600">Belum ada tugas.</p>
              <p className="mt-1">Klik tombol AI di atas untuk merancang tugas otomatis.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${task.status === "DONE" ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-200 shadow-sm"}`}>
                <button onClick={() => handleToggleStatus(task)} disabled={isPending} className="mt-0.5 shrink-0">
                  <CheckCircle2 className={`h-5 w-5 transition-colors ${task.status === "DONE" ? "text-emerald-500" : "text-slate-300 hover:text-emerald-400"}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-semibold truncate ${task.status === "DONE" ? "text-slate-500 line-through" : "text-slate-800"}`}>
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      <Badge variant="outline" className={`text-[10px] h-5 px-1.5 border-none ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Due: {format(new Date(task.dueDate), "dd MMM yyyy")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  {/* Always visible for now since we removed group class to keep it simple, let's keep opacity-50 -> 100 */}
                </div>
                <div className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(task.id)} disabled={isPending} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="font-medium text-slate-600">Belum ada tugas.</p>
              <p className="mt-1">Klik tombol AI di atas untuk merancang tugas otomatis.</p>
            </div>
          ) : (
            <TaskKanbanBoard projectId={projectId} tasks={tasks} />
          )}
        </div>
      )}
      
      <div className="pt-4 mt-4 border-t border-slate-100 text-center">
        <Button variant="outline" size="sm" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50" disabled={isPending}>
          <Plus className="h-4 w-4 mr-2" /> Add Manual Task
        </Button>
      </div>
    </div>
  );
}
