import { FileCheck, ShieldAlert, UserCog, UserPlus } from "lucide-react";

interface RecentActivityProps {
  selectedDate: Date;
}

const todayActivities = [
  {
    id: 1,
    icon: FileCheck,
    color: "emerald",
    message: "GDPR v1.1 framework published",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: UserPlus,
    color: "blue",
    message: "Sarah created a new user",
    time: "4 hours ago",
  },
  {
    id: 3,
    icon: ShieldAlert,
    color: "amber",
    message: "HIPAA controls imported",
    time: "Yesterday",
  },
  {
    id: 4,
    icon: UserCog,
    color: "rose",
    message: "James account deactivated",
    time: "2 days ago",
  },
];

const pastActivities = [
  {
    id: 1,
    icon: FileCheck,
    color: "violet",
    message: "SOC2 draft updated",
    time: "09:14 AM",
  },
  {
    id: 2,
    icon: UserPlus,
    color: "sky",
    message: "Emily invited as auditor",
    time: "11:40 AM",
  },
  {
    id: 3,
    icon: ShieldAlert,
    color: "orange",
    message: "PCI DSS controls reordered",
    time: "04:25 PM",
  },
];

const iconStyles = {
  emerald: `
    border-emerald-200
    bg-emerald-500
    shadow-emerald-200/70
  `,
  blue: `
    border-blue-200
    bg-blue-500
    shadow-blue-200/70
  `,
  amber: `
    border-amber-200
    bg-amber-500
    shadow-amber-200/70
  `,
  rose: `
    border-rose-200
    bg-rose-500
    shadow-rose-200/70
  `,
  violet: `
    border-violet-200
    bg-violet-500
    shadow-violet-200/70
  `,
  sky: `
    border-sky-200
    bg-sky-500
    shadow-sky-200/70
  `,
  orange: `
    border-orange-200
    bg-orange-500
    shadow-orange-200/70
  `,
};

export default function RecentActivity({ selectedDate }: RecentActivityProps) {
  const today = new Date();

  const isToday = selectedDate?.toDateString() === today.toDateString();

  const isFuture = selectedDate > today;

  const activities = isToday ? todayActivities : pastActivities;

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

      {/* GLOW */}
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

      {/* HEADER */}
      <div className="relative z-10 mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>

        <p className="text-sm text-slate-500">Administrative actions and operational events.</p>

        <p className="mt-2 text-xs font-medium text-violet-700">
          Viewing activity for {selectedDate?.toDateString()}
        </p>
      </div>

      {/* FUTURE WARNING */}
      {isFuture && (
        <div className="relative z-10 mb-5 rounded-xl border border-violet-200 bg-violet-50 p-3">
          <p className="text-xs font-medium text-violet-700">
            No activity recorded for future dates.
          </p>
        </div>
      )}

      {/* ACTIVITIES */}
      <div className="relative z-10 space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="
                flex
                items-start
                gap-4
                rounded-2xl
                border
                border-transparent
                p-3
                transition-all
                duration-300
                hover:border-violet-100
                hover:bg-violet-50/50
              "
            >
              {/* ICON */}
              <div
                className={`
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  p-2.5
                  shadow-lg
                  backdrop-blur-sm
                  ${iconStyles[activity.color as keyof typeof iconStyles]} `}
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
                    from-white/40
                    to-transparent
                  "
                />

                <Icon
                  size={18}
                  className="
                    relative
                    z-10
                    text-white
                    drop-shadow-sm
                  "
                />
              </div>

              {/* TEXT */}
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{activity.message}</p>

                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
