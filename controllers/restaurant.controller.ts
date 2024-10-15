import type { Request, Response, NextFunction } from "express";
import { type TResturantSchema } from "../schemas/restaurants.js";
import { nanoid } from "nanoid";
import { restaurantKeyById } from "../utils/keys.js";
import { successResponse } from "../utils/responses.js";

export const createRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as TResturantSchema;
  try {
    const id = nanoid();
    const restaurantKey = restaurantKeyById(id);
    const hashData = { id, name: data.name, location: data.location };
    const addResult = await req.redis.hSet(restaurantKey, hashData);
    console.log(`Added${addResult} to restaurant`);
    return successResponse(res, hashData, "added new restaurant");
  } catch (err) {
    next(err);
  }
  res.send("Restaurants");
};

export const getRestaurantById = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;
  try {
    const restaurantKey = restaurantKeyById(restaurantId);
    const [viewCount, restaurantData] = await Promise.all([
        req.redis.hIncrBy(restaurantKey, "viewCount", 1),
        req.redis.hGetAll(restaurantKey),
    ]);
    successResponse(res, restaurantData);
  } catch (err) {
    next(err);
  }
};
