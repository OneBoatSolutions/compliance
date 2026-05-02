"use client";

interface Props {
  data: {
    total: number;
    distribution: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    heatmap: {
      impact: number;
      likelihood: number;
      count: number;
    }[];
    remediation: {
      id: string;
      action: string;
      owner: string;
      dueDate: string;
      progress: number;
    }[];
  };
}

export default function RiskAnalysis({ data }: Props) {
  const heatmap = data?.heatmap ?? [];
  const remediation = data?.remediation ?? [];

  const distribution = data?.distribution ?? {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const getCellValue = (likelihood: number, impact: number) => {
    const cell = heatmap.find((h) => h.impact === impact && h.likelihood === likelihood);
    return cell?.count || 0;
  };

  const total = distribution.critical + distribution.high + distribution.medium + distribution.low;

  const safeTotal = total || 1;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  const segments = [
    { value: distribution.critical, color: "#ef4444" },
    { value: distribution.high, color: "#f97316" },
    { value: distribution.medium, color: "#eab308" },
    { value: distribution.low, color: "#22c55e" },
  ];

  return (
    <section className="bg-white rounded-xl shadow p-8 space-y-10">
      {/* 🔹 Title */}
      <h2 className="text-lg font-semibold text-purple-600 uppercase">
        RISK ANALYSIS & VISUALIZATION
      </h2>

      {/* 🔹 Top Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* 🟣 Donut */}
        <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center bg-gray-50/30">
          <h3 className="text-md font-semibold mb-4 text-gray-700">Risk Distribution</h3>

          {/* ✅ FIXED CONTAINER */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-40 h-40 -rotate-90">
              <circle cx="50%" cy="50%" r={radius} stroke="#eee" strokeWidth="10" fill="none" />

              {segments.map((seg, i) => {
                const dash = (seg.value / safeTotal) * circumference;
                const gap = circumference - dash;

                const el = (
                  <circle
                    key={i}
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={seg.color}
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={-offset}
                  />
                );

                offset += dash;
                return el;
              })}
            </svg>

            {/* ✅ CENTER TEXT (FIXED) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-400">Risks</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <span>🔴 Critical ({distribution.critical})</span>
            <span>🟠 High ({distribution.high})</span>
            <span>🟡 Medium ({distribution.medium})</span>
            <span>🟢 Low ({distribution.low})</span>
          </div>
        </div>

        {/* 🔹 Heatmap */}
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/30">
          <h3 className="text-md font-semibold mb-4 text-gray-700 text-center">
            Inherent Risk Heatmap
          </h3>

          <p className="text-xs text-gray-500 text-center mb-2">Impact →</p>

          <div className="flex items-center justify-center gap-3">
            <p className="text-xs text-gray-500 -rotate-90 whitespace-nowrap">Likelihood</p>

            <div className="grid grid-cols-5 gap-2">
              {[5, 4, 3, 2, 1].map((likelihood) =>
                [1, 2, 3, 4, 5].map((impact) => {
                  const value = getCellValue(likelihood, impact);

                  let color = "bg-gray-100";
                  if (value > 10) {
                    color = "bg-red-500";
                  } else if (value > 5) {
                    color = "bg-yellow-400";
                  } else if (value > 0) {
                    color = "bg-green-500";
                  }

                  return (
                    <div key={`${impact}-${likelihood}`} className="relative group">
                      <div
                        className={`h-12 w-12 rounded flex items-center justify-center text-xs font-medium text-white ${color}`}
                      >
                        {value || ""}
                      </div>

                      {value > 0 && (
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          {value} risks • Impact {impact}, Likelihood {likelihood}
                        </div>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-6">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center max-w-sm mx-auto">
            This heatmap represents the distribution of risks based on their impact and likelihood.
            Higher concentrations in red zones indicate critical areas requiring immediate
            attention.
          </p>
        </div>
      </div>

      {/* 🔹 Remediation Table */}
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">
          Top Priority Remediation Actions
        </h3>

        {remediation.length === 0 ? (
          <p className="text-gray-400 text-sm">No remediation actions available</p>
        ) : (
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="p-3 text-left">CONTROL ID</th>
                <th className="p-3 text-left">ACTION</th>
                <th className="p-3 text-left">OWNER</th>
                <th className="p-3 text-left">DUE DATE</th>
                <th className="p-3 text-left">PROGRESS</th>
              </tr>
            </thead>

            <tbody>
              {remediation.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.action}</td>
                  <td className="p-3">{r.owner}</td>
                  <td className="p-3">{r.dueDate}</td>

                  <td className="p-3 w-40">
                    <div className="w-full bg-gray-200 h-2 rounded">
                      <div
                        className="bg-purple-600 h-2 rounded"
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{r.progress}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
