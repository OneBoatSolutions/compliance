"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import {
  ShieldCheck,
  ListChecks,
  MoveRight,
  Clock4,
  File,
  Sparkles,
  SquareCheckBig,
  FileText,
  MonitorPlay,
  Headset,
  Play,
} from "lucide-react";
function EmptyState() {
  const router = useRouter();

  return (
    <section className="mb-12">
      <div
        className="
group
bg-white
rounded-2xl
border
border-gray-200
shadow-lg
hover:shadow-2xl
hover:-translate-y-1
transition-all
duration-300
p-12
text-center
flex
flex-col
items-center
"
      >
        {/* Icon */}
        <div
          className="
relative
w-24
h-24
rounded-full
bg-gradient-to-br
from-[#6d18ff]/20
to-[#a67fff]/20
flex
items-center
justify-center
mb-6
"
        >
          <div className="absolute inset-0 rounded-full blur-xl bg-[#6d18ff]/20" />

          <ListChecks aria-hidden="true" className="relative w-10 h-10 text-[#6d18ff]" />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No assessments yet</h2>

        <p className="text-slate-500 max-w-md mb-8">
          Create your first compliance assessment to discover which regulatory frameworks apply to
          your business and start tracking your compliance readiness.
        </p>

        {/* CTA */}
        <button
          type="button"
          aria-label="Create your first compliance assessment"
          onClick={() => router.push("/onboarding")}
          className="
group
h-[52px]
px-8
bg-[#6d18ff]
hover:bg-[#5412cc]
text-white
rounded-lg
font-semibold
flex
items-center
gap-2
shadow-lg
shadow-[#6d18ff]/25
hover:shadow-xl
hover:shadow-[#6d18ff]/30
transition-all
duration-300
focus:outline-none
    focus:ring-2
    focus:ring-[#6d18ff]
    focus:ring-offset-2
"
        >
          Create Your First Assessment
          <MoveRight
            aria-hidden="true"
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
          />
        </button>

        {/* Info */}
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-400">
          <Clock4 aria-hidden="true" className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider font-semibold">
            Takes only 5 minutes
          </span>
        </div>
      </div>
    </section>
  );
}
function HeroSection() {
  const userName = useAuthStore((state) => state.user?.name?.trim());
  const displayName = userName || "Sarah";

  return (
    <section className="mb-8 relative overflow-hidden bg-gradient-to-br from-[#f1eaff] to-white p-8 md:p-12 rounded-xl border border-[#6d18ff]/10 shadow-sm">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#6d18ff]/10 rounded-full blur-3xl" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Cipherion, {displayName}! 👋
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Let&apos;s start your compliance journey by creating your first assessment.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative w-full max-w-[320px] aspect-square bg-[#6d18ff]/5 rounded-full border border-[#6d18ff]/10 flex items-center justify-center">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-[#6d18ff]/10 animate-pulse"></div>
          <ShieldCheck aria-hidden="true" className="w-28 h-28 text-[#6d18ff]/40" />
        </div>
      </div>
    </section>
  );
}
function HowItWorks() {
  const steps = [
    {
      title: "Describe Your Business",
      desc: "Tell us about your business profile, target regions, and specific data handling requirements.",
      icon: <File aria-hidden="true" className="w-5 h-5 text-[#6d18ff]/40" />,
    },
    {
      title: "AI Analyzes Requirements",
      desc: "Our AI suggests applicable compliance frameworks for you.",
      icon: <Sparkles aria-hidden="true" className="w-5 h-5 text-[#6d18ff]/40" />,
    },
    {
      title: "Complete Assessment",
      desc: "Work through controls and track your compliance progress.",
      icon: <SquareCheckBig aria-hidden="true" className="w-5 h-5 text-[#6d18ff]/40" />,
    },
  ];

  return (
    <section className="mb-16">
      <h3 className="text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
        HOW IT WORKS
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="
group
bg-white
p-6
rounded-xl
border
border-slate-100
shadow-sm
hover:shadow-lg
hover:-translate-y-1
hover:border-[#6d18ff]/20
transition-all
duration-300
"
          >
            <div className="flex justify-between mb-4">
              <div
                className="
  w-8
  h-8
  bg-[#6d18ff]
  text-white
  rounded-full
  flex
  items-center
  justify-center
  text-sm
  font-bold
  group-hover:scale-110
  transition-transform
  "
              >
                {i + 1}
              </div>
              {step.icon}
            </div>

            <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function HelpResources() {
  const items = [
    {
      title: "Documentation",
      icon: (
        <FileText
          aria-hidden="true"
          className="w-5 h-5 text-slate-400 group-hover:text-[#6d18ff] transition-colors"
        />
      ),
    },
    {
      title: "Tutorials",
      icon: (
        <MonitorPlay
          aria-hidden="true"
          className="w-5 h-5 text-slate-400 group-hover:text-[#6d18ff] transition-colors"
        />
      ),
    },
    {
      title: "Support",
      icon: (
        <Headset
          aria-hidden="true"
          className="w-5 h-5 text-slate-400 group-hover:text-[#6d18ff] transition-colors"
        />
      ),
    },
    {
      title: "Book a Demo",
      icon: (
        <Play
          aria-hidden="true"
          className="w-5 h-5 text-slate-400 group-hover:text-[#6d18ff] transition-colors"
        />
      ),
    },
  ];

  return (
    <section className="border-t border-slate-200 pt-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900">Need guidance?</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="group p-4 bg-slate-100 rounded-lg border border-transparent hover:bg-[#6d18ff]/5 hover:border-[#6d18ff]/20 hover:-translate-y-1 transition-all "
          >
            {item.icon}

            <p className="text-sm mt-2 font-bold text-gray-900">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export default function EmptyDashboard() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <main
        aria-label="Dashboard empty state"
        className="flex-1 pt-24 pb-16 px-6 w-full max-w-6xl mx-auto"
      >
        <HeroSection />
        <EmptyState />
        <HowItWorks />
        <HelpResources />
      </main>
    </div>
  );
}
