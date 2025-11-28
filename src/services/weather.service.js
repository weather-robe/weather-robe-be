import { patchUserLocation } from "../repositories/user.repository.js";
import { geocode, reverseGeocode } from "../utils/geocoder.util.js";
import {
  getCurrentWeather,
  getForecastWeatherDaily,
  getForecastWeatherHourly,
} from "../utils/weather.util.js";
import {
  addWeather,
  addDailyWeather,
  getWeatherBySidoAndDtypeAndDt,
  patchDailyWeather,
  getDailyWeatherByUserIdAndWeatherId,
  getWeathersBySidoAndDtypeAndDtRange,
  patchWeathersIndividually,
  addWeathers,
  addDailyWeathers,
  addWeathersAndTimeBlocks,
  getTimeBlockByWeatherIdAndDtype,
  getTimeBlocksByWeatherIdsAndDtype,
  addTimeBlock,
  patchTimeBlock,
  getDailyWeather,
  getDailyWeatherByWeatherId,
  getWeather,
  getTimeBlock,
} from "../repositories/weather.repository.js";
import {
  responseFromDailyWeather,
  responseFromDailyWeatherFeedback,
  responseFromHourlyWeather,
  responseFromWeatherToday,
} from "../dtos/weather.dto.js";
import { InvalidRequestError } from "../errors/common.error.js";
import { getKSTCurrentDt, getKSTDailyDt } from "../utils/date.util.js";

const DTYPE_TIME_BLOCK = {
  TEMP: "temp",
  FEELS_LIKE: "feels_like",
};

const DTYPE = {
  CURRENT: "current",
  FORECAST_DAILY: "forecast_daily",
  FORECAST_HOURLY: "forecast_hourly",
};

const HOURLY = 2 * 24;
const DAILY = 10;

export const getWeatherToday = async ({ user, latitude, longitude }) => {
  // 위도 경도가 없으면 서울시청으로 기본 설정  const { user, latitude, longitude } = data;
  if (!latitude || !longitude) {
    //return null; //throw new Error("위도와 경도가 필요합니다.");
    latitude = 37.5665;
    longitude = 126.978;
  }
  const current_address = await reverseGeocode(latitude, longitude);
  let sido = user.location;
  // 유저가 제공한 위치가 없으면 현재 위치를 서울로 설정
  if (!sido) {
    sido = "서울특별시";
  }
  // const time = timeDiffInHours(user.locationTimeAt, new Date());
  // 이미 해당 지역의 날씨와 시간이 1시간 이내이면 에러 반환
  // if (current_address.sido === sido && time < 1) {
  //   return null; // throw new Error("이미 해당 지역의 날씨 정보입니다.");
  // }

  const { latitude: newLatitude, longitude: newLongitude } = await geocode(
    sido
  );
  // DB에 현재 날씨 데이터가 있는지 확인
  const current_dt = getKSTCurrentDt();

  let current_weather = await getWeatherBySidoAndDtypeAndDt(
    sido,
    DTYPE.CURRENT,
    current_dt
  );
  // DB에 저장되어 있는 데이터가 없다면 현재 위치의 날씨 정보 반환
  if (!current_weather) {
    console.log("현재 날씨 DB에 없음, 새로 추가");
    current_weather = await getCurrentWeather(newLatitude, newLongitude);
    current_weather.sido = sido;
    current_weather.dtype = DTYPE.CURRENT;
    const weather = await addWeather(current_weather);
    current_weather = await getWeather(weather.id);
  }

  const daily_dt = getKSTDailyDt();
  let daily_weather = await getWeatherBySidoAndDtypeAndDt(
    sido,
    DTYPE.FORECAST_DAILY,
    daily_dt
  );
  if (!daily_weather) {
    console.log("일별 예보 DB에 없음, 새로 추가");
    const { items, pm10, pm25 } = await getForecastWeatherDaily(
      newLatitude,
      newLongitude
    );
    const temp_avg =
      (items[0].temp.day +
        items[0].temp.night +
        items[0].temp.eve +
        items[0].temp.morn) /
      4;
    const feels_like_avg =
      (items[0].feels_like.day +
        items[0].feels_like.night +
        items[0].feels_like.eve +
        items[0].feels_like.morn) /
      4;
    const weather_data = {
      dt: items[0].dt,
      dtype: DTYPE.FORECAST_DAILY,
      sido: sido,
      main: items[0].main,
      icon: items[0].icon,
      description: items[0].description,
      temp: temp_avg,
      temp_max: items[0].temp.max,
      temp_min: items[0].temp.min,
      feels_like: feels_like_avg,
      humidity: items[0].humidity,
      pop: items[0].pop,
      rain: items[0].rain,
      snow: items[0].snow,
      wind_speed: items[0].wind_speed,
      wind_deg: items[0].wind_deg,
      pm10: pm10,
      pm25: pm25,
    };
    const { weather } = await addDailyWeather(user.id, weather_data);
    daily_weather = await getWeather(weather.id);
    const timeblock_data = {
      weatherId: weather.id,
      dtype: DTYPE_TIME_BLOCK.TEMP,
      night: items[0].temp.night,
      morn: items[0].temp.morn,
      day: items[0].temp.day,
      eve: items[0].temp.eve,
    };
    await addTimeBlock(timeblock_data);
  }
  // 최종적으로 사용자 위치 업데이트
  const updatedUser = await patchUserLocation(user.id, current_address.sido);
  const yesterday_dt = daily_dt - 24 * 60 * 60;
  let yesterday_weather = await getWeatherBySidoAndDtypeAndDt(
    sido,
    DTYPE.FORECAST_DAILY,
    yesterday_dt
  );
  if (!yesterday_weather) {
    console.log("어제 날씨 DB에 없음");
  }
  return responseFromWeatherToday({
    user: updatedUser,
    current_weather: current_weather,
    daily_weather: daily_weather,
    yesterday_weather: yesterday_weather,
  });
};

