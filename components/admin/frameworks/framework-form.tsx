"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ApiResponse, Framework } from "@/types/framework";
import { frameworkFormSchema, type FrameworkFormValues } from "@/lib/validations/framework";

const REGIONS = ["US", "EU", "UK", "Global", "India"] as const;
const CATEGORIES = ["Privacy", "Security", "Healthcare", "Financial"] as const;

const inputClass =
  "w-full rounded-2xl border border-[#e5e5e5] bg-white px-5 py-4 text-sm text-[#171717] shadow-sm outline-none transition duration-200 placeholder:text-[#a3a3a3] focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]";

export function FrameworkForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FrameworkFormValues>({
    resolver: zodResolver(frameworkFormSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      region: "",
      category: "",
      version: "1.0.0",
      effectiveDate: "",
      sourceLink: "",
    },
  });

  const version = watch("version");

  async function onSubmit(values: FrameworkFormValues) {
    try {
      const response = await fetch("/api/frameworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result: ApiResponse<Framework> = await response.json();

      if (!result.success) {
        if (result.errors) {
          for (const [key, messages] of Object.entries(result.errors)) {
            setError(key as keyof FrameworkFormValues, { message: messages[0] });
          }
        } else {
          toast.error(result.message);
        }
        return;
      }

      toast.success("Framework created");
      router.push(`/frameworks/${result.data.id}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong while creating the framework");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="overflow-hidden rounded-[32px] border border-[#e5e5e5] bg-white shadow-[0_20px_60px_rgba(109,24,255,0.08)]">
        <div className="border-b border-[#f5f5f5] bg-gradient-to-r from-[#faf7ff] to-white px-8 py-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b5cf6]">
                Framework Configuration
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#171717]">
                Compliance Framework Setup
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#525252]">
                Create a structured compliance framework with versioning, regional mapping, metadata
                validation, and publishing lifecycle controls.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#ede9fe] bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5cf6]">
                  Initial Status
                </p>
                <p className="mt-2 text-lg font-bold text-[#171717]">Draft</p>
              </div>
              <div className="rounded-2xl border border-[#ede9fe] bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5cf6]">
                  Version
                </p>
                <p className="mt-2 text-lg font-bold text-[#171717]">{version}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              label="Framework Code"
              helper="Unique identifier"
              error={errors.code?.message}
            >
              <input
                {...register("code", { setValueAs: (value) => String(value).toUpperCase() })}
                placeholder="CCPA"
                className={inputClass}
              />
            </FormField>

            <FormField label="Framework Name" helper="Official name" error={errors.name?.message}>
              <input
                {...register("name")}
                placeholder="California Consumer Privacy Act"
                className={inputClass}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField
                label="Description"
                helper="Purpose and scope"
                error={errors.description?.message}
              >
                <textarea
                  {...register("description")}
                  rows={6}
                  placeholder="Framework description..."
                  className={`${inputClass} resize-none`}
                />
              </FormField>
            </div>

            <FormField label="Region" error={errors.region?.message}>
              <select {...register("region")} className={inputClass} defaultValue="">
                <option value="">Select Region</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Category" error={errors.category?.message}>
              <select {...register("category")} className={inputClass} defaultValue="">
                <option value="">Select Category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Version" error={errors.version?.message}>
              <input {...register("version")} placeholder="1.0.0" className={inputClass} />
            </FormField>

            <FormField label="Effective Date" error={errors.effectiveDate?.message}>
              <input type="date" {...register("effectiveDate")} className={inputClass} />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Source Link" helper="Optional" error={errors.sourceLink?.message}>
                <input
                  {...register("sourceLink")}
                  placeholder="https://..."
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-[#f5f5f5] pt-8 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/frameworks")}
              className="rounded-2xl border border-[#d4d4d4] bg-white px-6 py-4 text-sm font-semibold text-[#525252] transition hover:bg-[#fafafa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-[#6d18ff] px-7 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(109,24,255,0.28)] transition hover:scale-[1.01] hover:bg-[#5412cc] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating Framework..." : "Create Framework"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, helper, error, children }: FormFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold tracking-wide text-[#171717]">{label}</label>
        {helper ? <span className="text-xs font-medium text-[#8a8a8a]">{helper}</span> : null}
      </div>
      {children}
      {error ? <p className="text-sm font-medium text-[#ef4444]">{error}</p> : null}
    </div>
  );
}
