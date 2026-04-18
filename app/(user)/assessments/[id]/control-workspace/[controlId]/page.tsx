"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ControlWorkspace from "@/components/user/control-workspace/ControlWorkspace";
import { getControl } from "@/services/control.services";

interface ControlWorkspaceData {
  id: string;
  framework: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  weight: number;
  assessmentId: string;
}

export default function Page() {
  const params = useParams();

  const assessmentId = params?.id as string;
  const controlId = params?.controlId as string;

  const [control, setControl] = useState<ControlWorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch control data
  useEffect(() => {
    if (!assessmentId || !controlId) {
      return;
    }

    const fetchData = async () => {
      try {
        const data = (await getControl(controlId)) as Omit<ControlWorkspaceData, "assessmentId">;
        setControl({
          ...data,
          assessmentId, // attach route param if needed
        });
      } catch (err) {
        console.error("Failed to load control:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId, controlId]);

  // 🛑 Invalid route
  if (!assessmentId || !controlId) {
    return <div>Invalid route</div>;
  }

  // ⏳ Loading state
  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading control...</div>;
  }

  // ❌ Safety fallback
  if (!control) {
    return <div className="p-6 text-sm text-destructive">Failed to load control</div>;
  }

  return <ControlWorkspace control={control} />;
}
