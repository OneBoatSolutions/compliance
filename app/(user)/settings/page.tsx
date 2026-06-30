"use client";

import { useEffect, useState, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Loader2,
  Sliders,
  Shield,
  Trash2,
  Building2,
  Calendar,
  Award,
} from "lucide-react";

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
      <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="flex flex-col items-center text-center max-w-lg px-8">
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-6 mb-6 shadow-sm">
            <Sliders className="w-12 h-12 text-purple-400 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No workspace configured</h2>
          <p className="text-slate-500 mb-8 font-normal leading-relaxed">
            Settings will appear here once you have an active assessment. Start by creating your
            first assessment from the dashboard.
          </p>
          <Button
            size="lg"
            className="font-semibold px-8"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
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

  const statusLabel =
    activeAssessment?.status === "COMPLETED"
      ? "Completed"
      : activeAssessment?.status === "DRAFT"
        ? "Draft"
        : "In Progress";

  const statusColor =
    activeAssessment?.status === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      : activeAssessment?.status === "DRAFT"
        ? "bg-slate-100 text-slate-650 ring-1 ring-slate-200"
        : "bg-amber-50 text-amber-750 ring-1 ring-amber-200";

  const scoreVal =
    activeAssessment?.score !== null && activeAssessment?.score !== undefined
      ? `${Math.round(activeAssessment.score)}%`
      : "N/A";

  const formattedDate = activeAssessment?.createdAt
    ? new Date(activeAssessment.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-24 px-6 pb-12 ">
      {/* Header Banner */}
      <section className="rounded-2xl border border-purple-100 bg-gradient-to-br from-[#f1eaff] via-white to-[#ede3ff] p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <Sliders className="size-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Workspace Settings</h1>
          </div>
          <p className="max-w-2xl text-sm text-slate-500 md:text-base">
            Configure your compliance profiles, manage workspace details, and switch between active
            assessments.
          </p>
        </div>
      </section>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        {/* ── Left Column ── */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Active Profile Selector */}
          <Card
            className="border-slate-100 bg-white shadow-sm transition-all
duration-300
hover:-translate-y-1
hover:shadow-lg"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Shield className="size-4 text-purple-600" />
                Active Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedAssessmentId}
                onValueChange={(val) => {
                  setSelectedAssessmentId(val);
                  setConfirmName("");
                }}
              >
                <SelectTrigger
                  aria-label="Select active assessment"
                  className="w-full h-10 bg-white transition-all
