import { getAllAllergens } from "../services/allergens.service.js";

export async function getAllergens(req, res) {
  try {
    const allergens = await getAllAllergens();
    res.status(200).json(allergens);
  } catch (error) {
    console.error("Error fetching allergens:", error);
    res.status(500).json({ error: "Failed to fetch allergens" });
  }
}