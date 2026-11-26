// services/orders.service.ts
import { HttpError } from "../utils/http-error.js";
import {
  findDishesByIds,
  createOrder,
  findOrders,
  findOrderById,
} from "../repositories/orders.repository.js";

type Role = "CUSTOMER" | "STAFF" | "ADMIN";

function toOrderResponse(o: any) {
  return {
    id: o.id,
    status: o.status,
    note: o.note ?? null,
    totalCents: o.totalCents,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    paymentStatus: o.paymentStatus,
    customer: { id: o.user.id, name: o.user.name },
    items: o.orderItems.map((i: any) => ({
      dishId: i.dishId,
      name: i.dish.name,
      quantity: i.quantity,
      unitPriceCents: i.unitPriceCents,
      lineTotalCents: i.quantity * i.unitPriceCents,
    })),
  };
}

export async function placeOrder(
  userId: number,
  items: { dishId: number; quantity: number }[],
  note?: string,
) {
  const dishes = await findDishesByIds(items.map((i) => i.dishId));
  const byId = new Map(dishes.map((d) => [d.id, d]));

  // plat inexistant ou indisponible -> 422
  const problems: { dishId: number; reason: "NOT_FOUND" | "UNAVAILABLE" }[] = [];
  for (const item of items) {
    const dish = byId.get(item.dishId);
    if (!dish) problems.push({ dishId: item.dishId, reason: "NOT_FOUND" });
    else if (!dish.available) problems.push({ dishId: item.dishId, reason: "UNAVAILABLE" });
  }
  if (problems.length > 0) {
    throw new HttpError(422, "DISH_UNAVAILABLE", "Certains plats ne sont pas disponibles", problems);
  }

  // les prix viennent de la base, jamais du client
  const lines = items.map((i) => ({
    dishId: i.dishId,
    quantity: i.quantity,
    unitPriceCents: byId.get(i.dishId)!.priceCents,
  }));
  const totalCents = lines.reduce((sum, l) => sum + l.quantity * l.unitPriceCents, 0);

  const order = await createOrder({ userId, note: note ?? null, totalCents, lines });
  return toOrderResponse(order);
}

export async function listOrders(
  user: { id: number; role: Role },
  q: { statuses?: string[]; newestFirst: boolean; page: number; pageSize: number },
) {
  const where = {
    // CUSTOMER : uniquement ses commandes
    ...(user.role === "CUSTOMER" && { userId: user.id }),
    ...(q.statuses && { status: { in: q.statuses } }),
  };

  const { items, total } = await findOrders({
    where,
    newestFirst: q.newestFirst,
    skip: (q.page - 1) * q.pageSize,
    take: q.pageSize,
  });

  return { items: items.map(toOrderResponse), total, page: q.page, pageSize: q.pageSize };
}

export async function getOrder(id: number, user: { id: number; role: Role }) {
  const order = await findOrderById(id);
  // commande d'un autre client -> 404 (on ne révèle pas qu'elle existe)
  if (!order || (user.role === "CUSTOMER" && order.userId !== user.id)) {
    throw new HttpError(404, "NOT_FOUND", "Commande introuvable");
  }
  return toOrderResponse(order);
}