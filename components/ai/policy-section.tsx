import { Card } from "@/components/ui/card";

export default function PolicySection() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Policy Recommendations</h3>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium">Access Control Policy</h4>
          <p className="text-sm text-gray-500">Define user roles and access rules.</p>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium">Password Policy</h4>
          <p className="text-sm text-gray-500">Enforce strong password guidelines.</p>
        </Card>
      </div>
    </div>
  );
}