export const setFeedbackWeather = async ({ userId, weatherId, feedback }) => {
  const daily_weather = await getDailyWeatherByUserIdAndWeatherId(
    userId,
    weatherId
  );
  if (!daily_weather) {
    throw new InvalidRequestError("해당 일별 날씨 데이터가 없습니다.");
  }
  const updated_daily_weather = await patchDailyWeather(daily_weather.id, {
    feeling_status: feedback,
  });
  return responseFromDailyWeatherFeedback({
    userId,
    daily_weather: updated_daily_weather,
  });
};

export const getWeatherHourly = async ({ user, latitude, longitude }) => {
  // 위도 경도가 없으면 서울시청으로 기본 설정  const { user, latitude, longitude } = data;
  if (!latitude || !longitude) {
    //return null; //throw new Error("위도와 경도가 필요합니다.");
    latitude = 37.5665;
    longitude = 126.978;
  }
  const current_address = await reverseGeocode(latitude, longitude);
  let sido = user.location;
  // 유저가 제공한 위치가 없으면 현재 위치를 서울로 설정
  if (!sido) {
    sido = "서울특별시";
  }

  const { latitude: newLatitude, longitude: newLongitude } = await geocode(
    sido
  );

  const current_dt = getKSTCurrentDt();

  // DB에 모레 날씨 데이터가 있는지 확인 - 값이 부족했거나 1시간이 지났는 지 판단하기 위함
  const day_after_tomorrow_dt = current_dt + HOURLY * 60 * 60;
  const hourly_weather =
    (await getWeathersBySidoAndDtypeAndDtRange(
      sido,
      DTYPE.FORECAST_HOURLY,
      current_dt,
      day_after_tomorrow_dt
    )) || [];
  console.log("DB에 있는 모레 날씨 데이터 수:", hourly_weather.length);
  if (hourly_weather.length < HOURLY) {
    console.log("현재 기준 모레 날씨 DB에 없음, 새로 추가 및 업데이트");
    const hourly_weather_temp = await getForecastWeatherHourly(
      newLatitude,
      newLongitude
    );
    const ids = [];
    const updateData = [];
    const createData = [];
    for (let i = 0; i < hourly_weather_temp.length; i++) {
      const newWeather = {
        ...hourly_weather_temp[i],
        sido: sido,
        dtype: DTYPE.FORECAST_HOURLY,
      };
      if (i < hourly_weather.length) {
        ids.push(hourly_weather[i].id);
        updateData.push(newWeather);
      } else {
        createData.push(newWeather);
      }
    }
    if (ids.length > 0) {
      const patched_weathers = await patchWeathersIndividually(ids, updateData);
      hourly_weather.push(...patched_weathers);
      console.log("업데이트 할 데이터 수:", ids.length);
    }
    if (createData.length > 0) {
      for (let i = 0; i < createData.length; i++) {
        hourly_weather.push(await addWeather(createData[i]));
      }
      console.log("생성 할 데이터 수:", createData.length);
    }
  }
  // 최종적으로 사용자 위치 업데이트
  const updatedUser = await patchUserLocation(user.id, current_address.sido);
  return responseFromHourlyWeather({
    user: updatedUser,
    hourly_weathers: hourly_weather,
  });
};

