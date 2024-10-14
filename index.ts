import express from "express";
import restaurantsRouter from "./routes/restaurants.js";
import culisinesRouter from "./routes/culisines.js";
import dotenv from 'dotenv';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
dotenv.config();

app.use("/restaurants", restaurantsRouter);
app.use("/culisines", culisinesRouter);


app
  .listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
