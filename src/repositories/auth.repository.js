import { prisma } from "../configs/db.config.js";

export const getUserSignIn = async (data) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: data.email,
    },
  });
  return user;
};
