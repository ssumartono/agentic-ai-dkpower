"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building, 
  Users, 
  BrainCircuit, 
  Link as LinkIcon, 
  Save,
  CheckCircle2,
  Shield,
  CreditCard,
  MessageSquare
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const tabs = [
    { id: "organization", label: "Organization", icon: Building },
    { id: "users", label: "User Management", icon: Users },
    { id: "ai", label: "AI Preferences", icon: BrainCircuit },
    { id: "integrations", label: "Integrations", icon: LinkIcon },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-6 space-y-6 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Settings</h1>
          <p className="text-sm text-slate-500">Manage your organization's configurations and AI rules.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {showSaved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {showSaved ? "Saved Successfully" : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* LEFT TAB MENU */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-white text-blue-600 shadow-sm border border-slate-100" 
                    : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1">
          <Card className="shadow-sm border-slate-100 min-h-[500px]">
            <CardContent className="p-8">
              
              {/* TAB: ORGANIZATION */}
              {activeTab === "organization" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Organization Profile</h2>
                    <p className="text-sm text-slate-500">Public information displayed on proposals and invoices.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Company Name</label>
                      <input 
                        type="text" 
                        defaultValue="DK Power Energy" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Legal Entity (NPWP Name)</label>
                      <input 
                        type="text" 
                        defaultValue="PT Energi Nusantara DK" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700">Headquarters Address</label>
                      <textarea 
                        rows={3}
                        defaultValue="Jl. Sudirman Kav 21, Jakarta Pusat, 10220" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Support Email</label>
                      <input 
                        type="email" 
                        defaultValue="support@dkpower.com" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Support Phone</label>
                      <input 
                        type="text" 
                        defaultValue="+62 811 9922 8833" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: USER MANAGEMENT */}
              {activeTab === "users" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">User Management</h2>
                      <p className="text-sm text-slate-500">Manage team members and their access levels.</p>
                    </div>
                    <button className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                      + Invite User
                    </button>
                  </div>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <span className="block font-bold text-slate-800">Andi Setiawan</span>
                            <span className="text-xs text-slate-400">andi@dkpower.com</span>
                          </td>
                          <td className="px-4 py-3"><span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold">Admin</span></td>
                          <td className="px-4 py-3"><span className="text-emerald-600 font-semibold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Active</span></td>
                          <td className="px-4 py-3 text-right"><button className="text-blue-600 hover:text-blue-800 font-semibold">Edit</button></td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <span className="block font-bold text-slate-800">Budi Santoso</span>
                            <span className="text-xs text-slate-400">budi@dkpower.com</span>
                          </td>
                          <td className="px-4 py-3"><span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold">Engineer</span></td>
                          <td className="px-4 py-3"><span className="text-emerald-600 font-semibold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Active</span></td>
                          <td className="px-4 py-3 text-right"><button className="text-blue-600 hover:text-blue-800 font-semibold">Edit</button></td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <span className="block font-bold text-slate-800">Citra Kirana</span>
                            <span className="text-xs text-slate-400">citra@dkpower.com</span>
                          </td>
                          <td className="px-4 py-3"><span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold">Sales</span></td>
                          <td className="px-4 py-3"><span className="text-slate-400 font-semibold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"/> Pending</span></td>
                          <td className="px-4 py-3 text-right"><button className="text-blue-600 hover:text-blue-800 font-semibold">Edit</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: AI PREFERENCES */}
              {activeTab === "ai" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-slate-800">AI Preferences & Guardrails</h2>
                    <p className="text-sm text-slate-500">Set boundaries and rules for autonomous AI agents.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Shield className="h-5 w-5" /></div>
                        <div>
                          <h4 className="font-bold text-slate-800">Financial Safety Limits</h4>
                          <p className="text-xs text-slate-500">Rules applied strictly to AI Proposal Writer</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Minimum Allowed Margin (%)</label>
                          <input type="number" defaultValue="15" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Max Discount Ceiling (%)</label>
                          <input type="number" defaultValue="5" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"/>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800">Auto-Approve Proposals</h4>
                        <p className="text-xs text-slate-500 max-w-[80%]">Allow AI to directly email proposals to customers if Confidence Score &gt; 95% and within Margin limits.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800">Strict Missing Data Blocking</h4>
                        <p className="text-xs text-slate-500 max-w-[80%]">Force AI to pause and request human input if high-impact data (e.g. Roof Area) is missing, bypassing assumptions.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB: INTEGRATIONS */}
              {activeTab === "integrations" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Third-Party Integrations</h2>
                    <p className="text-sm text-slate-500">Connect DK Power with external services.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="p-5 border border-emerald-100 bg-emerald-50/30 rounded-xl flex items-start gap-4">
                      <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-800">WhatsApp API</h4>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">Connected</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">For auto-sending proposals and notifications.</p>
                        <button className="text-xs font-semibold border border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">Configure</button>
                      </div>
                    </div>

                    <div className="p-5 border border-slate-200 rounded-xl flex items-start gap-4">
                      <div className="p-3 bg-slate-100 text-slate-500 rounded-lg shrink-0">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-800">Midtrans Payment</h4>
                          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Inactive</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Accept virtual accounts and credit cards.</p>
                        <button className="text-xs font-semibold border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">Connect</button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
