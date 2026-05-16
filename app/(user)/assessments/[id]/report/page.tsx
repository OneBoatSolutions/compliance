import { redirect } from "next/navigation";

interface ReportAliasPageProps {
  params: {
    id: string;
  };
}

export default function ReportAliasPage({ params }: ReportAliasPageProps) {
  redirect(`/assessments/${params.id}/reports`);
}
