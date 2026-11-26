import z from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Nom requis"),  
  email: z.string().trim().toLowerCase().min(1, "Email requis"),
  password: z.string().min(1, "Mot de passe requis"),
  role: z.enum(["ADMIN", "STAFF", "CUSTOMER"]).optional().default("CUSTOMER"),
});