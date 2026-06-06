"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ApiResponse, Framework } from "@/types/framework";
import { frameworkEditSchema, type FrameworkFormValues } from "@/lib/validations/framework";

const REGIONS = ["US", "EU", "UK", "Global", "India"] as const;
const CATEGORIES = ["Privacy", "Security", "Healthcare", "Financial"] as const;

const inputClass =
  "w-full rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-5 py-4 text-[#171717] outline-none focus-visible:ring-4 focus-visible:ring-[#e9ddff] focus-visible:border-[#6d18ff] transition focus:border-[#6d18ff] focus:bg-white focus:ring-4 focus:ring-[#e9ddff] disabled:cursor-not-allowed disabled:bg-[#f5f5f5] disabled:text-[#a3a3a3]";

interface FrameworkEditFormProps {
  framework: Framework;
  disabled: boolean;
  onSaved: (framework: Framework) => void;
}

export function FrameworkEditForm({ framework, disabled, onSaved }: FrameworkEditFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Pick<FrameworkFormValues, "code" | "name" | "description" | "region" | "category">>({
    resolver: zodResolver(frameworkEditSchema),
    defaultValues: {
      code: framework.code,
      name: framework.name,
      description: framework.description,
      region: framework.region,
      category: framework.category,
    },
  });

  useEffect(() => {
    reset({
      code: framework.code,
      name: framework.name,
      description: framework.description,
      region: framework.region,
      category: framework.category,
    });
  }, [framework, reset]);

  async function onSubmit(
    values: Pick<FrameworkFormValues, "code" | "name" | "description" | "region" | "category">,
  ) {
    try {
      const response = await fetch(`/api/frameworks/${framework.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result: ApiResponse<Framework> = await response.json();

      if (!result.success) {
        if (result.errors) {
          for (const [key, messages] of Object.entries(result.errors)) {
            setError(key as keyof typeof values, { message: messages[0] });
          }
        } else {
          toast.error(result.message);
        }
        return;
      }

      toast.success("Framework updated");
      onSaved(result.data);
    } catch {
      toast.error("Failed to update framework");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Field label="Framework Code" id="code" error={errors.code?.message}>
          <input
            id="code"
            {...register("code")}
            disabled={disabled}
            placeholder="Framework Code"
            className={inputClass}
            aria-invalid={!!errors.code}
            aria-describedby={errors.code ? "code-error" : undefined}
          />
        </Field>
        <Field label="Framework Name" id="name" error={errors.name?.message}>
          <input
            id="name"
            {...register("name")}
            disabled={disabled}
            placeholder="Framework Name"
            className={inputClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>
        <Field label="Region" id="region" error={errors.region?.message}>
          <select
            id="region"
            {...register("region")}
            disabled={disabled}
            className={inputClass}
            aria-invalid={!!errors.region}
            aria-describedby={errors.region ? "region-error" : undefined}
          >
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category" id="category" error={errors.category?.message}>
          <select
            id="category"
            {...register("category")}
            disabled={disabled}
            className={inputClass}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "category-error" : undefined}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description" id="description" error={errors.description?.message}>
        <textarea
          id="description"
          {...register("description")}
          disabled={disabled}
          rows={5}
          placeholder="Framework Description"
          className={`${inputClass} w-full`}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
      </Field>

      {!disabled ? (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            aria-disabled={isSubmitting || !isDirty}
            aria-busy={isSubmitting}
            className="rounded-2xl bg-[#6d18ff] px-6 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#5412cc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      ) : null}
    </form>
  );
}

function Field({
  label,
  error,
  id,
  children,
}: {
  label: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-[#171717]">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
