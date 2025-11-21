export const requestForWeatherToday = (user, latitude, longitude) => {
  return {
    user,
    latitude,
    longitude,
  };
};

export const requestForFeedbackWeather = (userId, weatherId, feedback) => {
  return {
    userId,
    weatherId,
    feedback,
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
      weatherId: current_weather.id,
      temp: current_weather.temp,
      weather: current_weather.main,
    },
    today: {
      weatherId: daily_weather.id,
      temp: {
        avg: daily_weather.temp,
        max: daily_weather.temp_max,
        min: daily_weather.temp_min,
      },
      feelsLike: daily_weather.feels_like,
      humidity: daily_weather.humidity,
      pop: daily_weather.pop,
      rain: daily_weather.rain,
      snow: daily_weather.snow,
      windSpeed: daily_weather.wind_speed,
      windDeg: daily_weather.wind_deg,
      pm10: daily_weather.pm10,
      pm25: daily_weather.pm25,
    },
    yesterday: {
      weatherId: yesterday_weather ? yesterday_weather.id : null,
      temp: {
        avg: yesterday_weather ? yesterday_weather.temp : null,
        max: yesterday_weather ? yesterday_weather.temp_max : null,
        min: yesterday_weather ? yesterday_weather.temp_min : null,
      },
    },
  };
};

export const responseFromDailyWeatherFeedback = ({ userId, daily_weather }) => {
  return {
    user: {
      id: userId,
    },
    daily: {
      weatherId: daily_weather.weatherId,
      feedback: daily_weather.feeling_status,
    },
  };
};
