// repositories/user.repository.ts
import { prisma } from "../lib/prisma.js";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export function createUser(data: { name: string; email: string; passwordHash: string }) {
  return prisma.user.create({ data });
}