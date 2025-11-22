/*
현재 날씨 조회 API
사용 가능한 값들:
weather[0].main: 날씨 상태 (예: Clear, Clouds, Rain)
weather[0].description: 날씨 설명 (예: 맑음, 구름 많음, 비)
main.temp: 기온
main.feels_like: 체감 온도
main.temp_min: 최저 기온
main.temp_max: 최고 기온
main.pressure: 기압
main.humidity: 습도
wind.speed: 바람 속도
wind.deg: 바람 방향
pop, snow도 제공해줌
*/

import axios from "axios";

export const currentWeather = async (
  latitude = 37.5674,
  longitude = 126.9755,
  units = "metric",
  lang = "kr"
) => {
  try {
    const url = `${process.env.DEFAULT_WEATHER_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=${units}&lang=${lang}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching current weather:", error);
  }
};

export const forecastWeatherHourly = async (
  latitude = 37.5674,
  longitude = 126.9755,
  cnt = 48,
  units = "metric",
  lang = "kr"
) => {
  try {
    const url = `${process.env.DEFAULT_WEATHER_URL}/forecast/hourly?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=${units}&lang=${lang}&cnt=${cnt}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast weather:", error);
  }
};

export const forecastWeatherDaily = async (
  latitude = 37.5674,
  longitude = 126.9755,
  cnt = 10,
  units = "metric",
  lang = "kr"
) => {
  try {
    const url = `${process.env.DEFAULT_WEATHER_URL}/forecast/daily?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=${units}&lang=${lang}&cnt=${cnt}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast weather:", error);
  }
};
