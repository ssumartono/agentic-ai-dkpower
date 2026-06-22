"use client";

import { useState } from "react";
import { FileText, Download, Plus, FileImage, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addLeadDocument } from "@/app/actions/lead";

export function DocumentsTab({ documents, leadId }: { documents: any[], leadId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("PDF");

  async function action(formData: FormData) {
    setLoading(true);
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    
    const result = await addLeadDocument(leadId, {
      name,
      url: url || "https://example.com/dummy.pdf",
      type,
    });
    
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
    } else {
      alert(result.error);
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FileText className="h-8 w-8 text-red-500" />;
      case "IMAGE": return <FileImage className="h-8 w-8 text-blue-500" />;
      default: return <File className="h-8 w-8 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-800">Lead Documents</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-slate-800 hover:bg-slate-900 text-white" />}>
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form action={action}>
              <DialogHeader>
                <DialogTitle>Add Document</DialogTitle>
                <DialogDescription>
                  Upload a new document or provide a link for this lead.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Document Name</Label>
                  <Input id="name" name="name" required placeholder="e.g. Proposal Rev 1" />
                </div>
                <div className="grid gap-2">
                  <Label>Document Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF Document</SelectItem>
                      <SelectItem value="DOC">Word / Excel</SelectItem>
                      <SelectItem value="IMAGE">Image / Photo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">File URL</Label>
                  <Input id="url" name="url" placeholder="https://..." />
                  <p className="text-xs text-slate-500">Leave blank to use a dummy generated URL.</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Document"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!documents || documents.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, i) => (
            <div key={i} className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow group bg-white">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                {getIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate" title={doc.name}>{doc.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(doc.createdAt).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <div className="mt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <Download className="h-3 w-3" /> View / Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
