import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { FrameworkForm } from "@/components/admin/frameworks/framework-form";

export default async function NewFrameworkPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return (
    <div
      className="min-h-screen bg-[#fafafa] px-6 py-10 lg:px-10"
      role="main"
      aria-labelledby="page-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b5cf6]">
            Cipherion Admin
          </p>
          <h1 id="page-title" className="mt-3 text-5xl font-bold tracking-tight text-[#171717]">
            Create Framework
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#525252]">
            Configure a new compliance framework with structured metadata, regional classification,
            versioning, and publishing controls.
          </p>
        </div>
        <FrameworkForm />
      </div>
    </div>
  );
}
