"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ApiResponse, CreateFrameworkPayload, Framework } from "@/types/framework";

const REGIONS = ["US", "EU", "UK", "Global", "India"];

const CATEGORIES = ["Privacy", "Security", "Healthcare", "Financial"];

interface FormErrors {
  code?: string;
  name?: string;
  description?: string;
  region?: string;
  category?: string;
  version?: string;
  effectiveDate?: string;
  sourceLink?: string;
  general?: string;
}

const initialForm: CreateFrameworkPayload = {
  code: "",
  name: "",
  description: "",
  region: "",
  category: "",
  version: "1.0.0",
  effectiveDate: "",
  sourceLink: "",
};

export function FrameworkForm() {
  const router = useRouter();

  const [form, setForm] = useState<CreateFrameworkPayload>(initialForm);

  const [errors, setErrors] = useState<FormErrors>({});

  const [loading, setLoading] = useState<boolean>(false);

  function updateField(field: keyof CreateFrameworkPayload, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  function validateForm(): boolean {
    const nextErrors: FormErrors = {};

    if (!form.code.trim()) {
      nextErrors.code = "Framework code is required";
    }

    if (!/^[A-Z0-9_-]+$/.test(form.code)) {
      nextErrors.code = "Code must be uppercase with no spaces";
    }

    if (!form.name.trim()) {
      nextErrors.name = "Framework name is required";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required";
    }

    if (!form.region) {
      nextErrors.region = "Region is required";
    }

    if (!form.category) {
      nextErrors.category = "Category is required";
    }

    if (!/^\d+\.\d+\.\d+$/.test(form.version)) {
      nextErrors.version = "Version must follow semantic versioning";
    }

    if (!form.effectiveDate) {
      nextErrors.effectiveDate = "Effective date is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/frameworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result: ApiResponse<Framework> = await response.json();

      if (!result.success) {
        if (result.errors) {
          const backendErrors: FormErrors = {};

          Object.entries(result.errors).forEach(([key, value]) => {
            backendErrors[key as keyof FormErrors] = value[0];
          });

          setErrors(backendErrors);
        } else {
          setErrors({
            general: result.message,
          });
        }

        return;
      }

      router.push(`/admin/frameworks/${result.data.id}`);

      router.refresh();
    } catch {
      setErrors({
        general: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-[32px] border border-[#e5e5e5] bg-white shadow-[0_20px_60px_rgba(109,24,255,0.08)]">
        {/* Header */}

        <div className="border-b border-[#f5f5f5] bg-gradient-to-r from-[#faf7ff] to-white to-white px-8 py-8 lg:px-10">
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

                <p className="mt-2 text-lg font-bold text-[#171717]">{form.version}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}

        <div className="p-8 lg:p-10">
          {errors.general ? (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
              {errors.general}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField label="Framework Code" helper="Unique identifier" error={errors.code}>
              <input
                value={form.code}
                onChange={(event) => updateField("code", event.target.value.toUpperCase())}
                placeholder="CCPA"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Framework Name"
              helper="Official compliance framework name"
              error={errors.name}
            >
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="California Consumer Privacy Act"
                className={inputClass}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField
                label="Description"
                helper="Describe the purpose and scope"
                error={errors.description}
              >
                <textarea
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  rows={6}
                  placeholder="Framework description..."
                  className={`${inputClass} resize-none`}
                />
              </FormField>
            </div>

            <FormField label="Region" helper="Applicable compliance region" error={errors.region}>
              <select
                value={form.region}
                onChange={(event) => updateField("region", event.target.value)}
                className={inputClass}
              >
                <option value="">Select Region</option>

                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Category" helper="Framework classification" error={errors.category}>
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className={inputClass}
              >
                <option value="">Select Category</option>

                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Version"
              helper="Current framework release version"
              error={errors.version}
            >
              <input
                value={form.version}
                onChange={(event) => updateField("version", event.target.value)}
                placeholder="1.0.0"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Effective Date"
              helper="Framework activation date"
              error={errors.effectiveDate}
            >
              <input
                type="date"
                value={form.effectiveDate}
                onChange={(event) => updateField("effectiveDate", event.target.value)}
                className={inputClass}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField
                label="Source Link"
                helper="Official reference URL (optional)"
                error={errors.sourceLink}
              >
                <input
                  value={form.sourceLink ?? ""}
                  onChange={(event) => updateField("sourceLink", event.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>

          {/* Footer */}

          <div className="mt-12 flex flex-col gap-4 border-t border-[#f5f5f5] pt-8 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/admin/frameworks")}
              className="rounded-2xl border border-[#d4d4d4] bg-white px-6 py-4 text-sm font-semibold text-[#525252] transition hover:bg-[#fafafa]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[#6d18ff] px-7 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(109,24,255,0.28)] transition hover:scale-[1.01] hover:bg-[#5412cc] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Framework..." : "Create Framework"}
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

const inputClass =
  "w-full rounded-2xl border border-[#e5e5e5] bg-white px-5 py-4 text-sm text-[#171717] shadow-sm outline-none transition duration-200 placeholder:text-[#a3a3a3] focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff]";
