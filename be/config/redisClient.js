const redis = require('redis');

let redisClient;

async function connectingClient() {
    if (!redisClient) {
        try {
            redisClient = redis.createClient({ url: "redis://localhost:6379" });
            redisClient.on("error", (error) => console.error(`Redis Error: ${error}`));
            await redisClient.connect();
            console.log("Connected to Redis");
        } catch (error) {
            console.error("Redis connection error:", error);
            throw error;
        }
    }
    return redisClient;
}

function getRedisClient() {
    if (!redisClient) {
        throw new Error("Redis client not initialized. Call connectingClient first.");
    }
    return redisClient;
}

module.exports = {
    connectingClient,
    getRedisClient,
};
