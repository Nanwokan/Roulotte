// schemas/common.schema.ts
import { z } from "zod";

// "12" -> 12 ; refuse "abc", "1e2", " 5 ", "-3", "1.5" et les tableaux (?page=1&page=2)
const intString = z.string().regex(/^\d+$/, "Doit être un entier");

// parameters.Id : entier >= 1
export const idParamSchema = z.object({
  id: intString.transform(Number).pipe(z.number().min(1, "Doit être strictement positif")),
});

// parameters.Page + parameters.PageSize (défauts 1 et 20, pageSize max 50)
export const paginationQuerySchema = z.object({
  page: intString
    .transform(Number)
    .pipe(z.number().min(1, "Doit être >= 1"))
    .optional()
    .transform((v) => v ?? 1),
  pageSize: intString
    .transform(Number)
    .pipe(z.number().min(1, "Doit être >= 1").max(50, "Doit être <= 50"))
    .optional()
    .transform((v) => v ?? 20),
});

// transforme une erreur zod en `details` du contrat : [{ path, message }]
export function zodDetails(error: z.ZodError) {
  return error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
}