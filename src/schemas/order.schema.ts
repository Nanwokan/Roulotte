import z from "zod";

const STATUSES = ["RECEIVED", "PREPARING", "READY", "PICKED_UP", "CANCELLED"];

export const orderUpdateSchema = z.object({
  status: z.enum(STATUSES).optional(),
})