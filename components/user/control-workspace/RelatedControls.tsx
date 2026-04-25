import { Link2, ExternalLink } from "lucide-react";

export default function RelatedControls() {
  const items = [
    "HIPAA-164.308(a)(1)(ii)(D) - Info System Review",
    "GDPR Art. 32 - Security of Processing",
    "SOC 2 CC6.1 - Access Mgmt",
  ];

  return (
    <div className="bg-white shadow-sm p-4 rounded-xl border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="text-purple-500" size={18} />
        <p className="font-medium">Related Controls</p>
      </div>

      {/* Links */}
      <div className="space-y-2 text-sm">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center text-primary hover:underline cursor-pointer"
          >
            <span>{item}</span>
            <ExternalLink size={14} className="text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
