import { patchUserLocation } from "../repositories/user.repository.js";
import {
  spliceHoursFromDateTime,
  spliceMinutesFromDateTime,
  spliceMinutesFromDt,
  timeDiffInHours,
} from "../utils/date.util.js";
import { geocode, reverseGeocode } from "../utils/geocoder.util.js";
import {
  getCurrentWeather,
  getforecastWeatherDaily,
} from "../utils/weather.util.js";
import {
  addWeather,
  addDailyWeather,
  getWeatherBySidoAndDtypeAndDt,
} from "../repositories/weather.repository.js";

const DTYPE = {
  CURRENT: "current",
  FORECAST_DAILY: "forecast_daily",
  FORECAST_HOURLY: "forecast_hourly",
};

export const getWeatherToday = async (user, latitude, longitude) => {
  longitude = 127;
  latitude = 37;
  if (!latitude || !longitude) {
    return null; //throw new Error("위도와 경도가 필요합니다.");
  }
  const current_address = await reverseGeocode(latitude, longitude);
  let sido = user.location;
  // 기본 위치가 없으면 현재 위치를 기본 위치로 설정
  if (!sido) {
    sido = "경기도";
  }
  const time = timeDiffInHours(user.locationTimeAt, new Date());
  // 이미 해당 지역의 날씨와 시간이 1시간 이내이면 에러 반환
  // if (current_address.sido === sido && time < 1) {
  //   return null; // throw new Error("이미 해당 지역의 날씨 정보입니다.");
  // }

  const { latitude: newLatitude, longitude: newLongitude } = await geocode(
    sido
  );
  // DB에 현재 날씨 데이터가 있는지 확인
  const current_date = new Date();
  current_date.setMinutes(0, 0, 0);
  const current_dt = current_date.getTime() / 1000 + 9 * 60 * 60;

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
    current_weather = await addWeather(current_weather);
  }

  const daily_date = new Date();
  daily_date.setHours(0, 0, 0, 0);
  const daily_dt = daily_date.getTime() / 1000 + 9 * 60 * 60;
  let daily_weather = await getWeatherBySidoAndDtypeAndDt(
    sido,
    DTYPE.FORECAST_DAILY,
    daily_dt
  );
  if (!daily_weather) {
    console.log("일별 예보 DB에 없음, 새로 추가");
    const { items, pm10, pm25 } = await getforecastWeatherDaily(
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
    ({ daily_weather } = await addDailyWeather(user.id, weather_data));
  }
  // 최종적으로 사용자 위치 업데이트
  const updatedUser = await patchUserLocation(user.id, current_address.sido);
  return {
    current_weather: current_weather,
    daily_weather: daily_weather,
    user: updatedUser,
  };
};
