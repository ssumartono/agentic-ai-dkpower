import { Bot, User as UserIcon, Calendar, CheckSquare, Phone, FileText } from "lucide-react";

export function ActivityTab({ activities, assigneeName }: { activities: any[], assigneeName: string }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <Calendar className="h-16 w-16 text-slate-200 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Recent Activity</h3>
        <p className="text-slate-500 max-w-md">There are no recorded activities for this lead yet.</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "MEETING": return <Calendar className="h-5 w-5 text-purple-500" />;
      case "TASK": return <CheckSquare className="h-5 w-5 text-blue-500" />;
      case "CALL": return <Phone className="h-5 w-5 text-emerald-500" />;
      case "SYSTEM_LOG": return <Bot className="h-5 w-5 text-slate-500" />;
      case "NOTE": return <FileText className="h-5 w-5 text-amber-500" />;
      default: return <UserIcon className="h-5 w-5 text-slate-400" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case "MEETING": return "bg-purple-50 border-purple-100";
      case "TASK": return "bg-blue-50 border-blue-100";
      case "CALL": return "bg-emerald-50 border-emerald-100";
      case "SYSTEM_LOG": return "bg-slate-50 border-slate-200";
      case "NOTE": return "bg-amber-50 border-amber-100";
      default: return "bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h3 className="text-xl font-bold text-slate-800 mb-8">Activity Timeline</h3>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {activities.map((act, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${getBgClass(act.type)}`}>
              {getIcon(act.type)}
            </div>
            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-slate-800 text-sm">{act.subject}</p>
                <time className="text-xs font-medium text-slate-400">
                  {new Date(act.date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                </time>
              </div>
              <p className="text-sm text-slate-600 mb-3">{act.description}</p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <UserIcon className="h-3 w-3 text-slate-500" />
                </div>
                <span className="text-xs font-medium text-slate-500">{assigneeName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
