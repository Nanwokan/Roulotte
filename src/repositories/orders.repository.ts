// repositories/orders.repository.ts
import { prisma } from "../lib/prisma.js";

const orderInclude = {
  user: { select: { id: true, name: true } },
  orderItems: { include: { dish: { select: { name: true } } } },
};

export function findDishesByIds(ids: number[]) {
  return prisma.dish.findMany({ where: { id: { in: ids } } });
}

// create imbriqué = une seule transaction (tout ou rien)
export function createOrder(data: {
  userId: number;
  note: string | null;
  totalCents: number;
  lines: { dishId: number; quantity: number; unitPriceCents: number }[];
}) {
  return prisma.order.create({
    data: {
      userId: data.userId,
      note: data.note,
      totalCents: data.totalCents,
      status: "RECEIVED",
      paymentStatus: "UNPAID",
      orderItems: { create: data.lines },
    },
    include: orderInclude,
  });
}

export async function findOrders(params: {
  where: object;
  newestFirst: boolean;
  skip: number;
  take: number;
}) {
  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      where: params.where,
      include: orderInclude,
      orderBy: { createdAt: params.newestFirst ? "desc" : "asc" },
      skip: params.skip,
      take: params.take,
    }),
    prisma.order.count({ where: params.where }),
  ]);
  return { items, total };
}

export function findOrderById(id: number) {
  return prisma.order.findUnique({ where: { id }, include: orderInclude });
}