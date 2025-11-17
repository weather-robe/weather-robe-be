import { prisma } from "../configs/db.config.js";
import { spliceMinutesFromDateTime } from "../utils/date.util.js";

export const getWeatherBySidoAndDtype = async (sido, dtype) => {
  const weather = await prisma.weather.findFirst({
    where: {
      sido: sido,
      dtype: dtype,
      dt: spliceMinutesFromDateTime(new Date()),
    },
  });
  return weather;
};

export const addWeather = async (data) => {
  const created = await prisma.weather.create({
    data: data,
  });
  return created;
};

export const addDailyWeather = async (userId, data) => {
  const created_weather = await prisma.weather.create({
    data: data,
  });
  const daily_data = {
    userId: userId,
    weatherId: created_weather.id,
  };
  const created_daily = await prisma.dailyWeather.create({
    data: daily_data,
  });
  return {
    weather: created_weather,
    daily_weather: created_daily,
  };
};
