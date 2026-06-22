"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteLead } from "@/app/actions/lead";
import { useRouter } from "next/navigation";

export function DeleteLeadButton({ leadId }: { leadId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead? This cannot be undone.")) {
      return;
    }
    
    setLoading(true);
    const result = await deleteLead(leadId);
    if (result.success) {
      router.push("/dashboard/leads");
    } else {
      alert(result.error);
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
