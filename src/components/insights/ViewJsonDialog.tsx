"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ViewJsonDialog({ inputPayload, outputPayload }: { inputPayload: any, outputPayload: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
        View Full JSON
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Processing Log</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">Input Payload (Customer Data)</h4>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(inputPayload, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">Output Payload (AI Recommendation)</h4>
            <pre className="bg-emerald-950 text-emerald-50 p-4 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(outputPayload, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
