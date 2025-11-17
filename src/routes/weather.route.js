import express from "express";
import { handleGetWeatherToday } from "../controllers/weather.controller.js";
const route = express.Router();

route.get("/", handleGetWeatherToday);

export default route;
