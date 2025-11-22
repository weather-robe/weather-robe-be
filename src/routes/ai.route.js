import express from "express";
import {
  handleGenAI,
  handleOpenAI,
  handleGetKeywords,
} from "../controllers/ai.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { verifyWeatherId } from "../middlewares/weather.middleware.js";
const route = express.Router();

//route.post("/genai", verifyAccessToken, handleGenAI);
//route.post("/openai", verifyAccessToken, handleOpenAI);
route.post("/weather/:weatherId/keyword", verifyWeatherId, handleGetKeywords);

export default route;
