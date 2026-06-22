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
import { updateLead } from "@/app/actions/lead";

export function EditLeadDialog({ lead }: { lead: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    setLoading(true);
    const result = await updateLead(lead.id, lead.customer.id, formData);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="font-semibold text-slate-600 border-slate-200" />}>
        Edit
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={action} key={lead.id + String(lead.updatedAt)}>
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>
              Update prospect information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Lead Title</Label>
              <Input id="title" name="title" defaultValue={lead.title} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input id="customerName" name="customerName" defaultValue={lead.customer?.name} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input id="customerEmail" name="customerEmail" type="email" defaultValue={lead.customer?.email || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input id="customerPhone" name="customerPhone" defaultValue={lead.customer?.phone || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerCompany">Company</Label>
              <Input id="customerCompany" name="customerCompany" defaultValue={lead.customer?.company || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customerAddress">Address</Label>
              <Input id="customerAddress" name="customerAddress" defaultValue={lead.customer?.address || ""} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
