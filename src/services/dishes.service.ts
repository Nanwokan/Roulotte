// services/dishes.service.ts
import {
  findDishes,
  findDishById,
  type DishFilters,
  findDishByName,
  createDish,
} from "../repositories/dishes.repository.js";
import { prisma } from "../lib/prisma.js";
import { dishSchema } from "../schemas/dish.schema.js";
import { AuthHttpError } from "../fourni/auth/errors.js";
import { Prisma } from "../../generated/prisma/client.js";
import type z from "zod";
import { findCategoryById } from "../repositories/categories.repository.js";
import { findExistingAllergenOfDish } from "../repositories/allergens.repository.js";

type DishInput = z.infer<typeof dishSchema>;


export async function getAllDishes(filters: DishFilters = {}) {
  return findDishes(filters);
}

export async function getDishById(id: number) {
  return findDishById(id);
}

export async function createDishService(input: DishInput) {
  const { allergens, categoryId, ...fields } = input;
  const codes = [...new Set(allergens)]; // pas de doublons

  // 422 : la catégorie doit exister
  const category = await findCategoryById(categoryId);
  if (!category) {
    throw new AuthHttpError(422, "INVALID_REFERENCE", "Catégorie inconnue");
  }

  // 422 : tous les codes d'allergènes doivent exister
  const found = await findExistingAllergenOfDish(codes);
  if (found.length !== codes.length) {
    throw new AuthHttpError(422, "INVALID_REFERENCE", "Allergène inconnu");
  }

  // 409 : le nom doit être unique
  const existing = await findDishByName(fields.name);
  if (existing) {
    throw new AuthHttpError(409, "CONFLICT", "Un plat porte déjà ce nom");
  }

  // Prisma renvoie directement la forme du contrat
  return createDish({
    ...fields,
    category: { connect: { id: categoryId } },
    allergens: { connect: codes.map((code) => ({ code })) },
  });
}

export async function updateDishService(id: number, input: Partial<DishInput>) {
  const { allergens, categoryId, ...fields } = input;
  const dish = await prisma.dish.findUnique({
    where: { id },
  });

  if (!dish) {
    throw new AuthHttpError(404, "NOT_FOUND", "Plat inconnu");
  }

  const data: Prisma.DishUpdateInput = { ...fields };

  if (categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category)
      throw new AuthHttpError(422, "INVALID_REFERENCE", "Catégorie inconnue");
    data.category = { connect: { id: categoryId } };
  }

  if (allergens !== undefined) {
    const codes = [...new Set(allergens)];
    const found = await prisma.allergen.findMany({
      where: { code: { in: codes } },
    });
    if (found.length !== codes.length)
      throw new AuthHttpError(422, "INVALID_REFERENCE", "Allergène inconnu");
    data.allergens = { set: codes.map((code) => ({ code })) }; // remplace toute la liste
  }

  if (fields.name !== undefined) {
    const clash = await prisma.dish.findUnique({
      where: { name: fields.name },
    });
    if (clash && clash.id !== id)
      throw new AuthHttpError(409, "CONFLICT", "Un plat porte déjà ce nom");
  }
  // Prisma renvoie directement la forme du contrat
  return prisma.dish.update({
    where: { id },
    data,
    omit: { categoryId: true },
    include: {
      category: { select: { id: true, name: true } },
      allergens: { select: { code: true, label: true } },
    },
  });
}

export async function deleteDishService(id: number) {
  const dish = await prisma.dish.findUnique({
    where: { id },
  });

  if (!dish) {
    throw new AuthHttpError(404, "NOT_FOUND", "Plat inconnu");
  }

  const orderedOnce = await prisma.orderItem.findFirst({
    where: { dishId: id },
  });

  if (orderedOnce) {
    throw new AuthHttpError(
      409,
      "CONFLICT",
      "Ce plat a déjà été commandé : rends-le indisponible à la place",
    );
  }

  return prisma.dish.delete({
    where: { id },
  });
}
