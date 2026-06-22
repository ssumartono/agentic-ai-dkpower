import { getProjects, getAllTasks, getAllIssues, seedTasksAndIssuesIfNeeded } from "@/app/actions/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HardHat, Activity, CheckCircle2, CircleDashed, ListTodo, AlertTriangle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default async function ProjectsPage() {
  await seedTasksAndIssuesIfNeeded();

  const [projectsResult, tasksResult, issuesResult] = await Promise.all([
    getProjects(),
    getAllTasks(),
    getAllIssues()
  ]);

  const projects = projectsResult.success ? projectsResult.data : [];
  const tasks = tasksResult.success ? tasksResult.data : [];
  const issues = issuesResult.success ? issuesResult.data : [];

  const formatCurrency = (val: number | null) => {
    if (!val) return "-";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING": return "bg-blue-100 text-blue-700";
      case "PROCUREMENT": return "bg-purple-100 text-purple-700";
      case "INSTALLATION": return "bg-amber-100 text-amber-700";
      case "COMMISSIONING": return "bg-emerald-100 text-emerald-700";
      case "COMPLETED": return "bg-slate-100 text-slate-700";
      case "TODO": return "bg-slate-100 text-slate-700";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-700";
      case "DONE": return "bg-emerald-100 text-emerald-700";
      case "OPEN": return "bg-red-100 text-red-700";
      case "RESOLVED": return "bg-emerald-100 text-emerald-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getPrioritySeverityColor = (level: string) => {
    switch (level) {
      case "LOW":
      case "MINOR": return "bg-slate-100 text-slate-700";
      case "MEDIUM": return "bg-amber-100 text-amber-700";
      case "HIGH":
      case "MAJOR": return "bg-orange-100 text-orange-700";
      case "CRITICAL": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Project Delivery Center</h1>
          <p className="text-slate-500 mt-1">Pantau eksekusi konstruksi, daftar tugas, dan permasalahan proyek secara terpusat.</p>
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit mb-4">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <HardHat className="h-4 w-4" /> Active Projects
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" /> View All Tasks
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> View All Issues
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ACTIVE PROJECTS */}
        <TabsContent value="projects" className="flex-1 flex flex-col min-h-0 mt-0 focus-visible:outline-none">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
            <Card className="shadow-sm border-slate-100">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <HardHat className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Projects</p>
                  <h3 className="text-2xl font-bold text-slate-800">{projects?.length || 0}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-slate-100">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">In Progress</p>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {projects?.filter((p: any) => p.status !== 'COMPLETED').length || 0}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-100">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Completed</p>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {projects?.filter((p: any) => p.status === 'COMPLETED').length || 0}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-slate-100 flex-1 flex flex-col min-h-0">
            <CardHeader className="shrink-0">
              <CardTitle className="text-lg">Daftar Proyek Berjalan</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contract Value</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead className="w-[200px]">Progress</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <CircleDashed className="h-8 w-8 text-slate-300" />
                          <p>Belum ada proyek. Geser kartu ke tahap WON di Pipeline untuk membuat proyek baru.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects?.map((project: any) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium text-slate-800">
                          {project.opportunity?.lead?.title}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {project.opportunity?.lead?.customer?.name}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(project.opportunity?.value)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(project.status)} hover:${getStatusColor(project.status)} border-none`}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex-1">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                                style={{ width: `${project.progress}%` }} 
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-500 w-8 text-right">
                              {project.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <a href={`/dashboard/projects/${project.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                            View Detail &rarr;
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: ALL TASKS */}
        <TabsContent value="tasks" className="flex-1 flex flex-col min-h-0 mt-0 focus-visible:outline-none">
          <Card className="shadow-sm border-slate-100 flex-1 flex flex-col min-h-0">
            <CardHeader className="shrink-0">
              <CardTitle className="text-lg">View All Tasks</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Title</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <CircleDashed className="h-8 w-8 text-slate-300" />
                          <p>Belum ada tugas untuk proyek apapun.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tasks?.map((task: any) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium text-slate-800">
                          {task.title}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {task.project?.opportunity?.lead?.title || "Unknown Project"}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(task.status)} hover:${getStatusColor(task.status)} border-none`}>
                            {task.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getPrioritySeverityColor(task.priority)} hover:${getPrioritySeverityColor(task.priority)} border-none`}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500">
                          {task.dueDate ? format(new Date(task.dueDate), "dd MMM yyyy") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <a href={`/dashboard/projects/${task.projectId}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                            View Project &rarr;
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: ALL ISSUES */}
        <TabsContent value="issues" className="flex-1 flex flex-col min-h-0 mt-0 focus-visible:outline-none">
          <Card className="shadow-sm border-slate-100 flex-1 flex flex-col min-h-0">
            <CardHeader className="shrink-0">
              <CardTitle className="text-lg">View All Issues</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue Title</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <CircleDashed className="h-8 w-8 text-slate-300" />
                          <p>Belum ada masalah (issue) yang dilaporkan.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    issues?.map((issue: any) => (
                      <TableRow key={issue.id}>
                        <TableCell>
                          <div className="font-medium text-slate-800">{issue.title}</div>
                          {issue.description && <div className="text-xs text-slate-500 truncate max-w-sm mt-1">{issue.description}</div>}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {issue.project?.opportunity?.lead?.title || "Unknown Project"}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(issue.status)} hover:${getStatusColor(issue.status)} border-none`}>
                            {issue.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getPrioritySeverityColor(issue.severity)} hover:${getPrioritySeverityColor(issue.severity)} border-none`}>
                            {issue.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500">
                          {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <a href={`/dashboard/projects/${issue.projectId}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                            View Project &rarr;
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
