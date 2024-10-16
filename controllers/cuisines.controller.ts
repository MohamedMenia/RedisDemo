import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { successResponse } from "../utils/responses.js";
import { cuisineKey, cuisinesKey, restaurantKeyById } from "../utils/keys.js";

export const getCuisines = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cuisines = await req.redis.sMembers(cuisinesKey);
    successResponse(res, cuisines);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getCuisine = async (
  req: Request<{ cuisine: string }>,
  res: Response,
  next: NextFunction
) => {
  const { cuisine } = req.params;
  try {
    const restaurantIds = await req.redis.sMembers(cuisineKey(cuisine));
    const restaurants = await Promise.all([
      ...restaurantIds.map((id) => {
        return  req.redis.hGet(restaurantKeyById(id),"name");
      }),
    ]);
    successResponse(res, restaurants);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
