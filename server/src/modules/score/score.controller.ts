import { z } from "zod";
import { CREATED, UNAUTHORIZED } from "../../constants/http";
import { submitScore as submitScoreToRedis } from "../../services/redisLeaderboardService";
import appAssert from "../../utils/appAssert";
import catchErrors from "../../utils/catchErrors";
import prisma from "../../utils/prisma";
import { redisClient } from "../../utils/redis";

const scoreSchema = z.object({
  score: z.number().int().min(0),
});

export const submitScoreHandler = catchErrors(async (req, res) => {
  const { score } = scoreSchema.parse(req.body);
  const userId = (req as any).user?.id;
  appAssert(userId, UNAUTHORIZED, "Unauthorized");

  // Save score record to Postgres (history)
  await prisma.score.create({
    data: {
      userId,
      value: score,
    },
  });

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
  });
});
