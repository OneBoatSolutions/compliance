const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.assessmentItem
  .findFirst()
  .then((a) => console.log(a.id, a.assessmentId, a.controlId))
  .catch(console.error)
  .finally(() => p.$disconnect());
