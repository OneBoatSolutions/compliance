import { OnboardingFormValues } from "@/lib/validations/onboarding";
import { create } from "zustand";

export interface FrameworkSuggestion {
  code: string;
  name: string;
  confidence: number;
  explanation: string;
  tags: string[];
  controls: number;
}

interface AssessmentState {
  organizationId: string | null;
  suggestions: FrameworkSuggestion[];
  selectedFrameworkIds: string[];
  onboardingData: OnboardingFormValues | null;
  setOnboardingData: (data: OnboardingFormValues) => void;

  setOrganizationId: (id: string) => void;
  setSuggestions: (data: FrameworkSuggestion[]) => void;
  toggleFramework: (id: string) => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  organizationId: null,
  suggestions: [],
  selectedFrameworkIds: [],
  onboardingData: null,

  setOrganizationId: (id) => set({ organizationId: id }),

  setSuggestions: (data) => set({ suggestions: data }),
  setOnboardingData: (data) => set({ onboardingData: data }),

  toggleFramework: (id) =>
    set((state) => ({
      selectedFrameworkIds: state.selectedFrameworkIds.includes(id)
        ? state.selectedFrameworkIds.filter((f) => f !== id)
        : [...state.selectedFrameworkIds, id],
    })),

  reset: () =>
    set({
      organizationId: null,
      suggestions: [],
      selectedFrameworkIds: [],
      onboardingData: null,
    }),
}));
