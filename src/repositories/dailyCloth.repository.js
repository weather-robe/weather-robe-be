import { prisma } from "../configs/db.config.js";
export const getDailyClothByDailyId = async (dailyWeatherId) => {
  const dailyCloth = await prisma.dailyCloth.findMany({
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
  return dailyCloth;
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

export const addDailyClothImages = async (dailyWeatherId, imageUrls) => {
  for (const imageUrl of imageUrls) {
    await prisma.clothImage.create({
      data: {
        dailyWeatherId: dailyWeatherId,
        imageUrl: imageUrl,
      },
    });
  }
  return await prisma.clothImage.findMany({
    where: {
      dailyWeatherId: dailyWeatherId,
    },
  });
};
