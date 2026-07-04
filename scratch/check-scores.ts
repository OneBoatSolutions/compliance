import { prisma } from "../lib/prisma";
import { recalculateAssessmentScore } from "../lib/assessment-score";
import { getCachedDashboardData } from "../lib/dashboard-data";

async function main() {
  const assessments = await prisma.assessment.findMany({
    include: {
      user: true,
      organization: true,
    },
  });

  console.log("=== Assessments in DB ===");
  for (const a of assessments) {
    console.log(`Assessment ID: ${a.id}`);
    console.log(`User: ${a.user.email} (ID: ${a.userId})`);
    console.log(`Saved DB Score: ${a.score}%`);

    // Recalculate dynamically
    const recalculated = await recalculateAssessmentScore(a.id);
    console.log(`Recalculated Score: ${recalculated.score}%`);

    // Check cached dashboard data
    const dashboard = await getCachedDashboardData(a.userId);
    console.log(`Cached Dashboard Average Score: ${dashboard.averageScore}%`);
    const dashboardAssessment = dashboard.assessments.find((da) => da.id === a.id);
    console.log(`Cached Dashboard Assessment Score: ${dashboardAssessment?.score}%\n`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
