import type { Express } from "express";

export default (app: Express) => {
    app.get("/dishes", (req, res) => {
        res.status(200).json();
    })

    app.get("/dishes", (req, res) => {
        res.status(200).json();
    })
}