import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  price: z
    .number({ message: "Price must be a number" })
    .positive("Price must be positive"),
  stock: z
    .number({ message: "Stock must be a number" })
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .default(0),
  description: z.string().nullable().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255).optional(),
  price: z
    .number({ message: "Price must be a number" })
    .positive("Price must be positive")
    .optional(),
  stock: z
    .number({ message: "Stock must be a number" })
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .optional(),
  description: z.string().nullable().optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().default(""),
  sortBy: z.enum(["id", "name", "price", "stock", "created_at"]).default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const productParamSchema = z.object({
  id: z.coerce.number().int().positive("Invalid product ID"),
});
