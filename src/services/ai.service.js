import {
  responseFromAI,
  responseFromKeywordImages,
  responseFromKeywords,
} from "../dtos/ai.dto.js";
import {
  getDailyWeatherByUserIdAndDtAndDtype,
  getDailyWeatherByUserIdAndWeatherId,
} from "../repositories/weather.repository.js";
import {
  genaiClient,
  genaiClothingRecommender,
  genaiClothingRecommenderImage,
} from "../utils/genai.util.js";
import { openaiClient, openaiModels } from "../utils/openai.util.js";
import {
  getDailyClothByDailyId,
  addDailyCloth,
  addDailyClothImages,
  getDailyClothImagesByDailyClothId,
} from "../repositories/dailyCloth.repository.js";
import { genaiModels } from "../models/genai.model.js";
import { saveGeneratedImages } from "../utils/image.util.js";
import { getSeason } from "../utils/weather.util.js";
import { InvalidRequestError } from "../errors/common.error.js";
export const sendMessageForGenAI = async (userId, message) => {
  const ai = await genaiClient(genaiModels.GEMINI_2_5_FLASH, message);
  return responseFromAI({
    ai: { type: "GenAI", reply: ai.candidates[0].content.parts[0].text },
  });
};
export const sendMessageForOpenAI = async (userId, message) => {
  const ai = await openaiClient(openaiModels.GPT_5_NANO, message);
  return responseFromAI({
    ai: { type: "OpenAI", reply: ai.choices[0].message.content },
  });
};

export const getKeywordsFromAI = async ({ user, weather }) => {
  const dailyWeather = await getDailyWeatherByUserIdAndWeatherId(
    user.userId,
    weather.id
  );
  if (!dailyWeather) {
    throw new InvalidRequestError("오늘 날씨 값을 찾을 수 없습니다.");
  }
  let dailyCloth = await getDailyClothByDailyId(dailyWeather.id);

  if (dailyCloth.length === 0) {
    const feels_like_user =
      weather.feels_like +
      (user.weather_correction ? user.weather_correction : 0);
    const keywords = await genaiClothingRecommender(
      feels_like_user,
      getSeason()
    );
    await addDailyCloth(dailyWeather.id, keywords);
    dailyCloth = await getDailyClothByDailyId(dailyWeather.id);
  }
  const yesterday_dt = weather.dt - 24 * 60 * 60;
  const yesterday_weather = await getDailyWeatherByUserIdAndDtAndDtype(
    user.userId,
    yesterday_dt,
    weather.dtype
  );
  return responseFromKeywords({
    user,
    weather,
    yesterday_weather,
    dailyCloths: dailyCloth,
  });
};

export const getKeywordImagesFromAI = async ({ user, weather }) => {
  const dailyWeather = await getDailyWeatherByUserIdAndWeatherId(
    user.userId,
    weather.id
  );
  if (!dailyWeather) {
    throw new InvalidRequestError("오늘 날씨 값을 찾을 수 없습니다.");
  }
  let dailyCloth = await getDailyClothByDailyId(dailyWeather.id);
  if (dailyCloth.length === 0) {
    const feels_like_user =
      weather.feels_like +
      (user.weather_correction ? user.weather_correction : 0);
    const keywords = await genaiClothingRecommender(
      feels_like_user,
      getSeason()
    );
    await addDailyCloth(dailyWeather.id, keywords);
    dailyCloth = await getDailyClothByDailyId(dailyWeather.id);
  }

  let dailyImages = await getDailyClothImagesByDailyClothId(dailyCloth[0].id);

  if (dailyImages.length === 0) {
    const keywords = dailyCloth[0].ClothKeywords.map((cloth) => cloth.keyword);
    const imagePromises = [
      genaiClothingRecommenderImage(keywords, "male", 0),
      genaiClothingRecommenderImage(keywords, "female", 1),
      genaiClothingRecommenderImage(keywords, "male", 2),
      genaiClothingRecommenderImage(keywords, "female", 3),
    ];

    const imageUrls = await Promise.all(imagePromises);
    dailyImages = await addDailyClothImages(dailyCloth[0].id, imageUrls);
  }
  return responseFromKeywordImages({
    user,
    images: dailyImages,
  });
};
