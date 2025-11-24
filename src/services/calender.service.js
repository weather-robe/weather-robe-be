import { responseFromCalendar } from "../dtos/calender.dto.js";
import { getWeathersByUserIdAndCalenderDateAndDtype } from "../repositories/calender.repository.js";

export const getCalenderForUser = async ({ userId, startDate, endDate }) => {
  const weathers = await getWeathersByUserIdAndCalenderDateAndDtype(
    userId,
    startDate,
    endDate,
    "forecast_daily"
  );
  return responseFromCalendar({ weathers });
};
export const getCalenderDetailForUser = async ({ userId, date }) => {};
