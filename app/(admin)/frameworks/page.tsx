import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { FrameworkListPagination } from "@/components/admin/frameworks/framework-list-pagination";
import { FrameworkListToolbar } from "@/components/admin/frameworks/framework-list-toolbar";
import { FrameworkTable } from "@/components/admin/frameworks/framework-table";
import { authOptions } from "@/lib/auth";
import { frameworkListQuerySchema } from "@/lib/validations/framework";
import { listFrameworks } from "@/services/framework-admin-service";
import type { Framework } from "@/types/framework";

interface FrameworksPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toQueryRecord(
  searchParams: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const raw: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      raw[key] = value;
    } else if (Array.isArray(value) && value[0]) {
      raw[key] = value[0];
    }
  }

  return raw;
}

function serializeFramework(
  item: Awaited<ReturnType<typeof listFrameworks>>["items"][number],
): Framework {
  return {
    ...item,
    effectiveDate: item.effectiveDate.toISOString(),
    publishedAt: item.publishedAt?.toISOString() ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export default async function FrameworksPage({ searchParams }: FrameworksPageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const parsed = frameworkListQuerySchema.safeParse(toQueryRecord(resolvedSearchParams));

  if (!parsed.success) {
    redirect("/frameworks");
  }

  const result = await listFrameworks(parsed.data);
  const frameworks = result.items.map(serializeFramework);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <h1 className="sr-only">Compliance Frameworks</h1>
        <div className="space-y-8">
          <Suspense
            fallback={
              <div
                role="status"
                aria-live="polite"
                className="rounded-[28px] border border-[#e5e5e5] bg-white p-7 text-sm text-[#737373]"
              >
                Loading filters...
              </div>
            }
          >
            <FrameworkListToolbar
              total={result.meta.total}
              published={result.counts.published}
              draft={result.counts.draft}
            />
          </Suspense>

          <div className="overflow-hidden rounded-[28px] border border-[#e5e5e5] bg-white shadow-sm">
            <div className="border-b border-[#f5f5f5] px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#171717]">Compliance Frameworks</h3>
                  <p className="mt-1 text-sm text-[#737373]">Secure framework management</p>
                </div>
                <div className="rounded-2xl bg-[#fafafa] px-4 py-2 text-sm font-semibold text-[#525252]">
                  {result.counts.archived} archived
                </div>
              </div>
            </div>

            <div className="p-6">
              <FrameworkTable frameworks={frameworks} />
            </div>
          </div>

          <Suspense fallback={null}>
            <FrameworkListPagination page={result.meta.page} totalPages={result.meta.totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
