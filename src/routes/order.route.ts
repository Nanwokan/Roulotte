// routes/orders.routes.ts
import type { Express } from "express";
import { createOrder, updateStatusOrder, getOrders, getOrderById, paymentOrder } from "../controllers/orders.controller.js";
import type { Auth } from "../fourni/auth/auth.js";

export default (app: Express, auth:Auth) => {
  app.post("/orders", auth.requireAuth, createOrder);
  app.patch("/orders/:id/status", auth.requireAuth, auth.requireRole("ADMIN", "STAFF"), updateStatusOrder);
  // app.post("/orders/:id/payment", auth.requireAuth, paymentOrder)
  app.get("/orders", auth.requireAuth, getOrders);
  app.get("/orders/:id", auth.requireAuth, getOrderById);
};