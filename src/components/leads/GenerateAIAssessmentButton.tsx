"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Loader2 } from "lucide-react";
import { generateLeadAssessmentAI } from "@/app/actions/lead";
import { useRouter } from "next/navigation";

export function GenerateAIAssessmentButton({ leadId }: { leadId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateLeadAssessmentAI(leadId);
      if (res.success) {
        // Will be refreshed by revalidatePath in the action, but we can also refresh router
        router.refresh();
      } else {
        alert(res.error || "Failed to generate AI assessment");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={loading}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 shadow-sm"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Analyzing Lead...
        </>
      ) : (
        <>
          <Bot className="h-5 w-5 mr-2" />
          Generate AI Assessment
        </>
      )}
    </Button>
  );
}
