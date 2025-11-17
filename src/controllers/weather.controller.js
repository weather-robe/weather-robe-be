import { StatusCodes } from "http-status-codes";
import { getWeatherToday } from "../services/weather.service.js";

export const handleGetWeatherToday = async (req, res, next) => {
  const user = req.user;
  const { latitude, longitude } = req.query;
  const weather = await getWeatherToday(user, latitude, longitude);

  res.status(StatusCodes.OK).success(weather);
};
