"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addNoteToLead } from "@/app/actions/lead";
import { Save, FileText } from "lucide-react";

export function NotesTab({ leadId, initialNotes = "" }: { leadId: string, initialNotes: string | null }) {
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    setLoading(true);
    const noteText = formData.get("noteText") as string;
    
    if (!noteText.trim()) {
      setLoading(false);
      return;
    }

    const result = await addNoteToLead(leadId, noteText);
    
    setLoading(false);
    
    if (result.success) {
      // Clear the textarea after successful save
      const form = document.getElementById("add-note-form") as HTMLFormElement;
      if (form) form.reset();
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[400px] flex flex-col md:flex-row gap-8">
      {/* Existing Notes */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          Lead Notes
        </h3>
        
        {initialNotes ? (
          <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed bg-amber-50/50 p-6 rounded-xl border border-amber-100 whitespace-pre-wrap">
            {initialNotes}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">No notes added yet.</p>
          </div>
        )}
      </div>

      {/* Add New Note */}
      <div className="w-full md:w-1/3 shrink-0">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-6">
          <h4 className="font-bold text-slate-800 mb-4 text-sm">Add New Note</h4>
          <form id="add-note-form" action={action}>
            <Textarea 
              name="noteText" 
              placeholder="Type your note here..." 
              className="min-h-[150px] mb-4 bg-white"
              required
            />
            <Button type="submit" disabled={loading} className="w-full bg-slate-800 hover:bg-slate-900 text-white">
              {loading ? "Saving..." : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Note
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
