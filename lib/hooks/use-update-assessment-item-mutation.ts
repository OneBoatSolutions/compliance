"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAssessmentItem } from "@/lib/checklist-api";
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

type UpdateAssessmentItemMutationResult = Awaited<ReturnType<typeof updateAssessmentItem>>;

export function useUpdateAssessmentItemMutation(assessmentId: string) {
  const queryClient = useQueryClient();

  return useMutation<UpdateAssessmentItemMutationResult, Error, UpdateAssessmentItemMutationInput>({
    mutationFn: ({ itemId, payload }) => {
      if (assessmentId.trim().length === 0) {
        throw new Error("Assessment ID is required before updating an item.");
      }

      return updateAssessmentItem(assessmentId, itemId, payload);
    },
    onSuccess: async () => {
      if (assessmentId.trim().length === 0) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.detail(assessmentId),
      });
    },
  });
}
