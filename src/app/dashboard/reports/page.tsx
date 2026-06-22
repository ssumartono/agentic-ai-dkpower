"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  BarChart4, 
  Settings, 
  Download, 
  Calendar, 
  Plus,
  PieChart,
  Activity,
  Briefcase
} from "lucide-react";

const recentReports = [
  { id: 'REP-1021', name: 'Q2 Sales Performance', category: 'Sales & Revenue', date: '21 Jun 2025', format: 'PDF', size: '2.4 MB' },
  { id: 'REP-1020', name: 'May Project Delivery SLA', category: 'Project Delivery', date: '01 Jun 2025', format: 'Excel', size: '1.1 MB' },
  { id: 'REP-1019', name: 'PT Maju Bersama Energy Yield', category: 'Energy Performance', date: '15 May 2025', format: 'PDF', size: '3.5 MB' },
  { id: 'REP-1018', name: 'Q1 Financial Summary', category: 'Sales & Revenue', date: '01 Apr 2025', format: 'PDF', size: '1.8 MB' },
  { id: 'REP-1017', name: 'Installation Issues Log', category: 'Project Delivery', date: '28 Mar 2025', format: 'CSV', size: '0.4 MB' },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-6 space-y-6 w-full">
      {/* HEADER & FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Reports & Analytics</h1>
          <p className="text-sm text-slate-500">Generate and manage your business intelligence reports.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm text-sm font-medium text-slate-600 w-full md:w-auto">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Last 30 Days</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap w-full md:w-auto">
            <Plus className="h-4 w-4" />
            New Report
          </button>
        </div>
      </div>

      {/* TOP METRICS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Reports Generated</p>
              <h2 className="text-2xl font-bold text-slate-800">1,248</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Scheduled Reports</p>
              <h2 className="text-2xl font-bold text-slate-800">12</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <PieChart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Active Dashboards</p>
              <h2 className="text-2xl font-bold text-slate-800">5</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Report Categories */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <h3 className="font-bold text-slate-800">Report Categories</h3>
          
          <Card className="shadow-sm border-slate-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BarChart4 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Sales & Revenue</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Lead conversion rates, revenue forecasts, and outstanding invoice summaries.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Project Delivery</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Installation SLAs, project bottlenecks, procurement delays, and completion rates.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Energy Performance</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Client system yields, grid import/export ratios, and battery degradation stats.</p>
              </div>
            </CardContent>
          </Card>
          
        </div>

        {/* RIGHT COLUMN: Generated Reports Archive */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-100 h-full">
            <CardContent className="p-0">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Generated Reports Archive</h3>
                <button className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Manage
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Report Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date Generated</th>
                      <th className="px-6 py-4">Format</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((rep, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{rep.name}</span>
                            <span className="text-xs text-slate-400">{rep.id} &bull; {rep.size}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{rep.category}</td>
                        <td className="px-6 py-4">{rep.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            rep.format === 'PDF' ? 'bg-red-50 text-red-600' : 
                            rep.format === 'Excel' ? 'bg-emerald-50 text-emerald-600' : 
                            'bg-blue-50 text-blue-600'
                          }`}>
                            {rep.format}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Download className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 text-center">
                <button className="text-sm font-bold text-blue-600 hover:text-blue-800">View All Archives</button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
