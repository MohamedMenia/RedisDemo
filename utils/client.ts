import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function initRedisClient() {
  if (!client) {
    client = createClient();
    client.on("error", (err: Error) => {
      console.error(`Error connecting to Redis`,err);
    });
    client.on("connect", () => {
      console.log("Connected to Redis");
    });
    await client.connect();
  }
  return client;
}
