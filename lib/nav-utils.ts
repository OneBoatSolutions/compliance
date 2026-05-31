export function isNavItemActive(item: { label: string; href: string }, pathname: string): boolean {
  const isReportsPage = pathname.includes("/reports");
  const isAssessmentPage = pathname.includes("/assessments") && !pathname.includes("/reports");

  if (item.label === "Reports") {
    return isReportsPage;
  }
  if (item.label === "Assessments") {
    return isAssessmentPage;
  }

  return pathname.startsWith(item.href);
}
