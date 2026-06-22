"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { addLeadDocument } from "@/app/actions/lead";
import { useRouter } from "next/navigation";

export function ProposalActions({ leadId }: { leadId: string | undefined }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePreview = () => {
    if (!leadId) {
      alert("Pilih Lead terlebih dahulu.");
      return;
    }
    window.open(`/document/proposal/${leadId}`, '_blank');
  };

  const handleGenerateAndSave = async () => {
    if (!leadId) {
      alert("Pilih Lead terlebih dahulu sebelum menyimpan proposal.");
      return;
    }

    setLoading(true);
    // Simulasi men-generate PDF di server, lalu menyimpannya ke database
    const result = await addLeadDocument(leadId, {
      name: `Proposal Penawaran - ${new Date().toLocaleDateString('id-ID')}`,
      type: "PDF",
      url: "/dummy-proposal.pdf" // Dummy URL
    });

    setLoading(false);

    if (result.success) {
      alert("Proposal berhasil digenerate dan disimpan ke arsip Document Lead!");
      // Redirect kembali ke tab documents lead
      router.push(`/dashboard/leads/${leadId}`);
    } else {
      alert("Gagal menyimpan proposal: " + result.error);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-slate-100 print:hidden">
      <Button 
        variant="outline"
        onClick={handlePreview}
        className="w-full py-3 h-auto border-2 border-emerald-500 text-emerald-600 font-bold text-sm hover:bg-emerald-50"
      >
        <FileText className="h-4 w-4 mr-2" />
        Preview PDF (Print)
      </Button>
      <Button 
        onClick={handleGenerateAndSave}
        disabled={loading}
        className="w-full py-3 h-auto bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-md shadow-emerald-200"
      >
        <Download className="h-4 w-4 mr-2" />
        {loading ? "Generating & Saving..." : "Generate & Save PDF"}
      </Button>
    </div>
  );
}
