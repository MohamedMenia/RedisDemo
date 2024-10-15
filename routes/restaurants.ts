import express from "express";
import { validate } from "../middlewares/validate.js";
import { ResturantSchema } from "../schemas/restaurants.js";
import { checkRestaurantExists } from "../middlewares/checkRestaurantId.js";
import * as ResturantController from "../controllers/restaurant.controller.js";
const router = express.Router();

router.post(
  "/",
  validate(ResturantSchema),
  ResturantController.createRestaurant
);

router.get(
  "/:restaurantId",
  checkRestaurantExists,
  ResturantController.getRestaurantById
);

export default router;
