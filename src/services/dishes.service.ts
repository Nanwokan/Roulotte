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

const dishes = [
  {
    id: 1,
    name: "Le Classique",
    description: "Bœuf, cheddar affiné, oignons confits, sauce maison",
    priceCents: 1150,
    category: "Burgers",
    allergens: ["gluten", "lait", "oeufs", "moutarde", "sesame"],
    available: true,
    stock: null,
  },
  {
    id: 2,
    name: "Le Montagnard",
    description: "Bœuf, raclette fondue, lard fumé, pommes grenaille",
    priceCents: 1350,
    category: "Burgers",
    allergens: ["gluten", "lait", "moutarde"],
    available: true,
    stock: null,
  },
  {
    id: 3,
    name: "Le Poulet croustillant",
    description: "Filet de poulet pané, salade, sauce yaourt-citron",
    priceCents: 1250,
    category: "Burgers",
    allergens: ["gluten", "lait", "oeufs"],
    available: true,
    stock: null,
  },
  {
    id: 4,
    name: "Le Burger du mois",
    description: "La recette surprise du chef (revient bientôt)",
    priceCents: 1450,
    category: "Burgers",
    allergens: ["gluten", "lait"],
    available: false,
    stock: null,
  },
  {
    id: 5,
    name: "Wrap falafel",
    description: "Falafels, houmous, crudités, sauce tahini",
    priceCents: 1050,
    category: "Veggie",
    allergens: ["gluten", "sesame"],
    available: true,
    stock: null,
  },
  {
    id: 6,
    name: "Bowl quinoa-patate douce",
    description: "Quinoa, patate douce rôtie, avocat, graines torréfiées",
    priceCents: 1150,
    category: "Veggie",
    allergens: ["sesame"],
    available: true,
    stock: null,
  },
  {
    id: 7,
    name: "Burger végé",
    description: "Galette pois chiche-betterave, chèvre, roquette",
    priceCents: 1200,
    category: "Veggie",
    allergens: ["gluten", "lait"],
    available: true,
    stock: null,
  },
  {
    id: 8,
    name: "Frites maison",
    description: "Pommes de terre fraîches, double cuisson",
    priceCents: 400,
    category: "Accompagnements",
    allergens: [],
    available: true,
    stock: null,
  },
  {
    id: 9,
    name: "Patates douces frites",
    description: "Croustillantes, fleur de sel",
    priceCents: 500,
    category: "Accompagnements",
    allergens: [],
    available: true,
    stock: null,
  },
  {
    id: 10,
    name: "Salade verte",
    description: "Jeunes pousses, vinaigrette moutarde-miel",
    priceCents: 350,
    category: "Accompagnements",
    allergens: ["moutarde"],
    available: true,
    stock: null,
  },
  {
    id: 11,
    name: "Cookie noisettes",
    description: "Cuit sur place, cœur fondant",
    priceCents: 300,
    category: "Desserts",
    allergens: ["gluten", "oeufs", "lait", "fruits-a-coque"],
    available: true,
    stock: 12,
  },
  {
    id: 12,
    name: "Brownie",
    description: "Chocolat noir et noix de pécan",
    priceCents: 350,
    category: "Desserts",
    allergens: ["gluten", "oeufs", "lait", "fruits-a-coque"],
    available: true,
    stock: 8,
  },
  {
    id: 13,
    name: "Salade de fruits frais",
    description: "Fruits de saison, menthe fraîche",
    priceCents: 400,
    category: "Desserts",
    allergens: [],
    available: true,
    stock: null,
  },
  {
    id: 14,
    name: "Citronnade maison",
    description: "Citrons pressés, sucre de canne",
    priceCents: 350,
    category: "Boissons",
    allergens: [],
    available: true,
    stock: null,
  },
  {
    id: 15,
    name: "Thé glacé pêche",
    description: "Infusé à froid, peu sucré",
    priceCents: 350,
    category: "Boissons",
    allergens: [],
    available: true,
    stock: null,
  },
  {
    id: 16,
    name: "Eau pétillante",
    description: "50 cl",
    priceCents: 250,
    category: "Boissons",
    allergens: [],
    available: true,
    stock: null,
  },
];

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
