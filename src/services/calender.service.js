import {
  responseFromCalendar,
  responseFromCalendarDetail,
} from "../dtos/calender.dto.js";
import {
  getWeathersByUserIdAndCalenderDateAndDtype,
  getWeatherByUserIdAndCalenderDateAndDtype,
} from "../repositories/calender.repository.js";
import { getDailyWeatherByUserIdAndDtAndDtype } from "../repositories/weather.repository.js";

export const getCalenderForUser = async ({ userId, startDate, endDate }) => {
  const weathers = await getWeathersByUserIdAndCalenderDateAndDtype(
    userId,
    startDate,
    endDate,
    "forecast_daily"
  );
  return responseFromCalendar({ weathers });
};
export const getCalenderDetailForUser = async ({ userId, date }) => {
  const weather = await getWeatherByUserIdAndCalenderDateAndDtype(
    userId,
    date,
    "forecast_daily"
  );
  const yesterday_dt = date - 24 * 60 * 60;
  const yesterday_weather = await getDailyWeatherByUserIdAndDtAndDtype(
    userId,
    yesterday_dt,
    "forecast_daily"
  );
  return responseFromCalendarDetail({ weather, yesterday_weather });
};
