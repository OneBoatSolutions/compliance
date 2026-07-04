"use client";

import { type QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getAssessmentChecklist,
  getAssessmentDetails,
  getAssessmentScore,
  updateAssessmentItem,
} from "@/lib/checklist-api";
import { assessmentQueryKeys } from "@/lib/hooks/use-assessment-query";
import { type AssessmentItemStatus } from "@/stores/assessment-store";

export interface UpdateAssessmentItemMutationPayload {
  status?: AssessmentItemStatus;
  comments?: string | null;
}

export interface UpdateAssessmentItemMutationInput {
  itemId: string;
  payload: UpdateAssessmentItemMutationPayload;
}

interface UseUpdateAssessmentItemMutationOptions {
  checklistQueryPrefix?: QueryKey;
  scoreQueryKey?: QueryKey;
}

type UpdateAssessmentItemMutationResult = Awaited<ReturnType<typeof updateAssessmentItem>>;
type AssessmentDetailResponse = Awaited<ReturnType<typeof getAssessmentDetails>>;
type ChecklistResponse = Awaited<ReturnType<typeof getAssessmentChecklist>>;
type AssessmentScoreResponse = Awaited<ReturnType<typeof getAssessmentScore>>;

interface OptimisticMutationContext {
  previousAssessment: AssessmentDetailResponse | undefined;
  previousChecklistEntries: Array<[QueryKey, ChecklistResponse | undefined]>;
  previousScore: AssessmentScoreResponse | undefined;
  optimisticScore: AssessmentScoreResponse | undefined;
}

interface FrameworkAccumulator {
  frameworkId: string;
  frameworkCode: string;
  frameworkName: string;
  numerator: number;
  denominator: number;
}

function scoreFactor(status: AssessmentItemStatus): number | null {
  if (status === "COMPLIANT") {
    return 1;
  }

  if (status === "PARTIALLY_COMPLIANT") {
    return 0.5;
  }

  if (status === "NOT_APPLICABLE") {
    return null;
  }

  return 0;
}

function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

function patchItem(
  item: AssessmentDetailResponse["items"][number],
  payload: UpdateAssessmentItemMutationPayload,
): AssessmentDetailResponse["items"][number] {
  const nextStatus = payload.status ?? item.status;
  const nextComments = payload.comments === undefined ? item.comments : payload.comments;

  if (nextStatus === item.status && nextComments === item.comments) {
    return item;
  }

  return {
    ...item,
    status: nextStatus,
    comments: nextComments,
  };
}

function patchAssessmentDetail(
  data: AssessmentDetailResponse | undefined,
  itemId: string,
  payload: UpdateAssessmentItemMutationPayload,
): AssessmentDetailResponse | undefined {
  if (!data) {
    return data;
  }

  return {
    ...data,
    items: data.items.map((item) => (item.id === itemId ? patchItem(item, payload) : item)),
  };
}

function patchChecklistResponse(
  data: ChecklistResponse | undefined,
  itemId: string,
  payload: UpdateAssessmentItemMutationPayload,
): ChecklistResponse | undefined {
  if (!data) {
    return data;
  }

  return {
    ...data,
    items: data.items.map((item) => (item.id === itemId ? patchItem(item, payload) : item)),
  };
}

function computeOptimisticScore(
  assessmentId: string,
  items: AssessmentDetailResponse["items"],
): AssessmentScoreResponse {
  let numerator = 0;
  let denominator = 0;

  const frameworks = new Map<string, FrameworkAccumulator>();

  for (const item of items) {
    const factor = scoreFactor(item.status);

    if (factor === null) {
      continue;
    }

    const weight = item.control.weight;
    numerator += weight * factor;
    denominator += weight;

    const frameworkId = item.control.framework.id;
    const existing = frameworks.get(frameworkId);

    if (existing) {
      existing.numerator += weight * factor;
      existing.denominator += weight;
      continue;
    }

    frameworks.set(frameworkId, {
      frameworkId,
      frameworkCode: item.control.framework.code,
      frameworkName: item.control.framework.name,
      numerator: weight * factor,
      denominator: weight,
    });
  }

  const frameworkScores = [...frameworks.values()]
    .map((entry) => ({
      frameworkId: entry.frameworkId,
      frameworkCode: entry.frameworkCode,
      frameworkName: entry.frameworkName,
      score: entry.denominator > 0 ? roundScore((entry.numerator / entry.denominator) * 100) : 0,
    }))
    .sort((left, right) => left.frameworkCode.localeCompare(right.frameworkCode));

  return {
    assessmentId,
    score: denominator > 0 ? roundScore((numerator / denominator) * 100) : 0,
    frameworkScores,
  };
}

