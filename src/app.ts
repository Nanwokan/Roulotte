import express from "express";
import { authErrorHandler, installSecurity } from "./fourni/auth/index.js";
import { config } from "dotenv";
import registerRoutes from "./routes/index.js";

export function CreateApp() {
  config();
  const app = express();

  installSecurity(app, { corsOrigin: process.env.CORS_ORIGIN }); // AVANT les routes
  app.use(express.json());
  registerRoutes(app); // les routes

  // … vos routes …
  app.use(authErrorHandler); // juste AVANT votre propre gestionnaire d'erreurs

  return app;
}
