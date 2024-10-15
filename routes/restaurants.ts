import express from "express";
import { validate } from "../middlewares/validate.js";
import { ResturantSchema, type TResturantSchema } from "../schemas/restaurants.js";
import { initRedisClient } from "../utils/client.js";
const router = express.Router();

router.post("/", validate(ResturantSchema) ,async (req, res) => {
  try {
    const data = req.body as TResturantSchema;
    res.send("Restaurants");
  } catch (error: any) {
    res.status(500).json({ error: error.message as string });
  }
});

export default router;
