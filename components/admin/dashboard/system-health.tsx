"use client";

import { CheckCircle2, Database, Server, ShieldCheck } from "lucide-react";

const healthItems = [
  {
    title: "API Services",
    status: "Operational",
    icon: Server,
    color: {
      bg: "bg-emerald-500",
      glow: "shadow-emerald-200/70",
    },
  },
  {
    title: "Database",
    status: "Healthy",
    icon: Database,
    color: {
      bg: "bg-blue-500",
      glow: "shadow-blue-200/70",
    },
  },
  {
    title: "Compliance Engine",
    status: "Running",
    icon: ShieldCheck,
    color: {
      bg: "bg-violet-500",
      glow: "shadow-violet-200/70",
    },
  },
  {
    title: "Background Jobs",
    status: "Stable",
    icon: CheckCircle2,
    color: {
      bg: "bg-fuchsia-500",
      glow: "shadow-fuchsia-200/70",
    },
  },
];

export default function SystemHealth() {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-violet-100
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:border-violet-200
        hover:shadow-2xl
        hover:shadow-violet-100/50
      "
    >
      {/* TOP LIGHT */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-20
          bg-gradient-to-b
          from-violet-50/80
          to-transparent
        "
      />

      {/* PURPLE GLOW */}
      <div
        className="
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-violet-100/30
          blur-3xl
        "
      />

      {/* CONTENT */}
      <div className="relative z-10">
        {/* HEADER */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">System Health</h2>

          <p className="text-sm text-slate-500">Operational platform monitoring overview.</p>
        </div>

        {/* HEALTH ITEMS */}
        <div className="space-y-3">
          {healthItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-violet-100
                  bg-violet-50/30
                  p-3
                  transition-all
                  duration-300
                  hover:-translate-y-[1px]
                  hover:border-violet-200
                  hover:bg-violet-50/60
                  hover:shadow-lg
                  hover:shadow-violet-100/40
                "
              >
                {/* GLOSS */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    h-6
                    bg-gradient-to-b
                    from-white/50
                    to-transparent
                  "
                />

                {/* ROW */}
                <div className="relative z-10 flex items-center justify-between">
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    {/* ICON */}
                    <div
                      className={`
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        border-white/20
                        ${item.color.bg}
                        p-2
                        shadow-md
                        ${item.color.glow}
                      `}
                    >
                      {/* ICON GLOSS */}
                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-x-0
                          top-0
                          h-4
                          bg-gradient-to-b
                          from-white/40
                          to-transparent
                        "
                      />

                      <Icon
                        size={15}
                        className="
                          relative
                          z-10
                          text-white
                        "
                      />
                    </div>

                    {/* TEXT */}
                    <div>
                      <p
                        className="
                          text-sm
                          font-semibold
                          text-slate-800
                        "
                      >
                        {item.title}
                      </p>

                      <span
                        className="
                          text-xs
                          text-slate-500
                        "
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* STATUS DOT */}
                  <div
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-emerald-500
                      shadow-md
                      shadow-emerald-200
                    "
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
