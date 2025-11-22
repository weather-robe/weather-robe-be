import express from "express";
import {
  handleGetDailyWeather,
  handleGetHourlyWeather,
  handleGetWeatherToday,
  handleSetFeedbackWeather,
} from "../controllers/weather.controller.js";
import { verifyWeatherId } from "../middlewares/weather.middleware.js";
const route = express.Router();

route.post("/today", handleGetWeatherToday);
route.post("/hourly", handleGetHourlyWeather);
route.post("/daily", handleGetDailyWeather);
route.post("/:weatherId", verifyWeatherId, handleSetFeedbackWeather);
export default route;
