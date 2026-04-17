import { ErrorHandler } from "../../../config/http";
import { ProductRepository } from "../../../repositories/module";

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
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new ErrorHandler("Failed to fetch products from external API", 502);
    }

    const externalProducts: {
      id: number;
      title: string;
      price: number;
      description: string;
    }[] = await response.json();

    const mapped = externalProducts.map(p => ({
      external_id: p.id,
      name: p.title,
      price: String(p.price),
      stock: 0,
      description: p.description || null,
    }));

    await ProductRepository.bulkUpsert(mapped);

    return { synced: mapped.length };
  },
};

export default productService;
