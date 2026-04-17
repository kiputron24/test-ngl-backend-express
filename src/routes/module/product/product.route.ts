import express from "express";
import { ProductController } from "../../../controllers";
import validate from "../../../middleware/validate";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  productParamSchema,
} from "../../../validation/product.validation";

const route = express.Router();

export default function ProductRouter() {
  route.get("/", validate(productQuerySchema, "query"), ProductController.all);
  route.get(
    "/:id",
    validate(productParamSchema, "params"),
    ProductController.show
  );
  route.post(
    "/",
    validate(createProductSchema, "body"),
    ProductController.create
  );
  route.put(
    "/:id",
    validate(productParamSchema, "params"),
    validate(updateProductSchema, "body"),
    ProductController.update
  );
  route.delete(
    "/:id",
    validate(productParamSchema, "params"),
    ProductController.delete
  );

  route.post("/sync", ProductController.sync);

  return route;
}
