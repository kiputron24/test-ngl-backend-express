import { eq, like, sql, asc, desc, and, isNull, AnyColumn } from "drizzle-orm";
import db from "../../../database/connection";
import { products } from "../../../database/schema";

interface FindAllParams {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: string;
}

const productRepository = {
  findAll: async ({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  }: FindAllParams) => {
    const offset = (page - 1) * limit;

    const columnMap: Record<string, AnyColumn> = {
      id: products.id,
      name: products.name,
      price: products.price,
      stock: products.stock,
    };
    const sortColumn = columnMap[sortBy] ?? products.id;
    const order = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

    const notDeleted = isNull(products.deleted_at);
    const where = search
      ? and(notDeleted, like(products.name, `%${search}%`))
      : notDeleted;

    const [data, total] = await Promise.all([
      db
        .select()
        .from(products)
        .where(where)
        .orderBy(order)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(where),
    ]);

    return {
      items: data,
      pagination: {
        total: total[0].count,
        page,
        limit,
        totalPages: Math.ceil(total[0].count / limit),
      },
    };
  },

  findById: async (id: number) => {
    const result = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), isNull(products.deleted_at)));
    return result[0] || null;
  },

  create: async (data: {
    name: string;
    price: string;
    stock: number;
    description?: string | null;
  }) => {
    const result = await db.insert(products).values(data);
    return result[0].insertId;
  },

  update: async (
    id: number,
    data: Partial<{
      name: string;
      price: string;
      stock: number;
      description: string | null;
    }>
  ) => {
    await db.update(products).set(data).where(eq(products.id, id));
  },

  delete: async (id: number) => {
    await db
      .update(products)
      .set({ deleted_at: sql`NOW()` })
      .where(eq(products.id, id));
  },

  bulkCreate: async (
    data: {
      name: string;
      price: string;
      stock: number;
      description?: string | null;
    }[]
  ) => {
    if (data.length === 0) return;
    await db.insert(products).values(data);
  },

  bulkUpsert: async (
    data: {
      external_id: number;
      name: string;
      price: string;
      stock: number;
      description?: string | null;
    }[]
  ) => {
    if (data.length === 0) return;
    for (const item of data) {
      const existing = await db
        .select()
        .from(products)
        .where(eq(products.external_id, item.external_id));

      if (existing.length > 0) {
        await db
          .update(products)
          .set({
            name: item.name,
            price: item.price,
            description: item.description,
            deleted_at: null,
          })
          .where(eq(products.external_id, item.external_id));
      } else {
        await db.insert(products).values(item);
      }
    }
  },
};

export default productRepository;
