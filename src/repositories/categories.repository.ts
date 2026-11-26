import { prisma } from "../lib/prisma.js";

export function findAllCategories() {
  return prisma.category.findMany({
    orderBy: { position: "asc" },
  });
}