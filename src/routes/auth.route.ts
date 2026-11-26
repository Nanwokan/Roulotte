import  {Router, type Express } from "express";
import { login, me, register } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export default (app: Express) => {
     const router = Router();

    router.post("/login", login);
    router.post("/register", register);
    router.get("/me", requireAuth, me);

    app.use("/auth", router);
}