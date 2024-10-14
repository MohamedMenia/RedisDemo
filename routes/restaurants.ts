import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.send("Restaurants");
  } catch (error: any) {
    res.status(500).json({ error: error.message as string });
  }
});

export default router;
