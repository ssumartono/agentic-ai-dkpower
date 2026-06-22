import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { getLeads } from "@/app/actions/lead";
import { CreateLeadDialog } from "@/components/leads/CreateLeadDialog";

export default async function LeadsPage() {
  const result = await getLeads();
  const leads = result.success ? result.data : [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "NEW": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "CONTACTED": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "QUALIFIED": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "PROPOSAL": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground mt-1">Manage your prospective customers and initial inquiries.</p>
        </div>
        <CreateLeadDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border border-border/50 shadow-sm shrink-0">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search leads by name or customer..." className="pl-9 bg-background" />
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[200px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads && leads.length > 0 ? leads.map((lead: any) => (
              <TableRow key={lead.id} className="cursor-pointer transition-colors hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/dashboard/leads/${lead.id}`} className="hover:underline text-primary">
                    {lead.id}
                  </Link>
                </TableCell>
                <TableCell>{lead.title}</TableCell>
                <TableCell>{lead.customer?.name || "Unknown"}</TableCell>
                <TableCell>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No leads found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
