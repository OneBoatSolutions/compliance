import { prisma } from "@/lib/prisma";

export async function getAdminDashboardStats() {
  const [totalUsers, publishedFrameworks, draftFrameworks, totalAssessments] = await Promise.all([
    prisma.user.count(),
    prisma.framework.count({ where: { status: "PUBLISHED" } }),
    prisma.framework.count({ where: { status: "DRAFT" } }),
    prisma.assessment.count(),
  ]);
  return { totalUsers, publishedFrameworks, draftFrameworks, totalAssessments };
}
