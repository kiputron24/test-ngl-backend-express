import { chromium } from "playwright";
import { ErrorHandler } from "../../../config/http";

export interface ScrapProduct {
  name: string;
  price: number;
  priceFormatted: string;
  link: string;
}

interface ShopeeItemBasic {
  name: string;
  price: number;
  price_min?: number;
  itemid: number;
  shopid: number;
}

interface ShopeeItem {
  item_basic: ShopeeItemBasic;
}

const scrapService = {
  scrapeShopee: async (keyword: string): Promise<ScrapProduct[]> => {
    if (!keyword || keyword.trim() === "") {
      throw new ErrorHandler("Keyword is required", 400);
    }

    let browser = null;
    let context = null;
    let page = null;

    try {
      browser = await chromium.launch({
        headless: true,
        args: [
          "--disable-blink-features=AutomationControlled",
          "--disable-dev-shm-usage",
          "--no-sandbox",
          "--disable-gpu",
        ],
      });

      context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        locale: "id-ID",
        viewport: { width: 1920, height: 1080 },
      });

      page = await context.newPage();
      const products: ScrapProduct[] = [];

      page.on("response", (response: any) => {
        const url = response.url();
        if (url.includes("search_items") && response.status() === 200) {
          response
            .json()
            .then((json: any) => {
              const items: ShopeeItem[] = json?.items ?? [];
              for (const item of items) {
                const basic = item.item_basic;
                if (!basic) continue;
                const rawPrice = basic.price_min ?? basic.price;
                const price = Math.round(rawPrice / 100000);
                const link = `https://shopee.co.id/product/${basic.shopid}/${basic.itemid}`;
                if (basic.name && price > 0) {
                  products.push({
                    name: basic.name,
                    price,
                    priceFormatted: `Rp ${price.toLocaleString("id-ID")}`,
                    link,
                  });
                }
              }
            })
            .catch(() => {});
        }
      });

      const searchUrl = `https://shopee.co.id/search?keyword=${encodeURIComponent(keyword.trim())}`;

      try {
        await page.goto(searchUrl, {
          waitUntil: "domcontentloaded",
          timeout: 15000,
        });
      } catch (err) {}

      await new Promise(resolve => setTimeout(resolve, 5000));

      try {
        if (page && !page.isClosed()) {
          await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight * 2);
          });

          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch {}

      const sorted = products.sort((a, b) => a.price - b.price).slice(0, 3);

      if (sorted.length === 0) {
        throw new ErrorHandler(
          "No products found - Shopee may have blocked with CAPTCHA",
          503
        );
      }

      return sorted;
    } catch (err) {
      if (err instanceof ErrorHandler) {
        throw err;
      }
      throw new ErrorHandler(
        (err as Error).message || "Error during scraping",
        500
      );
    } finally {
      if (page) {
        try {
          page.removeAllListeners();
          await page.close();
        } catch {}
      }

      if (context) {
        try {
          await context.close();
        } catch {}
      }

      if (browser) {
        try {
          await browser.close();
        } catch {}
      }
    }
  },
};

export default scrapService;
