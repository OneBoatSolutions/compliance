import { FileCheck, FileClock, ShieldCheck, Users } from "lucide-react";

interface DashboardStatsProps {
  totalUsers: number;
  publishedFrameworks: number;
  draftFrameworks: number;
  totalAssessments: number;
}

export default function DashboardStats({
  totalUsers,
  publishedFrameworks,
  draftFrameworks,
  totalAssessments,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      styles: {
        bg: "bg-blue-500",
        hover: "hover:shadow-blue-300/60",
        iconGlow: "shadow-blue-200/70",
      },
    },
    {
      title: "Published Frameworks",
      value: publishedFrameworks.toLocaleString(),
      icon: ShieldCheck,
      styles: {
        bg: "bg-emerald-500",
        hover: "hover:shadow-emerald-300/60",
        iconGlow: "shadow-emerald-200/70",
      },
    },
    {
      title: "Draft Frameworks",
      value: draftFrameworks.toLocaleString(),
      icon: FileClock,
      styles: {
        bg: "bg-violet-500",
        hover: "hover:shadow-violet-300/60",
        iconGlow: "shadow-violet-200/70",
      },
    },
    {
      title: "Total Assessments",
      value: totalAssessments.toLocaleString(),
      icon: FileCheck,
      styles: {
        bg: "bg-pink-500",
        hover: "hover:shadow-pink-300/60",
        iconGlow: "shadow-pink-200/70",
      },
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={`
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/20
              ${stat.styles.bg}
              p-5
              shadow-xl
              transition-all
              duration-300
              hover:-translate-y-[4px]
              hover:shadow-2xl
              ${stat.styles.hover}
            `}
          >
            {/* SOFT GLOSS */}
            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-20
                bg-gradient-to-b
                from-white/20
                to-transparent
              "
            />

            {/* SOFT ORB */}
            <div
              className="
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                bg-white/10
                blur-2xl
              "
            />

            {/* CONTENT */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">{stat.title}</p>

                <h3 className="mt-3 text-3xl font-bold text-white">{stat.value}</h3>
              </div>

              {/* ICON */}
              <div
                className={`
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/15
                  p-3
                  shadow-lg
                  backdrop-blur-sm
                  ${stat.styles.iconGlow}
                `}
              >
                {/* ICON GLOSS */}
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
                  size={20}
                  className="
                    relative
                    z-10
                    text-white
                    drop-shadow-sm
                  "
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
