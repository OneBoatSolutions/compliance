import { User, Calendar } from "lucide-react";

interface AssigneeDueDateProps {
  assignee: string;
  setAssignee: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
}

export function AssigneeDueDate({
  assignee,
  setAssignee,
  dueDate,
  setDueDate,
}: AssigneeDueDateProps) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Assignee */}
        <div
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
          role="group"
          aria-labelledby="assignee-heading"
        >
          <div className="flex items-center gap-2 mb-3">
            <User size={14} className="text-purple-600" />
            <p className="text-sm font-medium text-slate-700">Assignee</p>
          </div>

          <div
            className="
              flex items-center gap-2
              rounded-lg border border-slate-200
              px-3 py-2 bg-slate-50
              focus-within:border-purple-500
              focus-within:ring-4
              focus-within:ring-purple-500/10
              transition-all
            "
          >
            <User size={16} className="text-slate-400" />

            <input
              aria-label="Assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Select assignee"
            />
          </div>
          <p id="assignee-help" className="mt-2  text-xs text-slate-500">
            Person responsible for this control.
          </p>
        </div>

        {/* Due Date */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-purple-600" />
            <p className="text-sm font-medium text-slate-700">Due Date</p>
          </div>

          <div
            className="
              flex items-center gap-2
              rounded-lg border border-slate-200
              px-3 py-2 bg-slate-50
              focus-within:border-purple-500
              focus-within:ring-4
              focus-within:ring-purple-500/10
              transition-all
            "
          >
            <Calendar size={16} className="text-slate-400" />

            <input
              type="date"
              value={dueDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
              aria-describedby="due-date-help"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          <p className="mt-2 text-xs text-slate-500" id="due-date-help">
            Target completion date for this control.
          </p>
        </div>
      </div>
    </div>
  );
}
