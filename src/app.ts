import express from "express";
import { authErrorHandler, installSecurity } from "./fourni/auth/index.js";
import { config } from "dotenv";

installSecurity(app, { corsOrigin: config.CORS_ORIGIN }); // AVANT les routes
app.use("/auth", container.auth.router);
// … vos routes …
app.use(authErrorHandler); // juste AVANT votre propre gestionnaire d'erreurs
app.use(errorHandler);

export function CreateApp() {
    const app = express();
    
    app.use(express.json());
    return app;
}