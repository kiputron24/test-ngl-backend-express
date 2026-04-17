import express from "express";
import ProductRouter from "./module/product/product.route";

const route = express.Router();

export default function router() {
  route.use("ping", (req, res) => {
    res.status(200).json({
      status: "success",
      message: "pong",
    });
  });

  route.use("/products", ProductRouter());

  return route;
}
