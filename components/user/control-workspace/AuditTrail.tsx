"use client";

import { CheckCircle, Upload, FilePlus } from "lucide-react";

export default function AuditTrail() {
  const items = [
    {
      title: "Status Changed",
      desc: "Sarah Chen changed to 'Partially Compliant'",
      time: "Today, 2:15 PM",
      icon: <CheckCircle className="text-purple-500" size={16} />,
    },
    {
      title: "Evidence Uploaded",
      desc: "Okta_Audit_Log_Screenshot.png",
      time: "Today, 11:30 AM",
      icon: <Upload className="text-blue-500" size={16} />,
    },
    {
      title: "Control Updated",
      desc: "Compliance notes added",
      time: "Yesterday",
      icon: <FilePlus className="text-green-500" size={16} />,
    },
    {
      title: "Control Created",
      desc: "System generated via HIPAA template",
      time: "Jan 12, 2026",
      icon: <FilePlus className="text-gray-400" size={16} />,
    },
  ];

  return (
    <div className="bg-card p-5 rounded-xl border">
      <p className="font-medium mb-5">Audit Trail</p>

      <div className="relative">

        {/* 🔥 CONTINUOUS LINE */}
        <div className="absolute left-[10px] top-0 bottom-0 w-[2px] bg-primary" />

        <div className="space-y-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative flex gap-4 animate-fadeIn"
            >
              {/* 🔵 ICON ON LINE */}
              <div className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white border shadow-sm">
                {item.icon}
              </div>

              {/* 📄 CONTENT */}
              <div className="pb-2">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 EXTENSION LINE (below last item) */}
        <div className="absolute left-[10px] bottom-[-20px] w-[2px] h-6 bg-muted opacity-50" />
      </div>
    </div>
  );
}
