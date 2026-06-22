"use client";

import { useState, useEffect, useTransition } from "react";
import { updateLeadStatus } from "@/app/actions/lead";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];

export function LeadStatusSelect({ leadId, initialStatus }: { leadId: string; initialStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(initialStatus);

  // Sync state if initialStatus changes from server revalidation
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const handleStatusChange = (value: string | null) => {
    if (!value) return;
    setStatus(value); // Optimistic UI update
    startTransition(async () => {
      await updateLeadStatus(leadId, value);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
        <SelectTrigger className="w-[140px] h-8 text-xs font-semibold bg-blue-50 text-blue-800 border-0 focus:ring-0">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((status) => (
            <SelectItem key={status} value={status} className="text-xs font-medium">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
}
