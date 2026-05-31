export default function CostSummary() {
  return (
    <div className="bg-white border rounded-xl p-4 text-sm space-y-2">
      <h4 className="font-medium">Estimated Cost</h4>

      <div className="flex justify-between">
        <span>SaaS</span>
        <span>$1200/yr</span>
      </div>

      <div className="flex justify-between">
        <span>Labor</span>
        <span>$6400</span>
      </div>

      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span className="text-purple-600">$7600</span>
      </div>
    </div>
  );
}
