import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { getLeadById } from "@/app/actions/lead";
import { ProposalActions } from "@/components/proposal/ProposalActions";

export default async function ProposalGeneratorPage({ searchParams }: { searchParams: Promise<{ leadId?: string }> }) {
  const resolvedParams = await searchParams;
  const leadId = resolvedParams?.leadId;
  
  let lead = null;
  let aiData = null;

  if (leadId) {
    const res = await getLeadById(leadId);
    if (res.success && res.data) {
      lead = res.data;
      if (lead.aiAssessment) {
        aiData = JSON.parse(lead.aiAssessment);
      }
    }
  }
  const steps = [
    { id: 1, label: "1. Data Pelanggan" },
    { id: 2, label: "2. Sistem & Harga" },
    { id: 3, label: "3. Proposal", active: true },
    { id: 4, label: "4. Review" },
  ];

  const contents = [
    "Cover",
    "Executive Summary",
    "Existing Condition",
    "Proposed System",
    "Financial Analysis (ROI)",
    "Technical Drawing (SLD)",
    "Terms & Conditions",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-6 space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-600">4. Proposal Generator</h1>
        {!lead && (
          <p className="text-sm text-slate-500">Please select a Lead from the Pipeline or Lead Details to generate a proposal.</p>
        )}
      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center w-full gap-2 overflow-x-auto pb-2">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div 
              className={`px-6 py-3 rounded-lg text-sm font-semibold border whitespace-nowrap transition-colors ${
                step.active 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {step.label}
            </div>
            {idx < steps.length - 1 && (
              <div className="w-8 h-px bg-slate-300 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Cover Preview */}
        <Card className="lg:col-span-2 shadow-sm border-slate-100 overflow-hidden relative group">
          <CardContent className="p-0 relative aspect-[4/3] bg-white flex flex-col justify-between">
            {/* Background Cover Image */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-95" 
              style={{ backgroundImage: 'url("/proposal_cover.png")' }}
            />
            
            {/* Overlay Text Content designed to look like the proposal cover */}
            <div className="relative z-10 flex flex-col h-full p-12 bg-gradient-to-r from-white/90 via-white/70 to-transparent">
              <div className="mb-16">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-sm" />
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">DK POWER</h2>
                </div>
                <p className="text-xs font-bold tracking-widest text-slate-500 uppercase ml-10">Energy Solutions</p>
              </div>

              <div className="flex-1 flex flex-col justify-center max-w-md">
                <h1 className="text-4xl font-black text-slate-800 mb-4 leading-tight">PROPOSAL PENAWARAN</h1>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">
                  {aiData?.systemSize || "PLTS 50 kWp Hybrid"}
                </h2>
                <h3 className="text-xl font-medium text-slate-600">
                  {lead?.customer?.name || "PT Maju Bersama"}
                </h3>
                <div className="w-12 h-1 bg-emerald-500 mt-8 mb-6" />
                <p className="text-sm font-semibold text-emerald-700">
                  {lead?.customer?.address || "Palembang"}, {new Date().toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Contents & Actions */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-6 text-lg">
              Isi Proposal
            </h3>
            
            <div className="space-y-4 flex-1">
              {contents.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
              ))}
            </div>

            <ProposalActions leadId={leadId} />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
