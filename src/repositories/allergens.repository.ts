import { prisma } from "../lib/prisma.js";

export function findAllAllergens() {
  return prisma.allergen.findMany({
    orderBy: { code: "asc" },
  });
}