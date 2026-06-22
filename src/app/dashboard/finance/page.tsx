"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Wallet,
  Receipt
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

const revenueData = [
  { name: 'Jan', revenue: 120, target: 100 },
  { name: 'Feb', revenue: 150, target: 120 },
  { name: 'Mar', revenue: 180, target: 150 },
  { name: 'Apr', revenue: 220, target: 180 },
  { name: 'May', revenue: 260, target: 200 },
  { name: 'Jun', revenue: 310, target: 250 },
  { name: 'Jul', revenue: 280, target: 280 },
];

const recentInvoices = [
  { id: 'INV-2025-001', client: 'PT Maju Bersama', date: '10 Jun 2025', amount: 'Rp 450.000.000', status: 'PAID' },
  { id: 'INV-2025-002', client: 'CV Sentosa Jaya', date: '12 Jun 2025', amount: 'Rp 125.000.000', status: 'PENDING' },
  { id: 'INV-2025-003', client: 'PT Mega Konstruksi', date: '01 Jun 2025', amount: 'Rp 85.000.000', status: 'OVERDUE' },
  { id: 'INV-2025-004', client: 'Bpk. Ahmad Wijaya', date: '15 Jun 2025', amount: 'Rp 35.000.000', status: 'PAID' },
  { id: 'INV-2025-005', client: 'RS Medika Indah', date: '18 Jun 2025', amount: 'Rp 650.000.000', status: 'PENDING' },
];

const recentTransactions = [
  { title: 'Payment from PT Maju Bersama', time: '2 hours ago', amount: '+Rp 450.000.000', type: 'in' },
  { title: 'Server Hosting (AWS)', time: 'Yesterday', amount: '-Rp 2.500.000', type: 'out' },
  { title: 'Payment from Bpk. Ahmad Wijaya', time: '2 days ago', amount: '+Rp 35.000.000', type: 'in' },
  { title: 'Office Supplies', time: '3 days ago', amount: '-Rp 4.200.000', type: 'out' },
];

export default function FinanceDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-6 space-y-6 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Finance & Billing</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
          <Receipt className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Revenue */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500">Total Revenue (YTD)</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-slate-800">Rp 2.450 Jt</span>
              <div className="flex items-center text-sm font-semibold text-emerald-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+18.5%</span>
                <span className="text-slate-400 ml-1 font-normal">from last year</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Invoices */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500">Outstanding</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-slate-800">Rp 775 Jt</span>
              <div className="flex items-center text-sm font-semibold text-slate-500">
                <span>Across 12 pending invoices</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500">Overdue Invoices</span>
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-red-600">Rp 85 Jt</span>
              <div className="flex items-center text-sm font-semibold text-red-500">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>Requires immediate action</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT AREA: Chart & Table (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Chart */}
          <Card className="shadow-sm border-slate-100">
            <CardContent className="p-6">
              <h3 className="font-bold text-slate-800 mb-6">Revenue vs Target (Million IDR)</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
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
                    />
                    <Legend 
                      iconType="circle" 
                      wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                    />
                    <Bar dataKey="revenue" name="Actual Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="target" name="Target Revenue" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card className="shadow-sm border-slate-100">
            <CardContent className="p-0">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Recent Invoices</h3>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Invoice ID</th>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((inv, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{inv.id}</td>
                        <td className="px-6 py-4">{inv.client}</td>
                        <td className="px-6 py-4">{inv.date}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{inv.amount}</td>
                        <td className="px-6 py-4">
                          {inv.status === 'PAID' && (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold">PAID</span>
                          )}
                          {inv.status === 'PENDING' && (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md text-xs font-bold">PENDING</span>
                          )}
                          {inv.status === 'OVERDUE' && (
                            <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-md text-xs font-bold">OVERDUE</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-slate-600">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* RIGHT AREA: Recent Transactions */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border-slate-100 h-full">
            <CardContent className="p-6">
              <h3 className="font-bold text-slate-800 mb-6">Recent Transactions</h3>
              
              <div className="space-y-6">
                {recentTransactions.map((tx, idx) => (
                  <div key={idx} className="flex items-start justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        tx.type === 'in' ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100' : 'bg-red-50 text-red-500 group-hover:bg-red-100'
                      }`}>
                        {tx.type === 'in' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800 line-clamp-1">{tx.title}</span>
                        <span className="text-xs text-slate-500">{tx.time}</span>
                      </div>
                    </div>
                    <span className={`text-sm font-bold whitespace-nowrap ${tx.type === 'in' ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 w-full">
                <button className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Download Statement
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
