// repositories/dishes.repository.ts
import { prisma } from "../lib/prisma.js";

export type DishFilters = {
  categoryId?: number;
  available?: boolean;
  allergenFree?: string[];
};

const dishSelect = {
  id: true,
  name: true,
  description: true,
  priceCents: true,
  available: true,
  stock: true,
  imageUrl: true,
  category: { select: { id: true, name: true } },
  allergens: { select: { code: true, label: true } },
};

export function findDishes({ categoryId, available, allergenFree = [] }: DishFilters = {}) {
  return prisma.dish.findMany({
    where: {
      ...(categoryId !== undefined && { categoryId }),
      ...(available !== undefined && { available }),
      ...(allergenFree.length > 0 && {
        allergens: { none: { code: { in: allergenFree } } },
      }),
    },
    select: dishSelect,
    orderBy: [{ category: { position: "asc" } }, { name: "asc" }],
  });
}

export function findDishById(id: number) {
  return prisma.dish.findUnique({
    where: { id },
    select: dishSelect,
  });
}