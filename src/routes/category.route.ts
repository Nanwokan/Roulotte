import type { Express } from "express";
import { getCategories } from "../controllers/categories.controller.js";

export default (app: Express) => {
    app.get("/categories", getCategories)
}