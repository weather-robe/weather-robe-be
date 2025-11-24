import { dateTimeToDt, dtToDateTime } from "../utils/date.util.js";

export const requestForCalender = (userId, startDate, endDate) => {
  return {
    userId,
    startDate: dateTimeToDt(new Date(startDate)),
    endDate: dateTimeToDt(new Date(endDate)),
  };
};

export const requestForCalenderDetail = (userId, date) => {
  return {
    userId,
    date: dateTimeToDt(new Date(date)),
  };
};

export const responseFromCalendar = ({ weathers }) => {
  const weather = weathers.map((w) => ({
    date: dtToDateTime(w.dt).toISOString().split("T")[0],
    weather: w.main,
    temp_max: w.temp_max,
    temp_min: w.temp_min,
    feeling_status: w.DailyWeathers[0]
      ? w.DailyWeathers[0].feeling_status
      : null,
    cloth_keywords: w.DailyWeathers[0]
      ? w.DailyWeathers[0].DailyCloths.map((dc) =>
          dc.ClothKeywords.map((ck) => ck.keyword)
        ).flat()
      : [],
  }));
  return {
    weathers: weather,
  };
};

export const responseFromCalendarDetail = ({ weather }) => {
  if (!weather) {
    return {
      weather: null,
    };
  }
  const detailedWeather = {
    date: dtToDateTime(weather.dt).toISOString().split("T")[0],
    weather: weather.main,
    temp_max: weather.temp_max,
    temp_min: weather.temp_min,
    feeling_status: weather.DailyWeathers[0]
      ? weather.DailyWeathers[0].feeling_status
      : null,
    cloth_keywords: weather.DailyWeathers[0]
      ? weather.DailyWeathers[0].DailyCloths.map((dc) =>
          dc.ClothKeywords.map((ck) => ck.keyword)
        ).flat()
      : [],
  };
  return {
    weather: detailedWeather,
  };
};
