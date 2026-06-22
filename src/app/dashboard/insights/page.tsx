import { Card, CardContent } from "@/components/ui/card";
import { 
  Bot, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  FileSearch,
  UserCog,
  ShieldAlert,
  TerminalSquare,
  Activity
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ViewJsonDialog } from "@/components/insights/ViewJsonDialog";
import { RuleConfigurator } from "@/components/insights/RuleConfigurator";

export const dynamic = "force-dynamic";

export default async function AIInsightsPage() {
  // Ensure default rules exist
  const rulesCount = await prisma.aIGovernanceRule.count();
  if (rulesCount === 0) {
    await prisma.aIGovernanceRule.createMany({
      data: [
        { name: "Roof Dimension / Area", impact: "HIGH", frequency: 42, description: "Often missing in initial leads from Simulator." },
        { name: "Exact PLN Bill Value", impact: "MED", frequency: 28, description: "Users often input rough estimates instead of exact bills." },
        { name: "Site Pictures", impact: "LOW", frequency: 65, description: "Needed for accurate shadow analysis by Technical Reviewer." }
      ]
    });
  }

  // Fetch real metrics from Database
  const totalGenerations = await prisma.aILog.count({
    where: { actionType: "SOLAR_ESTIMATE" }
  });

  const allLogs = await prisma.aILog.findMany({
    where: { actionType: "SOLAR_ESTIMATE", isError: false },
    orderBy: { createdAt: "desc" }
  });

  const totalErrors = await prisma.aILog.count({
    where: { actionType: "SOLAR_ESTIMATE", isError: true }
  });

  // Calculate Average Confidence
  let avgConfidence = 0;
  if (allLogs.length > 0) {
    const sum = allLogs.reduce((acc, log) => acc + (log.confidenceScore || 0), 0);
    avgConfidence = sum / allLogs.length;
  }

  // Calculate Human Correction Rate (Simulated for now, could be based on DB later)
  const humanCorrectionRate = 12.5; 

  // Get the latest log for the console
  const latestLog = allLogs[0];
  let latestInput: any = null;
  let latestOutput: any = null;
  
  if (latestLog?.inputPayload) {
    try { latestInput = JSON.parse(latestLog.inputPayload); } catch (e) {}
  }
  if (latestLog?.outputPayload) {
    try { latestOutput = JSON.parse(latestLog.outputPayload); } catch (e) {}
  }

  const rules = await prisma.aIGovernanceRule.findMany({
    orderBy: { impact: "asc" } // HIGH, LOW, MED (alphabetical, but it works for now)
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-6 space-y-6 w-full">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">AI Agent Console & Insights</h1>
        <p className="text-sm text-slate-500">Monitor AI governance, agent performance, and confidence metrics.</p>
      </div>

      {/* TOP METRICS (AI Governance Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500">AI Generated Proposals</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Bot className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-slate-800">{totalGenerations}</span>
              <span className="text-sm font-semibold text-blue-600">Total requests logged</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500">Confidence Average</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <BrainCircuit className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-slate-800">{(avgConfidence * 100).toFixed(1)}%</span>
              <span className="text-sm font-semibold text-emerald-600">Based on Gemini AI inputs</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500">Human Correction Rate</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <UserCog className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-slate-800">{humanCorrectionRate}%</span>
              <span className="text-sm font-semibold text-amber-600">Minor technical tweaks</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="shadow-sm border-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500">Blocked / Errors</span>
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-slate-800">{totalErrors}</span>
              <span className="text-sm font-semibold text-red-600">Failed calculations</span>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: AI Agent Console (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TerminalSquare className="h-5 w-5 text-indigo-600" />
            Live Agent Consoles
          </h3>

          {/* Agent 1: AI Estimator */}
          <Card className="shadow-sm border-indigo-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-16 bg-indigo-50/50 rounded-bl-full -z-10" />
            
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">AI Estimator</h4>
                    {latestLog ? (
                      <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xs mt-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        Last Run: {new Date(latestLog.createdAt).toLocaleString("id-ID")}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs mt-1">Idle - No tasks yet</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Confidence Score</span>
                  <p className="text-2xl font-black text-indigo-600 mt-1">
                    {latestLog?.confidenceScore ? latestLog.confidenceScore.toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>

              {latestLog && latestInput ? (
                <>
                  <div className="bg-white border border-slate-100 rounded-xl p-4 mb-6 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-700">Latest Processed Lead</span>
                      <span className="text-sm font-bold text-slate-800 capitalize">{latestInput.location || "Unknown"}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold mb-1">Consumption</p>
                        <p className="text-sm font-bold text-slate-700">{latestInput.consumption} kWh</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-semibold mb-1">Peak Load</p>
                        <p className="text-sm font-bold text-slate-700">{latestInput.peakLoad} kW</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-semibold mb-1">Roof Area</p>
                        <p className="text-sm font-bold text-slate-700">{latestInput.roofArea} m²</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-semibold mb-1">Processing Time</p>
                        <p className="text-sm font-bold text-slate-700">{latestLog.processingTime} ms</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-xs font-bold text-emerald-800 mb-1">System Recommendation</span>
                        <span className="text-sm text-emerald-700 leading-tight">
                          Recommended {latestOutput?.recommendedKwp || 0} kWp system with {latestOutput?.panelsCount || 0} panels.
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No AI runs recorded yet. Go to Calculator to run an estimate.</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                <ViewJsonDialog inputPayload={latestInput} outputPayload={latestOutput} />
              </div>
            </CardContent>
          </Card>

          {/* Agent 2: AI Technical Reviewer */}
          <Card className="shadow-sm border-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                    <FileSearch className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">AI Technical Reviewer</h4>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mt-1">
                      <Activity className="w-4 h-4 animate-pulse" />
                      Online - Monitoring Pipeline
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-800">Score: 0.95 (Avg)</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: Logs & Missing Data */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-slate-500" />
            Common Missing Data
          </h3>

          <Card className="shadow-sm border-slate-100 h-full">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {rules.map(rule => (
                  <div key={rule.id} className={`p-4 transition-colors ${rule.isActive ? 'bg-white' : 'bg-slate-50 opacity-70'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-bold text-sm ${rule.isActive ? 'text-slate-800' : 'text-slate-500 line-through'}`}>{rule.name}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        rule.impact === 'HIGH' ? 'text-red-500 bg-red-50' : 
                        rule.impact === 'MED' ? 'text-amber-500 bg-amber-50' : 
                        'text-slate-500 bg-slate-100'
                      }`}>
                        {rule.impact} Impact
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{rule.description}</p>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                      <span>Frequency: {rule.frequency}%</span>
                      <RuleConfigurator rule={rule} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 text-center rounded-b-xl border-t border-slate-100">
                <Link href="/dashboard/insights/logs" className="text-sm font-bold text-slate-600 hover:text-slate-800">
                  View Full AI Logs &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
