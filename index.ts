import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import restaurantsRouter from "./routes/restaurants.js";
import culisinesRouter from "./routes/culisines.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import redisClient from "./config/redisConfig.js";
import type { RedisClientType } from "redis";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

//configure Redis
app.use((req: Request, res: Response, next: NextFunction) => {
  req.redis = redisClient as RedisClientType;
  next();
});

app.use("/restaurants", restaurantsRouter);
app.use("/culisines", culisinesRouter);
app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
