import { OK, UNAUTHORIZED } from "../../constants/http";
import {
  getTopScores,
  getUserRank,
} from "../../services/redisLeaderboardService";
import catchErrors from "../../utils/catchErrors";
import prisma from "../../utils/prisma";
import { redisClient } from "../../utils/redis";

const DEFAULT_LIMIT = 10;

export const getLeaderboardHandler = catchErrors(async (req, res) => {
  const limit = Number(req.query.limit) || DEFAULT_LIMIT;

  // Get top user IDs and scores from Redis
  const topScores = await getTopScores(limit);

  // topScores = [{ value: 'userId', score: number }, ...]

  // Extract user IDs
  const userIds = topScores.map((entry) => Number(entry.value));

  // Fetch user data from Postgres
  const usersWithScores = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      username: true,
      profileImage: true,
      scores: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { accuracy: true },
      },
    },
  });

  // Create a map for quick lookup
  const userMap = new Map(usersWithScores.map((u) => [u.id, u]));

  const leaderboard = topScores.map((entry, index) => {
    const user = userMap.get(Number(entry.value));
    return {
      rank: index + 1,
      userId: user?.id,
      username: user?.username,
      profileImage: user?.profileImage,
      score: entry.score,
      accuracy: user?.scores[0]?.accuracy ?? null,
    };
  });

  res.status(OK).json({
    success: true,
    leaderboard,
  });
});

export const getUserRankHandler = catchErrors(async (req, res) => {
  const userId = (req as any).userId;
  if (!userId) {
    return res.status(UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // Get rank (1-based) and score from Redis
  const rank = await getUserRank(userId);
  const score = await redisClient.zScore(
    "leaderboard:global",
    userId.toString()
  );

  res.status(OK).json({
    success: true,
    rank: rank || null,
    score: score !== null ? Number(score) : null,
  });
});
