import type { Express } from "express";
import healthRoute from "./health.route.js";
import categoryRoute from "./category.route.js";
import allergenRoute from "./allergen.route.js";
import dishRoute from "./dish.route.js";

export default (app: Express) => {
  healthRoute(app);
  categoryRoute(app);
  allergenRoute(app);
  dishRoute(app);
};
