// services/allergens.service.ts
import { findAllAllergens } from "../repositories/allergens.repository.js";

export async function getAllAllergens() {
  return findAllAllergens();
}