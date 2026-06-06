"use client";

import { useState, useEffect } from "react";

import { ApiResponse, Control } from "@/types/framework";

interface Props {
  frameworkId: string;

  controls: Control[];

  disabled: boolean;
}

interface EditingState {
  [controlId: string]: boolean;
}

export function ControlTable({ frameworkId, controls, disabled }: Props) {
  const [editing, setEditing] = useState<EditingState>({});

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [localControls, setLocalControls] = useState<Control[]>(controls);
  useEffect(() => {
    setLocalControls(controls);
  }, [controls]);
  async function updateControl(control: Control) {
    try {
      setLoadingId(control.id);

      const response = await fetch(`/api/frameworks/${frameworkId}/controls/${control.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: control.code,
          title: control.title,
          description: control.description,
          category: control.category,
          severity: control.severity,
          weight: control.weight,
        }),
      });

      const result: ApiResponse<Control> = await response.json();

      if (!result.success) {
        return;
      }

      setLocalControls((previous) =>
        previous.map((item) => (item.id === control.id ? result.data : item)),
      );

      setEditing((previous) => ({
        ...previous,
        [control.id]: false,
      }));
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteControl(controlId: string) {
    try {
      setLoadingId(controlId);

      const response = await fetch(`/api/frameworks/${frameworkId}/controls/${controlId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        return;
      }

      setLocalControls((previous) => previous.filter((control) => control.id !== controlId));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#e5e5e5] bg-white shadow-[0_10px_40px_rgba(109,24,255,0.06)]">
      <div className="flex items-center justify-between border-b border-[#f5f5f5] px-8 py-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b5cf6]">
            Compliance Controls
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#171717]">
            Framework Controls
          </h2>

          <p className="mt-2 text-sm text-[#737373]">
            Manage framework requirements, scoring weight, and severity mapping.
          </p>
        </div>

        <div className="rounded-2xl bg-[#f5f0ff] px-5 py-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5cf6]">
            Total Controls
          </p>

          <p className="mt-1 text-2xl font-bold text-[#171717]">{localControls.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table aria-label="Framework controls table" className="w-full min-w-[900px]">
          <thead className="bg-[#fafafa]">
            <tr className="border-b border-[#f0f0f0]">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
                Control Code
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
                Title
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
                Severity
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
                Weight
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {localControls.map((control) => {
              const isEditing = editing[control.id];

              return (
                <ControlRow
                  key={control.id}
                  control={control}
                  isEditing={isEditing}
                  loading={loadingId === control.id}
                  disabled={disabled}
                  setEditing={setEditing}
                  onSave={updateControl}
                  onDelete={deleteControl}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface RowProps {
  control: Control;

  isEditing?: boolean;

  loading: boolean;
  disabled: boolean;

  setEditing: React.Dispatch<React.SetStateAction<EditingState>>;

  onSave: (control: Control) => Promise<void>;

  onDelete: (controlId: string) => Promise<void>;
}

function ControlRow({
  control,
  isEditing,
  loading,
  disabled,
  setEditing,
  onSave,
  onDelete,
}: RowProps) {
  const [draft, setDraft] = useState<Control>(control);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const severityStyles: Record<Control["severity"], string> = {
    LOW: "bg-blue-50 text-blue-700 border-blue-100",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-100",
    HIGH: "bg-orange-50 text-orange-700 border-orange-100",
    CRITICAL: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <tr className="border-b border-[#f5f5f5] transition hover:bg-[#fcfbff]">
      <td className="px-6 py-5">
        <input
          aria-label={`Control code for ${control.title}`}
          value={draft.code}
          disabled={!isEditing || disabled}
          onChange={(event) =>
            setDraft({
              ...draft,
              code: event.target.value,
            })
          }
          className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm font-medium text-[#171717] outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff] disabled:bg-[#fafafa]"
        />
      </td>

      <td className="px-6 py-5">
        <input
          aria-label={`Control title for ${control.code}`}
          value={draft.title}
          disabled={!isEditing || disabled}
          onChange={(event) =>
            setDraft({
              ...draft,
              title: event.target.value,
            })
          }
          className="w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff] disabled:bg-[#fafafa]"
        />
      </td>

      <td className="px-6 py-5">
        <select
          aria-label={`Severity for ${control.code}`}
          value={draft.severity}
          disabled={!isEditing || disabled}
          onChange={(event) =>
            setDraft({
              ...draft,
              severity: event.target.value as Control["severity"],
            })
          }
          className={`rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff] ${severityStyles[draft.severity]}`}
        >
          <option value="LOW">LOW</option>

          <option value="MEDIUM">MEDIUM</option>

          <option value="HIGH">HIGH</option>

          <option value="CRITICAL">CRITICAL</option>
        </select>
      </td>

      <td className="px-6 py-5">
        <input
          aria-label={`Weight for ${control.code}`}
          type="number"
          value={draft.weight}
          disabled={!isEditing || disabled}
          onChange={(event) =>
            setDraft({
              ...draft,
              weight: Number(event.target.value),
            })
          }
          className="w-28 rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm font-medium text-[#171717] outline-none transition focus:border-[#6d18ff] focus:ring-4 focus:ring-[#e9ddff] disabled:bg-[#fafafa]"
        />
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end gap-3">
          {isEditing ? (
            <button
              type="button"
              aria-label={`Save control ${control.code}`}
              aria-busy={loading}
              disabled={loading || disabled}
              onClick={() => void onSave(draft)}
              className="rounded-xl bg-[#10b981] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-[#0d9f6e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              type="button"
              aria-label={`Edit control ${control.code}`}
              disabled={disabled}
              onClick={() =>
                setEditing((previous) => ({
                  ...previous,
                  [control.id]: true,
                }))
              }
              className="rounded-xl bg-[#6d18ff] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-[#5412cc] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Edit
            </button>
          )}

          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Confirm delete control ${control.code}`}
                disabled={loading}
                onClick={() => void onDelete(control.id)}
                className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white"
              >
                Confirm
              </button>

              <button
                type="button"
                aria-label={`Cancel delete control ${control.code}`}
                onClick={() => setConfirmDelete(false)}
                className="rounded-xl border border-[#e5e5e5] px-4 py-3 text-sm font-medium text-[#525252]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Delete control ${control.code}`}
              disabled={loading || disabled}
              onClick={() => setConfirmDelete(true)}
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
