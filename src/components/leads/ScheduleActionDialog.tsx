"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { addLeadActivity } from "@/app/actions/lead";

export function ScheduleActionDialog({ leadId, defaultSubject = "" }: { leadId: string, defaultSubject?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("TASK");

  async function action(formData: FormData) {
    setLoading(true);
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    
    const result = await addLeadActivity(leadId, {
      type,
      subject,
      description,
      date: dateStr ? new Date(dateStr) : undefined,
    });
    
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 shadow-sm" />}>
        Schedule Next Action
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>Schedule Next Action</DialogTitle>
            <DialogDescription>
              Set up a follow-up task or meeting for this lead.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Action Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TASK">Task / To-Do</SelectItem>
                  <SelectItem value="MEETING">Meeting / Survey</SelectItem>
                  <SelectItem value="CALL">Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" defaultValue={defaultSubject} required placeholder="e.g. Follow up on proposal" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date & Time</Label>
              <Input id="date" name="date" type="datetime-local" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Notes / Details</Label>
              <Textarea id="description" name="description" placeholder="Optional details..." />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Action"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
