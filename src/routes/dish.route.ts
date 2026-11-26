import type { Express } from "express";
import { getDishes, getDish, createDish, updateDish, deleteDish } from "../controllers/dishes.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

export default (app: Express) => {
  app.get("/dishes", getDishes);
  app.get("/dishes/:id", getDish);

  app.post("/dishes", requireAuth, requireRole("ADMIN"), createDish);
  app.patch("/dishes/:id", requireAuth, requireRole("ADMIN"), updateDish);
  app.put("/dishes/:id/image", requireAuth, requireRole("ADMIN"))
  app.delete("/dishes/:id", requireAuth, requireRole("ADMIN"), deleteDish);
};