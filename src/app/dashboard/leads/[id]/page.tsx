import { getLeadById } from "@/app/actions/lead";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, Building, User as UserIcon, Phone, Mail, MapPin, 
  MoreVertical, Calendar, CheckCircle2, FileText, Lock, MessageCircle,
  Bot
} from "lucide-react";
import { LeadStatusSelect } from "@/components/leads/LeadStatusSelect";
import { ConvertOpportunityDialog } from "@/components/leads/ConvertOpportunityDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { EditLeadDialog } from "@/components/leads/EditLeadDialog";
import { DeleteLeadButton } from "@/components/leads/DeleteLeadButton";
import { GenerateAIAssessmentButton } from "@/components/leads/GenerateAIAssessmentButton";
import { ScheduleActionDialog } from "@/components/leads/ScheduleActionDialog";
import { ActivityTab } from "@/components/leads/ActivityTab";
import { DocumentsTab } from "@/components/leads/DocumentsTab";
import { NotesTab } from "@/components/leads/NotesTab";


export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await getLeadById(resolvedParams.id);

  if (!res || !res.success || !res.data) {
    notFound();
  }

  const lead = res.data;

  const isConverted = !!lead.opportunity;

  // AI Assessment Data
  const aiAssessmentData = lead.aiAssessment ? JSON.parse(lead.aiAssessment) : null;
  const hasAssessment = !!aiAssessmentData;

  const aiRecommendation = hasAssessment ? {
    systemSize: aiAssessmentData.systemSize,
    investment: aiAssessmentData.investment,
    saving: aiAssessmentData.saving,
    payback: aiAssessmentData.payback,
    roi: aiAssessmentData.roi,
    probability: aiAssessmentData.probability || 0
  } : null;

  const nextActions = hasAssessment && aiAssessmentData.nextActions ? aiAssessmentData.nextActions.map((a: any) => ({
    label: a.label,
    icon: a.iconType === 'Calendar' ? Calendar : a.iconType === 'FileText' ? FileText : a.iconType === 'Lock' ? Lock : MessageCircle,
    done: false
  })) : [];



  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-6 space-y-6 w-full">
      
      {/* 1. Page Header (Breadcrumb) */}
      <div className="flex items-center text-sm font-medium text-slate-500">
        <h1 className="text-lg font-bold text-slate-800 mr-4">2. AI Sales Cockpit (Lead Detail)</h1>
      </div>
      
      <div>
        <Link href="/dashboard/leads" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Leads
        </Link>
      </div>

      {/* 2. Lead Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 bg-blue-50/50 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0 shadow-inner">
            <Building className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{lead.customer.name}</h2>
              <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2.5 font-medium">
              <span>{lead.customer.type === "B2B" ? "Industri Manufaktur" : "Residensial"}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {lead.customer.address || "Belum ada alamat lengkap"}</span>
            </div>
            <div className="flex items-center gap-5 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><UserIcon className="h-4 w-4 text-slate-400" /> {lead.title} (PIC)</span>
              <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-slate-400" /> {lead.customer.phone || "-"}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-slate-400" /> {lead.customer.email || "-"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <EditLeadDialog lead={lead} />
          {!isConverted ? (
            <ConvertOpportunityDialog leadId={lead.id} />
          ) : (
            <Link href="/dashboard/pipeline">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm">
                View Opportunity
              </Button>
            </Link>
          )}
          <DeleteLeadButton leadId={lead.id} />
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 space-x-8">
          <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none px-0 py-3 font-semibold text-slate-500">
            Overview
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none px-0 py-3 font-semibold text-slate-500">
            AI Assessment
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none px-0 py-3 font-semibold text-slate-500">
            Activity
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none px-0 py-3 font-semibold text-slate-500">
            Documents
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none px-0 py-3 font-semibold text-slate-500">
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Informasi Utama */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <h3 className="font-bold text-slate-800 mb-6 text-base tracking-tight">Informasi Utama</h3>
              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-2 text-sm items-center">
                  <span className="text-slate-500">Lead Source</span>
                  <span className="font-medium text-slate-800">Website</span>
                </div>
                <div className="grid grid-cols-2 text-sm items-center">
                  <span className="text-slate-500">Tanggal Dibuat</span>
                  <span className="font-medium text-slate-800">{new Date(lead.createdAt).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="grid grid-cols-2 text-sm items-center mt-2 pt-2 border-t border-slate-50">
                  <span className="text-slate-500">Monthly Bill</span>
                  <span className="font-medium text-slate-800">Rp 45.000.000</span>
                </div>
                <div className="grid grid-cols-2 text-sm items-center">
                  <span className="text-slate-500">Peak Load</span>
                  <span className="font-medium text-slate-800">75 kW</span>
                </div>
                <div className="grid grid-cols-2 text-sm items-center">
                  <span className="text-slate-500">Luas Atap</span>
                  <span className="font-medium text-slate-800">450 m²</span>
                </div>
                <div className="grid grid-cols-2 text-sm items-center mt-2 pt-2 border-t border-slate-50">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-emerald-600">{lead.status}</span>
                </div>
                <div className="grid grid-cols-2 text-sm items-center">
                  <span className="text-slate-500">Sales Owner</span>
                  <span className="font-medium text-slate-800">{lead.assignee?.name || "Rudi Hermawan"}</span>
                </div>
                <div className="grid grid-cols-2 text-sm items-start mt-2 pt-2 border-t border-slate-50">
                  <span className="text-slate-500">Alamat Lokasi</span>
                  <span className="font-medium text-slate-800 leading-snug">{lead.customer.address || "-"}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-slate-500 text-sm mb-2 block">Peta Lokasi</span>
                  {lead.customer.address ? (
                    <iframe 
                      width="100%" 
                      height="200" 
                      className="rounded-lg border border-slate-200 shadow-sm" 
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(lead.customer.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                      scrolling="no" 
                    ></iframe>
                  ) : (
                    <div className="w-full h-[200px] bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                      <MapPin className="h-8 w-8 mb-2 opacity-50" />
                      <span className="text-sm">Alamat belum diatur</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="font-bold text-slate-800 text-base tracking-tight">AI Recommendation</h3>
                <div className="bg-emerald-50 text-emerald-600 p-1 rounded-md">
                  <Bot className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-4 flex-1">
                {hasAssessment && aiRecommendation ? (
                  <>
                    <div className="grid grid-cols-2 text-sm items-center">
                      <span className="text-slate-500">Rekomendasi Sistem</span>
                      <span className="font-bold text-slate-800">{aiRecommendation.systemSize}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm items-center mt-2 pt-2 border-t border-slate-50">
                      <span className="text-slate-500">Estimasi Investasi</span>
                      <span className="font-bold text-slate-800">{aiRecommendation.investment}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm items-center">
                      <span className="text-slate-500">Estimated Saving</span>
                      <span className="font-bold text-slate-800">{aiRecommendation.saving}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm items-center mt-2 pt-2 border-t border-slate-50">
                      <span className="text-slate-500">Payback Period</span>
                      <span className="font-bold text-slate-800">{aiRecommendation.payback}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm items-center">
                      <span className="text-slate-500">ROI (IRR)</span>
                      <span className="font-bold text-slate-800">{aiRecommendation.roi}</span>
                    </div>
                    <div className="pt-5 mt-3 border-t border-slate-100">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-slate-500">Closing Probability</span>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">{aiRecommendation.probability}%</span>
                      </div>
                      <Progress value={aiRecommendation.probability} className="h-2.5 bg-slate-100 [&>div]:bg-emerald-500" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-slate-500">
                    <Bot className="h-10 w-10 text-slate-300" />
                    <p className="text-sm">Klik tombol di bawah untuk meminta AI membaca data prospek ini dan menyajikan rekomendasi sistem PLTS.</p>
                  </div>
                )}
              </div>
              {!hasAssessment && (
                <div className="mt-6">
                  <GenerateAIAssessmentButton leadId={lead.id} />
                </div>
              )}
            </div>

            {/* Next Best Action */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <h3 className="font-bold text-slate-800 mb-6 text-base tracking-tight">Next Best Action</h3>
              <div className="space-y-3 flex-1">
                {hasAssessment && nextActions.length > 0 ? (
                  nextActions.map((action: any, i: number) => {
                    const Icon = action.icon;
                    return (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer group bg-slate-50/50 hover:bg-emerald-50/30">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          <span className="text-sm font-medium text-slate-700">{action.label}</span>
                        </div>
                        <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-slate-500">
                    <p className="text-sm">Silakan generate AI Assessment terlebih dahulu untuk melihat rekomendasi tindakan selanjutnya.</p>
                  </div>
                )}
              </div>
              {hasAssessment && (
                <ScheduleActionDialog leadId={lead.id} defaultSubject={nextActions[0]?.label || ""} />
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-3">
              <h3 className="font-bold text-slate-800 mb-6 text-base tracking-tight">Recent Activity Preview</h3>
              <div className="space-y-5">
                {(!lead.activities || lead.activities.length === 0) ? (
                  <p className="text-sm text-slate-500">No activity yet. Schedule an action or add a note.</p>
                ) : (
                  lead.activities.slice(0, 3).map((act: any, i: number) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center border shrink-0 bg-slate-50 border-slate-200">
                        {act.type === "SYSTEM_LOG" ? (
                          <Bot className="h-5 w-5 text-slate-400" />
                        ) : (
                          <UserIcon className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-5">
                        <div>
                          <p className="font-semibold text-sm text-slate-800">{act.subject}</p>
                          <p className="text-sm text-slate-500 mt-0.5">{act.description}</p>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          {new Date(act.date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Bot className="h-6 w-6 text-emerald-600" />
              AI Sales Analysis
            </h3>
            {hasAssessment ? (
              <div className="prose prose-slate max-w-none">
                <div className="text-base text-slate-700 leading-relaxed bg-emerald-50/50 p-6 rounded-xl border border-emerald-100">
                  {aiAssessmentData.analysis}
                </div>
                
                <div className="flex flex-col gap-4 mb-4 mt-8">
                  <GenerateAIAssessmentButton leadId={lead.id} />
                  {hasAssessment && (
                    <Link href={`/dashboard/proposal?leadId=${lead.id}`} passHref>
                      <Button variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Proposal
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-4">
                <Bot className="h-16 w-16 text-slate-200" />
                <h4 className="text-lg font-semibold text-slate-700">Belum Ada Analisis AI</h4>
                <p className="text-slate-500 max-w-md mb-4">Klik tombol di bawah untuk menghasilkan analisis komprehensif terkait prospek ini.</p>
                <div className="w-64">
                  <GenerateAIAssessmentButton leadId={lead.id} />
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityTab activities={lead.activities || []} assigneeName={lead.assignee?.name || "Rudi Hermawan"} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentsTab documents={lead.documents || []} leadId={lead.id} />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <NotesTab leadId={lead.id} initialNotes={lead.notes} />
        </TabsContent>

      </Tabs>
    </div>
  );
}
