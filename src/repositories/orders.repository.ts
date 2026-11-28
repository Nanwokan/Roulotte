// repositories/orders.repository.ts
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/http-error.js";
const orderInclude = {
  user: { select: { id: true, name: true } },
  orderItems: { include: { dish: { select: { name: true } } } },
};

export function findDishesByIds(ids: number[]) {
  return prisma.dish.findMany({ where: { id: { in: ids } } });
}


export function createOrder(data: {
  userId: number;
  note: string | null;
  totalCents: number;
  lines: { dishId: number; quantity: number; unitPriceCents: number }[];
}) {
  return prisma.$transaction(async (tx) => {
    const shortages: { dishId: number; available: number }[] = [];

    for (const line of data.lines) {
      const dish = await tx.dish.findUnique({
        where: { id: line.dishId },
        select: { stock: true },
      });

      if (!dish || dish.stock === null) continue;

      const result = await tx.dish.updateMany({
        where: { id: line.dishId, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      });

      if (result.count === 0) {
        shortages.push({ dishId: line.dishId, available: dish.stock });
      }
    }

    // lever l'erreur dans la transaction = annulation de tous les décréments
    if (shortages.length > 0) {
      throw new HttpError(409, "OUT_OF_STOCK", "Stock insuffisant", shortages);
    }

    return tx.order.create({
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