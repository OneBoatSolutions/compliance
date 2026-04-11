"use client";

import { useParams } from "next/navigation";

export default function AssessmentDashboard() {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Assessment Dashboard</h1>

      <p className="mt-2 text-gray-600">Assessment ID: {id}</p>

      <div className="mt-6 p-4 border rounded-md bg-gray-50">
        <p>🎉 Assessment created successfully!</p>
        <p>This is where dashboard data will come later.</p>
      </div>
    </div>
  );
}
