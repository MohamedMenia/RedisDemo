import type { Request, Response, NextFunction } from "express";
import { type TResturantSchema } from "../schemas/restaurants.js";
import { nanoid } from "nanoid";
import {
  restaurantKeyById,
  reviewKeyById,
  reviewDetailsKeyById,
  cuisineKey,
  restaurantCuisinesKeyById,
  cuisinesKey,
} from "../utils/keys.js";
import { errorResponse, successResponse } from "../utils/responses.js";
import type { TReviewSchema } from "../schemas/review.js";

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
    await Promise.all([
      req.redis.hSet(restaurantKey, hashData),
      ...data.cuisines.map((cuisine) =>
        Promise.all([
          req.redis.sAdd(cuisinesKey, cuisine),
          req.redis.sAdd(cuisineKey(cuisine), id),
          req.redis.sAdd(restaurantCuisinesKeyById(id), cuisine),
        ])
      ),
    ]);
    return successResponse(
      res,
      { ...hashData, cuisines: data.cuisines },
      "added new restaurant"
    );
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
    const [viewCount, restaurantData, cuisines] = await Promise.all([
      req.redis.hIncrBy(restaurantKey, "viewCount", 1),
      req.redis.hGetAll(restaurantKey),
      req.redis.sMembers(restaurantCuisinesKeyById(restaurantId)),
    ]);
    successResponse(res, {
      ...restaurantData,
      cuisines
    });
  } catch (err) {
    next(err);
  }
};

export const createReview = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;
  const data = req.body as TReviewSchema;
  try {
    const reviewId = nanoid();
    const reviewKey = reviewKeyById(restaurantId);
    const reviewDetailsKey = reviewDetailsKeyById(reviewId);
    const reviewData = {
      id: reviewId,
      review: data.review,
      rating: data.rating,
      timestamp: Date.now(),
    };
    await Promise.all([
      req.redis.lPush(reviewKey, reviewId),
      req.redis.hSet(reviewDetailsKey, reviewData),
    ]);
    return successResponse(res, reviewData, "review added successfully");
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);
  try {
    const reviewKey = reviewKeyById(restaurantId || "");
    const reviewsIds = await req.redis.lRange(reviewKey, start, end);
    const reviews = await Promise.all(
      reviewsIds.map(async (reviewId) => {
        const reviewDetailsKey = reviewDetailsKeyById(reviewId);
        const reviewData = await req.redis.hGetAll(reviewDetailsKey);
        return {
          ...reviewData,
          id: reviewId,
        };
      })
    );
    return successResponse(res, reviews);
  } catch (err) {
    next(err);
  }
};

export const ReviewDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId, reviewId } = req.params;
  if (!reviewId) {
    return next(new Error("Review ID is required"));
  }
  try {
    const reviewKey = reviewKeyById(restaurantId || "");
    const reviewDetailsKey = reviewDetailsKeyById(reviewId);
    const [removeResult, deleteResult] = await Promise.all([
      req.redis.lRem(reviewKey, 0, reviewId),
      req.redis.del(reviewDetailsKey),
    ]);
    if (removeResult === 0 || deleteResult === 0) {
      return errorResponse(res, 404, "Review not found");
    }
    return successResponse(res, reviewId, "Review deleted successfully");
  } catch (err) {
    next(err);
  }
};
