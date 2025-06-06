import { v2 as cloudinary } from "cloudinary";
import { NOT_FOUND, OK, UNAUTHORIZED } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import bufferToStream from "../../utils/buffertToStream";
import catchErrors from "../../utils/catchErrors";
import prisma from "../../utils/prisma";

export const getUserProfile = catchErrors(async (req, res) => {
  const userId = (req as any).userId;
  appAssert(userId, UNAUTHORIZED, "Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      scores: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  appAssert(user, NOT_FOUND, "User not found");

  res.status(OK).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
      gamesPlayed: user.gamesPlayed,
      createdAt: user.createdAt,
      scores: user.scores,
    },
  });
});

export const updateUserProfile = catchErrors(async (req, res) => {
  const userId = (req as any).userId;
  appAssert(userId, UNAUTHORIZED, "Unauthorized");

  const { username } = req.body;

  let profileImageUrl: string | undefined;

  if (req.file) {
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user-profiles" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { secure_url: string });
          }
        );
        bufferToStream(req.file!.buffer).pipe(stream);
      }
    );

    profileImageUrl = uploadResult.secure_url;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      username: username || undefined,
      profileImage: profileImageUrl || undefined,
    },
  });

  res.status(OK).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      profileImage: updatedUser.profileImage,
    },
  });
});

// DELETE: /api/user/profile
export const deleteUserAccount = catchErrors(async (req, res) => {
  const userId = (req as any).userId;
  appAssert(userId, UNAUTHORIZED, "Unauthorized");

  await prisma.user.delete({
    where: { id: userId },
  });

  res.status(OK).json({
    success: true,
    message: "Account deleted successfully",
  });
});
