import express from "express";
const router = express.Router();
import * as cuisinesController from "../controllers/cuisines.controller.js";

router.get("/", cuisinesController.getCuisines);

router.get("/:cuisine", cuisinesController.getCuisine);

export default router;
