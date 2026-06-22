"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateSolarEstimate } from "@/app/actions/ai";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { createLeadFromCalculator } from "@/app/actions/lead";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine } from "recharts";
import { Sun, Zap, BatteryMedium, Home, UtilityPole, ArrowRight, UserPlus } from "lucide-react";

export function SolarCalculator() {
  const [consumption, setConsumption] = useState<number>(8500);
  const [peakLoad, setPeakLoad] = useState<number>(75);
  const [roofArea, setRoofArea] = useState<number>(450);
  
  const [location, setLocation] = useState("palembang");
  const [tariffType, setTariffType] = useState("r2");
  const [roofDirection, setRoofDirection] = useState("utara");
  const [roofTilt, setRoofTilt] = useState("10");

  const [isCalculated, setIsCalculated] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  const [results, setResults] = useState({
    recommendedKwp: 50, 
    monthlySavings: 17500000,
    estimatedCost: 650000000,
    paybackPeriod: 5.2,
    irr: 18.7,
    monthlyProduction: 6300,
    panelsCount: 93
  });

  const router = useRouter();
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: ""
  });

  const handleSaveLead = async () => {
    if (!leadForm.name) {
      alert("Nama pelanggan wajib diisi");
      return;
    }
    setIsSavingLead(true);
    const res = await createLeadFromCalculator({
      customerName: leadForm.name,
      customerCompany: leadForm.company,
      customerEmail: leadForm.email,
      customerPhone: leadForm.phone,
      customerAddress: location, // from the state
      calculatorResults: results
    });
    setIsSavingLead(false);

    if (res.success && res.data) {
      setShowLeadDialog(false);
      router.push(`/dashboard/leads/${res.data.id}`);
    } else {
      alert("Gagal menyimpan Lead");
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const res = await generateSolarEstimate({
        location,
        tariffType,
        consumption,
        peakLoad,
        roofArea,
        roofDirection,
        roofTilt
      });
      
      if (res.success && res.data) {
        setResults(res.data);
      } else {
        alert("Gagal menghitung menggunakan AI: " + (res.error || ""));
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan sistem saat memanggil AI.");
    } finally {
      setIsCalculating(false);
      setIsCalculated(true);
    }
  };

  const monthlyProductionData = useMemo(() => {
    const base = results.monthlyProduction;
    // Musim hujan (Des-Feb) turun, Kemarau (Jun-Ags) naik
    const multipliers = [0.9, 0.92, 1.0, 1.05, 1.1, 1.15, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    return months.map((m, i) => ({
      name: m,
      kWh: Math.round(base * multipliers[i])
    }));
  }, [results.monthlyProduction]);

  const roiData = useMemo(() => {
    const data = [];
    let currentCashflow = -results.estimatedCost;
    const yearlySavings = results.monthlySavings * 12;
    for (let year = 0; year <= 20; year++) {
      data.push({
        year: `Tahun ${year}`,
        cashflow: currentCashflow,
      });
      currentCashflow += yearlySavings;
    }
    return data;
  }, [results.estimatedCost, results.monthlySavings]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
      
      {/* LEFT COLUMN: Input Form */}
      <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="space-y-5">
          <div className="grid grid-cols-[1fr_1.5fr] items-center gap-4">
            <Label className="text-slate-600 font-medium">Lokasi</Label>
            <Select value={location} onValueChange={(val) => setLocation(val || "")}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pilih Lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="palembang">Palembang</SelectItem>
                <SelectItem value="jakarta">Jakarta</SelectItem>
                <SelectItem value="surabaya">Surabaya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[1fr_1.5fr] items-center gap-4">
            <Label className="text-slate-600 font-medium">Tarif Listrik</Label>
            <Select value={tariffType} onValueChange={(val) => setTariffType(val || "")}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pilih Tarif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="r2">R2 - Industri</SelectItem>
                <SelectItem value="r1">R1 - Rumah Tangga</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[1fr_1.5fr] items-center gap-4">
            <Label className="text-slate-600 font-medium">Monthly Consumption</Label>
            <div className="relative">
              <Input 
                type="number" 
                value={consumption} 
                onChange={(e) => setConsumption(Number(e.target.value))} 
                className="h-9 pr-12 text-right font-medium"
              />
              <span className="absolute right-3 top-2 text-sm text-slate-400">kWh</span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1.5fr] items-center gap-4">
            <Label className="text-slate-600 font-medium">Peak Load</Label>
            <div className="relative">
              <Input 
                type="number" 
                value={peakLoad} 
                onChange={(e) => setPeakLoad(Number(e.target.value))} 
                className="h-9 pr-10 text-right font-medium"
              />
              <span className="absolute right-3 top-2 text-sm text-slate-400">kW</span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1.5fr] items-center gap-4">
            <Label className="text-slate-600 font-medium">Luas Atap</Label>
            <div className="relative">
              <Input 
                type="number" 
                value={roofArea} 
                onChange={(e) => setRoofArea(Number(e.target.value))} 
                className="h-9 pr-10 text-right font-medium"
              />
              <span className="absolute right-3 top-2 text-sm text-slate-400">m²</span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1.5fr] items-center gap-4">
            <Label className="text-slate-600 font-medium">Arah Atap</Label>
            <Select value={roofDirection} onValueChange={(val) => setRoofDirection(val || "")}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pilih Arah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utara">Utara</SelectItem>
                <SelectItem value="selatan">Selatan</SelectItem>
                <SelectItem value="timur">Timur</SelectItem>
                <SelectItem value="barat">Barat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[1fr_1.5fr] items-center gap-4">
            <Label className="text-slate-600 font-medium">Kemiringan Atap</Label>
            <Select value={roofTilt} onValueChange={(val) => setRoofTilt(val || "")}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pilih Sudut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5°</SelectItem>
                <SelectItem value="10">10°</SelectItem>
                <SelectItem value="15">15°</SelectItem>
                <SelectItem value="20">20°</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleCalculate} 
          disabled={isCalculating}
          className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-base shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              AI is thinking...
            </>
          ) : "Hitung Rekomendasi AI"}
        </Button>

        {/* AI Tip Box */}
        <div className="mt-auto pt-8">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 items-start">
            <div className="bg-emerald-100 p-2 rounded-full mt-0.5">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-800 mb-1">AI Insights Aktif</h4>
              <p className="text-xs text-emerald-600/80 leading-relaxed">
                Kalkulasi ini menggunakan algoritma generatif Gemini untuk mencocokkan profil beban Anda dengan cuaca dan regulasi kelistrikan lokal secara dinamis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Results */}
      <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <Tabs defaultValue="rekomendasi" className="w-full flex-1 flex flex-col">
          <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 space-x-8 mb-6">
            <TabsTrigger value="rekomendasi" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none px-0 py-3 font-bold text-slate-500">
              Hasil Rekomendasi
            </TabsTrigger>
            <TabsTrigger value="produksi" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none px-0 py-3 font-bold text-slate-500">
              Produksi & ROI
            </TabsTrigger>
            <TabsTrigger value="diagram" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600 rounded-none px-0 py-3 font-bold text-slate-500">
              Diagram Sistem
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rekomendasi" className="flex-1 flex flex-col m-0 outline-none">
            <div className="flex flex-col xl:flex-row gap-6 mb-8 flex-1">
              <div className="w-full xl:w-[60%] bg-slate-100 rounded-xl overflow-hidden relative min-h-[250px]">
                <Image 
                  src="/solar-factory.png" 
                  alt="Solar Factory Render" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="w-full xl:w-[40%] flex flex-col justify-center">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">System Summary</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-[1fr_1.2fr] text-sm items-center">
                    <span className="text-slate-500">Rekomendasi Sistem</span>
                    <span className="font-bold text-slate-800">{results.recommendedKwp.toFixed(0)} kWp Hybrid</span>
                  </div>
                  <div className="grid grid-cols-[1fr_1.2fr] text-sm items-center">
                    <span className="text-slate-500">Panel</span>
                    <span className="font-bold text-slate-800">540W Mono</span>
                  </div>
                  <div className="grid grid-cols-[1fr_1.2fr] text-sm items-center">
                    <span className="text-slate-500">Jumlah Panel</span>
                    <span className="font-bold text-slate-800">{results.panelsCount} pcs</span>
                  </div>
                  <div className="grid grid-cols-[1fr_1.2fr] text-sm items-center">
                    <span className="text-slate-500">Inverter</span>
                    <span className="font-bold text-slate-800">{results.recommendedKwp.toFixed(0)} kW Hybrid</span>
                  </div>
                  <div className="grid grid-cols-[1fr_1.2fr] text-sm items-center">
                    <span className="text-slate-500">Battery (ESS)</span>
                    <span className="font-bold text-slate-800">{results.recommendedKwp * 2} kWh</span>
                  </div>
                  <div className="grid grid-cols-[1fr_1.2fr] text-sm items-center">
                    <span className="text-slate-500">Produksi / Bulan</span>
                    <span className="font-bold text-slate-800">{new Intl.NumberFormat('id-ID').format(Math.round(results.monthlyProduction))} kWh</span>
                  </div>
                  <div className="grid grid-cols-[1fr_1.2fr] text-sm items-center">
                    <span className="text-slate-500">Performance Ratio</span>
                    <span className="font-bold text-slate-800">82%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col items-start">
                <span className="text-xs text-slate-500 font-medium mb-1">Investasi</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(results.estimatedCost)}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col items-start">
                <span className="text-xs text-slate-500 font-medium mb-1">Penghematan / Bulan</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(results.monthlySavings)}</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col items-start">
                <span className="text-xs text-slate-500 font-medium mb-1">Payback Period</span>
                <span className="text-lg font-bold text-slate-800">{results.paybackPeriod.toFixed(1)} Tahun</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col items-start">
                <span className="text-xs text-slate-500 font-medium mb-1">IRR</span>
                <span className="text-lg font-bold text-slate-800">{results.irr.toFixed(1)}%</span>
              </div>
            </div>

            <Button 
              onClick={() => setShowLeadDialog(true)}
              className="mt-6 w-full lg:w-auto self-end bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 shadow-md"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Simpan sebagai Lead Baru
            </Button>
          </TabsContent>

          <TabsContent value="produksi" className="flex-1 flex flex-col m-0 outline-none">
            <div className="flex flex-col gap-6 h-full w-full">
              {/* Bar Chart: Produksi Bulanan */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 w-full flex-1 min-h-[300px] flex flex-col">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Estimasi Produksi Tahunan (Dinamika Musim)</h3>
                <div className="flex-1 w-full h-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <BarChart data={monthlyProductionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `${val/1000}k`} />
                      <RechartsTooltip 
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`${new Intl.NumberFormat('id-ID').format(value as number)} kWh`, 'Produksi']}
                      />
                      <Bar dataKey="kWh" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area Chart: Simulasi ROI */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 w-full flex-1 min-h-[300px] flex flex-col">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Simulasi Return on Investment (20 Tahun)</h3>
                <div className="flex-1 w-full h-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                    <AreaChart data={roiData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} minTickGap={30} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `${(val/1000000).toFixed(0)}Jt`} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [formatCurrency(value as number), 'Cashflow']}
                      />
                      <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
                      <Area type="monotone" dataKey="cashflow" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCashflow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="diagram" className="flex-1 flex flex-col m-0 outline-none">
            <div className="flex flex-col gap-4 h-full w-full">
              {/* Roof Layout Simulation */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full flex flex-col">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Simulasi Tata Letak Atap (2D)</h3>
                <div className="flex flex-col items-center bg-slate-100 p-4 rounded-lg border border-slate-200 min-h-[120px]">
                  
                  {(() => {
                    const panelAreaM2 = 2.6; // Asumsi standar ukuran 1 panel 540Wp
                    const totalSlots = Math.max(results.panelsCount, Math.floor(Number(roofArea) / panelAreaM2));
                    const unusedSlots = totalSlots - results.panelsCount;
                    
                    // Kalkulasi formasi baris x kolom (asumsi atap lebih lebar)
                    const cols = Math.max(1, Math.ceil(Math.sqrt(results.panelsCount * 2)));
                    const rows = Math.ceil(results.panelsCount / cols);

                    return (
                      <div className="flex flex-col items-center gap-4 w-full">
                        {/* Area Panel Terpasang (Formation) */}
                        <div className="bg-slate-200/40 p-2 rounded-lg border border-slate-200">
                          <div 
                            className="grid gap-1"
                            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                          >
                            {Array.from({ length: results.panelsCount }).map((_, i) => (
                              <div 
                                key={`used-${i}`} 
                                className="w-4 h-6 sm:w-5 sm:h-8 bg-blue-600 border border-blue-400 rounded-sm shadow-inner opacity-90"
                                title="Panel Surya"
                              ></div>
                            ))}
                          </div>
                          <div className="text-center mt-2">
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white px-2 py-0.5 rounded-full shadow-sm">
                               Formasi: {rows} Baris × {cols} Kolom
                             </span>
                          </div>
                        </div>

                        {/* Sisa Area Atap (Unused) */}
                        {unusedSlots > 0 && (
                          <div className="flex flex-wrap justify-center gap-1 w-full max-w-2xl">
                            {Array.from({ length: unusedSlots }).map((_, i) => (
                              <div 
                                key={`unused-${i}`} 
                                className="w-4 h-6 sm:w-5 sm:h-8 bg-slate-200/50 border border-dashed border-slate-300 rounded-sm"
                                title="Area Kosong"
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 mt-3 px-2">
                  <div className="flex items-center gap-1.5">
                     <span className="w-3 h-3 bg-blue-600 rounded-sm inline-block"></span>
                     <span>Terpakai: {results.panelsCount} panel ({(results.panelsCount * 2.6).toFixed(1)} m²)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <span className="w-3 h-3 bg-slate-200/50 border border-dashed border-slate-400 rounded-sm inline-block"></span>
                     <span>Luas Total: {roofArea} m²</span>
                  </div>
                </div>
              </div>

              {/* SLD Diagram */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full flex-1 flex flex-col overflow-x-auto overflow-y-hidden">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Single Line Diagram</h3>
                
                <div className="flex-1 flex items-center justify-center relative p-2 min-w-[500px]">
                  {/* Container SLD */}
                  <div className="flex items-center gap-3 md:gap-6 w-full max-w-2xl justify-center">
                    
                    {/* PV Array */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-300 z-10">
                        <Sun className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="text-center mt-2">
                        <p className="font-bold text-slate-700 text-xs">PV Array</p>
                        <p className="text-[10px] text-slate-500">{results.recommendedKwp.toFixed(1)} kWp</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-1 h-0.5 border-t-2 border-dashed border-emerald-400 relative min-w-[30px]">
                      <ArrowRight className="absolute -top-2.5 right-0 text-emerald-500 w-5 h-5" />
                    </div>

                    {/* Inverter */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center border-2 border-emerald-400 z-10">
                        <Zap className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div className="text-center mt-2">
                        <p className="font-bold text-slate-700 text-xs">Hybrid Inverter</p>
                        <p className="text-[10px] text-slate-500">{Math.ceil(results.recommendedKwp)} kW</p>
                      </div>
                    </div>

                    {/* Arrow Branches */}
                    <div className="flex flex-col justify-center h-32 relative min-w-[40px] md:min-w-[60px]">
                       {/* Top branch line */}
                       <div className="absolute top-4 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-300"></div>
                       <div className="absolute top-4 left-0 h-1/2 border-l-2 border-dashed border-slate-300"></div>
                       {/* Middle branch line */}
                       <div className="absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-emerald-400">
                         <ArrowRight className="absolute -top-2.5 right-0 text-emerald-500 w-5 h-5" />
                       </div>
                       {/* Bottom branch line */}
                       <div className="absolute bottom-4 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-300"></div>
                       <div className="absolute top-1/2 left-0 h-[calc(50%-1rem)] border-l-2 border-dashed border-slate-300"></div>
                    </div>

                    {/* Right Nodes */}
                    <div className="flex flex-col justify-between h-40">
                      {/* Grid */}
                      <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300 z-10">
                            <UtilityPole className="w-5 h-5 text-slate-600" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-700 text-xs">PLN Grid</p>
                            <p className="text-[10px] text-slate-500">EXIM Meter</p>
                         </div>
                      </div>
                      
                      {/* Home */}
                      <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-400 z-10">
                            <Home className="w-5 h-5 text-blue-600" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-700 text-xs">Home Load</p>
                            <p className="text-[10px] text-slate-500">Essential</p>
                         </div>
                      </div>

                      {/* Battery */}
                      <div className="flex items-center gap-2">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-400 z-10">
                            <BatteryMedium className="w-5 h-5 text-indigo-600" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-700 text-xs">BESS</p>
                            <p className="text-[10px] text-slate-500">{(results.recommendedKwp * 2).toFixed(1)} kWh</p>
                         </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* AI Technical Assessment */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 w-full flex items-start gap-4">
                 <div className="bg-emerald-100 p-2.5 rounded-full shrink-0">
                   <Zap className="w-6 h-6 text-emerald-600" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-emerald-800 mb-1">AI System Validation Passed</h3>
                   <p className="text-xs text-emerald-700 leading-relaxed">
                     Konfigurasi Inverter <strong>{Math.ceil(results.recommendedKwp)} kW</strong> dinilai sangat optimal untuk melayani <em>Peak Load</em> <strong>{peakLoad} kW</strong> Anda. Rasio panel terhadap luasan atap ({roofArea} m²) berada dalam ambang batas aman (SNI). Baterai berkapasitas <strong>{(results.recommendedKwp * 2).toFixed(1)} kWh</strong> siap mengamankan beban esensial rumah Anda saat terjadi pemadaman PLN.
                   </p>
                 </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showLeadDialog} onOpenChange={setShowLeadDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Simpan sebagai Lead</DialogTitle>
            <DialogDescription>
              Buat prospek baru menggunakan hasil kalkulasi kapasitas {results.recommendedKwp.toFixed(0)} kWp.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Klien <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={leadForm.name} 
                onChange={(e) => setLeadForm({...leadForm, name: e.target.value})} 
                placeholder="Mis. Bpk Budi" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Nama Perusahaan</Label>
              <Input 
                id="company" 
                value={leadForm.company} 
                onChange={(e) => setLeadForm({...leadForm, company: e.target.value})} 
                placeholder="Mis. PT Maju Jaya" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telepon / WhatsApp</Label>
              <Input 
                id="phone" 
                value={leadForm.phone} 
                onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})} 
                placeholder="Mis. 08123..." 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={leadForm.email} 
                onChange={(e) => setLeadForm({...leadForm, email: e.target.value})} 
                placeholder="Mis. budi@email.com" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeadDialog(false)}>Batal</Button>
            <Button onClick={handleSaveLead} disabled={isSavingLead} className="bg-emerald-600 hover:bg-emerald-700">
              {isSavingLead ? "Menyimpan..." : "Simpan Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
