import { getAllDishes } from  "../services/dishes.service.js";
import {getPagination} from "../services/pagination.service.js"
export async function getDishes(req, res) {
  try {
    const dishes = await getAllDishes();
    const pagination = getPagination(dishes)
    res.status(200).json(pagination);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
}