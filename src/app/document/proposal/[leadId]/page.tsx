import { getLeadById } from "@/app/actions/lead";
import { notFound } from "next/navigation";
import { FileText, Calendar, CheckCircle2, DollarSign, Activity, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposal Penawaran - DK Power",
};

export default async function DocumentProposalPage({ params }: { params: Promise<{ leadId: string }> }) {
  const resolvedParams = await params;
  const res = await getLeadById(resolvedParams.leadId);
  
  if (!res.success || !res.data) {
    notFound();
  }

  const lead = res.data;
  let aiData: any = {};
  if (lead.aiAssessment) {
    try {
      aiData = JSON.parse(lead.aiAssessment);
    } catch (e) {
      console.error(e);
    }
  }

  const systemSize = aiData?.systemSize || "PLTS 50 kWp Hybrid";
  const investment = aiData?.investment || 0;
  const saving = aiData?.saving || 0;
  const roi = aiData?.roi || 0;
  const payback = aiData?.payback || 0;

  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col gap-8 print:gap-0 font-sans text-slate-800">
      
      {/* PAGE 1: COVER */}
      <div className="w-[210mm] h-[297mm] bg-white shadow-xl print:shadow-none print:w-auto print:h-auto relative overflow-hidden break-after-page">
        {/* Cover Background Graphic */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-[60%] bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-bl-[200px]" />
          <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-emerald-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-16 h-full flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center font-black text-emerald-600 text-2xl">
              DK
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter">DK POWER</h2>
              <p className="text-xs font-bold tracking-widest text-emerald-100 uppercase">Energy Solutions</p>
            </div>
          </div>

          <div className="mt-auto mb-32 bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-2xl border border-white/50 w-[85%] max-w-xl">
            <h1 className="text-5xl font-black text-slate-800 mb-6 leading-tight uppercase tracking-tight">Proposal<br/><span className="text-emerald-600">Penawaran</span></h1>
            <div className="w-20 h-2 bg-emerald-500 mb-8 rounded-full" />
            <h2 className="text-3xl font-bold text-slate-700 mb-2">{systemSize}</h2>
            <h3 className="text-xl font-medium text-slate-500 mb-8">{lead.customer.name}</h3>
            
            <div className="space-y-2 mt-8 border-t border-slate-200 pt-6">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Lokasi Proyek</p>
              <p className="text-lg font-medium text-slate-800">{lead.customer.address}</p>
              <p className="text-sm font-medium text-slate-500 mt-4">Tanggal: {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2: EXECUTIVE SUMMARY */}
      <div className="w-[210mm] h-[297mm] bg-white shadow-xl print:shadow-none print:w-auto print:h-auto relative p-16 break-after-page">
        <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Executive Summary</h2>
            <p className="text-slate-500 mt-2">Ringkasan Spesifikasi & Keselarasan Proyek</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-black">
            DK
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6">
          <p>
            Yth. Bapak/Ibu PIC dari <strong>{lead.customer.name}</strong>,<br/>
            Berdasarkan survei awal dan asesmen kecerdasan buatan (AI) yang telah kami lakukan pada atap lokasi {lead.customer.address}, kami dengan bangga menyampaikan proposal desain Pembangkit Listrik Tenaga Surya (PLTS) Atap.
          </p>
          
          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Latar Belakang & Keselarasan (Alignment)</h3>
          <p>
            Proposal ini dirancang secara spesifik berdasarkan hasil kualifikasi sistem. Fokus kami adalah memastikan sistem <strong>{systemSize}</strong> ini mampu mengatasi tantangan energi di fasilitas Anda secara optimal, sejalan dengan catatan diskusi awal kita:
          </p>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4 mb-8">
            <p className="italic text-slate-600">"{aiData?.analysis || 'Rekomendasi teknis yang berfokus pada ketahanan energi (energy resilience) dan penghematan jangka panjang.'}"</p>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Spesifikasi Utama Sistem</h3>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
              <Zap className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Kapasitas Pembangkitan</h4>
                <p className="text-sm text-slate-600 mt-1">{systemSize}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Topologi Sistem</h4>
                <p className="text-sm text-slate-600 mt-1">Sesuai dengan standardisasi On-Grid / Hybrid / Off-Grid yang relevan.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 3: FINANCIAL ANALYSIS */}
      <div className="w-[210mm] h-[297mm] bg-white shadow-xl print:shadow-none print:w-auto print:h-auto relative p-16 break-after-page">
        <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Analisis Finansial</h2>
            <p className="text-slate-500 mt-2">Kalkulasi Keekonomian & Pengembalian Modal (ROI)</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-black">
            DK
          </div>
        </div>

        <div className="bg-slate-800 text-white p-8 rounded-2xl mb-12 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">Estimasi Nilai Investasi (CAPEX)</h3>
          <p className="text-5xl font-black tracking-tight">{formatCurrency(investment)}</p>
          <p className="text-sm text-slate-400 mt-4">*Harga estimasi di luar pajak dan penambahan struktur atap khusus (jika diperlukan).</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="border border-slate-200 rounded-2xl p-8">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <DollarSign className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Penghematan per Tahun</h4>
            <p className="text-3xl font-black text-emerald-600">{formatCurrency(saving * 12)}</p>
            <p className="text-sm text-slate-500 mt-2">Atau sekitar {formatCurrency(saving)} / bulan dari tagihan listrik berjalan.</p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-8">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Return on Investment (ROI)</h4>
            <p className="text-3xl font-black text-blue-600">{roi}%</p>
            <p className="text-sm text-slate-500 mt-2">Tingkat pengembalian modal per tahun yang atraktif.</p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-8 col-span-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <h4 className="text-lg font-bold text-slate-800">Payback Period</h4>
              </div>
              <p className="text-sm text-slate-500">Estimasi waktu kembali modal (BEP)</p>
            </div>
            <p className="text-4xl font-black text-orange-500">{payback} Tahun</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
          <h4 className="font-bold text-amber-800 mb-2">Catatan Final</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            Perhitungan ini bersifat estimatif berdasarkan data parameter awal (irradiasi matahari standar, jam tayang beban puncak rata-rata). Hasil daya yang sebenarnya dapat sedikit berbeda bergantung pada kondisi cuaca rill dan efisiensi panel setelah instalasi fisik (site-survey final).
          </p>
        </div>
      </div>
      
    </div>
  );
}
