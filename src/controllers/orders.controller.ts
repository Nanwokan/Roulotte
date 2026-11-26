// controllers/orders.controller.ts
import type { Request, Response } from "express";
import { z } from "zod";
import { HttpError } from "../utils/http-error.js";
import { placeOrder, listOrders, getOrder } from "../services/orders.service.js";

const STATUSES = ["RECEIVED", "PREPARING", "READY", "PICKED_UP", "CANCELLED"];

const createOrderSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            dishId: z.number().int().min(1),
            quantity: z.number().int().min(1).max(10),
          })
          .strict(),
      )
      .min(1)
      .max(20)
      .refine((items) => new Set(items.map((i) => i.dishId)).size === items.length, {
        message: "Pas deux lignes pour le même plat",
      }),
    note: z.string().max(200).optional(),
  })
  .strict();

function validationError(res: Response, details: { path: string; message: string }[]) {
  return res.status(400).json({
    error: { code: "VALIDATION_ERROR", message: "Données invalides", details },
  });
}

function handleError(res: Response, error: unknown) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined && { details: error.details }),
      },
    });
  }
  console.error("Orders error:", error);
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Erreur interne du serveur" },
  });
}

export async function createOrder(req: Request, res: Response) {
  try {
    const result = createOrderSchema.safeParse(req.body);
    if (!result.success) {
      return validationError(
        res,
        result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      );
    }

    const order = await placeOrder(req.user.id, result.data.items, result.data.note);
    return res.status(201).location(`/orders/${order.id}`).json(order);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    const { status, sort, page, pageSize } = req.query;
    const details: { path: string; message: string }[] = [];

    let statuses: string[] | undefined;
    if (status !== undefined) {
      statuses =
        typeof status === "string" ? status.split(",").map((s) => s.trim()) : [];
      if (statuses.length === 0 || !statuses.every((s) => STATUSES.includes(s))) {
        details.push({ path: "status", message: `Valeurs possibles : ${STATUSES.join(", ")}` });
      }
    }

    if (sort !== undefined && sort !== "createdAt" && sort !== "-createdAt") {
      details.push({ path: "sort", message: "Doit valoir 'createdAt' ou '-createdAt'" });
    }

    const pageNum = page === undefined ? 1 : typeof page === "string" ? Number(page) : NaN;
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      details.push({ path: "page", message: "Doit être un entier >= 1" });
    }

    const pageSizeNum =
      pageSize === undefined ? 20 : typeof pageSize === "string" ? Number(pageSize) : NaN;
    if (!Number.isInteger(pageSizeNum) || pageSizeNum < 1 || pageSizeNum > 50) {
      details.push({ path: "pageSize", message: "Doit être un entier entre 1 et 50" });
    }

    if (details.length > 0) return validationError(res, details);

    const result = await listOrders(req.user, {
      statuses,
      newestFirst: sort !== "createdAt",
      page: pageNum,
      pageSize: pageSizeNum,
    });
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return validationError(res, [
        { path: "id", message: "Doit être un entier strictement positif" },
      ]);
    }

    const order = await getOrder(Number(id), req.user);
    return res.status(200).json(order);
  } catch (error) {
    return handleError(res, error);
  }
}