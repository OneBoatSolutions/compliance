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

  const assessmentId = params?.assessmentId as string; // ✅ correct
  const controlId = params?.controlId as string;

  const [control, setControl] = useState<ControlWorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId || !controlId) {
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getControl(controlId);

        setControl({
          ...data,
          assessmentId,
        });
      } catch (err) {
        console.error("Failed to load control:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId, controlId]);

  if (!assessmentId || !controlId) {
    return <div>Invalid route</div>;
  }

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading control...</div>;
  }

  if (!control) {
    return <div className="p-6 text-sm text-destructive">Failed to load control</div>;
  }

  return <ControlWorkspace control={control} />;
}
