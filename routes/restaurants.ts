import express, { type Request } from "express";
import { validate } from "../middlewares/validate.js";
import {
  ResturantSchema,
  type TResturantSchema,
} from "../schemas/restaurants.js";
import { initRedisClient } from "../utils/client.js";
import { nanoid } from "nanoid";
import { restaurantKeyById } from "../utils/keys.js";
import { successResponse } from "../utils/responses.js";
import { checkRestaurantExists } from "../middlewares/checkRestaurantId.js";
import { promise } from "zod";
const router = express.Router();

router.post("/", validate(ResturantSchema), async (req, res, next) => {
  const data = req.body as TResturantSchema;
  try {
    const client = await initRedisClient();
    const id = nanoid();
    const restaurantKey = restaurantKeyById(id);
    const hashData = { id, name: data.name, location: data.location };
    const addResult = await client.hSet(restaurantKey, hashData);
    console.log(`Added${addResult} to restaurant`);
    return successResponse(res, hashData, "added new restaurant");
  } catch (err) {
    next(err);
  }
  res.send("Restaurants");
});

router.get(
  "/:restaurantId",
  checkRestaurantExists,
  async (req: Request<{ restaurantId: string }>, res, next): Promise<any> => {
    const { restaurantId } = req.params;
    try {
      const client = await initRedisClient();
      const restaurantKey = restaurantKeyById(restaurantId);
      const [viewCount, restaurantData] = await Promise.all([
        client.hIncrBy(restaurantKey, "viewCount", 1),
        client.hGetAll(restaurantKey),
      ]);
      successResponse(res, restaurantData);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
