export const requestForWeatherToday = (user, latitude, longitude) => {
  return {
    user,
    latitude,
    longitude,
  };
};

export const responseFromWeatherToday = ({
  user,
  current_weather,
  daily_weather,
  yesterday_weather,
}) => {
  return {
    user: {
      id: user.id,
    },
    current: {
      temp: current_weather.temp,
      weather: current_weather.main,
    },
    today: {
      temp: daily_weather.temp,
      temp_max: daily_weather.temp_max,
      temp_min: daily_weather.temp_min,
      feels_like: daily_weather.feels_like,
      humidity: daily_weather.humidity,
      pop: daily_weather.pop,
      rain: daily_weather.rain,
      snow: daily_weather.snow,
      wind_speed: daily_weather.wind_speed,
      wind_deg: daily_weather.wind_deg,
      pm10: daily_weather.pm10,
      pm25: daily_weather.pm25,
    },
    yesterday: {
      temp: yesterday_weather ? yesterday_weather.temp : null,
      temp_max: yesterday_weather ? yesterday_weather.temp_max : null,
      temp_min: yesterday_weather ? yesterday_weather.temp_min : null,
    },
  };
};
