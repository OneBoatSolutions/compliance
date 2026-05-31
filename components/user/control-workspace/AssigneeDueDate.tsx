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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* 👤 Assignee */}
      <div>
        <p className="text-sm mb-1">Assignee</p>

        <div className="flex items-center border border-muted rounded-md px-2">
          <User size={16} className="text-muted-foreground" />
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full p-2 outline-none bg-transparent text-sm"
            placeholder="Select assignee"
          />
        </div>
      </div>

      {/* 📅 Due Date */}
      <div>
        <p className="text-sm mb-1">Due Date</p>

        <div className="flex items-center border border-muted rounded-md px-2">
          <Calendar size={16} className="text-muted-foreground" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 outline-none bg-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
}
