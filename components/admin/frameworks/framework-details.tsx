"use client";

import { useEffect, useState } from "react";

import { ApiResponse, CreateControlPayload, Framework } from "@/types/framework";

import { ControlTable } from "./control-table";
import { CsvImport } from "./csv-import";
import { FrameworkEditForm } from "./framework-edit-form";
import { StatusBadge } from "./status-badge";

interface Props {
  frameworkId: string;
}

interface FormErrors {
  general?: string;
}

export function FrameworkDetails({ frameworkId }: Props) {
  const [framework, setFramework] = useState<Framework | null>(null);

  const [initialLoading, setInitialLoading] = useState(true);
  // Deleted unused state

  const [errors, setErrors] = useState<FormErrors>({});
  useEffect(() => {
    if (!errors.general) {
      return;
    }

    const timer = setTimeout(() => {
      setErrors({});
    }, 4000);

    return () => clearTimeout(timer);
  }, [errors.general]);

  const [controlForm, setControlForm] = useState<CreateControlPayload>({
    code: "",
    title: "",
    description: "",
    category: "",
    severity: "MEDIUM",
    weight: 1,
  });

  async function fetchFramework(showLoader = false) {
    try {
      if (showLoader) {
        setInitialLoading(true);
      }

      const response = await fetch(`/api/frameworks/${frameworkId}`);

      const result: ApiResponse<Framework> = await response.json();

      if (!result.success) {
        setErrors({
          general: result.message,
        });

        return;
      }

      setFramework(result.data);
    } catch {
      setErrors({
        general: "Failed to load framework",
      });
    } finally {
      if (showLoader) {
        setInitialLoading(false);
      }
    }
  }
  useEffect(() => {
    void fetchFramework(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameworkId]);

  async function addControl() {
    try {
      const response = await fetch(`/api/frameworks/${frameworkId}/controls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(controlForm),
      });

      const result: ApiResponse<Framework> = await response.json();

      if (!response.ok) {
        setErrors({
          general: "message" in result ? result.message : "Failed to add control",
        });

        return;
      }

      await fetchFramework(false);

      setControlForm({
        code: "",
        title: "",
        description: "",
        category: "",
        severity: "MEDIUM",
        weight: 1,
      });
    } catch {
      setErrors({
        general: "Failed to add control",
      });
    }
  }

  async function archiveFramework() {
    try {
      const response = await fetch(`/api/frameworks/${frameworkId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "ARCHIVED",
        }),
      });

      if (!response.ok) {
        setErrors({
          general: "Failed to archive framework",
        });

        return;
      }

      await fetchFramework();
    } catch {
      setErrors({
        general: "Failed to archive framework",
      });
    }
  }

  async function publishFramework() {
    try {
      setErrors({});

      const response = await fetch(`/api/frameworks/${frameworkId}/publish`, {
        method: "POST",
      });

      const result: ApiResponse<Framework> = await response.json();

      if (!response.ok) {
        if ("errors" in result && result.errors) {
          const messages = Object.values(result.errors).flat().join(", ");

          setErrors({
            general: messages,
          });
        } else {
          setErrors({
            general: "message" in result ? result.message : "Failed to publish framework",
          });
        }

        return;
      }

      await fetchFramework();
    } catch {
      setErrors({
        general: "Failed to publish framework",
      });
    }
  }

  if (initialLoading) {
    return (
      <div className="rounded-3xl border border-[#e5e5e5] bg-white p-20 text-center shadow-sm">
        <div
          role="status"
          aria-label="Loading framework workspace"
          className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#e9ddff] border-t-[#6d18ff]"
        />

        <p className="mt-6 text-lg font-medium text-[#525252]">Loading framework workspace...</p>
      </div>
    );
  }

  if (!framework) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-500">
        Framework not found
      </div>
    );
  }

  const isLocked = framework.status === "PUBLISHED" || framework.status === "ARCHIVED";

  return (
    <div className="space-y-8">
      {/* HERO */}

      <section
        aria-labelledby="framework-title"
        className="relative overflow-hidden rounded-[32px] border border-[#7c3aed]/20 bg-gradient-to-br from-[#6d18ff] via-[#7c3aed] to-[#5412cc] p-10 text-white shadow-2xl"
      >
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d8b4fe]">
              Compliance Framework
            </p>

            <h1 id="framework-title" className="mt-4 text-5xl font-bold tracking-tight">
              {framework.name}
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#ede9fe]">
              Securely manage controls, publishing workflows, governance states, and audit-ready
              compliance configurations inside Cipherion.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <StatusBadge status={framework.status} />

              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
                {framework.controls?.length ?? 0} Controls
              </div>

              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
                Version {framework.version}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {framework.status === "DRAFT" ? (
              <button
                type="button"
                aria-label="Publish framework"
                onClick={() => void publishFramework()}
                className="rounded-2xl bg-[#10b981] px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#059669] "
              >
                Publish Framework
              </button>
            ) : null}

            {framework.status === "PUBLISHED" ? (
              <button
                type="button"
                aria-label="Archive framework"
                onClick={() => void archiveFramework()}
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Archive Framework
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* ERROR */}

      {errors.general ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-red-600 shadow-sm"
        >
          {errors.general}
        </div>
      ) : null}

      {/* DETAILS */}

      <div className="rounded-[32px] border border-[#e5e5e5] bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#171717]">Framework Details</h2>

            <p className="mt-2 text-[#525252]">Configure metadata and governance information.</p>
          </div>

          {isLocked ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-full bg-[#f5f5f5] px-4 py-2 text-sm font-medium text-[#525252]"
            >
              Read Only
            </div>
          ) : null}
        </div>

        <FrameworkEditForm
          framework={framework}
          disabled={isLocked}
          onSaved={(updated) => setFramework(updated)}
        />
      </div>

      {/* ADD CONTROL */}

      <div className="rounded-[32px] border border-[#e5e5e5] bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#171717]">Add Control</h2>

          <p className="mt-2 text-[#525252]">Create controls and compliance checkpoints.</p>
        </div>
        {errors.general ? (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-red-600 shadow-sm mb-4"
          >
            {errors.general}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <input
            id="control-code"
            aria-label="Control Code"
            disabled={isLocked}
            placeholder="Control Code"
            value={controlForm.code}
            onChange={(event) =>
              setControlForm({
                ...controlForm,
                code: event.target.value,
              })
            }
            className={inputClass}
          />

          <input
            id="control-title"
            aria-label="Control Title"
            disabled={isLocked}
            placeholder="Title"
            value={controlForm.title}
            onChange={(event) =>
              setControlForm({
                ...controlForm,
                title: event.target.value,
              })
            }
            className={inputClass}
          />
        </div>

        <textarea
          id="control-description"
          aria-label="Control Description"
          disabled={isLocked}
          placeholder="Description"
          rows={4}
          value={controlForm.description}
          onChange={(event) =>
            setControlForm({
              ...controlForm,
              description: event.target.value,
            })
          }
          className={`${inputClass} mt-6 w-full`}
        />

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            aria-label="Add control"
            disabled={isLocked}
            onClick={() => void addControl()}
            className="rounded-2xl bg-[#6d18ff] px-6 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#5412cc]"
          >
            Add Control
          </button>
        </div>
      </div>

      <CsvImport frameworkId={frameworkId} refresh={fetchFramework} disabled={isLocked} />

      <ControlTable
        frameworkId={frameworkId}
        controls={framework.controls ?? []}
        disabled={isLocked || framework.status === "ARCHIVED"}
      />
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-5 py-4 text-[#171717] outline-none transition focus:border-[#6d18ff] focus:bg-white focus:ring-4 focus:ring-[#e9ddff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6d18ff]/30 disabled:cursor-not-allowed disabled:bg-[#f5f5f5] disabled:text-[#a3a3a3]";
