import express from "express";
import { validate } from "../middlewares/validate.js";
import {
  ResturantSchema,
  ResturantDetailsSchema,
} from "../schemas/restaurants.js";
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

router.get("/", ResturantController.getRestaurants);

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

//delete Review
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

//add restaurant Details
router.post(
  "/:restaurantId/details",
  checkRestaurantExists,
  validate(ResturantDetailsSchema),
  ResturantController.addRestDetails
);

export default router;
