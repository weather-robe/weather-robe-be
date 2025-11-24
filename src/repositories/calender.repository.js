import { prisma } from "../configs/db.config.js";

export const getWeathersByUserIdAndCalenderDateAndDtype = async (
  userId,
  startDate,
  endDate,
  dtype
) => {
  const filteredWeathers = await prisma.weather.findMany({
    where: {
      dt: {
        gte: startDate,
        lte: endDate,
      },
      dtype: dtype,
      DailyWeathers: {
        some: {
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      dt: true,
      dtype: true,
      main: true,
      temp_max: true,
      temp_min: true,
      DailyWeathers: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
          userId: true,
          weatherId: true,
          feeling_status: true,
          createdAt: true,
          updatedAt: true,
          DailyCloths: {
            select: {
              ClothKeywords: {
                select: {
                  keyword: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return filteredWeathers;
};

export const getWeatherByCalenderDateAndDtype = async (
  calenderDate,
  dtype
) => {};
