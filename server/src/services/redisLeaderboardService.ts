import { redisClient } from "../utils/redis";

const LEADERBOARD_KEY = "leaderboard:global";

export async function submitScore(userId: number, score: number) {
  await redisClient.zAdd(LEADERBOARD_KEY, {
    score,
    value: userId.toString(),
  });
}

export async function getTopScores(limit = 10) {
  return await redisClient.zRangeWithScores(LEADERBOARD_KEY, -limit, -1, {
    REV: true,
  });
}

export async function getUserRank(userId: number) {
  const rank = await redisClient.zRevRank(LEADERBOARD_KEY, userId.toString());
  return rank !== null ? rank + 1 : null;
}
