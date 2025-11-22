import { responseFromAI, responseFromKeywords } from "../dtos/ai.dto.js";
import { getDailyWeatherByUserIdAndWeatherId } from "../repositories/weather.repository.js";
import { genaiClient, genaiClothingRecommender } from "../utils/genai.util.js";
import { openaiClient, openaiModels } from "../utils/openai.util.js";
import {
  getDailyClouthByDailyId,
  addDailyCloth,
} from "../repositories/dailyClouth.repository.js";
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
    let dailyCloth = await getDailyClouthByDailyId(daily.id);

    if (dailyCloth.length === 0) {
      {
        const feels_like_user =
          weather.feels_like +
          (user.weather_correction ? user.weather_correction : 0);
        const keywords = await genaiClothingRecommender(
          feels_like_user,
          season
        );
        dailyCloth = await addDailyCloth(daily.id, keywords);
      }
    }
    return responseFromKeywords({ user, dailyCloths: dailyCloth });
  }
};
