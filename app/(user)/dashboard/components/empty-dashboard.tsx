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
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl shadow-gray-200/50 p-12 text-center flex flex-col items-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#6d18ff]/10 rounded-full flex items-center justify-center mb-6 text-[#6d18ff]">
          <ListChecks className="w-10 h-10 text-purple-600" />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No assessments yet</h2>

        <p className="text-slate-500 max-w-md mb-8">
          Start your compliance journey by creating your first assessment. We&apos;ll guide you
          through selecting a framework and connecting your infrastructure.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push("/onboarding")}
          className="h-[52px] px-8 bg-[#6d18ff] hover:bg-[#5412cc] text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-[#6d18ff]/20 transition-transform active:scale-95"
        >
          Create Your First Assessment
          <MoveRight className="w-5 h-5" />
        </button>

        {/* Info */}
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-400">
          <Clock4 className="w-4 h-4" />
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
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Cipherion, {displayName}! 👋
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Automate your compliance journey and stay audit-ready with ease. We help you simplify
            framework management so you can focus on building your business.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative w-full max-w-[320px] aspect-square bg-[#6d18ff]/5 rounded-full border border-[#6d18ff]/10 flex items-center justify-center">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-[#6d18ff]/10 animate-pulse"></div>
          <ShieldCheck className="w-28 h-28 text-[#6d18ff]/40" />
        </div>
      </div>
    </section>
  );
}
function HowItWorks() {
  const steps = [
    {
      title: "Describe",
      desc: "Tell us about your business profile, target regions, and specific data handling requirements.",
      icon: <File className="w-5 h-5 text-[#6d18ff]/40" />,
    },
    {
      title: "AI Analyzes",
      desc: "Our AI engine automatically maps your profile to security frameworks and identifies critical gaps.",
      icon: <Sparkles className="w-5 h-5 text-[#6d18ff]/40" />,
    },
    {
      title: "Complete",
      desc: "Follow the guided remediation steps and seamlessly track your journey to full compliance.",
      icon: <SquareCheckBig className="w-5 h-5 text-[#6d18ff]/40" />,
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
            className="bg-white p-6 rounded-lg border border-slate-100 hover:border-[#6d18ff]/30 transition-all"
          >
            <div className="flex justify-between mb-4">
              <div className="w-8 h-8 bg-[#6d18ff] text-white flex items-center justify-center rounded-full text-sm font-bold">
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
        <FileText className="w-5 h-5 text-slate-400 group-hover:text-[#6d18ff] transition-colors" />
      ),
    },
    {
      title: "Tutorials",
      icon: (
        <MonitorPlay className="w-5 h-5 text-slate-400 group-hover:text-[#6d18ff] transition-colors" />
      ),
    },
    {
      title: "Support",
      icon: (
        <Headset className="w-5 h-5 text-slate-400 group-hover:text-[#6d18ff] transition-colors" />
      ),
    },
    {
      title: "Book a Demo",
      icon: (
        <Play className="w-5 h-5 text-slate-400 group-hover:text-[#6d18ff] transition-colors" />
      ),
    },
  ];

  return (
    <section className="border-t border-slate-200 pt-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900">Need guidance?</h3>
        <span className="text-[#6d18ff] text-sm font-semibold cursor-pointer mt-2 md:mt-0">
          View all resources
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="group p-4 bg-slate-100 rounded-lg border border-transparent hover:bg-[#6d18ff]/5 hover:border-[#6d18ff]/20 transition-all cursor-pointer"
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
      <main className="flex-1 pt-24 pb-16 px-6 w-full max-w-6xl mx-auto">
        <HeroSection />
        <EmptyState />
        <HowItWorks />
        <HelpResources />
      </main>
    </div>
  );
}
