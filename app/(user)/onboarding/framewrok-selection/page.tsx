"use client";

import { useEffect, useState } from "react";

import TopSection from "@/components/framework-selection/TopSection";
import FrameworkCard from "@/components/framework-selection/framework-card";
import SidebarSummary from "@/components/framework-selection/SidebarSummary";
import LoadingScreen from "@/components/framework-selection/LoadingScreen";
import SearchInput from "@/components/framework-selection/SearchInput";
import FilterTabs from "@/components/framework-selection/FilterTabs";
import Stepper from "@/components/framework-selection/Stepper";

import BottomNavigation from "@/components/framework-selection/bottomNavigation";

/* ---------------- MOCK DATA ---------------- */
const frameworksData = [
  {
    name: "SOC 2",
    description: "Security, availability, and confidentiality controls",
    category: "Security",
    confidence: 92,
    why: "Recommended for SaaS platforms handling customer data and requiring trust assurance.",
    requirements: ["Access control", "Monitoring", "Encryption"],
    controls: 64,
    recommended: true,
  },
  {
    name: "ISO 27001",
    description: "International information security standard",
    category: "Security",
    confidence: 85,
    why: "Ideal for organizations building a structured information security management system.",
    requirements: ["Risk assessment", "Policies", "Audits"],
    controls: 114,
  },
  {
    name: "GDPR",
    description: "European data protection regulation",
    category: "Privacy",
    confidence: 78,
    why: "Applies if you collect or process personal data of EU citizens.",
    requirements: ["Consent", "Data rights", "Breach reporting"],
    controls: 45,
  },
  {
    name: "HIPAA",
    description: "US healthcare data protection regulation",
    category: "Privacy",
    confidence: 88,
    why: "Required for systems handling protected health information (PHI) in the US.",
    requirements: ["PHI protection", "Audit logs", "Encryption"],
    controls: 78,
    recommended: true,
  },
  {
    name: "PCI DSS",
    description: "Payment card data security standard",
    category: "Industry",
    confidence: 81,
    why: "Necessary for businesses processing or storing card payment information.",
    requirements: ["Secure network", "Access control", "Monitoring"],
    controls: 90,
  },
  {
    name: "NIST CSF",
    description: "Cybersecurity risk management framework",
    category: "Security",
    confidence: 75,
    why: "Useful for organizations looking to improve cybersecurity maturity and risk management.",
    requirements: ["Identify", "Protect", "Detect", "Respond"],
    controls: 108,
  },
  {
    name: "FedRAMP",
    description: "US government cloud security compliance",
    category: "Industry",
    confidence: 70,
    why: "Applies to cloud providers serving US federal agencies.",
    requirements: ["Continuous monitoring", "Risk assessment"],
    controls: 325,
  },
  {
    name: "CIS Controls",
    description: "Best practices for cybersecurity defense",
    category: "Security",
    confidence: 83,
    why: "Provides a prioritized set of actions to defend against common cyber threats.",
    requirements: ["Inventory", "Access control", "Monitoring"],
    controls: 153,
  },
  {
    name: "ISO 27701",
    description: "Privacy extension for ISO 27001",
    category: "Privacy",
    confidence: 79,
    why: "Extends ISO 27001 to include privacy and personal data management controls.",
    requirements: ["PII handling", "Privacy governance"],
    controls: 49,
  },
  {
    name: "SOC 1",
    description: "Financial reporting controls framework",
    category: "Industry",
    confidence: 72,
    why: "Relevant for organizations impacting financial reporting and internal controls.",
    requirements: ["Internal controls", "Audit readiness"],
    controls: 60,
  },
];

/* ---------------- PAGE ---------------- */

export default function Page() {
  const [loading, setLoading] = useState(true);
  interface Framework {
    name: string;
    description: string;
    category: string;
    confidence: number;
    why: string;
    requirements: string[];
    controls: number;
    recommended?: boolean;
  }
  const [selected, setSelected] = useState<Framework[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [confidenceFilter, setConfidenceFilter] = useState("All");

  /* Simulate loading */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  /* Preselect high confidence */
  useEffect(() => {
    const preselected = frameworksData.filter((f) => f.confidence > 85);
    setSelected(preselected);
  }, []);

  /* Toggle selection */
  const toggleFramework = (framework: Framework) => {
    setSelected((prev) => {
      const exists = prev.find((f) => f.name === framework.name);
      if (exists) {
        return prev.filter((f) => f.name !== framework.name);
      }
      return [...prev, framework];
    });
  };

  /* Filter logic */
  const filteredFrameworks = frameworksData
    .filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());

      const matchesTab = activeTab === "All" || f.category === activeTab;

      const matchesConfidence =
        confidenceFilter === "All" ||
        (confidenceFilter === "High" && f.confidence > 80) ||
        (confidenceFilter === "Medium" && f.confidence > 50 && f.confidence <= 80) ||
        (confidenceFilter === "Low" && f.confidence <= 50);

      return matchesSearch && matchesTab && matchesConfidence;
    })
    .sort((a, b) => b.confidence - a.confidence);

  /* Loading screen */
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      <>
        {/* Top Section */}

        {/* Stepper */}
        <Stepper currentStep={2} />
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* ✅ THIS is the Top Section (greeting line) */}
          <TopSection />

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between py-4">
            <div className="w-full md:w-1/2">
              <SearchInput value={search} onChange={setSearch} />
            </div>
            <FilterTabs active={activeTab} setActive={setActiveTab} />
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
            {/* LEFT: Cards */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {filteredFrameworks.map((framework, index) => (
                <div
                  key={framework.name}
                  className="animate-fadeIn"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <FrameworkCard
                    framework={framework}
                    selected={selected.some((f) => f.name === framework.name)}
                    onToggle={() => toggleFramework(framework)}
                  />
                </div>
              ))}
            </div>

            {/* RIGHT: Sidebar */}
            <SidebarSummary selected={selected} onContinue={() => {}} />
            <div></div>
          </div>
        </div>
      </>
      <BottomNavigation onNext={() => {}} />
    </div>
  );
}
