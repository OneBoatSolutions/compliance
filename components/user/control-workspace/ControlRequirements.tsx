import { ClipboardList, CheckCircle2 } from "lucide-react";


export default function ControlRequirements() {
  const items = [
    { text: "Documented authorization process for ePHI", done: true },
    { text: "Monthly audit logs of supervisor reviews", done: false },
    { text: "Evidence of periodic workforce re-training", done: false },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="text-primary" size={18} />
        <p className="font-medium">Control Requirements</p>
      </div>

      {/* Items */}
      <div className="space-y-2 text-sm">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2
              size={16}
              className={item.done ? "text-green-500" : "text-gray-300"}
            />
            <span className={item.done ? "" : "text-muted-foreground"}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
