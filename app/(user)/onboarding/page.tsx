"use client";

import { useForm, UseFormRegisterReturn, FieldErrors, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, OnboardingFormValues } from "@/lib/validations/onboarding";
import { useEffect, useState, ReactNode } from "react";
import { useRef } from "react";
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
  productName: string;
  description: string;
  services: string;
  targetCustomers: string;
  problemSolved: string;
  dataHandled: string[];
  regions: string[];
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
function Stepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, label: "Business Profile" },
    { id: 2, label: "Framework Selection" },
    { id: 3, label: "Review & Create" },
  ];

  // 33% per step
  const progressPercent = (currentStep / steps.length) * 100;

  return (
    <div className="bg-white border-b px-8 py-8 mt-10 flex justify-between items-center">
      <div className="relative w-full max-w-3xl">
        {/* Steps */}
        <div className="flex justify-between relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center w-1/3">
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
                className={`mt-3 text-sm font-medium
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

      {/* Save */}
      <button className="text-gray-500 hover:text-gray-700 font-medium ml-6 whitespace-nowrap">
        Save & Exit
      </button>
    </div>
  );
}

export default function OnboardingPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
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
  const [saved, setSaved] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [lastSavedValues, setLastSavedValues] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);

  const createOrganization = async (values: OnboardingFormValues) => {
    const controller = new AbortController();
    abortRef.current = controller;

    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(mapToBackend(values)),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error("Failed to create organization");
    }

    const data = await res.json();
    setOrgId(data.id);
  };

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

  // AUTO SAVE
  useEffect(() => {
    if (!isReadyForSave || !hasFetched) {
      return;
    }

    const handler = setTimeout(async () => {
      const mapped = mapToBackend(values);
      const current = JSON.stringify(mapped);

      if (current === lastSavedValues) {
        return;
      }

      // ✅ MOVE GUARD BEFORE setting saving
      if (!orgId && creating) {
        return;
      }
      const minSavingTime = 500;

      try {
        const start = Date.now();
        setSaving(true);
        setSaved(false);

        abortRef.current?.abort();

        if (!orgId) {
          if (!isReadyForSave) {
            return;
          }
          try {
            setCreating(true);
            await createOrganization(values);
          } finally {
            setCreating(false);
          }
        } else {
          await updateOrganization(values);
        }
        const elapsed = Date.now() - start;
        const remaining = minSavingTime - elapsed;

        if (remaining > 0) {
          await new Promise((res) => setTimeout(res, remaining));
        }
        setLastSavedValues(current);

        // ✅ keep "saved" visible
        setSaving(false);
        setSaved(true);
        console.log("SAVED TRIGGERED");
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Auto-save failed", error);
      }
    }, 2000);

    return () => clearTimeout(handler);
  }, [values, orgId, hasFetched, lastSavedValues, creating, isReadyForSave]);

  //FETCH EXISTING DATA
  useEffect(() => {
    //Don't fetch if orgId is not available
    if (!orgId) {
      setHasFetched(true); //allow autosave
      return;
    }
    const fetchOrg = async () => {
      try {
        const res = await fetch(`/api/organizations/${orgId}`, {
          method: "GET", // optional (default is GET)
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ADD THIS
        }); // get existing org
        if (!res.ok) {
          throw new Error("Failed to fetch organization");
        }

        const data: BackendOrganization & { id: string } = await res.json();

        if (data) {
          // ✅ map backend → frontend
          const mapped = mapFromBackend(data);

          // ✅ fill form
          setValue("productName", mapped.productName, { shouldValidate: true });
          setValue("description", mapped.description, { shouldValidate: true });
          setValue("services", mapped.services, { shouldValidate: true });
          setValue("customers", mapped.customers, { shouldValidate: true });
          setValue("problem", mapped.problem, { shouldValidate: true });
          setValue("dataTypes", mapped.dataTypes, { shouldValidate: true });
          setValue("regions", mapped.regions, { shouldValidate: true });
          setValue("otherDataType", mapped.otherDataType, { shouldValidate: true });
          setValue("otherRegion", mapped.otherRegion, { shouldValidate: true });

          // ✅ prevent autosave firing immediately
          setLastSavedValues(JSON.stringify(mapToBackend(mapped)));
        }
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        // ✅ ALWAYS allow autosave after fetch attempt
        setHasFetched(true);
      }
    };

    fetchOrg();
  }, [orgId]);

  // CHECKBOX HANDLER
  const handleCheckbox = (field: "dataTypes" | "regions", value: string) => {
    const current = values[field] || [];

    if (current.includes(value)) {
      // REMOVE value
      const updated = current.filter((v) => v !== value);

      setValue(field, updated, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // ✅ CLEAR "Other" input when unchecked
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
      });
    }
  };

  const onSubmit = (data: OnboardingFormValues) => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      return;
    }
    console.log("FINAL:", data);
  };
  const onError = (errors: FieldErrors<OnboardingFormValues>) => {
    const firstError = Object.keys(errors)[0] as keyof OnboardingFormValues;

    const el = document.querySelector(`[name="${firstError}"]`) as HTMLElement | null;

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Stepper currentStep={currentStep} />
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="mb-6">
          <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
            ⏱ About 5 minutes
          </span>
          <h1 className="text-3xl font-semibold mt-3">Tell us about your business</h1>
          <p className="text-gray-600 mt-1">
            Help us understand your compliance needs by providing some basic information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="bg-white p-6 rounded-lg shadow space-y-8"
        >
          <div className="text-right text-sm min-h-[24px]">
            <span className="text-gray-500 min-h-[24px] inline-block">
              {saving && "Saving..."}
              {!saving && saved && "✔ All changes saved"}
            </span>
          </div>

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
            <DataCheckboxGrid
              selected={values.dataTypes || []}
              onChange={(val) => handleCheckbox("dataTypes", val)}
              register={register}
            />
            {errors.dataTypes && <p className="text-red-500 text-sm">{errors.dataTypes.message}</p>}
          </Section>
          <Section
            title="Regions of Operation"
            number={3}
            description="Select all regions where your business operates"
          >
            <RegionCheckboxGrid
              selected={values.regions || []}
              onChange={(val: string) => handleCheckbox("regions", val)}
              register={register}
            />
            {errors.regions && <p className="text-red-500 text-sm">{errors.regions.message}</p>}
          </Section>

          <div className=" left-0 w-full bg-white border-t border-gray-200 px-6 py-6 mt-8">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              {/* LEFT: Save Draft (ghost) */}
              <button
                type="button"
                className="text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                Save Draft
              </button>

              {/* RIGHT: Actions */}
              <div className="flex items-center gap-3">
                {/* Back */}
                <button
                  type="button"
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
                <button
                  type="submit"
                  disabled={!isStep1Valid}
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
                  Next: Framework Selection →
                </button>
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
      <label className="font-medium text-gray-900">{label}</label>

      {helper && <p className="text-gray-500 text-sm mt-1">{helper}</p>}

      <div className="relative mt-1">
        <input
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
          {error && <CircleAlert size={18} className="text-red-500" />}
          {!error && isValid && <CircleCheck size={18} className="text-green-500" />}
        </div>
      </div>

      {/* Error + Counter */}
      <div className="flex justify-between text-sm mt-1">
        <span className="text-red-500 flex items-center gap-1">
          {error && <CircleCheck size={14} />}
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
      <label className="font-medium text-gray-900">{label}</label>

      {helper && <p className="text-gray-500 text-sm mt-1">{helper}</p>}

      <div className="relative mt-1">
        <textarea
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
          {error && <CircleAlert size={18} className="text-red-500" />}
          {!error && isValid && <CircleCheck size={18} className="text-green-500" />}
        </div>
      </div>

      <div className="flex justify-between text-sm mt-1">
        <span className="text-red-500 flex items-center gap-1">
          {error && <CircleAlert size={14} />}
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
    icon: <User size={18} />,
  },
  {
    id: "PHI",
    label: "PHI",
    description: "Protected Health Information",
    helper: "Health records, medical data",
    icon: <Heart size={18} />,
  },
  {
    id: "Financial",
    label: "Financial",
    description: "Bank accounts or transaction data",
    helper: "Bank accounts, financial statements",
    icon: <DollarSign size={18} />,
  },
  {
    id: "Payment",
    label: "Payment Card",
    description: "PCI DSS relevant credit card data",
    helper: "Card numbers, CVV, billing info",
    icon: <CreditCard size={18} />,
  },
  {
    id: "Biometric",
    label: "Biometric",
    description: "Facial scans, iris, or fingerprints",
    helper: "Fingerprints, facial recognition",
    icon: <Fingerprint size={18} />,
  },
  {
    id: "Children",
    label: "Children's Data",
    description: "COPPA relevant data of minors",
    helper: "Data from users under 13/16",
    icon: <Baby size={18} />,
  },
  {
    id: "Employee",
    label: "Employee Data",
    description: "Internal HR and payroll records",
    helper: "Employee records, HR data",
    icon: <Briefcase size={18} />,
  },
  {
    id: "Other",
    label: "Other",
    description: "Any other sensitive data categories",
    helper: "Specify other data types",
    icon: <Plus size={18} />,
  },
];
interface DataCheckboxGridProps {
  selected: string[];
  onChange: (val: string) => void;
  register: UseFormRegister<OnboardingFormValues>;
}
export function DataCheckboxGrid({ selected, onChange, register }: DataCheckboxGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {dataTypeOptions.map((opt) => {
        const isSelected = selected.includes(opt.id);

        return (
          <div
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`
              flex items-center justify-between
              p-5 rounded-xl border cursor-pointer transition-all
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
      absolute left-0 top-6 z-20 hidden group-hover:block
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
interface RegionOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const regionOptions = [
  { id: "US", short: "US", label: "UNITED STATES", icon: <Flag /> },
  { id: "EU", short: "EU", label: "EUROPEAN UNION", icon: <Flag /> },
  { id: "UK", short: "UK", label: "UNITED KINGDOM", icon: <Flag /> },
  { id: "Canada", short: "Canada", label: "CANADA", icon: <Flag /> },
  { id: "Australia", short: "Australia", label: "AUSTRALIA", icon: <Flag /> },
  { id: "APAC", short: "APAC", label: "ASIA-PACIFIC", icon: <Globe /> },
  { id: "LATAM", short: "LATAM", label: "LATIN AMERICA", icon: <Globe /> },
  { id: "Other", short: "Other", label: "GLOBAL / OTHER", icon: <Globe /> },
];

interface RegionCheckboxGridProps {
  selected: string[];
  onChange: (val: string) => void;
  register: UseFormRegister<OnboardingFormValues>;
}
export function RegionCheckboxGrid({ selected, onChange, register }: RegionCheckboxGridProps) {
  return (
    <div className="grid grid-cols-2 gap-5">
      {regionOptions.map((opt) => {
        const isSelected = selected.includes(opt.id);

        return (
          <div
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`
              p-5 rounded-xl border cursor-pointer transition-all
              flex flex-col items-center justify-center text-center
              min-h-[110px]
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
