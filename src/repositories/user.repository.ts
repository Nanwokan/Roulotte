// repositories/user.repository.ts
import { prisma } from "../lib/prisma.js";
import type { AuthUserStore } from "../fourni/auth/auth.js";

export const userRepository: AuthUserStore = {
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  findById: (id) => prisma.user.findUnique({ where: { id } }),
  create: (data) => prisma.user.create({ data }),
}