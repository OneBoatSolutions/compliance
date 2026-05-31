"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface FrameworkActivityTableProps {
  selectedDate: Date;
}

const activityData = [
  {
    id: 1,
    framework: "GDPR",
    event: "Framework Published",
    version: "1.1.0",
    actor: "Sarah",
    status: "Success",
    severity: "High",
    time: "09:14 AM",
    date: new Date().toDateString(),
  },
  {
    id: 2,
    framework: "HIPAA",
    event: "Controls Imported",
    version: "2.0.0",
    actor: "Admin",
    status: "Processing",
    severity: "Medium",
    time: "10:40 AM",
    date: new Date().toDateString(),
  },
  {
    id: 3,
    framework: "SOC2",
    event: "Draft Updated",
    version: "3.4.1",
    actor: "Emily",
    status: "Success",
    severity: "Low",
    time: "11:22 AM",
    date: new Date().toDateString(),
  },
  {
    id: 4,
    framework: "PCI DSS",
    event: "Workflow Approved",
    version: "3.2.1",
    actor: "James",
    status: "Approved",
    severity: "Critical",
    time: "01:08 PM",
    date: new Date().toDateString(),
  },

  /* PREVIOUS DATE MOCK DATA */
  {
    id: 5,
    framework: "ISO 27001",
    event: "Version Created",
    version: "2.4.0",
    actor: "Admin",
    status: "Draft",
    severity: "Medium",
    time: "09:40 AM",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toDateString(),
  },
  {
    id: 6,
    framework: "NIST AI RMF",
    event: "Publish Failed",
    version: "1.0.0",
    actor: "System",
    status: "Failed",
    severity: "Critical",
    time: "11:12 AM",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toDateString(),
  },
];

const severityStyles = {
  Critical: `
    border-rose-200
    bg-rose-500
    text-white
    shadow-rose-200/70
  `,
  High: `
    border-violet-200
    bg-violet-500
    text-white
    shadow-violet-200/70
  `,
  Medium: `
    border-amber-200
    bg-amber-500
    text-white
    shadow-amber-200/70
  `,
  Low: `
    border-emerald-200
    bg-emerald-500
    text-white
    shadow-emerald-200/70
  `,
};

