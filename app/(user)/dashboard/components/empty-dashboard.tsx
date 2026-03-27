"use client";
import { useRouter } from "next/navigation";
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
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center flex flex-col items-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#6d18ff]/10 rounded-full flex items-center justify-center mb-6">
          <ListChecks className="w-10 h-10 text-purple-600" />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">No assessments yet</h2>

        <p className="text-gray-600 max-w-md mb-8">
          Create your first compliance assessment to discover which regulatory frameworks apply to
          your business and start tracking your compliance readiness.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push("/onboarding")}
          className="h-[52px] px-8 bg-[#6d18ff] hover:bg-[#5412cc] text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg transition"
        >
          Create Your First Assessment
          <MoveRight className="w-10 h-7" />
        </button>

        {/* Info */}
        <div className="mt-4 text-gray-500 text-sm font-semibold flex items-center gap-2">
          <Clock4 className="w-5 h-5 " />
          TAKES ONLY 5 MINUTES
        </div>
      </div>
    </section>
  );
}
function HeroSection() {
  return (
    <section className="mb-8 bg-linear-to-br from-[#e9ddff] to-white p-8 md:p-12 rounded-xl border border-[#6d18ff]/10 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text */}
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Welcome to Cipherion! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Automate your compliance journey and stay audit-ready with ease. We help you simplify
            framework management so you can focus on building your business.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative w-full max-w-[320px] aspect-square bg-[#6d18ff]/10 rounded-full flex items-center justify-center">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-[#6d18ff]/10 animate-pulse"></div>
          <ShieldCheck className="w-25 h-25 text-purple-600" />
        </div>
      </div>
    </section>
  );
}
function HowItWorks() {
  const steps = [
    {
      title: "Describe Your Business",
      desc: "Tell us about your product, services, and data handling",
      icon: <File />,
    },
    {
      title: "AI Analyzes Requirements",
      desc: "Our AI suggests applicable compliance frameworks for you",
      icon: <Sparkles />,
    },
    {
      title: "Complete Assessment",
      desc: "Work through controls and track your compliance progress",
      icon: <SquareCheckBig />,
    },
  ];

  return (
    <section className="mb-16">
      <h3 className="text-center text-sm font-semibold tracking-widest text-gray-400 mb-8">
        HOW IT WORKS
      </h3>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg border hover:border-[#6d18ff]/30 transition"
          >
            <div className="flex justify-between mb-4">
              <div className="w-8 h-8 bg-[#6d18ff] text-white flex items-center justify-center rounded-full text-sm font-bold">
                {i + 1}
              </div>
              <span className="material-symbols-outlined text-[#6d18ff]/40">{step.icon}</span>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
            <p className="text-sm text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function HelpResources() {
  const items = [
    { title: "Documentation", icon: <FileText /> },
    { title: "Tutorials", icon: <MonitorPlay /> },
    { title: "Support", icon: <Headset /> },
    { title: "Book a Demo", icon: <Play /> },
  ];

  return (
    <section className="border-t border-gray-200 pt-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Need guidance?</h3>
        <span className="text-[#6d18ff] text-sm cursor-pointer">View all resources</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-lg hover:bg-[#6d18ff]/5 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-gray-400 mb-2">{item.icon}</span>

            <p className="text-sm mt-2 font-semibold text-gray-900">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export default function EmptyDashboard() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <main className="flex-1 pt-20 px-6 lg:p-10">
        <HeroSection />
        <EmptyState />
        <HowItWorks />
        <HelpResources />
      </main>
    </div>
  );
}
