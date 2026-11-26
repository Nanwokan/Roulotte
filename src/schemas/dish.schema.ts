import z from "zod";

export const dishSchema = z.strictObject({
  name: z.string().min(2).max(80),
  description: z.string().max(300).default(""),
  priceCents: z.int().min(50).max(10000),
  categoryId: z.int(),
  allergens: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  stock: z.int().min(0).nullable().default(null),
});