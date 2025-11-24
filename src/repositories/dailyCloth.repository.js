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

export const getDailyClothImagesByDailyClothId = async (dailyClothId) => {
  const clothImages = await prisma.clothImage.findMany({
    where: {
      dailyClothId: dailyClothId,
    },
  });
  return clothImages;
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

export const addDailyClothImages = async (dailyClothId, imageUrls) => {
  await prisma.clothImage.createMany({
    data: imageUrls.map((url) => ({
      dailyClothId: dailyClothId,
      imageUrl: url,
    })),
  });
  return await prisma.clothImage.findMany({
    where: {
      dailyClothId: dailyClothId,
    },
  });
};
