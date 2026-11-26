import type { Express } from "express";
import {getDishes} from "../controllers/dishes.controller.js"
export default (app: Express) => {
    app.get("/dishes", getDishes )
}