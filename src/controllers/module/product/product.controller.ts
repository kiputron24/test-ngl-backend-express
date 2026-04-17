import { Request, Response, NextFunction } from "express";
import { ErrorHandler, httpResponse } from "../../../config/http";
import { ProductService } from "../../../services/module";

export default {
  all: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductService.getAll(req.query);
      httpResponse(res, "success", "Products retrieved successfully", result);
    } catch (err) {
      if (err instanceof ErrorHandler) {
        next(new ErrorHandler(err.message, err.status, err.data));
      } else {
        next(
          new ErrorHandler(
            (err as Error).message || "Internal Server Error",
            500
          )
        );
      }
    }
  },

  show: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const product = await ProductService.getById(id);
      httpResponse(res, "success", "Product retrieved successfully", product);
    } catch (err) {
      if (err instanceof ErrorHandler) {
        next(new ErrorHandler(err.message, err.status, err.data));
      } else {
        next(
          new ErrorHandler(
            (err as Error).message || "Internal Server Error",
            500
          )
        );
      }
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await ProductService.create(req.body);
      httpResponse(
        res,
        "success",
        "Product created successfully",
        product,
        201
      );
    } catch (err) {
      if (err instanceof ErrorHandler) {
        next(new ErrorHandler(err.message, err.status, err.data));
      } else {
        next(
          new ErrorHandler(
            (err as Error).message || "Internal Server Error",
            500
          )
        );
      }
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const product = await ProductService.update(id, req.body);
      httpResponse(res, "success", "Product updated successfully", product);
    } catch (err) {
      if (err instanceof ErrorHandler) {
        next(new ErrorHandler(err.message, err.status, err.data));
      } else {
        next(
          new ErrorHandler(
            (err as Error).message || "Internal Server Error",
            500
          )
        );
      }
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await ProductService.delete(id);
      httpResponse(res, "success", "Product deleted successfully");
    } catch (err) {
      if (err instanceof ErrorHandler) {
        next(new ErrorHandler(err.message, err.status, err.data));
      } else {
        next(
          new ErrorHandler(
            (err as Error).message || "Internal Server Error",
            500
          )
        );
      }
    }
  },

  sync: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ProductService.syncFromExternalApi();
      httpResponse(res, "success", "Products synced successfully", result, 201);
    } catch (err) {
      if (err instanceof ErrorHandler) {
        next(new ErrorHandler(err.message, err.status, err.data));
      } else {
        next(
          new ErrorHandler(
            (err as Error).message || "Internal Server Error",
            500
          )
        );
      }
    }
  },
};
