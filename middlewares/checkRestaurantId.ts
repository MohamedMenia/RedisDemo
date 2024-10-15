import type { Request, Response, NextFunction } from "express";
import { initRedisClient } from "../utils/client.js";
import { restaurantKeyById } from "../utils/keys.js";
import { errorResponse } from "../utils/responses.js";

export const checkRestaurantExists = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { restaurantId } = req.params;
  if (!restaurantId) {
    return errorResponse(res, 400, "Restaurant ID is required");
  }
  try {
    const restaurantKey = restaurantKeyById(restaurantId);
    const exists = await req.redis.exists(restaurantKey);
    if (!exists) {
      return errorResponse(res, 404, "Restaurant not found");
    }

    next();
  } catch (err) {
    next(err);
  }
};