export function useUpdateAssessmentItemMutation(
  assessmentId: string,
  options: UseUpdateAssessmentItemMutationOptions = {},
) {
  const queryClient = useQueryClient();
  const assessmentDetailKey = assessmentQueryKeys.detail(assessmentId);

  return useMutation<
    UpdateAssessmentItemMutationResult,
    Error,
    UpdateAssessmentItemMutationInput,
    OptimisticMutationContext
  >({
    mutationFn: async ({ itemId, payload }) => {
      if (assessmentId.trim().length === 0) {
        throw new Error("Assessment ID is required before updating an item.");
      }

      return await updateAssessmentItem(assessmentId, itemId, payload);
    },
    onMutate: async ({ itemId, payload }) => {
      const checklistPrefix = options.checklistQueryPrefix;
      const scoreKey = options.scoreQueryKey;

      await queryClient.cancelQueries({ queryKey: assessmentDetailKey });

      if (checklistPrefix) {
        await queryClient.cancelQueries({ queryKey: checklistPrefix });
      }

      if (scoreKey) {
        await queryClient.cancelQueries({ queryKey: scoreKey });
      }

      const previousAssessment =
        queryClient.getQueryData<AssessmentDetailResponse>(assessmentDetailKey);
      const previousChecklistEntries = checklistPrefix
        ? queryClient.getQueriesData<ChecklistResponse>({ queryKey: checklistPrefix })
        : [];
      const previousScore = scoreKey
        ? queryClient.getQueryData<AssessmentScoreResponse>(scoreKey)
        : undefined;

      const nextAssessment = patchAssessmentDetail(previousAssessment, itemId, payload);

      if (nextAssessment) {
        queryClient.setQueryData<AssessmentDetailResponse>(assessmentDetailKey, nextAssessment);
      }

      for (const [key, previousEntry] of previousChecklistEntries) {
        if (!previousEntry) {
          continue;
        }

        const nextEntry = patchChecklistResponse(previousEntry, itemId, payload);
        queryClient.setQueryData<ChecklistResponse>(key, nextEntry);
      }

      let optimisticScore: AssessmentScoreResponse | undefined;
      if (scoreKey && payload.status && nextAssessment) {
        optimisticScore = computeOptimisticScore(assessmentId, nextAssessment.items);
        queryClient.setQueryData<AssessmentScoreResponse>(scoreKey, optimisticScore);
      }

      return {
        previousAssessment,
        previousChecklistEntries,
        previousScore,
        optimisticScore,
      };
    },
    onError: (error, variables, context) => {
      void error;
      void variables;

      if (!context) {
        return;
      }

      queryClient.setQueryData<AssessmentDetailResponse | undefined>(
        assessmentDetailKey,
        context.previousAssessment,
      );

      for (const [key, previousEntry] of context.previousChecklistEntries) {
        queryClient.setQueryData<ChecklistResponse | undefined>(key, previousEntry);
      }

      if (options.scoreQueryKey) {
        queryClient.setQueryData<AssessmentScoreResponse | undefined>(
          options.scoreQueryKey,
          context.previousScore,
        );
      }
    },
    onSuccess: async (data, variables, context) => {
      void variables;

      const scoreKey = options.scoreQueryKey;

      if (scoreKey) {
        queryClient.setQueryData<AssessmentScoreResponse | undefined>(scoreKey, (previous) => {
          if (previous) {
            return {
              ...previous,
              score: data.score,
            };
          }

          if (context?.optimisticScore) {
            return {
              ...context.optimisticScore,
              score: data.score,
            };
          }

          return previous;
        });
      }

      if (assessmentId.trim().length === 0) {
        return;
      }
    },
    onSettled: async () => {
      const invalidations: Array<Promise<void>> = [
        queryClient.invalidateQueries({ queryKey: assessmentDetailKey }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ];

      if (options.checklistQueryPrefix) {
        invalidations.push(
          queryClient.invalidateQueries({ queryKey: options.checklistQueryPrefix }),
        );
      }

      if (options.scoreQueryKey) {
        invalidations.push(queryClient.invalidateQueries({ queryKey: options.scoreQueryKey }));
      }

      await Promise.all(invalidations);
    },
  });
}
