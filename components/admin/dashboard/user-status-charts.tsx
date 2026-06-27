"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const UserStatusPie = dynamic(() => import("@/components/charts/user-status-pie"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-2xl" />,
});

const data = [
  {
    name: "Active",
    value: 94,
    fill: "#8B5CF6",
  },
  {
    name: "Inactive",
    value: 34,
    fill: "#C4B5FD",
  },
];

export default function UserStatusChart() {
  const totalUsers = data.reduce((acc, item) => acc + item.value, 0);

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

      {/* HEADER */}
      <div className="relative z-10 mb-6">
        <h2 className="text-lg font-semibold text-slate-900">User Status</h2>

        <p className="text-sm text-slate-500">Active and inactive user distribution.</p>
      </div>

      {/* CHART */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative h-[240px] w-full">
          <UserStatusPie data={data} />

          {/* CENTER LABEL */}
          <div
            className="
              absolute
              left-1/2
              top-1/2
              flex
              -translate-x-1/2
              -translate-y-1/2
              flex-col
              items-center
              justify-center
            "
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-violet-100
                bg-white/90
                px-5
                py-3
                shadow-lg
                backdrop-blur-sm
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
                  from-white/70
                  to-transparent
                "
              />

              <div className="relative z-10 text-center">
                <p className="text-2xl font-bold text-violet-700">{totalUsers}</p>

                <span className="text-xs font-medium text-slate-500">Total Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LEGENDS */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-6">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            {/* COLOR CHIP */}
            <div
              className="
                relative
                h-3.5
                w-3.5
                rounded-full
                shadow-md
              "
              style={{
                backgroundColor: item.fill,
                boxShadow: `
                  0 0 12px ${item.fill}55
                `,
              }}
            >
              {/* GLOSS */}
              <div
                className="
                  absolute
                  inset-x-0
                  top-0
                  h-1.5
                  rounded-full
                  bg-white/60
                "
              />
            </div>

            <span className="text-sm font-medium text-slate-700">{item.name}</span>

            <span className="text-sm text-slate-500">({item.value})</span>
          </div>
        ))}
      </div>
      <Link
        href="/admin/users"
        className="
    group
    relative
    mt-6
    inline-flex
    items-center
    gap-2
    overflow-hidden
    rounded-2xl
    border
    border-violet-200
    bg-violet-50/80
    px-4
    py-2.5
    text-sm
    font-semibold
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

        <span className="relative z-10">Manage Users</span>

        <span
          className="
      relative
      z-10
      transition-transform
      duration-300
      group-hover:translate-x-1
    "
        >
          →
        </span>
      </Link>
    </section>
  );
}
