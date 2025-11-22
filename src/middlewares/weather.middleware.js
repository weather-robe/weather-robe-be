import { NotFoundError } from "../errors/common.error.js";
import { getWeather } from "../repositories/weather.repository.js";

export const verifyWeatherId = async (req, res, next) => {
  const paramWeatherId = req.params.weatherId;
  const parseIntedWeatherId = parseInt(paramWeatherId, 10);
  const weather = await getWeather(parseIntedWeatherId);
  if (!weather) {
    return next(new NotFoundError("존재하지 않는 날씨 정보입니다."));
  }
  req.weather = weather;
  return next();
};
