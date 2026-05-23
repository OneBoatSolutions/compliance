import { FrameworkForm } from "@/components/admin/frameworks/framework-form";

export default function NewFrameworkPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b5cf6]">
            Cipherion Admin
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight text-[#171717]">
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
