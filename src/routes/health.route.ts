import type { Express } from "express";
import { prisma } from "../lib/prisma.js"

export default (app: Express) => {
  app.get("/health", async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ status: "ok", database: "up" });
    } catch {
      res.status(503).json({ status: "degraded", database: "down" });
    }
  });
};
