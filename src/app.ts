import express from "express";
import { authErrorHandler, AuthHttpError, installSecurity } from "./fourni/auth/index.js";
import { config } from "dotenv";
import registerRoutes from "./routes/index.js";

export function CreateApp() {
  config();
  const app = express();

  installSecurity(app, { corsOrigin: process.env.CORS_ORIGIN }); // AVANT les routes
  app.use(express.json());
  registerRoutes(app); // les routes

  app.use((req,res) => {
    throw new AuthHttpError(404, "NOT_FOUND", "Route introuvable")
  }); 

  app.use(authErrorHandler);

  return app;
}
