import { Button } from "@/components/ui/button"

export default function RemediationActions() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-purple-600 text-white p-4 rounded-xl shadow-lg flex gap-3">
      <Button variant="secondary">Regenerate</Button>
      <Button variant="secondary">Save Plan</Button>
      <Button variant="secondary">Export as PDF</Button>
    </div>
  )
}
