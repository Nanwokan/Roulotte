import type { Express } from "express";
import { getDishes, getDish } from "../controllers/dishes.controller.js";

export default (app: Express) => {
  app.get("/dishes", getDishes);
  app.get("/dishes/:id", getDish);
};