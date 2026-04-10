"use client";

import { useEffect, useState } from "react";

import TopSection from "@/components/framework-selection/TopSection";
import FrameworkCard from "@/components/framework-selection/framework-card";
import SidebarSummary from "@/components/framework-selection/SidebarSummary";
import LoadingScreen from "@/components/framework-selection/LoadingScreen";
import SearchInput from "@/components/framework-selection/SearchInput";
import FilterTabs from "@/components/framework-selection/FilterTabs";
import Stepper from "@/components/framework-selection/Stepper";
import { useAssessmentStore } from "@/stores/assessment-store";
import BottomNavigation from "@/components/framework-selection/bottomNavigation";
import { useRouter } from "next/navigation";
import { includes } from "zod";

/* ---------------- PAGE ---------------- */

export default function Page() {
  const router = useRouter();

  const [creatingAssessment, setCreatingAssessment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    const { organizationId, selectedFrameworkIds } = useAssessmentStore.getState();

    if (!organizationId) {
      setError("Organization ID missing");
      return;
    }

    if (selectedFrameworkIds.length === 0) {
      setError("Select at least one framework");
      return;
    }

    try {
      setCreatingAssessment(true);
      setError(null);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          organizationId,
          frameworkIds: selectedFrameworkIds,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error("FAILED");
      }

      const data = await res.json();

      // ✅ IMPORTANT: extract assessmentId
      const assessmentId = data.data?.assessmentId;

      if (!assessmentId) {
        throw new Error("NO_ID");
      }

      // ✅ OPTIONAL: reset store (clean state)
      useAssessmentStore.getState().reset();

      // ✅ REDIRECT TO DASHBOARD
      router.push(`/assessment/${assessmentId}/checklist`);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out. Try again.");
        return;
      }

      setError("Failed to create assessment");
    } finally {
      setCreatingAssessment(false);
    }
  };
  const { suggestions, selectedFrameworkIds, toggleFramework } = useAssessmentStore();
  const getCategoryFromTags = (tags: string[]) => {
    const t = tags.map((tag) => tag.toLowerCase());

    if (t.includes("privacy") || t.includes("pii")) {
      return "Privacy";
    }
    if (t.includes("finance") || t.includes("payment")) {
      return "Industry";
    }
    if (t.includes("security") || t.includes("cybersecurity")) {
      return "Security";
    }

    return "Security"; // default fallback
  };
  const mappedFrameworks = (suggestions || []).map((f) => ({
    code: f.code,
    name: f.name,
    description: f.explanation, // fallback
    category: getCategoryFromTags(f.tags || []),
    confidence: f.confidence,
    why: f.explanation,
    requirements: [], // empty for now
    controls: 0, //backend does not give this
  }));

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
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [confidenceFilter, setConfidenceFilter] = useState("All");

  useEffect(() => {
    if (!suggestions) {
      return;
    }

    suggestions.forEach((f) => {
      if (f.confidence > 85 && !selectedFrameworkIds.includes(f.code)) {
        toggleFramework(f.code);
      }
    });
  }, [suggestions]);
  useEffect(() => {
    console.log(" SUGGESTIONS UPDATED:", suggestions);
  }, [suggestions]);
  /* Filter logic */
  const filteredFrameworks = mappedFrameworks
    .filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());

      const matchesTab = activeTab === "All" || f.category === activeTab;

      const matchesConfidence =
        confidenceFilter === "All" ||
        (confidenceFilter === "High" && f.confidence > 80) ||
        (confidenceFilter === "Medium" && f.confidence > 50 && f.confidence <= 80) ||
        (confidenceFilter === "Low" && f.confidence <= 50);
      console.log("FINAL RENDER DATA:", mappedFrameworks);

      return matchesSearch && matchesTab && matchesConfidence;
    })
    .sort((a, b) => b.confidence - a.confidence);

  /* Loading screen */
  const [isHydrated, setIsHydrated] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
    //  force loader to stay for at least 500ms
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated || showLoader || !suggestions) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md">{error}</div>
      )}
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
                  key={framework.code}
                  className="animate-fadeIn"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <FrameworkCard
                    framework={framework}
                    selected={selectedFrameworkIds.includes(framework.code)}
                    onToggle={() => toggleFramework(framework.code)}
                  />
                </div>
              ))}
            </div>

            {/* RIGHT: Sidebar */}
            <SidebarSummary
              selected={mappedFrameworks.filter((f) => selectedFrameworkIds.includes(f.code))}
              onContinue={handleNext}
              loading={creatingAssessment}
            />
            <div></div>
          </div>
        </div>
      </>
      <BottomNavigation onNext={handleNext} />
    </div>
  );
}
