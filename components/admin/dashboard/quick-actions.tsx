import { FilePlus2, ShieldPlus, Upload, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const actions = [
  {
    title: "Create Framework",
    icon: ShieldPlus,
    route: "/admin/frameworks",
  },
  {
    title: "Add User",
    icon: UserPlus,
    route: "/admin/users",
  },
  {
    title: "Import Controls",
    icon: Upload,
    route: "/admin/frameworks",
  },
  {
    title: "Publish Drafts",
    icon: FilePlus2,
    route: "/admin/frameworks",
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <section
      className="
  rounded-2xl
  border
  border-slate-200
  bg-white
  p-5
  shadow-sm
  transition-all
  duration-300
  hover:-translate-y-[2px]
  hover:border-violet-200
  hover:shadow-xl
  hover:shadow-violet-100/50
"
    >
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-purple-500">Quick Actions</h2>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => router.push(action.route)}
              className="
                group
                rounded-2xl
                border
                border-violet-200
                bg-purple-50/80
                p-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-violet-300
                hover:bg-purple-200
                hover:shadow-lg
                hover:shadow-purple-100
              "
            >
              <div className="flex flex-col items-center justify-center text-center">
                {/* ICON */}
                <div
                  className="
                    mb-2
                    rounded-xl
                    bg-white
                    p-2
                    text-purple-600
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:scale-105
                  "
                >
                  <Icon size={18} />
                </div>

                {/* TEXT */}
                <span className="text-xs font-bold text-purple-800">{action.title}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
