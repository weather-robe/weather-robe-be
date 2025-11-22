export const requestForWeatherLocation = (user, latitude, longitude) => {
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
      feels_like: daily_weather.feels_like,
      humidity: daily_weather.humidity,
      pop: daily_weather.pop ? daily_weather.pop : 0,
      rain: daily_weather.rain ? daily_weather.rain : 0,
      snow: daily_weather.snow ? daily_weather.snow : 0,
      wind_speed: daily_weather.wind_speed,
      wind_deg: daily_weather.wind_deg,
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

export const responseFromHourlyWeather = ({ user, hourly_weathers }) => {
  return {
    user: {
      id: user.id,
    },
    hourly: hourly_weathers.map((weather) => ({
      weatherId: weather.id,
      date: new Date(weather.dt * 1000).toISOString().split("T")[0],
      time: new Date(weather.dt * 1000).toISOString().split("T")[1].slice(0, 5),
      temp: weather.temp,
      feels_like: weather.feels_like,
      weather: weather.main,
      pop: weather.pop ? weather.pop : 0,
      rain: weather.rain ? weather.rain : 0,
      humidity: weather.humidity,
      wind_speed: weather.wind_speed,
      wind_deg: weather.wind_deg,
    })),
    pm10: hourly_weathers.length > 0 ? hourly_weathers[0].pm10 : null,
    pm25: hourly_weathers.length > 0 ? hourly_weathers[0].pm25 : null,
  };
};

export const responseFromDailyWeather = ({
  user,
  weathers,
  time_blocks,
  yesterday_weather,
}) => {
  return {
    user: {
      id: user.id,
    },
    daily: weathers.map((weather, index) => ({
      weatherId: weather.id,
      date: new Date(weather.dt * 1000).toISOString().split("T")[0],
      weather: weather.main,
      temp: {
        max: weather.temp_max,
        min: weather.temp_min,
        morning: (time_blocks[index].morn + time_blocks[index].night) / 2,
        afternoon: (time_blocks[index].day + time_blocks[index].eve) / 2,
      },
      pop: weather.pop ? weather.pop : 0,
    })),
    yesterday: {
      weatherId: yesterday_weather ? yesterday_weather.id : null,
      date: yesterday_weather
        ? new Date(yesterday_weather.dt * 1000).toISOString().split("T")[0]
        : null,
      temp: {
        max: yesterday_weather ? yesterday_weather.temp_max : null,
        min: yesterday_weather ? yesterday_weather.temp_min : null,
      },
    },
  };
};