duration-200
hover:border-purple-300
focus:ring-2
focus:ring-purple-300 border-input "
                >
                  <SelectValue placeholder="Select an assessment" />
                </SelectTrigger>
                <SelectContent>
                  {assessments.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {getOrgName(a.organizationId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Live Status */}
          <Card
            className="border-slate-100 bg-white shadow-sm flex-1 flex flex-col transition-all
duration-300
hover:-translate-y-1
hover:shadow-lg"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between pb-6">
              {/* Organization */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <Building2 className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Organization
                  </p>
                  <p className="text-sm font-bold text-slate-900 truncate">{activeOrgName}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                <span className="text-xs font-semibold text-slate-500">Progress Status</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${statusColor}`}
                >
                  {statusLabel}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                <span className="text-xs font-semibold text-slate-500">Compliance Score</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
                  <Award className="size-4 text-amber-500" />
                  {scoreVal}
                </span>
              </div>

              {/* Created */}
              <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                <span className="text-xs font-semibold text-slate-500">Created</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <Calendar className="size-3.5 text-slate-400" />
                  {formattedDate}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-7 flex flex-col">
          {loadingActiveAssessment || loadingOrg ? (
            <Card className="flex h-64 items-center justify-center border-slate-100 bg-white shadow-sm flex-1">
              <CardContent className="flex flex-col items-center gap-3 pt-6">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <p className="text-sm text-slate-500">Loading assessment details...</p>
              </CardContent>
            </Card>
          ) : (
            <Card
              className="border-slate-100 bg-white shadow-sm transition-all
duration-300
hover:-translate-y-1
hover:shadow-lg flex-1 flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Assessment Details
                </CardTitle>
                <CardDescription>
                  Configure profile metadata for the organization associated with this assessment.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="productName" className="text-sm font-medium text-slate-700">
                        Product Name
                      </Label>
                      <div className="mt-1.5">
                        <Input
                          id="productName"
                          type="text"
                          {...register("productName")}
                          aria-invalid={!!errors.productName}
                          className="h-11 bg-white text-slate-900 transition-all
duration-200
hover:border-purple-300
focus-visible:ring-purple-400"
                        />
                      </div>
                      {errors.productName && (
                        <p role="alert" className="mt-1 text-xs text-red-500">
                          {errors.productName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                        Product Description
                      </Label>
                      <div className="mt-1.5">
                        <textarea
                          id="description"
                          rows={4}
                          {...register("description")}
                          aria-invalid={!!errors.description}
                          className=" w-full
    min-w-0
    rounded-md
    border
    border-input
    bg-white
    px-3
    py-2
    text-sm
    text-slate-900
    shadow-sm
    transition-all
    duration-200
    outline-none
    placeholder:text-slate-400
    hover:border-purple-300
    focus-visible:border-purple-400
    focus-visible:ring-2
    focus-visible:ring-purple-400
    disabled:cursor-not-allowed
    disabled:opacity-50
    aria-invalid:border-destructive
    aria-invalid:ring-destructive/20
    resize-none"
                        />
                      </div>
                      {errors.description && (
                        <p role="alert" className="mt-1 text-xs text-red-550">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="targetCustomers"
                        className="text-sm font-medium text-slate-700"
                      >
                        Target Audience
                      </Label>
                      <div className="mt-1.5">
                        <Input
                          id="targetCustomers"
                          type="text"
                          {...register("targetCustomers")}
                          aria-invalid={!!errors.targetCustomers}
                          className="h-11 bg-white text-slate-900 transition-all
duration-200
hover:border-purple-300
focus-visible:ring-purple-400"
                        />
                      </div>
                      {errors.targetCustomers && (
                        <p role="alert" className="mt-1 text-xs text-red-500">
                          {errors.targetCustomers.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="font-semibold transition-all
duration-200
hover:scale-[1.02]
active:scale-[0.98]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Destructive actions card - placed below the columns, spanning the right column space */}
        {!loadingActiveAssessment && !loadingOrg && (
          <div className="lg:col-span-10">
            {/* Delete Assessment Card */}
            <Card
              className="overflow-hidden
    border border-red-200
    bg-white p-0
    shadow-sm
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-lg"
            >
              <div
                className="border-b border-red-100
    bg-gradient-to-r
    from-red-50
    via-red-50/20
    to-white
    px-6 py-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <Trash2 className="size-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-700">Deletion Zone</h3>

                    <p className="text-sm text-red-600/80">
                      Permanently delete this assessment and all associated data.
                    </p>
                  </div>
                </div>
              </div>
              <CardHeader className="pb-6 px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between ">
                  <div className="space-y-1 ">
                    <CardTitle className="text-base font-semibold text-slate-900">
                      Delete Assessment
                    </CardTitle>
                    <CardDescription>
                      <p className="text-sm text-slate-600">
                        Deleting this assessment removes all associated compliance data and cannot
                        be undone.
                      </p>
                      <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                          This action removes:
                        </p>

                        <ul className="mt-2 space-y-2 text-sm text-red-700">
                          <li>• Assessment progress and compliance score</li>
                          <li>• Uploaded evidence and checklist responses</li>
                          <li>• Workspace data linked to this assessment</li>
                        </ul>
                      </div>
                    </CardDescription>
                  </div>
                  <Button
                    variant="destructive"
                    aria-label={`Delete assessment ${activeOrgName}`}
                    size="lg"
                    className="shrink-0 font-semibold px-8 md:self-center transition-all
duration-200
hover:scale-[1.02]
active:scale-[0.98]"
                    onClick={() => {
                      setConfirmName("");
                      setShowDeleteConfirm(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-2.5 mb-4 text-red-650">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-650">
                <AlertTriangle className="size-5" />
              </div>
              <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900">
                Delete Assessment
              </h3>
            </div>

            <p
              id="delete-dialog-description"
              className="text-sm text-slate-650 font-normal leading-relaxed"
            >
              This action cannot be undone. This will permanently delete the assessment for{" "}
              <strong className="text-slate-900 font-semibold">{activeOrgName}</strong>, including
              all compliance status details and uploaded evidence.
            </p>

            <div className="mt-5 space-y-2">
              <Label
                htmlFor="confirmName"
                className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
              >
                Type the assessment name to confirm:
              </Label>
              <div>
                <p className="text-xs text-slate-950 font-bold bg-slate-50 border border-slate-100 rounded px-2.5 py-1.5 inline-block">
                  {activeOrgName}
                </p>
              </div>
              <div className="mt-1">
                <Input
                  id="confirmName"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder={activeOrgName}
                  className="h-11 text-slate-900 border-red-200 focus-visible:ring-red-200 bg-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="lg"
                disabled={confirmName !== activeOrgName || isDeleting}
                onClick={handleDelete}
                className="font-semibold"
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Assessment
              </Button>
            </div>
          </div>
        </div>
      )}
      <footer className="mt-10 rounded-xl border border-slate-200 bg-slate-50 px-6 py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-800">Workspace Settings</p>

            <p className="mt-1 text-sm text-slate-500">
              Updates made here are reflected across your compliance workspace and future
              assessments.
            </p>
          </div>

          <div className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
            Securely managed by Cipherion
          </div>
        </div>
      </footer>
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
