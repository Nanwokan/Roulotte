// services/categories.service.ts
import { findAllCategories } from "../repositories/categories.repository.js";

export async function getAllCategories() {
  return findAllCategories();
}