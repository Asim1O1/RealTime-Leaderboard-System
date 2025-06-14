import prisma from "../utils/prisma";
import { redisClient } from "../utils/redis"; // adjust the path if needed

async function clearLeaderboardData() {
  // Delete score records
  await prisma.score.deleteMany();

  // Reset user stats
  await prisma.user.updateMany({
    data: { gamesPlayed: 0 },
  });

  // Clear Redis leaderboard
  await redisClient.del("leaderboard:global");

  console.log("✅ Cleared Postgres and Redis leaderboard data");
}

clearLeaderboardData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error clearing data:", err);
    process.exit(1);
  });
