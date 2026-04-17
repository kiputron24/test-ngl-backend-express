import express from "express";
import ScrapController from "../../../controllers/module/scrap/scrap.controller";

const route = express.Router();

export default function ScrapRouter() {
  route.get("/", ScrapController.scrapeShopee);

  return route;
}
