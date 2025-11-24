import express from "express";
import {
  handleGenAI,
  handleOpenAI,
  handleGetKeywords,
  handleGetKeywordImages,
} from "../controllers/ai.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { verifyWeatherId } from "../middlewares/weather.middleware.js";
import { genaiClothingRecommenderImage } from "../utils/genai.util.js";
import { saveGeneratedImages } from "../utils/image.util.js";
const route = express.Router();

//route.post("/genai", verifyAccessToken, handleGenAI);
//route.post("/openai", verifyAccessToken, handleOpenAI);
route.post("/:weatherId/keyword", verifyWeatherId, handleGetKeywords);
route.post("/:weatherId/image", verifyWeatherId, handleGetKeywordImages);

export default route;
