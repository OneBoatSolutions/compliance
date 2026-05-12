/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText } from "lucide-react";
import { RemediationData } from "@/services/types";

const mockPolicies = [
  {
    title: "Access Control Policy",
    desc: "Guidelines for provisioning access",
  },
  {
    title: "Password & Credential Policy",
    desc: "Rules for password rotation and storage",
  },
];
export default function PolicyRecommendations({ data }: { data?: RemediationData }) {
  const policies = data?.policies ?? mockPolicies;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-purple-600" />
        <h3 className="font-semibold">Policy Recommendations</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {policies.map((p: any, i: number) => (
          <div key={i} className="border rounded-xl p-4">
            <p className="font-medium">{p.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>

            <button className="text-xs text-purple-600 mt-2 hover:underline">
              Download Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
