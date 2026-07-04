"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

import FrameworkCard from "@/components/framework-selection/framework-card";
import SidebarSummary from "@/components/framework-selection/SidebarSummary";
import LoadingScreen from "@/components/framework-selection/LoadingScreen";
import SearchInput from "@/components/framework-selection/SearchInput";
import FilterTabs from "@/components/framework-selection/FilterTabs";
import Stepper from "@/components/framework-selection/Stepper";
import { useAssessmentStore } from "@/stores/assessment-store";
import BottomNavigation from "@/components/framework-selection/bottomNavigation";
import { useRouter } from "next/navigation";
import { Search, Plus, X, AlertCircle } from "lucide-react";
import { Shield } from "lucide-react";

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

interface PublishedFramework {
  id: string;
  code: string;
  name: string;
  description: string;
  region: string;
  category: string;
  version: string;
  _count: { controls: number };
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
    suggestionSource,
  } = useAssessmentStore();

  const creatingAssessment = phase === "creating";
  const isFallback = useMemo(
    () => suggestionSource === "heuristic" || suggestionSource === "keyword",
    [suggestionSource],
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Manual add state
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualSearch, setManualSearch] = useState("");
  const [publishedFrameworks, setPublishedFrameworks] = useState<PublishedFramework[]>([]);
  const [isLoadingPublished, setIsLoadingPublished] = useState(false);
  const [manuallyAdded, setManuallyAdded] = useState<FrameworkCardModel[]>([]);

  const fetchPublishedFrameworks = useCallback(async (query: string) => {
    setIsLoadingPublished(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("search", query.trim());
      }
      const res = await fetch(`/api/frameworks/published?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setPublishedFrameworks(json.data ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoadingPublished(false);
    }
  }, []);

  useEffect(() => {
    if (showManualAdd) {
      void fetchPublishedFrameworks(manualSearch);
    }
  }, [showManualAdd, manualSearch, fetchPublishedFrameworks]);

  const handleAddManualFramework = (fw: PublishedFramework) => {
    // Check if already in suggestions
    const alreadySuggested = suggestions.some((s) => s.frameworkId === fw.id);
    const alreadyManual = manuallyAdded.some((m) => m.id === fw.id);

    if (!alreadySuggested && !alreadyManual) {
      setManuallyAdded((prev) => [
        ...prev,
        {
          id: fw.id,
          code: fw.code,
          name: fw.name,
          description: fw.description,
          category: fw.category || "Security",
          confidence: 0,
          why: "Manually added",
          requirements: [],
          controls: fw._count.controls,
        },
      ]);
    }

    // Auto-select it
    if (!selectedFrameworkIds.includes(fw.id)) {
      toggleFramework(fw.id);
    }

    setShowManualAdd(false);
    setManualSearch("");
  };

  const handleNext = async () => {
    clearError();

    const result = await createAssessment();
    if (!result.ok) {
      return;
    }

    if (result.assessmentId) {
      router.push(`/assessments/${result.assessmentId}/checklist`);
      return;
    }

    router.push("/assessments");
  };

  const handleRetry = async () => {
    const didRetrySucceed = await retryLastAction();
    if (!didRetrySucceed) {
      return;
    }

    const state = useAssessmentStore.getState();

    if (state.phase === "success") {
      const nextAssessmentId = state.assessmentId;
      state.reset();

      if (nextAssessmentId) {
        router.push(`/assessments/${nextAssessmentId}/checklist`);
        return;
      }

      router.push("/assessments");
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

  // Combine AI suggestions with manually added frameworks
  const allFrameworks = useMemo(() => {
    return [...mappedFrameworks, ...manuallyAdded];
  }, [mappedFrameworks, manuallyAdded]);

  /* Filter logic */
  const filteredFrameworks = useMemo(
    () =>
      allFrameworks
        .filter((framework) => {
          const matchesSearch = framework.name.toLowerCase().includes(search.toLowerCase());
          const matchesTab = activeTab === "All" || framework.category === activeTab;
          return matchesSearch && matchesTab;
        })
        .sort((a, b) => b.confidence - a.confidence),
    [allFrameworks, search, activeTab],
  );

  // Filter out frameworks already in suggestions or manually added
  const availablePublished = useMemo(() => {
    const existingIds = new Set(allFrameworks.map((f) => f.id));
    return publishedFrameworks.filter((fw) => !existingIds.has(fw.id));
  }, [publishedFrameworks, allFrameworks]);

  // Initial page loader
  useEffect(() => {
    setIsHydrated(true);

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Redirect if there are no frameworks
  useEffect(() => {
    if (!isHydrated || showLoader) {
      return;
    }

    if (suggestions.length === 0 && manuallyAdded.length === 0) {
      router.replace("/onboarding");
    }
  }, [isHydrated, showLoader, suggestions.length, manuallyAdded.length, router]);

  // Close manual dialog with Escape
  useEffect(() => {
    if (!showManualAdd) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowManualAdd(false);
        setManualSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showManualAdd]);

  // Loading states
  if (!isHydrated || showLoader) {
    return <LoadingScreen />;
  }

  if (suggestions.length === 0 && manuallyAdded.length === 0) {
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
      {isFallback && (
        <div
          role="alert"
          aria-live="polite"
          className="max-w-7xl mx-auto bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 text-sm text-amber-800 dark:text-amber-200 shadow-sm animate-fadeIn"
        >
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-amber-900 dark:text-amber-100">
              Auto-Suggested Recommendations
            </h5>
            <p className="mt-1 text-amber-700 dark:text-amber-300 leading-relaxed">
              Our live AI engine is currently experiencing high latency. The compliance frameworks
              below have been automatically suggested based on your business profile&apos;s industry
              keywords, regions, and data types instead of a dynamic AI distillation.
            </p>
          </div>
        </div>
      )}
      <>
        {/* Stepper */}
        <div>
          <div className="max-w-7xl mx-auto">
            <Stepper currentStep={2} />
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="border-b border-slate-200 my-6" />

            <div
              className="
      rounded-3xl
      border border-purple-100
      bg-gradient-to-br
      from-purple-50/80
      via-purple-50/30
      to-white
      p-6 md:p-8
      shadow-sm
      space-y-6
    "
            >
              {/* Stepper */}

              {/* Heading */}
              <div className="flex items-start gap-4">
                <div className=" flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 border border-purple-200">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Select your compliance frameworks
                  </h1>

                  <p className="mt-2 text-slate-600 max-w-2xl">
                    Review AI recommendations and choose the frameworks that best match your
                    organization’s compliance needs.
                  </p>
                </div>
              </div>

              {/* Toolbar */}
              <div className="rounded-2xl border border-purple-100 bg-white/80 backdrop-blur-sm p-4">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                  {/* Search */}
                  <div className="flex-1 max-w-2xl">
                    <SearchInput value={search} onChange={setSearch} />
                  </div>

                  {/* Add Framework */}
                  <button
                    onClick={() => setShowManualAdd(true)}
                    className="
            inline-flex items-center justify-center gap-2
            rounded-xl
            bg-purple-600
            px-5 py-3
            text-sm font-medium text-white
            shadow-sm
            transition-all
            hover:bg-purple-700
            hover:shadow-md
          "
                  >
                    <Plus size={16} className="text-lg font-semibold text-gray-900" />
                    Add Framework
                  </button>
                </div>

                {/* Filter Chips */}
                <div className="mt-4">
                  <FilterTabs active={activeTab} setActive={setActiveTab} />
                </div>
              </div>
            </div>
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
              selected={allFrameworks.filter((framework) =>
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

      {/* Manual Add Modal */}
      {showManualAdd && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[80vh] flex flex-col "
            role="dialog"
            aria-modal="true"
            aria-labelledby="manual-framework-title"
            aria-describedby="manual-framework-description"
          >
            <div className="flex justify-between items-center">
              <h3 id="manual-framework-title" className="text-lg font-semibold text-gray-900">
                Add Framework
              </h3>
              <button
                type="button"
                aria-label="Close Add Framework dialog"
                onClick={() => {
                  setShowManualAdd(false);
                  setManualSearch("");
                }}
                className="text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-500" id="manual-framework-description">
              Search and add published frameworks that the AI may not have suggested.
            </p>

            {/* Search input */}
            <div className="relative">
              <Search
                aria-label="Search published frameworks"
                aria-describedby="framework-search-help"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                aria-label="Search published frameworks"
                aria-describedby="framework-search-help"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6d18ff]/40 focus:border-[#6d18ff]"
                placeholder="Search by name or code..."
                value={manualSearch}
                onChange={(e) => setManualSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && availablePublished.length > 0) {
                    handleAddManualFramework(availablePublished[0]);
                  }
                }}
                autoFocus
              />
            </div>

            {/* Results */}
            <div
              className="flex-1 overflow-y-auto space-y-2 min-h-0"
              role="list"
              aria-label="Published frameworks"
            >
              {isLoadingPublished ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  Searching frameworks...
                </div>
              ) : availablePublished.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  {manualSearch
                    ? "No additional frameworks found matching your search."
                    : "All published frameworks are already in your selection."}
                </div>
              ) : (
                availablePublished.map((fw) => (
                  <button
                    type="button"
                    role="listitem"
                    aria-label={`Add ${fw.name} (${fw.code})`}
                    key={fw.id}
                    onClick={() => handleAddManualFramework(fw)}
                    className="w-full text-left rounded-lg border border-slate-200 bg-white p-3 hover:border-[#6d18ff]/40 hover:bg-[#6d18ff]/5 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{fw.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {fw.code} · {fw._count.controls} controls · {fw.region || "Global"}
                        </p>
                      </div>
                      <Plus size={16} className="text-[#6d18ff] shrink-0" />
                    </div>
                    {fw.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{fw.description}</p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
