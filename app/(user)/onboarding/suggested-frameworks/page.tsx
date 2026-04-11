"use client";

import { useEffect, useMemo, useState } from "react";

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

/* ---------------- PAGE ---------------- */

interface FrameworkCardModel {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  confidence: number;
  why: string;
  requirements: string[];
  controls: number;
  recommended?: boolean;
}

function getCategoryFromTags(tags: string[]) {
  const normalized = tags.map((tag) => tag.toLowerCase());

  if (normalized.includes("privacy") || normalized.includes("pii")) {
    return "Privacy";
  }

  if (normalized.includes("finance") || normalized.includes("payment")) {
    return "Industry";
  }

  if (normalized.includes("security") || normalized.includes("cybersecurity")) {
    return "Security";
  }

  return "Security";
}

export default function Page() {
  const router = useRouter();
  const {
    suggestions,
    selectedFrameworkIds,
    toggleFramework,
    createAssessment,
    retryLastAction,
    phase,
    error: flowError,
    clearError,
    reset,
  } = useAssessmentStore();

  const creatingAssessment = phase === "creating";
  const [isHydrated, setIsHydrated] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const handleNext = async () => {
    clearError();

    const result = await createAssessment();
    if (!result.ok) {
      return;
    }

    reset();
    router.push("/dashboard");
  };

  const handleRetry = async () => {
    const didRetrySucceed = await retryLastAction();
    if (!didRetrySucceed) {
      return;
    }

    if (useAssessmentStore.getState().phase === "success") {
      useAssessmentStore.getState().reset();
      router.push("/dashboard");
    }
  };

  const mappedFrameworks = useMemo<FrameworkCardModel[]>(
    () =>
      (suggestions || []).map((suggestion) => ({
        id: suggestion.frameworkId,
        code: suggestion.code,
        name: suggestion.name,
        description: suggestion.explanation,
        category: getCategoryFromTags(suggestion.tags || []),
        confidence: suggestion.confidence,
        why: suggestion.explanation,
        requirements: [],
        controls: suggestion.controls ?? 0,
      })),
    [suggestions],
  );

  /* Filter logic */
  const filteredFrameworks = useMemo(
    () =>
      mappedFrameworks
        .filter((framework) => {
          const matchesSearch = framework.name.toLowerCase().includes(search.toLowerCase());

          const matchesTab = activeTab === "All" || framework.category === activeTab;

          return matchesSearch && matchesTab;
        })
        .sort((a, b) => b.confidence - a.confidence),
    [mappedFrameworks, search, activeTab],
  );

  useEffect(() => {
    if (!isHydrated || showLoader) {
      return;
    }

    if (suggestions.length === 0) {
      router.replace("/onboarding");
    }
  }, [isHydrated, router, showLoader, suggestions.length]);

  useEffect(() => {
    setIsHydrated(true);
    // Force loader to stay for a short duration for smooth transition.
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated || showLoader) {
    return <LoadingScreen />;
  }

  if (suggestions.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 space-y-6">
      {flowError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md">
          <p>{flowError.message}</p>
          {flowError.retryable && (
            <button
              type="button"
              onClick={handleRetry}
              className="mt-2 text-sm underline text-blue-600"
            >
              Retry
            </button>
          )}
        </div>
      )}
      <>
        {/* Stepper */}
        <Stepper currentStep={2} />
        <div className="max-w-7xl mx-auto p-6 space-y-6">
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
                  key={framework.id}
                  className="animate-fadeIn"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <FrameworkCard
                    framework={framework}
                    selected={selectedFrameworkIds.includes(framework.id)}
                    onToggle={() => toggleFramework(framework.id)}
                  />
                </div>
              ))}
            </div>

            {/* RIGHT: Sidebar */}
            <SidebarSummary
              selected={mappedFrameworks.filter((framework) =>
                selectedFrameworkIds.includes(framework.id),
              )}
              onContinue={handleNext}
              loading={creatingAssessment}
            />
            <div />
          </div>
        </div>
      </>
      <BottomNavigation onNext={handleNext} loading={creatingAssessment} />
    </div>
  );
}
