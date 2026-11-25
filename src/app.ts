import express from "express";
import { authErrorHandler, installSecurity } from "./fourni/auth/index.js";
import { config } from "dotenv";

export function CreateApp() {
  config();
  const app = express();

  installSecurity(app, { corsOrigin: process.env.CORS_ORIGIN }); // AVANT les routes
  app.use(express.json());
  // … vos routes …
  app.use(authErrorHandler); // juste AVANT votre propre gestionnaire d'erreurs

  app.use(express.json());
  return app;
}
