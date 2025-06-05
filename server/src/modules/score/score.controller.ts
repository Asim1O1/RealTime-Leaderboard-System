import { z } from "zod";
import { CREATED, OK, UNAUTHORIZED } from "../../constants/http";
import { submitScore as submitScoreToRedis } from "../../services/redisLeaderboardService";
import appAssert from "../../utils/appAssert";
import catchErrors from "../../utils/catchErrors";
import prisma from "../../utils/prisma";
import { redisClient } from "../../utils/redis";

const scoreSchema = z.object({
  score: z.number().int().min(0),
  accuracy: z.number().min(0).max(100),
});

export const submitScoreHandler = catchErrors(async (req, res) => {
  const { score, accuracy } = scoreSchema.parse(req.body);
  const userId = (req as any).userId;
  appAssert(userId, UNAUTHORIZED, "Unauthorized");

  // Start a transaction to ensure both operations succeed or fail together
  const [_, updatedUser] = await prisma.$transaction([
    // Save score record to Postgres (history)
    prisma.score.create({
      data: {
        userId,
        value: score,
        accuracy,
      },
    }),

    // Increment gamesPlayed counter
    prisma.user.update({
      where: { id: userId },
      data: {
        gamesPlayed: {
          increment: 1,
        },
      },
    }),
  ]);

  // Get current score from Redis
  const currentScore = await redisClient.zScore(
    "leaderboard:global",
    userId.toString()
  );

  // Update Redis only if new score is higher or no current score
  if (currentScore === null || score > Number(currentScore)) {
    await submitScoreToRedis(userId, score);
  }

  res.status(CREATED).json({
    success: true,
    message: "Score submitted successfully",
    gamesPlayed: updatedUser.gamesPlayed, // Optional: return the new count
  });
});
export const getMyScoresHandler = catchErrors(async (req, res) => {
  const userId = (req as any).userId; // This matches what your auth middleware sets
  appAssert(userId, UNAUTHORIZED, "Unauthorized");

  const scores = await prisma.score.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  res.status(OK).json({
    success: true,
    message: "Scores fetched Successfully",
    scores,
  });
});
