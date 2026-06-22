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
import { Plus } from "lucide-react";
import { createLead } from "@/app/actions/lead";

export function CreateLeadDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    setLoading(true);
    const result = await createLead(formData);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="shrink-0 gap-2" />}>
        <Plus size={16} />
        New Lead
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
            <DialogDescription>
              Add a new prospect to your pipeline. Customer will be created if they don't exist.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Lead Title / Opportunity Name</Label>
              <Input id="title" name="title" placeholder="e.g. 100kWp Solar Panel" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerName">Customer Name / Company</Label>
              <Input id="customerName" name="customerName" placeholder="e.g. PT Industri Energi" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input id="customerEmail" name="customerEmail" type="email" placeholder="email@company.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input id="customerPhone" name="customerPhone" placeholder="+62..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerAddress">Address / Location</Label>
              <Input id="customerAddress" name="customerAddress" placeholder="e.g. Jakarta Barat" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
