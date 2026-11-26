import type { Express } from "express";
import { getAllergens } from "../controllers/allergens.controller.js";

export default (app: Express) => {
    app.get("/allergens", getAllergens)
}