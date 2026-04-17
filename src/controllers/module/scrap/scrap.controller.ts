import { Request, Response, NextFunction } from "express";
import { ErrorHandler, httpResponse } from "../../../config/http";
import scrapService from "../../../services/module/scrap/scrap.service";

export default {
  scrapeShopee: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const keyword = req.query.keyword as string;
      const products = await scrapService.scrapeShopee(keyword);
      httpResponse(
        res,
        "success",
        `Top 3 cheapest products for "${keyword}"`,
        products
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
};
