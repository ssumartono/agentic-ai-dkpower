"use client";

import React, { useState, useEffect, useTransition } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { updateOpportunityStage } from "@/app/actions/pipeline";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Calendar, DollarSign, Percent, FileText } from "lucide-react";
import Link from "next/link";

// Kolom tahapan pipeline yang standar
const COLUMNS = [
  { id: "QUALIFICATION", title: "Qualification" },
  { id: "PROPOSAL", title: "Proposal" },
  { id: "NEGOTIATION", title: "Negotiation" },
  { id: "WON", title: "Closed Won" },
  { id: "LOST", title: "Closed Lost" }
];

export function KanbanBoard({ initialData }: { initialData: any[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
    setData(initialData); // sinkronisasi jika data dari server berubah
  }, [initialData]);

  if (!isMounted) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Pipeline Board...</div>;
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStage = destination.droppableId;
    
    // 1. Optimistic Update UI seketika
    const updatedData = data.map(item => {
      if (item.id === draggableId) {
        return { ...item, stage: newStage };
      }
      return item;
    });
    
    setData(updatedData);

    // 2. Simpan ke database di background
    startTransition(async () => {
      await updateOpportunityStage(draggableId, newStage);
    });
  };

  const getItemsByStage = (stage: string) => {
    return data.filter(item => item.stage === stage);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto pb-4 items-stretch px-1">
        {COLUMNS.map((col) => (
          <div key={col.id} className="w-1/5 min-w-[250px] flex-1 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200">
            {/* Column Header */}
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white/60 rounded-t-xl shrink-0">
              <h3 className="font-semibold text-slate-800 text-sm tracking-tight">{col.title}</h3>
              <span className="bg-slate-200 text-slate-600 text-xs py-0.5 px-2.5 rounded-full font-medium">
                {getItemsByStage(col.id).length}
              </span>
            </div>
            
            {/* Droppable Area */}
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] transition-colors rounded-b-xl ${snapshot.isDraggingOver ? "bg-slate-200/50" : ""}`}
                >
                  {getItemsByStage(col.id).map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.9 : 1,
                            transform: snapshot.isDragging 
                              ? `${provided.draggableProps.style?.transform} scale(1.02)` 
                              : provided.draggableProps.style?.transform,
                          }}
                        >
                          <Card className={`shadow-sm border-slate-200 cursor-grab active:cursor-grabbing hover:border-blue-400 transition-all ${snapshot.isDragging ? "shadow-md ring-1 ring-blue-400" : ""}`}>
                            <CardContent className="p-4 flex flex-col gap-3">
                              <div className="flex justify-between items-start gap-2">
                                <Link href={`/dashboard/leads/${item.leadId}`} className="font-semibold text-sm text-slate-800 line-clamp-2 leading-tight hover:text-blue-600 transition-colors">
                                  {item.lead.title}
                                </Link>
                                {item.stage === "PROPOSAL" && (
                                  <Link href={`/dashboard/proposal?leadId=${item.leadId}`} title="Generate Proposal" className="text-emerald-500 hover:text-emerald-700 p-1 shrink-0">
                                    <FileText className="h-4 w-4" />
                                  </Link>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Building className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{item.lead.customer.name}</span>
                              </div>
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1 font-medium text-slate-700">
                                  <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                  Rp {(item.value / 1000000).toFixed(1)}M
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <span className="flex items-center gap-1 text-slate-500">
                                    <Percent className="h-3 w-3 text-blue-500" />
                                    {item.probability}%
                                  </span>
                                  {item.expectedClose && (
                                    <span className="flex items-center gap-1 text-slate-500" title="Expected Close Date">
                                      <Calendar className="h-3 w-3 text-orange-400" />
                                      {new Date(item.expectedClose).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