export default function FrameworkActivityTable({ selectedDate }: FrameworkActivityTableProps) {
  const [showActor, setShowActor] = useState(true);

  const [showVersion, setShowVersion] = useState(true);

  const [showCustomize, setShowCustomize] = useState(false);

  const today = new Date();

  const isFuture = selectedDate > today;

  const filteredData = useMemo(() => {
    if (isFuture) {
      return [];
    }

    return activityData
      .filter((item) => item.date === selectedDate.toDateString())
      .sort((a, b) => {
        const severityOrder = {
          Critical: 1,
          High: 2,
          Medium: 3,
          Low: 4,
        };

        return (
          severityOrder[a.severity as keyof typeof severityOrder] -
          severityOrder[b.severity as keyof typeof severityOrder]
        );
      });
  }, [selectedDate, isFuture]);

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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Framework Activity</h2>

            <p className="text-sm text-slate-500">
              Operational framework highlights for {selectedDate.toDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* VIEW ALL */}
            <Link
              href="/admin/frameworks"
              className="
                group
                relative
                overflow-hidden
                rounded-xl
                border
                border-violet-200
                bg-violet-50/80
                px-4
                py-2
                text-sm
                font-medium
                text-violet-700
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-[1px]
                hover:border-violet-300
                hover:bg-violet-100
                hover:shadow-lg
                hover:shadow-violet-100/50
              "
            >
              {/* GLOSS */}
              <span
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  top-0
                  h-5
                  bg-gradient-to-b
                  from-white/50
                  to-transparent
                "
              />

              <span className="relative z-10 flex items-center gap-2">
                View All
                <span
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </span>
            </Link>

            {/* CUSTOMIZE */}
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              className="
                rounded-xl
                border
                border-violet-200
                bg-violet-50
                px-4
                py-2
                text-sm
                font-medium
                text-violet-700
                shadow-sm
                transition-all
                duration-300
                hover:border-violet-300
                hover:bg-violet-100
                hover:shadow-md
                hover:shadow-violet-100/50
              "
            >
              Customize View
            </button>
          </div>
        </div>

        {/* CUSTOMIZE PANEL */}
        {showCustomize && (
          <div
            className="
              mb-6
              flex
              flex-wrap
              gap-3
              rounded-2xl
              border
              border-violet-100
              bg-violet-50/60
              p-4
            "
          >
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={showVersion}
                onChange={() => setShowVersion(!showVersion)}
              />
              Version
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={showActor}
                onChange={() => setShowActor(!showActor)}
              />
              Actor
            </label>
          </div>
        )}

        {/* FUTURE DATE EMPTY STATE */}
        {isFuture && (
          <div
            className="
              rounded-2xl
              border
              border-violet-100
              bg-violet-50/60
              p-8
              text-center
            "
          >
            <p className="text-sm font-medium text-violet-700">
              No framework activity available for future dates.
            </p>
          </div>
        )}

        {/* TABLE */}
        {!isFuture && filteredData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="px-4 pb-3 text-left text-sm font-semibold text-slate-800 drop-shadow-sm">
                    Framework
                  </th>

                  <th className="px-4 pb-3 text-left text-sm font-semibold text-slate-800 drop-shadow-sm">
                    Event
                  </th>

                  {showVersion && (
                    <th className="px-4 pb-3 text-left text-sm font-semibold text-slate-800 drop-shadow-sm">
                      Version
                    </th>
                  )}

                  {showActor && (
                    <th className="px-4 pb-3 text-left text-sm font-semibold text-slate-800 drop-shadow-sm">
                      Actor
                    </th>
                  )}

                  <th className="px-4 pb-3 text-left text-sm font-semibold text-slate-800 drop-shadow-sm">
                    Severity
                  </th>

                  <th className="px-4 pb-3 text-left text-sm font-semibold text-slate-800 drop-shadow-sm">
                    Status
                  </th>

                  <th className="px-4 pb-3 text-left text-sm font-semibold text-slate-800 drop-shadow-sm">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((activity) => (
                  <tr
                    key={activity.id}
                    className="
                          rounded-2xl
                          border
                          border-transparent
                          bg-white
                          shadow-sm
                          transition-all
                          duration-300
                          hover:border-violet-100
                          hover:bg-violet-50/40
                          hover:shadow-lg
                          hover:shadow-violet-100/40
                        "
                  >
                    <td className="rounded-l-2xl px-4 py-4">
                      <p className="text-sm font-semibold text-slate-800">{activity.framework}</p>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">{activity.event}</td>

                    {showVersion && (
                      <td className="px-4 py-4 text-sm text-slate-600">{activity.version}</td>
                    )}

                    {showActor && (
                      <td className="px-4 py-4 text-sm text-slate-600">{activity.actor}</td>
                    )}

                    {/* SEVERITY */}
                    <td className="px-4 py-4">
                      <span
                        className={`
                              relative
                              overflow-hidden
                              rounded-full
                              border
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              shadow-sm
                              ${severityStyles[activity.severity as keyof typeof severityStyles]}
                            `}
                      >
                        {/* GLOSS */}
                        <span
                          className="
                                pointer-events-none
                                absolute
                                inset-x-0
                                top-0
                                h-3
                                bg-gradient-to-b
                                from-white/40
                                to-transparent
                              "
                        />

                        <span className="relative z-10">{activity.severity}</span>
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      <span
                        className="
                              rounded-full
                              border
                              border-violet-200
                              bg-violet-50
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              text-violet-700
                            "
                      >
                        {activity.status}
                      </span>
                    </td>

                    <td className="rounded-r-2xl px-4 py-4 text-sm text-slate-500">
                      {activity.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isFuture && filteredData.length === 0 && (
          <div
            className="
                rounded-2xl
                border
                border-violet-100
                bg-violet-50/60
                p-8
                text-center
              "
          >
            <p className="text-sm font-medium text-violet-700">
              No framework activity found for the selected date.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
