import axios from "axios";
import { ErrorHandler } from "../../../config/http";
import { ProductRepository } from "../../../repositories/module";

interface ExternalProduct {
  id: number;
  title: string;
  price: number;
  description: string;
}

const productService = {
  getAll: async (query: {
    page?: string | number;
    limit?: string | number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const search = (query.search as string) || "";
    const sortBy = (query.sortBy as string) || "id";
    const sortOrder = (query.sortOrder as string) || "desc";

    return ProductRepository.findAll({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    });
  },

  getById: async (id: number) => {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }
    return product;
  },

  create: async (data: {
    name: string;
    price: string;
    stock: number;
    description?: string | null;
  }) => {
    const insertId = await ProductRepository.create(data);
    return ProductRepository.findById(insertId);
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
    await productService.getById(id);
    await ProductRepository.update(id, data);
    return ProductRepository.findById(id);
  },

  delete: async (id: number) => {
    await productService.getById(id);
    await ProductRepository.delete(id);
  },

  syncFromExternalApi: async () => {
    try {
      const { data: externalProducts } = await axios.get<ExternalProduct[]>(
        "https://fakestoreapi.com/products"
      );

      const mapped = externalProducts.map((p: ExternalProduct) => ({
        external_id: p.id,
        name: p.title,
        price: String(p.price),
        stock: 0,
        description: p.description || null,
      }));

      await ProductRepository.bulkUpsert(mapped);

      return { synced: mapped.length };
    } catch (error) {
      throw new ErrorHandler("Failed to fetch products from external API", 502);
    }
  },
};

export default productService;
