import { prisma } from "../lib/prisma.js";

export function findAllAllergens() {
  return prisma.allergen.findMany({
    orderBy: { code: "asc" },
  });
}

export function findExistingAllergenOfDish(codes: string[]) {
  return prisma.allergen.findMany({
    where: { code: { in: codes } },
  });
}