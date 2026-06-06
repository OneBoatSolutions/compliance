"use client";
import { useForm, UseFormRegisterReturn, FieldErrors, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, OnboardingFormValues } from "@/lib/validations/onboarding";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/stores/assessment-store";
import { useRef } from "react";
import { toast } from "sonner";
import {
  User,
  Heart,
  DollarSign,
  CreditCard,
  Fingerprint,
  Baby,
  Briefcase,
  Plus,
  Info,
  Globe,
  Flag,
  CircleCheck,
  CircleAlert,
} from "lucide-react";

const mapToBackend = (values: OnboardingFormValues) => ({
  productName: values.productName,
  description: values.description,
  services: values.services,
  targetCustomers: values.customers,
  problemSolved: values.problem,

  dataHandled: (values.dataTypes ?? []).map((val) => {
    switch (val) {
      case "PII":
        return "PII (Personally Identifiable Information)";
      case "PHI":
        return "PHI (Protected Health Information)";
      case "Financial":
        return "Financial data";
      case "Payment":
        return "Payment card data";
      case "Biometric":
        return "Biometric data";
      case "Children":
        return "Children data";
      case "Employee":
        return "Employee data";
      default:
        return values.otherDataType || "Other";
    }
  }),

  regions: (values.regions ?? []).map((r) => {
    switch (r) {
      case "US":
        return "United States";
      case "EU":
        return "European Union";
      case "UK":
        return "United Kingdom";
      case "Canada":
        return "Canada";
      case "Australia":
        return "Australia";
      case "APAC":
        return "APAC";
      case "LATAM":
        return "Latin America";
      default:
        return values.otherRegion || "Other";
    }
  }),
});
interface BackendOrganization {
  id: string;
  name: string;
  productName?: string | null;
  description?: string | null;
  services?: string | null;
  targetCustomers?: string | null;
  problemSolved?: string | null;
  dataHandled?: string[] | null;
  regions?: string[] | null;
}
const mapFromBackend = (data: BackendOrganization): OnboardingFormValues => ({
  productName: data.productName || "",
  description: data.description || "",
  services: data.services || "",
  customers: data.targetCustomers || "",
  problem: data.problemSolved || "",

  dataTypes: (data.dataHandled || []).map((val) => {
    if (val.includes("PII")) {
      return "PII";
    }
    if (val.includes("PHI")) {
      return "PHI";
    }
    if (val.includes("Financial")) {
      return "Financial";
    }
    if (val.includes("Payment")) {
      return "Payment";
    }
    if (val.includes("Biometric")) {
      return "Biometric";
    }
    if (val.includes("Children")) {
      return "Children";
    }
    if (val.includes("Employee")) {
      return "Employee";
    }
    return "Other";
  }),
  otherDataType:
    (data.dataHandled || []).find((val) => {
      return !["PII", "PHI", "Financial", "Payment", "Biometric", "Children", "Employee"].some(
        (known) => val.includes(known),
      );
    }) || "",

  regions: (data.regions || []).map((r) => {
    if (r.includes("United States")) {
      return "US";
    }
    if (r.includes("European Union")) {
      return "EU";
    }
    if (r.includes("United Kingdom")) {
      return "UK";
    }
    if (r.includes("Canada")) {
      return "Canada";
    }
    if (r.includes("Australia")) {
      return "Australia";
    }
    if (r.includes("APAC")) {
      return "APAC";
    }
    if (r.includes("Latin America")) {
      return "LATAM";
    }
    return "Other";
  }),
  otherRegion:
    (data.regions || []).find((r) => {
      return ![
        "United States",
        "European Union",
        "United Kingdom",
        "Canada",
        "Australia",
        "APAC",
        "Latin America",
      ].some((known) => r.includes(known));
    }) || "",
});
function Stepper({
  currentStep,
  saving,
  saved,
  onSaveExit,
}: {
  currentStep: number;
  saving: boolean;
  saved: boolean;
  onSaveExit: () => void;
}) {
  const steps = [
    { id: 1, label: "Business Profile" },
    { id: 2, label: "AI Recommendations & Review" },
  ];

  const progressPercent = (currentStep / steps.length) * 100;

  return (
    <div className="bg-white border-b px-4 md:px-8 py-6 md:py-8 mt-4 md:mt-10">
      <div className="relative max-w-7xl mx-auto">
        {/* CENTERED STEPPER */}
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={currentStep}
          aria-label="Onboarding progress"
          className="relative w-full max-w-3xl mx-auto"
        >
          {/* Steps */}
          <div className="flex justify-between relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center w-1/2">
                {/* Circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all
                ${
                  currentStep === step.id
                    ? "bg-purple-600 text-white shadow-md"
                    : currentStep > step.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </div>

                {/* Label */}
                <span
                  className={`mt-3 text-xs sm:text-sm font-medium px-2 text-center
                ${currentStep === step.id ? "text-purple-600" : "text-gray-400"}`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Base Line */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded" />

          {/* Progress Line */}
          <div
            className="absolute top-5 left-0 h-1 bg-purple-600 rounded transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* SAVE SECTION */}
        <div
          className="
          mt-6
          flex flex-col items-center

          md:mt-0
          md:absolute
          md:right-0
          md:top-1/2
          md:-translate-y-1/2
          md:items-end
        "
        >
          <span
            aria-live="polite"
            role="status"
            className="text-xs text-gray-500 font-medium min-h-[16px] mb-1"
          >
            {saving ? "Saving..." : saved ? "✔ All changes saved" : ""}
          </span>

          <button
            type="button"
            aria-label="Save progress and exit onboarding"
            onClick={onSaveExit}
            className="text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap"
          >
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const {
    organizationId,
    onboardingData,
    setOrganizationId,
    submitOnboarding,
    retryLastAction,
    phase,
    error: flowError,
    clearError,
  } = useAssessmentStore();

  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: onboardingData || {
      productName: "",
      description: "",
      services: "",
      customers: "",
      problem: "",
      dataTypes: [],
      regions: [],
      otherDataType: "",
      otherRegion: "",
    },
  });

  const values = watch();
  const isStep1Valid =
    !!values.productName &&
    !!values.description &&
    !!values.services &&
    !!values.customers &&
    !!values.problem;

  const isReadyForSave = isStep1Valid && values.dataTypes.length > 0 && values.regions.length > 0;

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false); // AutoSave
  const [manualSaving, setManualSaving] = useState(false); // Save Draft button
  const [orgId, setOrgId] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [lastSavedValues, setLastSavedValues] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const isSubmitting = phase === "savingOrg" || phase === "aiLoading";

  const updateOrganization = async (values: OnboardingFormValues) => {
    if (!orgId) {
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const res = await fetch(`/api/organizations/${orgId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(mapToBackend(values)),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error("Failed to update organization");
    }
  };

  // STEP STATE (DYNAMIC)
  const [currentStep, setCurrentStep] = useState(1);
  useEffect(() => {
    if (organizationId && !orgId) {
      setOrgId(organizationId);
    }
  }, [organizationId, orgId]);
  //Onboarding data
  useEffect(() => {
    if (onboardingData) {
      reset(onboardingData);
    }
  }, [onboardingData, reset]);

  // AUTO SAVE
  useEffect(() => {
    if (!isReadyForSave) {
      return;
    }
    if (!orgId || !hasFetched) {
      return;
    }

    const handler = setTimeout(async () => {
      const mapped = mapToBackend(values);
      const current = JSON.stringify(mapped);

      if (current === lastSavedValues) {
        return;
      }

      const minSavingTime = 500;

      try {
        const start = Date.now();
        setSaving(true);
        setSaved(false);

        abortRef.current?.abort();

        await updateOrganization(values);
        const elapsed = Date.now() - start;
        const remaining = minSavingTime - elapsed;

        if (remaining > 0) {
          await new Promise((res) => setTimeout(res, remaining));
        }
        setLastSavedValues(current);

        // ✅ keep "saved" visible
        setSaving(false);
        setSaved(true);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Auto-save failed", error);
        toast.error("Auto-save failed");
      }
    }, 2000);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, orgId, hasFetched, lastSavedValues, isReadyForSave]);

  //FETCH EXISTING DATA
  useEffect(() => {
    if (orgId) {
      return;
    }

    const fetchCurrentOrg = async () => {
      try {
        const res = await fetch("/api/organizations", {
          credentials: "include",
        });
        const data = (await res.json()) as {
          success?: boolean;
          data?: BackendOrganization[];
        };

        const organization = data.success ? data.data?.[0] : null;
        if (organization) {
          setOrgId(organization.id);
          setOrganizationId(organization.id);
          reset(mapFromBackend(organization));
          setHasFetched(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentOrg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, setOrganizationId]);

  //FETCH EXISTING DATA
  useEffect(() => {
    if (!orgId) {
      return;
    }

    const fetchOrg = async () => {
      try {
        const res = await fetch(`/api/organizations/${orgId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          reset(mapFromBackend(data.data));
          setHasFetched(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  // CHECKBOX HANDLER
  const handleCheckbox = (field: "dataTypes" | "regions", value: string) => {
    const current = values[field] || [];
    let updated;

    if (current.includes(value)) {
      // REMOVE value
      updated = current.filter((v) => v !== value);

      setValue(field, updated, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      // CLEAR "Other" input when unchecked
      if (value === "Other") {
        if (field === "dataTypes") {
          setValue("otherDataType", "", { shouldDirty: true });
        }
        if (field === "regions") {
          setValue("otherRegion", "", { shouldDirty: true });
        }
      }
    } else {
      // ADD value
      setValue(field, [...current, value], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };
  const router = useRouter();

  const onSubmit = async (data: OnboardingFormValues) => {
    if (isSubmitting) {
      return;
    }

    clearError();
    setHasFetched(false);

    const result = await submitOnboarding(data, orgId);
    if (!result.ok) {
      return;
    }

    setHasFetched(true);
    router.push("/onboarding/suggested-frameworks");
  };

  const retryAI = async () => {
    const didRetrySucceed = await retryLastAction();
    if (didRetrySucceed) {
      router.push("/onboarding/suggested-frameworks");
    }
  };
  const handleSaveExit = async () => {
    if (isReadyForSave && orgId) {
      try {
        await updateOrganization(values);
        toast.success("Changes saved");
      } catch (error) {
        console.error("Failed to save draft", error);
        toast.error("Failed to save");
      }
    }

    router.push("/dashboard");
  };

  const handleSaveDraft = async () => {
    if (!orgId) {
      return;
    }

    setManualSaving(true);

    try {
      await updateOrganization(values);
      toast.success("Draft saved successfully");

      setLastSavedValues(JSON.stringify(mapToBackend(values)));
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setManualSaving(false);
    }
  };

  const onError = (errors: FieldErrors<OnboardingFormValues>) => {
    // eslint-disable-next-line no-console
    console.log("FORM ERRORS", errors);
    const firstError = Object.keys(errors)[0] as keyof OnboardingFormValues;

    const el = document.querySelector(`[name="${firstError}"]`) as HTMLElement | null;

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="bg-gray-50">
      <Stepper
        currentStep={currentStep}
        saving={saving}
        saved={saved}
        onSaveExit={handleSaveExit}
      />
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <div className="mb-6">
          <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
            ⏱ About 5 minutes
          </span>
          <h1 className="text-3xl font-semibold mt-3">Tell us about your business</h1>
          <p className="text-gray-600 mt-1">
            Help us understand your compliance needs by providing some basic information.
          </p>
        </div>

        {flowError && (
          <div
            role="alert"
            aria-live="assertive"
            className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4"
          >
            <p>{flowError.message}</p>
            {flowError.retryable && (
              <button
                type="button"
                onClick={retryAI}
                className="mt-2 text-sm underline text-blue-600"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <form
          aria-label="Business onboarding form"
          aria-busy={isSubmitting}
          onSubmit={handleSubmit(onSubmit, onError)}
          className="
bg-white
rounded-xl
border
border-gray-200
shadow-sm
p-8
space-y-10
"
        >
          <Section title="Product Information" number={1}>
            <Input
              label="Product Name"
              max={100}
              helper="What do you call your product?"
              placeholder="e.g., HealthTrack App"
              register={register("productName")}
              error={errors.productName?.message}
              value={values.productName}
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {["Health App", "Fintech SaaS", "E-commerce"].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() =>
                    setValue("productName", example, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
                >
                  {example}
                </button>
              ))}
            </div>
            <Textarea
              label="Business Description"
              max={500}
              helper="Briefly describe what your product/service does"
              placeholder="e.g., A mobile application that helps users track their fitness goals and nutrition..."
              register={register("description")}
              error={errors.description?.message}
              value={values.description}
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {["A healthcare tracking app", "A SaaS for payments", "Online store platform"].map(
                (example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() =>
                      setValue("description", example, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
                  >
                    {example}
                  </button>
                ),
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Textarea
                  label="Services Offered"
                  max={300}
                  helper="What specific services do you provide?"
                  placeholder="e.g., Data analytics, personalized recommendations, meal planning..."
                  register={register("services")}
                  error={errors.services?.message}
                  value={values.services}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Web app", "Mobile app", "API service"].map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() =>
                        setValue("services", example, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <Textarea
                  label="Target Customers"
                  max={200}
                  helper="Who uses your product?"
                  placeholder="Individual consumers, fitness enthusiasts, health-conscious adults..."
                  register={register("customers")}
                  error={errors.customers?.message}
                  value={values.customers}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Students", "Small businesses", "Freelancers"].map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() =>
                        setValue("customers", example, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Textarea
              label="Problem Solved"
              max={300}
              helper="What problem does your product solve?"
              placeholder="e.g., Difficulty tracking health metrics consistently, lack of personalized nutrition guidance..."
              register={register("problem")}
              error={errors.problem?.message}
              value={values.problem}
            />
          </Section>

          <Section
            title="Data Handling"
            number={2}
            description="Select all types of data your business collects or processes"
          >
            <fieldset>
              <legend className="sr-only">Types of data your business collects</legend>
              <DataCheckboxGrid
                selected={values.dataTypes || []}
                onChange={(val) => handleCheckbox("dataTypes", val)}
                register={register}
              />
            </fieldset>
            {errors.dataTypes && (
              <p role="alert" className="text-red-500 text-sm">
                {errors.dataTypes.message}
              </p>
            )}
          </Section>
          <Section
            title="Regions of Operation"
            number={3}
            description="Select all regions where your business operates"
          >
            <fieldset>
              <legend className="sr-only">Regions where your business operates</legend>
              <RegionCheckboxGrid
                selected={values.regions || []}
                onChange={(val: string) => handleCheckbox("regions", val)}
                register={register}
              />
            </fieldset>
            {errors.regions && (
              <p role="alert" className="text-red-500 text-sm">
                {errors.regions.message}
              </p>
            )}
          </Section>

          <div className=" left-0 bg-white border-t border-gray-200 px-6 py-6 mt-8">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              {/* LEFT: Save Draft (ghost) */}
              <button
                type="button"
                aria-label="Save onboarding draft"
                onClick={handleSaveDraft}
                disabled={manualSaving}
                className="text-gray-500 font-medium hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                {manualSaving ? "Saving..." : "Save Draft"}
              </button>

              {/* RIGHT: Actions */}
              <div className="flex items-center gap-3">
                {/* Back */}
                <button
                  type="button"
                  aria-label="Go to previous step"
                  disabled={currentStep === 1}
                  className={`
          px-5 py-2.5 rounded-md border text-sm font-medium transition-all
          ${
            currentStep === 1
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }
        `}
                  onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                >
                  Back
                </button>

                {/* Next */}
                <span
                  title={!isStep1Valid ? "Please fill in all required fields above" : undefined}
                  className="inline-block"
                >
                  <button
                    type="submit"
                    aria-label="Continue to AI recommendations"
                    disabled={
                      isSubmitting ||
                      (currentStep === 1 && !isStep1Valid) ||
                      (currentStep === 2 && values.dataTypes.length === 0) ||
                      (currentStep === 3 && values.regions.length === 0)
                    }
                    className={`
            px-6 py-2.5 rounded-md text-sm font-semibold text-white transition-all
            flex items-center gap-2
            ${
              isStep1Valid
                ? "bg-purple-600 hover:bg-purple-700 shadow-sm hover:shadow-md"
                : "bg-gray-300 cursor-not-allowed"
            }
          `}
                  >
                    {phase === "savingOrg"
                      ? "Saving organization..."
                      : phase === "aiLoading"
                        ? "Generating AI suggestions..."
                        : "Next: AI Recommendations →"}
                  </button>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

interface SectionProps {
  title: string;
  number: number;
  description?: string;
  children: ReactNode;
}

function Section({ title, number, description, children }: SectionProps) {
  return (
    <div className="mt-12">
      {" "}
      {/* 48px spacing */}
      <div className="flex items-center gap-3">
        <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm font-semibold">
          {number}
        </span>
        <h2 className="text-[20px] font-semibold">{title}</h2>
      </div>
      {/* Divider */}
      <div className="h-[2px] bg-purple-200 mt-3 mb-3" />
      {/* Description */}
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface InputProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  max: number;
  value?: string;
  helper?: string;
  placeholder?: string;
}
function Input({ label, register, error, max, value, helper, placeholder }: InputProps) {
  const isValid = value && value.length > 0 && !error;

  return (
    <div>
      <label htmlFor={register.name} className="font-medium text-gray-900">
        {label}
      </label>

      {helper && (
        <p id={`${register.name}-helper`} className="text-gray-500 text-sm mt-1">
          {helper}
        </p>
      )}

      <div className="relative mt-1">
        <input
          id={register.name}
          aria-invalid={!!error}
          aria-describedby={error ? `${register.name}-error` : `${register.name}-helper`}
          {...register}
          placeholder={placeholder}
          className={`
            w-full mt-1 border p-2 rounded-md bg-gray-50 transition-all
            ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : isValid
                  ? "border-green-500 focus:ring-2 focus:ring-green-200"
                  : "border-gray-200 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            }
          `}
        />

        {/* RIGHT ICON */}
        <div className="absolute right-2 top-2.5">
          {error && <CircleAlert aria-hidden="true" size={18} className="text-red-500" />}
          {!error && isValid && (
            <CircleCheck aria-hidden="true" size={18} className="text-green-500" />
          )}
        </div>
      </div>

      {/* Error + Counter */}
      <div className="flex justify-between text-sm mt-1">
        <span id={`${register.name}-error`} className="text-red-500 flex items-center gap-1">
          {error && <CircleAlert aria-hidden="true" size={14} />}
          {error}
        </span>

        <span className={(value?.length ?? 0) >= max ? "text-red-500" : "text-gray-400"}>
          {value?.length ?? 0}/{max}
        </span>
      </div>
    </div>
  );
}

interface TextareaProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  max: number;
  value?: string;
  helper?: string;
  placeholder?: string;
}
function Textarea({ label, register, error, max, value, helper, placeholder }: TextareaProps) {
  const isValid = value && value.length > 0 && !error;

  return (
    <div>
      <label htmlFor={register.name} className="font-medium text-gray-900">
        {label}
      </label>

      {helper && (
        <p id={`${register.name}-helper`} className="text-gray-500 text-sm mt-1">
          {helper}
        </p>
      )}

      <div className="relative mt-1">
        <textarea
          id={register.name}
          aria-invalid={!!error}
          aria-describedby={error ? `${register.name}-error` : `${register.name}-helper`}
          {...register}
          placeholder={placeholder}
          rows={3}
          className={`
            w-full border p-2.5 rounded-md bg-gray-50 resize-none transition-all outline-none
            ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : isValid
                  ? "border-green-500 focus:ring-2 focus:ring-green-200"
                  : "border-gray-200 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            }
          `}
        />

        <div className="absolute right-2 top-2.5">
          {error && <CircleAlert aria-hidden="true" size={18} className="text-red-500" />}
          {!error && isValid && (
            <CircleCheck aria-hidden="true" size={18} className="text-green-500" />
          )}
        </div>
      </div>

      <div className="flex justify-between text-sm mt-1">
        <span id={`${register.name}-error`} className="text-red-500 flex items-center gap-1">
          {error && <CircleAlert aria-hidden="true" size={14} />}
          {error}
        </span>

        <span className={(value?.length ?? 0) >= max ? "text-red-500" : "text-gray-400"}>
          {value?.length ?? 0}/{max}
        </span>
      </div>
    </div>
  );
}
interface DataTypeOption {
  id: string;
  label: string;
  description: string;
  helper: string;
  icon: React.ReactNode;
}

const dataTypeOptions: DataTypeOption[] = [
  {
    id: "PII",
    label: "PII",
    description: "Personally Identifiable Information",
    helper: "Names, emails, addresses, phone numbers",
    icon: <User aria-hidden="true" size={18} />,
  },
  {
    id: "PHI",
    label: "PHI",
    description: "Protected Health Information",
    helper: "Health records, medical data",
    icon: <Heart aria-hidden="true" size={18} />,
  },
  {
    id: "Financial",
    label: "Financial",
    description: "Bank accounts or transaction data",
    helper: "Bank accounts, financial statements",
    icon: <DollarSign aria-hidden="true" size={18} />,
  },
  {
    id: "Payment",
    label: "Payment Card",
    description: "PCI DSS relevant credit card data",
    helper: "Card numbers, CVV, billing info",
    icon: <CreditCard aria-hidden="true" size={18} />,
  },
  {
    id: "Biometric",
    label: "Biometric",
    description: "Facial scans, iris, or fingerprints",
    helper: "Fingerprints, facial recognition",
    icon: <Fingerprint aria-hidden="true" size={18} />,
  },
  {
    id: "Children",
    label: "Children's Data",
    description: "COPPA relevant data of minors",
    helper: "Data from users under 13/16",
    icon: <Baby aria-hidden="true" size={18} />,
  },
  {
    id: "Employee",
    label: "Employee Data",
    description: "Internal HR and payroll records",
    helper: "Employee records, HR data",
    icon: <Briefcase aria-hidden="true" size={18} />,
  },
  {
    id: "Other",
    label: "Other",
    description: "Any other sensitive data categories",
    helper: "Specify other data types",
    icon: <Plus aria-hidden="true" size={18} />,
  },
];
interface DataCheckboxGridProps {
  selected: string[];
  onChange: (val: string) => void;
  register: UseFormRegister<OnboardingFormValues>;
}
function DataCheckboxGrid({ selected, onChange, register }: DataCheckboxGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {dataTypeOptions.map((opt) => {
        const isSelected = selected.includes(opt.id);

        return (
          <div
            role="checkbox"
            tabIndex={0}
            aria-checked={isSelected}
            aria-label={opt.label}
            key={opt.id}
            onClick={() => onChange(opt.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(opt.id);
              }
            }}
            className={`
              flex items-center justify-between
              p-5 rounded-xl border cursor-pointer transition-all focus:outline-none
focus:ring-2
focus:ring-purple-500
focus:ring-offset-2
              ${
                isSelected
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
          >
            {/* LEFT: Icon */}
            <div
              className={`
                w-10 h-10 flex items-center justify-center rounded-lg
                ${isSelected ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500"}
              `}
            >
              {opt.icon}
            </div>

            {/* MIDDLE: TEXT */}
            <div className="flex-1 ml-4">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{opt.label}</p>

                {/* INFO TOOLTIP */}
                <div className="relative group flex items-center">
                  <Info
                    size={16}
                    className="text-gray-400 cursor-pointer transition-colors group-hover:text-purple-600"
                  />

                  {/* Tooltip */}
                  <div
                    className="
      absolute left-0 top-6 z-20 hidden group-hover:block group-focus-within:block
      bg-gray-900 text-white text-xs rounded-md px-3 py-2 w-56
      shadow-lg
    "
                  >
                    {opt.helper}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500">{opt.description}</p>

              {/* OTHER INPUT */}
              {opt.id === "Other" && isSelected && (
                <input
                  {...register("otherDataType")}
                  placeholder="Specify other data type"
                  className="mt-3 w-full border border-gray-200 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>

            {/* RIGHT: CHECKBOX */}
            <div className="ml-4">
              <div
                className={`
                  w-6 h-6 rounded-md border flex items-center justify-center
                  ${isSelected ? "bg-purple-600 border-purple-600" : "border-gray-300 bg-white"}
                `}
              >
                {isSelected && <span className="text-white text-sm font-bold">✓</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const regionOptions = [
  { id: "US", short: "US", label: "UNITED STATES", icon: <Flag aria-hidden="true" /> },
  { id: "EU", short: "EU", label: "EUROPEAN UNION", icon: <Flag aria-hidden="true" /> },
  { id: "UK", short: "UK", label: "UNITED KINGDOM", icon: <Flag aria-hidden="true" /> },
  { id: "Canada", short: "Canada", label: "CANADA", icon: <Flag aria-hidden="true" /> },
  { id: "Australia", short: "Australia", label: "AUSTRALIA", icon: <Flag aria-hidden="true" /> },
  { id: "APAC", short: "APAC", label: "ASIA-PACIFIC", icon: <Globe aria-hidden="true" /> },
  { id: "LATAM", short: "LATAM", label: "LATIN AMERICA", icon: <Globe aria-hidden="true" /> },
  { id: "Other", short: "Other", label: "GLOBAL / OTHER", icon: <Globe aria-hidden="true" /> },
];

interface RegionCheckboxGridProps {
  selected: string[];
  onChange: (val: string) => void;
  register: UseFormRegister<OnboardingFormValues>;
}
function RegionCheckboxGrid({ selected, onChange, register }: RegionCheckboxGridProps) {
  return (
    <div className="grid grid-cols-2 gap-5">
      {regionOptions.map((opt) => {
        const isSelected = selected.includes(opt.id);

        return (
          <div
            role="checkbox"
            tabIndex={0}
            aria-checked={isSelected}
            aria-label={opt.short}
            key={opt.id}
            onClick={() => onChange(opt.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(opt.id);
              }
            }}
            className={`
              p-5 rounded-xl border cursor-pointer transition-all
              flex flex-col items-center justify-center text-center
              min-h-[110px] focus:outline-none
focus:ring-2
focus:ring-purple-500
focus:ring-offset-2
              ${
                isSelected
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
          >
            {/* Icon */}
            <div
              className={`mb-2 transition-colors ${
                isSelected ? "text-purple-600" : "text-gray-400"
              }`}
            >
              {opt.icon}
            </div>

            {/* SHORT LABEL (Bold) */}
            <span className="font-semibold text-gray-900">{opt.short}</span>

            {/* SUBTEXT */}
            <span className="text-xs text-gray-400 tracking-wide">{opt.label}</span>

            {/* Other input */}
            {opt.id === "Other" && isSelected && (
              <input
                {...register("otherRegion")}
                placeholder="Specify region"
                className="mt-3 w-full border border-gray-200 p-2 rounded text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
