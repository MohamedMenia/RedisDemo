import express from "express";
import { validate } from "../middlewares/validate.js";
import { ResturantSchema } from "../schemas/restaurants.js";
import { checkRestaurantExists } from "../middlewares/checkRestaurantId.js";
import * as ResturantController from "../controllers/restaurant.controller.js";
import { ReviewSchema } from "../schemas/review.js";
const router = express.Router();

//create a new restaurant
router.post(
  "/",
  validate(ResturantSchema),
  ResturantController.createRestaurant
);

//create a new review
router.post(
  "/:restaurantId/reviews",
  checkRestaurantExists,
  validate(ReviewSchema),
  ResturantController.createReview
);

//get restaurant's reviews
router.get(
  "/:restaurantId/reviews",
  checkRestaurantExists,
  ResturantController.getReviews
);
router.delete(
  "/:restaurantId/reviews/:reviewId",
  checkRestaurantExists,
  ResturantController.ReviewDelete
);

//get Restaurant By Id
router.get(
  "/:restaurantId",
  checkRestaurantExists,
  ResturantController.getRestaurantById
);

export default router;
