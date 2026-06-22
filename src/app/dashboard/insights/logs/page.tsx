import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AILogsPage() {
  const logs = await prisma.aILog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100 // Limit to last 100 for performance
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-6 space-y-6 w-full">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/insights" className="text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Full AI Logs</h1>
          <p className="text-sm text-slate-500">Comprehensive history of all AI actions and metacognition data.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <CardTitle className="text-lg font-bold text-slate-800">Recent AI Activity (Last 100)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600">Timestamp</TableHead>
                  <TableHead className="font-semibold text-slate-600">Action Type</TableHead>
                  <TableHead className="font-semibold text-slate-600">Location (Lead)</TableHead>
                  <TableHead className="font-semibold text-slate-600">Confidence</TableHead>
                  <TableHead className="font-semibold text-slate-600">Time (ms)</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => {
                    let location = "Unknown";
                    if (log.inputPayload) {
                      try {
                        const parsed = JSON.parse(log.inputPayload);
                        location = parsed.location || "Unknown";
                      } catch(e) {}
                    }

                    return (
                      <TableRow key={log.id} className="hover:bg-slate-50/50">
                        <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                          {log.createdAt.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                            {log.actionType}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-800 capitalize">
                          {location}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-bold text-slate-700">
                            {log.confidenceScore ? log.confidenceScore.toFixed(2) : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {log.processingTime}
                        </TableCell>
                        <TableCell className="text-right">
                          {log.isError ? (
                            <div className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
                              <AlertTriangle className="w-4 h-4" />
                              Error
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Success
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
