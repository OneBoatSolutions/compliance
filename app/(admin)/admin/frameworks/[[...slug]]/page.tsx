import { redirect } from "next/navigation";

interface LegacyFrameworkRedirectProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function LegacyFrameworkRedirectPage({
  params,
}: LegacyFrameworkRedirectProps) {
  const resolvedParams = await params;
  const suffix = resolvedParams.slug?.length ? `/${resolvedParams.slug.join("/")}` : "";
  redirect(`/frameworks${suffix}`);
}
