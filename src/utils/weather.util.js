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

export const getForecastWeatherHourly = async (latitude, longitude) => {
  const openweather_datas = await forecastWeatherHourly(latitude, longitude);
  const { sido } = await reverseGeocode(latitude, longitude);
  const sidoName = getDustAddress(sido);
  const dust_data = await currentAirPollution(sidoName);
  const datas = [];
  for (let openweather_data of openweather_datas.list) {
    const data = {
      dt: openweather_data.dt + 9 * 60 * 60,
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
      pm10: parseFloat(dust_data.response.body.items[0].pm10Value),
      pm25: parseFloat(dust_data.response.body.items[0].pm25Value),
    };
    datas.push(data);
  }
  return datas;
};
export const getForecastWeatherDaily = async (latitude, longitude) => {
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

export const getSeason = () => {
  const month = new Date().getMonth() + 1;
  if ([12, 1, 2].includes(month)) return "winter";
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  return "autumn";
};

export const getDescriptionFromWeather = (weather, yesterday_weather) => {
  const season = getSeason();
  console.log(season);
  let description = [];
  if (yesterday_weather === null) {
    description.push("어제의 날씨 정보가 없어 오늘 날씨와 비교할 수 없습니다.");
  } else if (weather.temp === yesterday_weather.temp) {
    description.push("오늘은 어제와 비슷한 날씨입니다.");
  } else {
    switch (season) {
      case "winter":
        if (weather.temp < yesterday_weather.temp) {
          description.push("오늘은 어제보다 추워졌고,");
        } else {
          description.push("오늘은 어제보다 따뜻해졌고,");
        }
        break;
      case "spring":
        if (weather.temp < yesterday_weather.temp) {
          description.push("오늘은 어제보다 시원해졌고,");
        } else {
          description.push("오늘은 어제보다 따뜻해졌고,");
        }
        break;
      case "summer":
        if (weather.temp < yesterday_weather.temp) {
          description.push("오늘은 어제보다 시원해졌고,");
        } else {
          description.push("오늘은 어제보다 더워졌고,");
        }
        break;
      case "autumn":
        if (weather.temp < yesterday_weather.temp) {
          description.push("오늘은 어제보다 추워졌고,");
        } else {
          description.push("오늘은 어제보다 따뜻해졌고,");
        }
        break;
      default:
        break;
    }
    console.log(weather.temp);
    console.log(yesterday_weather.temp);
  }
  switch (weather.main) {
    case "Rain":
      description.push("비가 올 예정이니 우산을 챙기세요.");
      break;
    case "Snow":
      description.push("눈이 올 예정이니 따뜻하게 입으세요.");
      break;
    case "Clear":
      description.push("맑은 날씨가 예상됩니다.");
      break;
    case "Clouds":
      description.push("구름이 낀 날씨가 예상됩니다.");
      break;
    default:
      description.push(`오늘의 날씨는 ${weather.main}입니다.`);
      break;
  }
  console.log(weather.main);

  if (weather.temp_max - weather.temp_min >= 10) {
    description.push("또한, 일교차가 커서 감기에 유의하셔야 해요.");
  }
  console.log(weather.temp_max - weather.temp_min);
  return description.join(" ");
};

export const getDescriptionFromWindSpeed = (wind_speed) => {
  switch (true) {
    case typeof wind_speed !== "number" || wind_speed < 0:
      return "문제 발생: 유효하지 않은 값";
    case wind_speed === 0:
      return "없음";
    case wind_speed < 6:
      return "약함";
    case wind_speed < 11:
      return "주의";
    case wind_speed < 15:
      return "경계";
    case wind_speed < 21:
      return "위험";
    case wind_speed >= 21:
      return "매우 위험";
    default:
      return "문제 발생: 알 수 없는 풍속";
  }
};
