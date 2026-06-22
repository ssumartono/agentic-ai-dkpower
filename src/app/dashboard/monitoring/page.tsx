"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Zap, Battery, Home, ArrowRight, ArrowDown, ArrowUp, Activity, CheckCircle2, SunMedium } from "lucide-react";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PvTrendChart } from "@/components/monitoring/PvTrendChart";
import { TodayProductionChart } from "@/components/monitoring/TodayProductionChart";
import { MonthlyProductionChart } from "@/components/monitoring/MonthlyProductionChart";

function formatTime(date: Date) {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

export default function MonitoringDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("realtime");
  
  // Power states
  const [pvPower, setPvPower] = useState(42.5);
  const [loadPower, setLoadPower] = useState(40.2);
  const [batteryPower, setBatteryPower] = useState(-5.0); // negative = charging, positive = discharging
  const [gridPower, setGridPower] = useState(-2.7); // grid = load - pv - battery (if negative, exporting)
  
  const [batterySOC, setBatterySOC] = useState(86.5);
  const [todayProduction, setTodayProduction] = useState(256.4);
  
  // Chart data state
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const initialData = [];
    const now = new Date();
    for(let i = 20; i > 0; i--) {
      const pastTime = new Date(now.getTime() - i * 2000);
      const prod = Math.max(0, 40 + Math.random() * 5);
      const cons = 38 + Math.random() * 5;
      const isImport = cons > prod;
      initialData.push({
        time: formatTime(pastTime),
        "Production (kW)": Number(prod.toFixed(1)),
        "Consumption (kW)": Number(cons.toFixed(1)),
        "Import (kW)": isImport ? Number((cons - prod).toFixed(1)) : 0,
        "Export (kW)": !isImport ? Number((prod - cons).toFixed(1)) : 0,
      });
    }
    setChartData(initialData);
    setMounted(true);

    const interval = setInterval(() => {
      const currentTime = new Date();
      
      const newPv = 35 + Math.random() * 12;
      const newLoad = 30 + Math.random() * 20;
      
      let newBatt = 0;
      let newGrid = 0;

      if (newPv > newLoad) {
        const excess = newPv - newLoad;
        newBatt = -Math.min(excess, 8); 
        newGrid = -(excess + newBatt); 
      } else {
        const deficit = newLoad - newPv;
        newBatt = Math.min(deficit, 10); 
        newGrid = deficit - newBatt; 
      }

      setPvPower(newPv);
      setLoadPower(newLoad);
      setBatteryPower(newBatt);
      setGridPower(newGrid);

      setTodayProduction(prev => prev + (newPv / 3600) * 2);

      setChartData(prev => {
        const isImport = newLoad > newPv;
        const newDataPoint = {
          time: formatTime(currentTime),
          "Production (kW)": Number(newPv.toFixed(1)),
          "Consumption (kW)": Number(newLoad.toFixed(1)),
          "Import (kW)": isImport ? Number((newLoad - newPv).toFixed(1)) : 0,
          "Export (kW)": !isImport ? Number((newPv - newLoad).toFixed(1)) : 0,
        };
        const newData = [...prev, newDataPoint];
        if (newData.length > 20) newData.shift();
        return newData;
      });

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-6 space-y-6 w-full">
      {/* HEADER */}
      <h1 className="text-2xl font-bold tracking-tight text-emerald-700">6. Energy Monitoring Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-slate-100 h-full">
            <CardContent className="p-6">
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-slate-800 font-bold border rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50">
                  <span className="text-sm">PT Maju Bersama</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  Online
                </div>
              </div>

              <div className="space-y-8">
                <div 
                  className="cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-lg transition-colors"
                  onClick={() => setActiveTab("pvtrend")}
                >
                  <p className="text-sm font-medium text-slate-500 mb-2">Current PV Power</p>
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-blue-600 transition-all duration-300">
                      {pvPower.toFixed(1)} kW
                    </h2>
                    <Activity className="h-5 w-5 text-emerald-500 animate-pulse" />
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100" />

                <div 
                  className="cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-lg transition-colors"
                  onClick={() => setActiveTab("today")}
                >
                  <p className="text-sm font-medium text-slate-500 mb-2">Today Production</p>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-blue-600 transition-all duration-300">
                      {todayProduction.toFixed(2)} kWh
                    </h2>
                    <ChevronDown className="h-5 w-5 text-slate-300 -rotate-90" />
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100" />

                <div 
                  className="cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-lg transition-colors"
                  onClick={() => setActiveTab("monthly")}
                >
                  <p className="text-sm font-medium text-slate-500 mb-2">This Month</p>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-blue-600">7.2 MWh</h2>
                    <ChevronDown className="h-5 w-5 text-slate-300 -rotate-90" />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANELS */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* TOP ROW: Power Flow & Performance */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-auto">
            
            {/* Power Flow */}
            <Card className="xl:col-span-3 shadow-sm border-slate-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-800 mb-6">Live Power Flow</h3>
                
                <div className="relative h-64 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {/* PV to Load */}
                    <line x1="25%" y1="35%" x2="50%" y2="55%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="37.5%" cy="45%" r="4" fill="#3b82f6" className="animate-ping" style={{ animationDuration: '1.5s' }} />
                    
                    {/* Battery to Load */}
                    <line x1="50%" y1="35%" x2="50%" y2="55%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="50%" cy="45%" r="4" fill="#10b981" className="animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }} />

                    {/* Grid to Load */}
                    <line x1="75%" y1="35%" x2="50%" y2="55%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="62.5%" cy="45%" r="4" fill="#fb923c" className="animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }} />
                  </svg>

                  <div className="w-full flex flex-col items-center justify-center relative z-10 space-y-12">
                    
                    {/* Top Row: PV, Battery, Grid */}
                    <div className="flex items-center justify-between w-4/5">
                      {/* PV */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">PV</span>
                        <div className="w-14 h-14 bg-white border-2 border-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                          <SunMedium className="h-7 w-7 text-emerald-500" />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-bold text-slate-800 block transition-all">{pvPower.toFixed(1)} kW</span>
                        </div>
                      </div>

                      {/* Battery */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Battery</span>
                        <div className={`w-14 h-14 bg-white border-2 ${batteryPower < 0 ? 'border-emerald-500' : batteryPower > 0 ? 'border-amber-500' : 'border-slate-300'} rounded-xl flex items-center justify-center shadow-md relative transition-colors`}>
                          <Battery className={`h-7 w-7 ${batteryPower < 0 ? 'text-emerald-600' : batteryPower > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
                          <div className={`absolute -top-2 -right-2 ${batteryPower < 0 ? 'bg-emerald-500' : batteryPower > 0 ? 'bg-amber-500' : 'bg-slate-400'} rounded-full w-4 h-4 border-2 border-white`} />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-bold block transition-all">{Math.abs(batteryPower).toFixed(1)} kW</span>
                          <span className="text-[10px] text-slate-400 uppercase">{batteryPower < 0 ? 'Charging' : batteryPower > 0 ? 'Discharging' : 'Standby'}</span>
                        </div>
                      </div>

                      {/* Grid */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Grid</span>
                        <div className="w-14 h-14 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                          <Zap className="h-7 w-7 text-slate-400" />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-bold text-slate-800 block transition-all">{Math.abs(gridPower).toFixed(1)} kW</span>
                          <span className="text-[10px] text-slate-400 uppercase">{gridPower < 0 ? 'Export' : 'Import'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Load */}
                    <div className="flex items-center justify-center w-full">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-white border-2 border-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                          <Home className="h-7 w-7 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-semibold text-slate-500 block">Load</span>
                          <span className="text-sm font-bold text-slate-800 block transition-all">{loadPower.toFixed(1)} kW</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="xl:col-span-2 shadow-sm border-slate-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-800 mb-6">Performance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-4">
                  {/* Item 1 */}
                  <div className="flex flex-col items-center xl:flex-row xl:justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center xl:text-left gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500">Production</span>
                      <span className="text-2xl font-black text-slate-800">98%</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Good
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex flex-col items-center xl:flex-row xl:justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center xl:text-left gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500">Battery SOC</span>
                      <span className="text-2xl font-black text-slate-800 transition-all">{batterySOC.toFixed(1)}%</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Good
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex flex-col items-center xl:flex-row xl:justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center xl:text-left gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500">Inverter</span>
                      <span className="text-2xl font-black text-slate-800">95%</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Good
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* BOTTOM ROW: Energy Chart */}
          <Card className="shadow-sm border-slate-100">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800">Energy Analysis</h3>
                  <TabsList>
                    <TabsTrigger value="realtime">Real-Time</TabsTrigger>
                    <TabsTrigger value="pvtrend">PV Trend</TabsTrigger>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="realtime" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12 }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          cursor={{ fill: '#f8fafc' }}
                          animationDuration={300}
                        />
                        <Legend 
                          iconType="circle" 
                          wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                        />
                        <Bar dataKey="Production (kW)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
                        <Bar dataKey="Consumption (kW)" fill="#fb923c" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
                        <Line type="monotone" dataKey="Import (kW)" stroke="#64748b" strokeWidth={2} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="Export (kW)" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" isAnimationActive={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="pvtrend" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                  <div className="h-80 w-full">
                    <PvTrendChart />
                  </div>
                </TabsContent>

                <TabsContent value="today" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                  <div className="h-80 w-full">
                    <TodayProductionChart />
                  </div>
                </TabsContent>

                <TabsContent value="monthly" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                  <div className="h-80 w-full">
                    <MonthlyProductionChart />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
