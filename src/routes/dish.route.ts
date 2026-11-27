import type { Express } from "express";
import { getDishes, getDish, createDish, updateDish, deleteDish } from "../controllers/dishes.controller.js";
import type { Auth } from "../fourni/auth/auth.js";

export default (app: Express, auth:Auth) => {
  app.get("/dishes", getDishes);
  app.get("/dishes/:id", getDish);

  app.post("/dishes", auth.requireAuth, auth.requireRole("ADMIN"), createDish);
  app.patch("/dishes/:id", auth.requireAuth, auth.requireRole("ADMIN"), updateDish);
  app.put("/dishes/:id/image", auth.requireAuth, auth.requireRole("ADMIN"))
  app.delete("/dishes/:id", auth.requireAuth, auth.requireRole("ADMIN"), deleteDish);
};