import type { Express } from "express";
import healthRoute from "./health.route.js";
import categoryRoute from "./category.route.js";
import allergenRoute from "./allergen.route.js";
import dishRoute from "./dish.route.js";
import orderRoute from "./order.route.js";
import type { Auth } from "../fourni/auth/auth.js";

export default (app: Express, auth:Auth) => {
  healthRoute(app);
  categoryRoute(app);
  allergenRoute(app);
  dishRoute(app, auth);
  orderRoute(app, auth);
};
