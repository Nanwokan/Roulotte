import z from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Email requis"),
  password: z.string().min(1, "Mot de passe requis"),
});