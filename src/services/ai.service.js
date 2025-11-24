import {
  responseFromAI,
  responseFromKeywordImages,
  responseFromKeywords,
} from "../dtos/ai.dto.js";
import { getDailyWeatherByUserIdAndWeatherId } from "../repositories/weather.repository.js";
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

const season = (() => {
  const month = new Date().getMonth() + 1;
  if ([12, 1, 2].includes(month)) return "winter";
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  return "autumn";
})();

export const getKeywordsFromAI = async ({ user, weather }) => {
  const daily = await getDailyWeatherByUserIdAndWeatherId(
    user.userId,
    weather.id
  );
  if (daily) {
    let dailyCloth = await getDailyClothByDailyId(daily.id);

    if (dailyCloth.length === 0) {
      {
        const feels_like_user =
          weather.feels_like +
          (user.weather_correction ? user.weather_correction : 0);
        const keywords = await genaiClothingRecommender(
          feels_like_user,
          season
        );
        await addDailyCloth(daily.id, keywords);
        dailyCloth = await getDailyClothByDailyId(daily.id);
      }
    }
    return responseFromKeywords({ user, dailyCloths: dailyCloth });
  }
};

export const getKeywordImagesFromAI = async ({ user, weather }) => {
  const daily = await getDailyWeatherByUserIdAndWeatherId(
    user.userId,
    weather.id
  );
  if (!daily) {
    throw new Error("daily 없음");
  }
  let dailyCloth = await getDailyClothByDailyId(daily.id);
  if (dailyCloth.length === 0) {
    {
      const feels_like_user =
        weather.feels_like +
        (user.weather_correction ? user.weather_correction : 0);
      const keywords = await genaiClothingRecommender(feels_like_user, season);
      await addDailyCloth(daily.id, keywords);
      dailyCloth = await getDailyClothByDailyId(daily.id);
    }
  }
  const keywords = dailyCloth[0].ClothKeywords.map((cloth) => cloth.keyword);
  // const imagePromises = [
  //   genaiClothingRecommenderImage(keywords, "male", 0),
  //   genaiClothingRecommenderImage(keywords, "female", 1),
  //   genaiClothingRecommenderImage(keywords, "male", 2),
  //   genaiClothingRecommenderImage(keywords, "female", 3),
  // ];

  // const imageResponses = await Promise.all(imagePromises);

  const imageUrls = ["1", "2", "3", "4"]; // 실제로는 imageResponses의 데이터를 S3에 저장 후 URL을 받아와야 합니다.
  let dailyImages = await getDailyClothImagesByDailyClothId(dailyCloth[0].id);
  if (dailyImages.length === 0) {
    dailyImages = await addDailyClothImages(dailyCloth[0].id, imageUrls);
  }
  return responseFromKeywordImages({
    user,
    dailyCloth: dailyCloth[0],
    images: dailyImages,
  });
};
