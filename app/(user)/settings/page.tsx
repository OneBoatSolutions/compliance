"use client";

import { useEffect, useState, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Settings, AlertTriangle, Loader2 } from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { deleteAssessment } from "@/lib/checklist-api";
import { useAuthStore } from "@/stores/auth-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AssessmentListItem {
  id: string;
  status: string;
  score: number | null;
  createdAt: string;
  organizationId: string;
}

interface Organization {
  id: string;
  name: string;
  productName: string | null;
  description: string | null;
  services: string | null;
  targetCustomers: string | null;
  problemSolved: string | null;
  dataHandled: string[];
  regions: string[];
}

interface AssessmentDetails {
  id: string;
  userId: string;
  organizationId: string;
  status: string;
  score: number | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const settingsFormSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(1, "Product Name is required")
    .max(100, "Product Name must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Product Description is required")
    .max(500, "Product Description must be at most 500 characters"),
  targetCustomers: z
    .string()
    .trim()
    .min(1, "Target Audience is required")
    .max(200, "Target Audience must be at most 200 characters"),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all user assessments
  const {
    data: assessments,
    isLoading: loadingAssessments,
    error: assessmentsError,
  } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => apiClient.get<AssessmentListItem[]>("/api/assessments"),
  });

  // Fetch all user organizations to get friendly names
  const { data: organizations, isLoading: loadingOrgs } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => apiClient.get<Organization[]>("/api/organizations"),
  });

  const activeAssessment = assessments?.find((a) => a.id === selectedAssessmentId);

  // Fetch active assessment details (mainly to get organizationId)
  const { data: activeAssessmentDetails, isLoading: loadingActiveAssessment } = useQuery({
    queryKey: ["assessment", selectedAssessmentId],
    queryFn: () => apiClient.get<AssessmentDetails>(`/api/assessments/${selectedAssessmentId}`),
    enabled: !!selectedAssessmentId,
  });

  // Fetch organization details of the active assessment
  const orgId = activeAssessmentDetails?.organizationId;
  const { data: activeOrganization, isLoading: loadingOrg } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => apiClient.get<Organization>(`/api/organizations/${orgId}`),
    enabled: !!orgId,
  });

  // Determine initial selection based on search params or fallback to first assessment
  useEffect(() => {
    if (assessments && assessments.length > 0 && !selectedAssessmentId) {
      const paramId = searchParams.get("assessmentId");
      const matched = assessments.find((a) => a.id === paramId);
      if (matched) {
        setSelectedAssessmentId(matched.id);
      } else {
        setSelectedAssessmentId(assessments[0].id);
      }
    }
  }, [assessments, searchParams, selectedAssessmentId]);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      productName: "",
      description: "",
      targetCustomers: "",
    },
  });

  // Reset form when organization details are loaded/changed
  useEffect(() => {
    if (activeOrganization) {
      reset({
        productName: activeOrganization.productName || "",
        description: activeOrganization.description || "",
        targetCustomers: activeOrganization.targetCustomers || "",
      });
    }
  }, [activeOrganization, reset]);

  if (loadingAssessments || loadingOrgs) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (assessmentsError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center max-w-md mx-auto my-8">
        <p className="text-sm font-semibold text-red-700">Error loading settings</p>
        <p className="mt-1 text-sm text-red-600">
          {assessmentsError instanceof Error
            ? assessmentsError.message
            : "Failed to load assessments"}
        </p>
        <Button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["assessments"] })}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Handle empty state
  if (!assessments || assessments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto h-[60vh]">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <Settings className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">No Assessments</h2>
        <p className="text-slate-500 mb-6 font-normal">
          No assessments found. Create an assessment to get started.
        </p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  const getOrgName = (oId: string) => {
    return organizations?.find((o) => o.id === oId)?.name || "Default Organization";
  };

  const activeOrgName = activeAssessment
    ? getOrgName(activeAssessment.organizationId)
    : "Default Organization";

  // Form submit handler
  const onSubmit = async (data: SettingsFormValues) => {
    if (!orgId) {
      return;
    }

    try {
      await apiClient.patch(`/api/organizations/${orgId}`, { body: data });
      toast.success("Assessment updated successfully");

      // Invalidate queries to update cache
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["assessment", selectedAssessmentId] });
      queryClient.invalidateQueries({ queryKey: ["organization", orgId] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });

      // Invalidate next-auth/zustand session
      await useAuthStore.getState().checkSession();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update assessment");
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!selectedAssessmentId) {
      return;
    }
    setIsDeleting(true);

    try {
      await deleteAssessment(selectedAssessmentId);
      toast.success("Assessment deleted successfully");
      setShowDeleteConfirm(false);

      // Invalidate dashboard and assessments
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });

      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete assessment");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-0 pb-12">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 font-normal">
          Manage your assessment and organization profile details.
        </p>
      </div>

      {/* Assessment Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border bg-slate-50">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Active Assessment</h2>
          <p className="text-xs text-slate-500 font-normal">
            Select which assessment you want to configure.
          </p>
        </div>
        <div className="w-full md:w-72">
          <Select
            value={selectedAssessmentId}
            onValueChange={(val) => {
              setSelectedAssessmentId(val);
              // Clear deletion confirmation input when switching assessments
              setConfirmName("");
            }}
          >
            <SelectTrigger className="w-full bg-white text-slate-800">
              <SelectValue placeholder="Select an assessment" />
            </SelectTrigger>
            <SelectContent>
              {assessments.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {getOrgName(a.organizationId)} ({a.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Settings Form */}
      {loadingActiveAssessment || loadingOrg ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-900 text-lg">Assessment Details</CardTitle>
              <CardDescription>
                Configure details for the organization associated with this assessment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="productName" className="text-slate-700">
                    Product Name
                  </Label>
                  <Input
                    id="productName"
                    type="text"
                    {...register("productName")}
                    aria-invalid={!!errors.productName}
                    className="text-slate-900"
                  />
                  {errors.productName && (
                    <p role="alert" className="text-xs text-red-500 mt-1 font-normal">
                      {errors.productName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700">
                    Product Description
                  </Label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register("description")}
                    aria-invalid={!!errors.description}
                    className="border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-24 text-slate-900"
                  />
                  {errors.description && (
                    <p role="alert" className="text-xs text-red-500 mt-1 font-normal">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetCustomers" className="text-slate-700">
                    Target Audience
                  </Label>
                  <Input
                    id="targetCustomers"
                    type="text"
                    {...register("targetCustomers")}
                    aria-invalid={!!errors.targetCustomers}
                    className="text-slate-900"
                  />
                  {errors.targetCustomers && (
                    <p role="alert" className="text-xs text-red-500 mt-1 font-normal">
                      {errors.targetCustomers.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader className="border-red-100">
              <CardTitle className="text-red-600 flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5" /> Danger Zone
              </CardTitle>
              <CardDescription>
                Destructive operations that affect your assessment database records.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-red-50/50 border border-red-100">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Delete Assessment</h4>
                  <p className="text-xs text-slate-500 font-normal mt-1 max-w-md">
                    Permanently delete this assessment, including checklist scores, compliance
                    status, and uploaded evidence.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setConfirmName("");
                    setShowDeleteConfirm(true);
                  }}
                >
                  Delete Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 text-lg">Delete Assessment</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the assessment for{" "}
              <strong className="text-slate-900">{activeOrgName}</strong>, including all compliance
              status details and uploaded evidence.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-normal">
                Please type the organization name{" "}
                <strong className="text-slate-900 font-semibold">{activeOrgName}</strong> to
                confirm:
              </p>
              <Input
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder={activeOrgName}
                className="h-10 text-slate-900"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="text-slate-700 border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmName !== activeOrgName || isDeleting}
              onClick={handleDelete}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}I understand, delete
              this assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-slate-500">Loading settings...</p>
          </div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
