import {
  currentWeather,
  forecastWeatherDaily,
  forecastWeatherHourly,
} from "../apis/openweather.api.js";
import { currentAirPollution } from "../apis/data.api.js";
import { reverseGeocode } from "./geocoder.util.js";
import { getDustAddress } from "./address.util.js";
import {
  dateTimeToDt,
  dtToDateTime,
  spliceMinutesFromDateTime,
  spliceMinutesFromDt,
} from "./date.util.js";

export const getCurrentWeather = async (latitude, longitude) => {
  const openweather_data = await currentWeather(latitude, longitude);
  const { sido } = await reverseGeocode(latitude, longitude);
  const sidoName = getDustAddress(sido);
  const dust_data = await currentAirPollution(sidoName);
  const dt = openweather_data.dt + 9 * 60 * 60; // 한국 시간으로 변환
  const date = new Date(dt * 1000);
  date.setMinutes(0, 0, 0);
  const edit_dt = date.getTime() / 1000;
  const data = {
    dt: edit_dt,
    sido: openweather_data.name,
    main: openweather_data.weather[0].main,
    temp: openweather_data.main.temp,
    temp_max: openweather_data.main.temp_max,
    temp_min: openweather_data.main.temp_min,
    feels_like: openweather_data.main.feels_like,
    humidity: openweather_data.main.humidity,
    rain: openweather_data.rain?.["1h"],
    snow: openweather_data.snow?.["1h"],
    wind_speed: openweather_data.wind.speed,
    wind_deg: openweather_data.wind.deg,
    pm10: parseFloat(dust_data.response.body.items[0].pm10Value),
    pm25: parseFloat(dust_data.response.body.items[0].pm25Value),
  };
  return data;
};

export const getforecastWeatherHourly = async (latitude, longitude) => {
  const openweather_datas = await forecastWeatherHourly(latitude, longitude);
  const { sido } = await reverseGeocode(latitude, longitude);
  const sidoName = getDustAddress(sido);
  const dust_data = await currentAirPollution(sidoName);
  const datas = [];
  for (let openweather_data of openweather_datas.list) {
    const data = {
      dt: openweather_data.dt,
      sido: openweather_datas.city.name,
      main: openweather_data.weather[0].main,
      temp: openweather_data.main.temp,
      temp_max: openweather_data.main.temp_max,
      temp_min: openweather_data.main.temp_min,
      feels_like: openweather_data.main.feels_like,
      humidity: openweather_data.main.humidity,
      pop: openweather_data.pop,
      rain: openweather_data.rain?.["1h"],
      snow: openweather_data.snow?.["1h"],
      wind_speed: openweather_data.wind.speed,
      wind_deg: openweather_data.wind.deg,
    };
    datas.push(data);
  }
  const data = {
    items: datas,
    pm10: parseFloat(dust_data.response.body.items[0].pm10Value),
    pm25: parseFloat(dust_data.response.body.items[0].pm25Value),
  };
  return data;
};
export const getforecastWeatherDaily = async (latitude, longitude) => {
  const openweather_datas = await forecastWeatherDaily(latitude, longitude);
  const { sido } = await reverseGeocode(latitude, longitude);
  const sidoName = getDustAddress(sido);
  const dust_data = await currentAirPollution(sidoName);
  const datas = [];
  for (let openweather_data of openweather_datas.list) {
    const temp = {
      max: openweather_data.temp.max,
      min: openweather_data.temp.min,
      day: openweather_data.temp.day,
      night: openweather_data.temp.night,
      eve: openweather_data.temp.eve,
      morn: openweather_data.temp.morn,
    };
    const feels_like = {
      day: openweather_data.feels_like.day,
      night: openweather_data.feels_like.night,
      eve: openweather_data.feels_like.eve,
      morn: openweather_data.feels_like.morn,
    };
    const dt = openweather_data.dt - 3 * 60 * 60; // 한국 시간으로 변환
    const data = {
      dt: dt,
      sido: openweather_datas.city.name,
      main: openweather_data.weather[0].main,
      temp: temp,
      feels_like: feels_like,
      humidity: openweather_data.humidity,
      pop: openweather_data.pop,
      rain: openweather_data.rain,
      snow: openweather_data.snow,
      wind_speed: openweather_data.speed,
      wind_deg: openweather_data.deg,
    };
    datas.push(data);
  }
  const data = {
    items: datas,
    pm10: parseFloat(dust_data.response.body.items[0].pm10Value),
    pm25: parseFloat(dust_data.response.body.items[0].pm25Value),
  };
  return data;
};
