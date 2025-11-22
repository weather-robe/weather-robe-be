import { prisma } from "../configs/db.config.js";
export const getDailyClouthByDailyId = async (dailyWeatherId) => {
  const dailyClouth = await prisma.dailyCloth.findMany({
    select: {
      id: true,
      dailyWeatherId: true,
      createdAt: true,
      updatedAt: true,
      ClothKeywords: {
        select: {
          id: true,
          dailyClothId: true,
          keyword: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    where: {
      dailyWeatherId: dailyWeatherId,
    },
  });
  return dailyClouth;
};

export const addDailyCloth = async (dailyWeatherId, clothKeywords) => {
  const createdDailyCloth = await prisma.dailyCloth.create({
    data: {
      dailyWeatherId: dailyWeatherId,
      ClothKeywords: {
        create: clothKeywords.map((keyword) => ({
          keyword: keyword,
        })),
      },
    },
    include: {
      ClothKeywords: true,
    },
  });
  return createdDailyCloth;
};
