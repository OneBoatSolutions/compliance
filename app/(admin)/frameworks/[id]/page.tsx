import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { FrameworkDetails } from "@/components/admin/frameworks/framework-details";

interface FrameworkDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FrameworkDetailsPage({ params }: FrameworkDetailsPageProps) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return (
    <div
      role="main"
      aria-labelledby="framework-workspace-title"
      className="min-h-screen bg-[#fafafa] px-6 py-10 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8b5cf6]">
            Cipherion Admin
          </p>
          <h1
            id="framework-workspace-title"
            className="mt-3 text-5xl font-bold tracking-tight text-[#171717]"
          >
            Framework Workspace
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-[#525252]">
            Manage framework metadata, controls, publishing lifecycle, and compliance configuration
            in one secure workspace.
          </p>
        </div>
        <FrameworkDetails frameworkId={resolvedParams.id} />
      </div>
    </div>
  );
}
