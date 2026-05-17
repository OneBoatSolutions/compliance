import { redirect } from "next/navigation";

interface ReportAliasPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReportAliasPage({ params }: ReportAliasPageProps) {
  const { id } = await params;
  redirect(`/assessments/${id}/reports`);
}
