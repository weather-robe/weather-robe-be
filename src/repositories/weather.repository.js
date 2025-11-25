import { prisma } from "../configs/db.config.js";

export const getWeather = async (weatherId) => {
  const weather = await prisma.weather.findUnique({
    where: {
      id: weatherId,
    },
  });
  return weather;
};

export const getDailyWeatherByUserIdAndDtAndDtype = async (
  userId,
  dt,
  dtype
) => {
  const dailyWeather = await prisma.dailyWeather.findFirst({
    where: {
      userId: userId,
      weather: {
        dt: dt,
        dtype: dtype,
      },
    },
    include: {
      weather: true,
    },
  });
  return dailyWeather;
};

export const getWeatherBySidoAndDtypeAndDt = async (sido, dtype, dt) => {
  const weather = await prisma.weather.findFirst({
    where: {
      sido: sido,
      dtype: dtype,
      dt: dt,
    },
  });
  return weather;
};

export const getDailyWeatherByUserIdAndWeatherId = async (
  userId,
  weatherId
) => {
  const dailyWeather = await prisma.dailyWeather.findFirst({
    where: {
      userId: userId,
      weatherId: weatherId,
    },
  });
  return dailyWeather;
};

export const getWeathersBySidoAndDtypeAndDtRange = async (
  sido,
  dtype,
  startDt,
  endDt
) => {
  const weathers = await prisma.weather.findMany({
    where: {
      sido: sido,
      dtype: dtype,
      dt: {
        gte: startDt,
        lte: endDt,
      },
    },
    orderBy: {
      dt: "asc",
    },
  });
  return weathers;
};

export const getTimeBlockByWeatherIdAndDtype = async (weatherId, dtype) => {
  const timeBlock = await prisma.timeBlock.findFirst({
    where: {
      weatherId: weatherId,
      dtype: dtype,
    },
  });
  return timeBlock;
};

export const getTimeBlocksByWeatherIdsAndDtype = async (weatherIds, dtype) => {
  const timeBlocks = await prisma.timeBlock.findMany({
    where: {
      weatherId: {
        in: weatherIds,
      },
      dtype: dtype,
    },
  });
  return timeBlocks;
};

export const addWeather = async (data) => {
  const created = await prisma.weather.create({
    data: data,
  });
  return created;
};

export const addWeathers = async (datas) => {
  const created = await prisma.weather.createMany({
    data: datas,
  });
  return created;
};

export const addWeathersAndTimeBlocks = async (
  weatherDatas,
  timeBlockDatas
) => {
  // 데이터 배열의 길이가 일치해야 1:1 매핑이 가능합니다.
  if (weatherDatas.length !== timeBlockDatas.length) {
    throw new Error(
      "Weather와 TimeBlock 데이터 배열의 길이가 일치해야 합니다."
    );
  }

  // weatherDatas와 timeBlockDatas를 묶어 하나의 처리 작업 배열로 만듭니다.
  // zip 함수가 없으므로 map을 사용하여 인덱스를 통해 두 배열에 접근합니다.
  const operations = weatherDatas.map((weatherData, index) => {
    const timeBlockData = timeBlockDatas[index];

    // 각 쌍(Weather + TimeBlock)의 생성을 단일 트랜잭션으로 묶습니다.
    return prisma.$transaction(async (tx) => {
      // 1. Weather를 개별 생성하고 ID를 반환받습니다. (tx.weather.create 사용)
      const createdWeather = await tx.weather.create({
        data: weatherData,
      });

      // 2. Weather ID를 TimeBlock 데이터에 연결하여 TimeBlock을 생성합니다.
      const createdTimeBlock = await tx.timeBlock.create({
        data: {
          ...timeBlockData,
          weatherId: createdWeather.id, // 💡 생성된 ID를 명시적으로 사용
        },
      });

      // 한 쌍의 결과를 반환
      return {
        weather: createdWeather,
        timeblock: createdTimeBlock,
      };
    });
  });

  // 모든 트랜잭션 작업을 병렬로 실행합니다.
  // 모든 쌍이 성공해야 전체 작업이 성공합니다.
  const results = await Promise.all(operations);

  return results; // 모든 쌍의 생성 결과를 반환합니다.
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

export const addTimeBlock = async (data) => {
  const created = await prisma.timeBlock.create({
    data: data,
  });
  return created;
};

export const addTimeBlocks = async (datas) => {
  const created = await prisma.timeBlock.createMany({
    data: datas,
  });
  return created;
};

export const addDailyWeathers = async (datas) => {
  const created = await prisma.dailyWeather.createMany({
    data: datas,
  });
  return created;
};
export const patchDailyWeather = async (dailyWeatherId, data) => {
  const updated = await prisma.dailyWeather.update({
    where: {
      id: dailyWeatherId,
    },
    data: data,
  });
  return updated;
};

export const patchWeathersIndividually = async (ids, datas) => {
  const updates = ids.map((id, index) => {
    const data = datas[index];
    return prisma.weather.update({
      where: {
        id: id,
      },
      data: data,
    });
  });
  const result = await prisma.$transaction(updates);
  return result;
};

export const patchWeathersAndTimeBlocksIndividually = async (
  weatherIds,
  weatherDatas,
  timeBlockDatas
) => {
  const weatherUpdates = weatherIds.map((id, index) => {
    const data = weatherDatas[index];
    return prisma.weather.update({
      where: {
        id: id,
      },
      data: data,
    });
  });
  const timeBlockUpdates = timeBlockDatas.map((timeBlockData) => {
    const { timeBlockId, data } = timeBlockData;
    return prisma.timeBlock.update({
      where: {
        id: timeBlockId,
      },
      data: data,
    });
  });
  return await prisma.$transaction({
    weatherUpdates,
    timeBlockUpdates,
  });
};

export const patchTimeBlock = async (timeBlockId, data) => {
  const updated = await prisma.timeBlock.update({
    where: {
      id: timeBlockId,
    },
    data: data,
  });
  return updated;
};
