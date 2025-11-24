import { prisma } from "../configs/db.config.js";
export const addUser = async (data) => {
  const loginId = await prisma.user.findFirst({
    where: { loginId: data.loginId },
  });
  if (loginId) {
    return { loginId: null };
  }
  const email = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (email) {
    return { email: null };
  }
  const created = await prisma.user.create({ data: data });
  return created.id;
};

export const getUser = async (userId) => {
  const user = await prisma.user.findFirst({ where: { id: userId } });
  return user;
};

export const patchUserLocation = async (userId, location) => {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      location: location,
      locationTimeAt: new Date(),
    },
  });
  return updated;
};
