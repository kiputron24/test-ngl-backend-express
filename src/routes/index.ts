import express from "express";
import ProductRouter from "./module/product/product.route";
import ScrapRouter from "./module/scrap/scrap.route";

const route = express.Router();

export default function router() {
  route.use("ping", (req, res) => {
    res.status(200).json({
      status: "success",
      message: "pong",
    });
  });

  route.use("/products", ProductRouter());
  route.use("/scrap", ScrapRouter());

  return route;
}
