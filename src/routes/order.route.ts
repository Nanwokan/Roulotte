// routes/orders.routes.ts
import type { Express } from "express";
import { createOrder, getOrders, getOrderById } from "../controllers/orders.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js"; // adapte le nom et le chemin

export default (app: Express) => {
  app.post("/orders", requireAuth, createOrder);
  app.get("/orders", requireAuth, getOrders);
  app.get("/orders/:id", requireAuth, getOrderById);
};