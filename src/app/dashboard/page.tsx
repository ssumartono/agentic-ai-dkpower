"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar,
  PieChart, Pie, Cell
} from "recharts";
import { 
  ArrowUp, FolderKanban, Zap, Leaf, BrainCircuit, AlertTriangle, Lightbulb, Clock, CheckCircle2
} from "lucide-react";

const trendData = [
  { name: 'Jan', lastYear: 1800000, thisYear: 3500000 },
  { name: 'Feb', lastYear: 2200000, thisYear: 4200000 },
  { name: 'Mar', lastYear: 3400000, thisYear: 6000000 },
  { name: 'Apr', lastYear: 3200000, thisYear: 5500000 },
  { name: 'May', lastYear: 4200000, thisYear: 6800000 },
  { name: 'Jun', lastYear: 5100000, thisYear: 9000000 },
];

const capacityData = [
  { name: 'Jan', kwp: 800 },
  { name: 'Feb', kwp: 1200 },
  { name: 'Mar', kwp: 2100 },
  { name: 'Apr', kwp: 2400 },
  { name: 'May', kwp: 3100 },
  { name: 'Jun', kwp: 3800 },
];

const categoryData = [
  { name: 'Solar Panel', value: 62, color: '#3b82f6' },
  { name: 'ESS (Battery)', value: 18, color: '#22c55e' },
  { name: 'Inverter', value: 10, color: '#0ea5e9' },
  { name: 'UPS & Genset', value: 6, color: '#38bdf8' },
  { name: 'Others', value: 4, color: '#0284c7' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full gap-4 pb-0">
      {/* Top Row - KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 shrink-0">
        {/* Card 1 */}
        <Card className="border-slate-100 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-md bg-[#22c55e]/10 flex items-center justify-center">
                <LayoutIcon className="h-4 w-4 text-[#22c55e]" />
              </div>
              <span className="text-sm font-medium text-slate-500">Pipeline Value</span>
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">Rp 2.4 Miliar</div>
            <div className="flex items-center text-xs font-medium text-[#22c55e]">
              <ArrowUp className="h-3 w-3 mr-1" /> + 12.5% <span className="text-slate-400 font-normal ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-slate-100 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-md bg-[#3b82f6]/10 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-[#3b82f6]" />
              </div>
              <span className="text-sm font-medium text-slate-500">New Leads</span>
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">38</div>
            <div className="flex items-center text-xs font-medium text-[#22c55e]">
              <ArrowUp className="h-3 w-3 mr-1" /> + 5 <span className="text-slate-400 font-normal ml-1">this week</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-slate-100 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-md bg-[#f97316]/10 flex items-center justify-center">
                <FolderKanban className="h-4 w-4 text-[#f97316]" />
              </div>
              <span className="text-sm font-medium text-slate-500">Proposal Sent</span>
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">17</div>
            <div className="flex items-center text-xs font-medium text-[#22c55e]">
              <ArrowUp className="h-3 w-3 mr-1" /> + 2 <span className="text-slate-400 font-normal ml-1">this week</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-slate-100 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-md bg-[#f59e0b]/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-[#f59e0b]" />
              </div>
              <span className="text-sm font-medium text-slate-500">Won Deals</span>
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">6</div>
            <div className="flex items-center text-xs font-medium text-[#22c55e]">
              <ArrowUp className="h-3 w-3 mr-1" /> + 1 <span className="text-slate-400 font-normal ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 5 */}
        <Card className="border-slate-100 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-md bg-[#10b981]/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-[#10b981]" />
              </div>
              <span className="text-sm font-medium text-slate-500">Installed Capacity</span>
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">125.4 kWp</div>
            <div className="flex items-center text-xs font-medium text-slate-400">
              Total operational system
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-[1.2] min-h-0">
        {/* Sales Pipeline Funnel */}
        <Card className="border-slate-100 shadow-sm rounded-xl flex flex-col h-full">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold text-slate-800">Sales Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center pt-6 pb-8">
            <div className="space-y-3 w-full max-w-[280px] mx-auto">
              <FunnelLayer label="New" count="38" percentage="100%" width="100%" color="bg-[#3b82f6]" />
              <FunnelLayer label="Qualified" count="24" percentage="63%" width="85%" color="bg-[#0ea5e9]" />
              <FunnelLayer label="Proposal" count="17" percentage="45%" width="70%" color="bg-[#38bdf8]" />
              <FunnelLayer label="Negotiation" count="10" percentage="26%" width="55%" color="bg-[#4ade80]" />
              <FunnelLayer label="Won Deals" count="6" percentage="16%" width="40%" color="bg-[#22c55e]" />
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="border-slate-100 shadow-sm rounded-xl flex flex-col h-full">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold text-slate-800">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-6 pb-2 px-2 min-h-0 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 25, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(val) => `${val / 1000000}M`}
                />
                <Tooltip 
                  formatter={(value: any) => [`Rp ${(value/1000000).toFixed(1)}M`, undefined]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ bottom: -5, fontSize: '12px' }} />
                <Line type="monotone" name="This Year" dataKey="thisYear" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Last Year" dataKey="lastYear" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Projects */}
        <Card className="border-slate-100 shadow-sm rounded-xl h-full overflow-hidden flex flex-col">
          <CardHeader className="pb-2 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-base font-semibold text-slate-800">Top Projects</CardTitle>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-800">View All</button>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pr-4 min-h-0">
            <div className="space-y-4 mt-1">
              <ProjectItem title="PLTS PT Maju Bersama" value="Rp 650.000.000" percent={78} />
              <ProjectItem title="PLTS CV Sinar Abadi" value="Rp 420.000.000" percent={65} />
              <ProjectItem title="PLTS Gudang Sejahtera" value="Rp 330.000.000" percent={45} />
              <ProjectItem title="PLTS Pabrik Makmur" value="Rp 580.000.000" percent={30} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Recent Activities & AI Insight */}
        <Card className="border-slate-100 shadow-sm rounded-xl flex flex-col h-full">
          <CardHeader className="pb-3 shrink-0">
            <CardTitle className="text-base font-semibold text-slate-800">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 flex-1 overflow-auto pr-2 min-h-0">
            <InsightItem 
              icon={<FolderKanban className="h-4 w-4 text-blue-600" />} 
              bgColor="bg-blue-100" 
              text="Proposal generated for PT ABC" 
            />
            <InsightItem 
              icon={<BrainCircuit className="h-4 w-4 text-indigo-600" />} 
              bgColor="bg-indigo-100" 
              text="Lead from simulator: Rumah Palembang" 
            />
            <InsightItem 
              icon={<Lightbulb className="h-4 w-4 text-amber-600" />} 
              bgColor="bg-amber-100" 
              text="New lead entered pipeline: CV Sinar Abadi" 
            />
            <InsightItem 
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} 
              bgColor="bg-emerald-100" 
              text="Won Deal: 6.6 kWp System at Ruko Citra" 
            />
          </CardContent>
        </Card>

        {/* Installed Capacity */}
        <Card className="border-slate-100 shadow-sm rounded-xl flex flex-col h-full">
          <CardHeader className="pb-0 shrink-0">
            <CardTitle className="text-base font-semibold text-slate-800">Installed Capacity (kWp)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-6 pb-2 px-2 min-h-0 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="kwp" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card className="border-slate-100 shadow-sm rounded-xl flex flex-col h-full">
          <CardHeader className="pb-0 shrink-0">
            <CardTitle className="text-base font-semibold text-slate-800">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-between pt-2 min-h-0">
            <div className="w-[140px] h-[140px] relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-500 font-medium">Total</span>
                <span className="text-xs font-bold text-slate-800">Rp 12.8 M</span>
              </div>
            </div>
            
            <div className="flex-1 pl-6 space-y-2.5">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helpers

function LayoutIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <line x1="3" x2="21" y1="9" y2="9"/>
      <line x1="9" x2="9" y1="21" y2="9"/>
    </svg>
  );
}

function FunnelLayer({ label, count, percentage, width, color }: { label: string, count: string, percentage: string, width: string, color: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="w-20 font-medium text-slate-600">{label}</div>
      <div className="flex-1 flex justify-center">
        <div className={`h-8 ${color} rounded-sm relative`} style={{ width }}>
          {/* Using a simple rectangular approach for the funnel to keep it clean, as CSS trapezoids are tricky with text inside */}
        </div>
      </div>
      <div className="w-24 text-right">
        <span className="font-bold text-slate-800 mr-2">{count}</span>
        <span className="text-xs text-slate-500">({percentage})</span>
      </div>
    </div>
  );
}

function ProjectItem({ title, value, percent }: { title: string, value: string, percent: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-start">
        <span className="text-sm font-semibold text-slate-800">{title}</span>
        <span className="text-sm font-bold text-slate-800">{percent}%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">{value}</span>
        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}

function InsightItem({ icon, bgColor, text }: { icon: React.ReactNode, bgColor: string, text: string }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
      <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bgColor}`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-700 leading-snug">{text}</p>
    </div>
  );
}
