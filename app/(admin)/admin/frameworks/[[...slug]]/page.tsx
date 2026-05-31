import { redirect } from "next/navigation";

interface LegacyFrameworkRedirectProps {
  params: {
    slug?: string[];
  };
}

export default function LegacyFrameworkRedirectPage({ params }: LegacyFrameworkRedirectProps) {
  const suffix = params.slug?.length ? `/${params.slug.join("/")}` : "";
  redirect(`/frameworks${suffix}`);
}
