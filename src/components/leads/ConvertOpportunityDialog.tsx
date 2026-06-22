"use client";

import { useState, useTransition } from "react";
import { convertLeadToOpportunity } from "@/app/actions/lead";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export function ConvertOpportunityDialog({ leadId }: { leadId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const value = parseFloat(formData.get("value") as string);
    const probability = parseInt(formData.get("probability") as string);
    const expectedCloseStr = formData.get("expectedClose") as string;
    
    if (isNaN(value) || isNaN(probability) || !expectedCloseStr) {
      setError("Please fill all fields correctly.");
      return;
    }

    startTransition(async () => {
      const result = await convertLeadToOpportunity(leadId, {
        value,
        probability,
        expectedClose: new Date(expectedCloseStr),
      });

      if (result.success) {
        setIsOpen(false);
      } else {
        setError(result.error || "Failed to convert opportunity");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={buttonVariants({ className: "gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm border-0" })}>
        Convert to Opportunity
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convert to Opportunity</DialogTitle>
          <DialogDescription>
            Enter the details for this new opportunity. The lead status will be updated to QUALIFIED.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="value">Estimated Project Value (Rp)</Label>
            <Input id="value" name="value" type="number" placeholder="e.g. 50000000" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="probability">Probability of Closing (%)</Label>
            <Input id="probability" name="probability" type="number" min="0" max="100" placeholder="e.g. 50" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expectedClose">Expected Close Date</Label>
            <Input id="expectedClose" name="expectedClose" type="date" required />
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Convert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
