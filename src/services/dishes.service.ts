// services/dishes.service.ts
import { findDishes, findDishById, type DishFilters } from "../repositories/dishes.repository.js";

export async function getAllDishes(filters: DishFilters = {}) {
  return findDishes(filters);
}

export async function getDishById(id: number) {
  return findDishById(id);
}