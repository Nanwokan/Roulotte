import express from "express";
import { authErrorHandler, AuthHttpError, installSecurity } from "./fourni/auth/index.js";
import { config } from "dotenv";
import registerRoutes from "./routes/index.js";
import { createContainer } from "./container.js";
import { notFound } from "./middlewares/not-found.middleware.js";

export function CreateApp() {
  config();
  const container = createContainer()
  const app = express();

  installSecurity(app, { corsOrigin: process.env.CORS_ORIGIN }); // AVANT les routes

  app.use("/auth", container.auth.router);
  registerRoutes(app, container.auth); // les routes

  app.use(authErrorHandler);
  app.use(notFound);
  return app;
}
