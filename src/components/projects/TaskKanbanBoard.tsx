"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { updateTask } from "@/app/actions/task";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

export function TaskKanbanBoard({ projectId, tasks }: { projectId: string; tasks: any[] }) {
  const [boardData, setBoardData] = useState<{ [key: string]: any[] }>({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  useEffect(() => {
    // Populate board data based on tasks
    const newBoard = {
      TODO: [] as any[],
      IN_PROGRESS: [] as any[],
      DONE: [] as any[],
    };
    
    tasks.forEach(task => {
      // In case status is not matched, default to TODO
      const status = (task.status === "TODO" || task.status === "IN_PROGRESS" || task.status === "DONE") ? task.status : "TODO";
      newBoard[status as keyof typeof newBoard].push(task);
    });

    setBoardData(newBoard);
  }, [tasks]);

  const getPriorityColor = (p: string) => {
    if (p === "HIGH") return "bg-orange-100 text-orange-700";
    if (p === "MEDIUM") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-700";
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const newBoardData = { ...boardData };
    const sourceTasks = [...newBoardData[sourceCol]];
    const destTasks = sourceCol === destCol ? sourceTasks : [...newBoardData[destCol]];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.status = destCol; // optimistically update status
    
    destTasks.splice(destination.index, 0, movedTask);

    newBoardData[sourceCol] = sourceTasks;
    if (sourceCol !== destCol) {
      newBoardData[destCol] = destTasks;
    }

    setBoardData(newBoardData);

    // Persist to database asynchronously
    try {
      await updateTask(movedTask.id, projectId, { status: destCol });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {COLUMNS.map(column => (
          <div key={column.id} className="flex-1 min-w-[280px] bg-slate-50 rounded-lg p-3 flex flex-col border border-slate-200 shadow-inner">
            <h4 className="font-bold text-slate-700 mb-3 flex items-center justify-between">
              {column.title}
              <Badge variant="secondary" className="bg-slate-200 text-slate-600">{boardData[column.id]?.length || 0}</Badge>
            </h4>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex-1 overflow-y-auto space-y-3 min-h-[150px] transition-colors rounded-md p-1 ${
                    snapshot.isDraggingOver ? "bg-slate-200/50" : ""
                  }`}
                >
                  {boardData[column.id]?.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-3 rounded-lg border shadow-sm ${
                            snapshot.isDragging ? "shadow-lg ring-2 ring-blue-500 ring-opacity-50 scale-[1.02]" : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                          } transition-all duration-200`}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-sm font-semibold line-clamp-2 ${task.status === "DONE" ? "text-slate-500 line-through" : "text-slate-800"}`}>
                              {task.title}
                            </span>
                            <Badge variant="outline" className={`text-[10px] h-5 px-1.5 border-none shrink-0 ml-2 ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                            {task.dueDate ? (
                              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {format(new Date(task.dueDate), "dd MMM yyyy")}
                              </span>
                            ) : <span />}
                          </div>
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
      </DragDropContext>
    </div>
  );
}
