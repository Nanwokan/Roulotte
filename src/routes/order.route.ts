// routes/orders.routes.ts
import type { Express } from "express";
import { createOrder, updateStatusOrder, getOrders, getOrderById, paymentOrder } from "../controllers/orders.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js"; 

export default (app: Express) => {
  app.post("/orders", requireAuth, createOrder);
  app.patch("/orders/:id/status", requireAuth, requireRole("ADMIN"), updateStatusOrder);
  app.post("/orders/:id/payment", paymentOrder)
  app.get("/orders", requireAuth, getOrders);
  app.get("/orders/:id", requireAuth, getOrderById);
};