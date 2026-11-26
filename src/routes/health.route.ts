import type { Express } from "express";

export default (app: Express) => {
    app.get("/health", (req, res) => {
        res.status(200).json({ status: "ok" });
    })
}