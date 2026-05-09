"use client";

import { CheckCircle } from "lucide-react";
import { DataInventoryItem } from "@/lib/report-types";

interface Props {
  organization: {
    name: string;
    systems: string;
    reportId: string;

    dataInventory: DataInventoryItem[];
    frameworks: {
      name: string;
      score: number;
      controls: number;
      minorGaps: number;
      highRisk: number;
    }[];
  };
}

export default function OrganizationProfile({ organization }: Props) {
  //  Defensive defaults
  const dataInventory = organization?.dataInventory ?? [];
  const frameworks = organization?.frameworks ?? [];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "HIGH":
        return "bg-red-100 text-red-600";
      case "MED":
        return "bg-yellow-100 text-yellow-600";
      case "LOW":
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <section className="bg-white rounded-xl shadow p-8 space-y-6">
      {/*  Title */}
      <h2 className="text-lg font-semibold text-purple-600 tracking-wide uppercase">
        ORGANIZATION COMPLIANCE PROFILE
      </h2>

      {/*  Basic Info */}
      <div className="grid md:grid-cols-3 gap-6 py-6 text-sm">
        <div>
          <p className="text-gray-400 text-xs">ORGANIZATION NAME</p>
          <p className="font-medium text-gray-800">{organization?.name || "—"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">SYSTEMS IN SCOPE</p>
          <p className="font-medium text-gray-800">{organization?.systems || "—"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">REPORT ID</p>
          <p className="font-medium text-gray-800">{organization?.reportId || "—"}</p>
        </div>
      </div>

      {/*  Data Inventory */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Data Inventory Scoping</h3>

        {dataInventory.length === 0 ? (
          <p className="text-sm text-gray-400">No data inventory available</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr>
                  <th className="p-3 text-left">DATA CATEGORY</th>
                  <th className="p-3 text-left">IN SCOPE</th>
                  <th className="p-3 text-left">EXAMPLES</th>
                  <th className="p-3 text-left">RISK LEVEL</th>
                </tr>
              </thead>

              <tbody>
                {dataInventory.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{item.category}</td>

                    <td className="p-3">
                      {item.inScope ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <span className="text-gray-300">●</span>
                      )}
                    </td>

                    <td className="p-3 text-gray-600">{item.examples}</td>

                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${getRiskColor(item.risk)}`}>
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/*  Framework Performance */}
      <div className="py-8">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Detailed Framework Performance</h3>

        {frameworks.length === 0 ? (
          <p className="text-sm text-gray-400">No framework data available</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {frameworks.map((fw, i) => (
              <div key={i} className="border rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{fw.name}</span>
                  <span className="text-purple-600 font-semibold">{fw.score}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div className="bg-purple-600 h-2 rounded" style={{ width: `${fw.score}%` }} />
                </div>

                <p className="text-xs text-gray-500">
                  {fw.controls} Controls | {fw.minorGaps} Minor Gaps | {fw.highRisk} High Risk
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
