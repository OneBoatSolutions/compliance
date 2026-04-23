import { Wrench, Clock, DollarSign } from "lucide-react";
import { mockRemediationData } from "./mock-remediation";

export default function RemediationSidebar() {
  const data = mockRemediationData;

  return (
    <div className="space-y-6 text-sm">

      {/* 🔧 TOOLS */}
      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wrench size={16} />
          <p className="font-medium">Recommended Tooling</p>
        </div>

        <div className="space-y-3">
          {data.tools.map((tool, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{tool.name}</p>
                <span className="text-xs px-2 py-0.2 rounded bg-green-100 text-green-600">
                  {tool.badge}
                </span>
              </div>

              <a
                href={tool.link}
                className="text-purple-600 text-xs hover:underline"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ⏳ TIMELINE */}
      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} />
          <p className="font-medium">Implementation Timeline</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>WK 1</span>
            <span>WK 6</span>
            <span>WK 12</span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
            <div className="bg-purple-600 w-[50%]" />
            <div className="bg-purple-300 w-[30%]" />
          </div>

          <div className="space-y-1 text-xs">
            {data.timeline.phases.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 💰 COST */}
      <div className="bg-card border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={16} />
          <p className="font-medium">Cost Estimation</p>
        </div>

        <div className="space-y-2 text-xs">
          {data.cost.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}

          <div className="border-t pt-2 flex justify-between font-medium text-purple-600">
            <span>Total</span>
            <span>{data.cost.total}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