export const getWeatherDaily = async ({ user, latitude, longitude }) => {
  // 위도 경도가 없으면 서울시청으로 기본 설정  const { user, latitude, longitude } = data;
  if (!latitude || !longitude) {
    //return null; //throw new Error("위도와 경도가 필요합니다.");
    latitude = 37.5665;
    longitude = 126.978;
  }
  const current_address = await reverseGeocode(latitude, longitude);
  let sido = user.location;
  // 유저가 제공한 위치가 없으면 현재 위치를 서울로 설정
  if (!sido) {
    sido = "서울특별시";
  }

  const { latitude: newLatitude, longitude: newLongitude } = await geocode(
    sido
  );

  const daily_dt = getKSTDailyDt();
  const ten_days_later_dt = daily_dt + DAILY * 24 * 60 * 60;
  let weathers =
    (await getWeathersBySidoAndDtypeAndDtRange(
      sido,
      DTYPE.FORECAST_DAILY,
      daily_dt,
      ten_days_later_dt
    )) || [];
  const weather_ids = weathers.map((weather) => weather.id);
  let timeblocks =
    (await getTimeBlocksByWeatherIdsAndDtype(
      weather_ids,
      DTYPE_TIME_BLOCK.TEMP
    )) || [];
  console.log("DB에 있는 10일 날씨 데이터 수:", weathers.length);
  if (weathers.length < DAILY) {
    console.log("현재 기준 모레 날씨 DB에 없음, 새로 추가 및 업데이트");
    const { items, pm10, pm25 } = await getForecastWeatherDaily(
      newLatitude,
      newLongitude
    );
    const ids = [];
    const updateData = [];
    const updateTimeBlockData = [];
    const createData = [];
    const createTimeBlockData = [];
    for (let i = 0; i < items.length; i++) {
      const temp_avg =
        (items[i].temp.day +
          items[i].temp.night +
          items[i].temp.eve +
          items[i].temp.morn) /
        4;
      const feels_like_avg =
        (items[i].feels_like.day +
          items[i].feels_like.night +
          items[i].feels_like.eve +
          items[i].feels_like.morn) /
        4;
      const newWeather = {
        ...items[i],
        temp: temp_avg,
        temp_max: items[i].temp.max,
        temp_min: items[i].temp.min,
        feels_like: feels_like_avg,
        sido: sido,
        dtype: DTYPE.FORECAST_DAILY,
        pm10: pm10,
        pm25: pm25,
      };
      const newTimeBock = {
        weatherId: null, // 나중에 추가
        dtype: DTYPE_TIME_BLOCK.TEMP,
        night: items[i].temp.night,
        morn: items[i].temp.morn,
        day: items[i].temp.day,
        eve: items[i].temp.eve,
      };
      if (i < weathers.length) {
        ids.push(weathers[i].id);
        updateData.push(newWeather);
        updateTimeBlockData.push({ ...newTimeBock, weatherId: weathers[i].id });
      } else {
        createData.push(newWeather);
        createTimeBlockData.push(newTimeBock);
      }
    }
    if (ids.length > 0) {
      const patched_weathers = await patchWeathersIndividually(ids, updateData);
      weathers.push(...patched_weathers);
      for (let i = 0; i < ids.length; i++) {
        const timeblock = await getTimeBlockByWeatherIdAndDtype(
          ids[i],
          DTYPE_TIME_BLOCK.TEMP
        );
        timeblocks.push(
          await patchTimeBlock(timeblock.id, updateTimeBlockData[i])
        );
        const dailyWeather = await getDailyWeatherByUserIdAndWeatherId(
          user.id,
          ids[i]
        );
        await patchDailyWeather(dailyWeather.id, { weatherId: ids[i] });
      }
      console.log("업데이트 할 데이터 수:", ids.length);
    }
    if (createData.length > 0) {
      for (let i = 0; i < createTimeBlockData.length; i++) {
        const { weather: ws } = await addDailyWeather(user.id, createData[i]);
        const weather = await getWeather(ws.id);
        const ts = await addTimeBlock({
          ...createTimeBlockData[i],
          weatherId: ws.id,
        });
        const timeblock = await getTimeBlock(ts.id);
        weathers.push(weather);
        timeblocks.push(timeblock);
      }
    }
    console.log("생성 할 데이터 수:", createData.length);
  }
  const yesterday_dt = daily_dt - 24 * 60 * 60;
  const yesterday_weather = await getWeatherBySidoAndDtypeAndDt(
    sido,
    DTYPE.FORECAST_DAILY,
    yesterday_dt
  );
  if (!yesterday_weather) {
    console.log("어제 날씨 DB에 없음");
  }
  // 최종적으로 사용자 위치 업데이트
  const updatedUser = await patchUserLocation(user.id, current_address.sido);
  return responseFromDailyWeather({
    user: updatedUser,
    weathers: weathers,
    time_blocks: timeblocks,
    yesterday_weather: yesterday_weather,
  });
};
