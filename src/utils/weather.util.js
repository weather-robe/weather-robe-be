import axios from "axios";

export const currentWeather = async (
  latitude,
  longitude,
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
  latitude,
  longitude,
  units = "metric",
  lang = "kr"
) => {
  try {
    const url = `${process.env.DEFAULT_WEATHER_URL}/forecast/hourly?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=${units}&lang=${lang}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast weather:", error);
  }
};

export const forecastWeatherDaily = async (
  latitude,
  longitude,
  units = "metric",
  lang = "kr"
) => {
  try {
    const url = `${process.env.DEFAULT_WEATHER_URL}/forecast/daily?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=${units}&lang=${lang}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast weather:", error);
  }
};
