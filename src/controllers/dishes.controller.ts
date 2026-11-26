import { AuthHttpError } from "../fourni/auth/errors.js";
import { dishSchema } from "../schemas/dish.schema.js";
import { createDishService, getAllDishes, getDishById} from  "../services/dishes.service.js";
import {getPagination} from "../services/pagination.service.js"
// controller
// controller
export async function getDishes(req, res) {
  try {
    const { category, available, allergenFree } = req.query;

    if (category !== undefined) {
      const id = Number(category);
      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: "category doit être un entier >= 1" });
      }
    }
    if (available !== undefined && !["true", "false"].includes(available)) {
      return res.status(400).json({ error: "available doit valoir 'true' ou 'false'" });
    }
    if (allergenFree !== undefined && typeof allergenFree !== "string") {
      return res.status(400).json({ error: "allergenFree doit être une liste de codes séparés par des virgules" });
    }

    const allergenCodes = allergenFree
      ? allergenFree.split(",").map(c => c.trim()).filter(Boolean)
      : [];

    const dishes = await getAllDishes({
      categoryId: category !== undefined ? Number(category) : undefined,
      available: available !== undefined ? available === "true" : undefined,
      allergenFree: allergenCodes,
    });
    res.status(200).json(getPagination(dishes, req.query));
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
}
export async function getDish(req, res) {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({ error: "id doit être un entier >= 1" });
    }

    const dish = await getDishById(Number(id));

    // 404 : plat inexistant
    if (!dish) {
      return res.status(404).json({ error: "Plat introuvable" });
    }

    res.status(200).json(dish);
  } catch (error) {
    console.error("Error fetching dish:", error);
    res.status(500).json({ error: "Failed to fetch dish" });
  }
}

export async function createDish(req, res) {

  const result = dishSchema.safeParse(req.body);
  if (!result.success) {
    throw new AuthHttpError(
      400,
      "VALIDATION_ERROR",
      "Données invalides",
    );
  }

  // créer le plat (le service lève 409 ou 422 si besoin)
  const dish = await createDishService(result.data);

  //répondre 201 + Location
  return res.status(201).location(`/dishes/${dish.id}`).json(dish);
}

export async function updateDish(req, res) {

  const result = dishSchema.safeParse(req.body);
  if (!result.success) {
    throw new AuthHttpError(
      400,
      "VALIDATION_ERROR",
      "Données invalides",
    );
  }

  // créer le plat (le service lève 409 ou 422 si besoin)
  const dish = await updateDishService(result.data);

  //répondre 201 + Location
  return res.status(201).location(`/dishes/${dish.id}`).json(dish);
}

export async function deleteDish(req, res) {

  const result = dishSchema.safeParse(req.body);
  if (!result.success) {
    throw new AuthHttpError(
      400,
      "VALIDATION_ERROR",
      "Données invalides",
    );
  }

  // créer le plat (le service lève 409 ou 422 si besoin)
  const dish = await deleteDishService(result.data);

  //répondre 201 + Location
  return res.status(201).location(`/dishes/${dish.id}`).json(dish);
}