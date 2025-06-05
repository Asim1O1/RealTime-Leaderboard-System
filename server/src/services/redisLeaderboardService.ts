import { redisClient } from "../utils/redis";

const LEADERBOARD_KEY = "leaderboard:global";

interface LeaderboardEntry {
  value: string;
  score: number;
}

export async function submitScore(
  userId: number,
  score: number
): Promise<boolean> {
  if (typeof userId !== "number" || typeof score !== "number") {
    throw new Error("Invalid userId or score");
  }

  try {
    await redisClient.zAdd(LEADERBOARD_KEY, {
      score,
      value: userId.toString(),
    });
    return true;
  } catch (error) {
    console.error(`Error submitting score for user ${userId}:`, error);
    throw error;
  }
}

export async function getTopScores(limit = 10): Promise<LeaderboardEntry[]> {
  if (limit <= 0) {
    throw new Error("Limit must be positive");
  }

  try {
    return await redisClient.zRangeWithScores(LEADERBOARD_KEY, -limit, -1, {
      REV: true,
    });
  } catch (error) {
    console.error("Error retrieving top scores:", error);
    throw error;
  }
}

export async function getUserRank(userId: number): Promise<number | null> {
  try {
    const zeroBasedRank = await redisClient.zRevRank(
      LEADERBOARD_KEY,
      userId.toString()
    );
    return zeroBasedRank !== null ? zeroBasedRank + 1 : null;
  } catch (error) {
    console.error(`Error getting rank for user ${userId}:`, error);
    return null;
  }
}

export async function getUserScore(userId: number): Promise<number | null> {
  try {
    const score = await redisClient.zScore(LEADERBOARD_KEY, userId.toString());
    return score !== null ? Number(score) : null;
  } catch (error) {
    console.error(`Error getting score for user ${userId}:`, error);
    return null;
  }
}

export async function getLeaderboardSize(): Promise<number> {
  try {
    return await redisClient.zCard(LEADERBOARD_KEY);
  } catch (error) {
    console.error("Error getting leaderboard size:", error);
    return 0;
  }
}
