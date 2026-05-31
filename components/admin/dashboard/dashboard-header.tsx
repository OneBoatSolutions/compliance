export default function DashboardHeader() {
  return (
    <section
      className="relative
        overflow-hidden
        rounded-3xl
        border
        border-violet-100
        bg-white
        p-5
        mt-8
        shadow-sm
        transition-all
        duration-300
        hover:border-violet-200
        hover:shadow-lg
        hover:shadow-violet-100/"
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
          -right-20
          -top-20
          h-44
          w-44
          rounded-full
          bg-violet-100/30
          blur-3xl
        "
      />
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 relative z-0">
        Admin Dashboard
      </h1>

      <p className="text-sm text-slate-500">
        Monitor compliance frameworks, users, system health and platform activity.
      </p>
    </section>
  );
}
