import express from "express";
import {
  handleGetWeatherToday,
  handleSetFeedbackWeather,
} from "../controllers/weather.controller.js";
import { verifyWeatherId } from "../middlewares/weather.middleware.js";
const route = express.Router();

route.get("/", handleGetWeatherToday);
route.post("/:weatherId", verifyWeatherId, handleSetFeedbackWeather);
export default route;
