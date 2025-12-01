import {
  responseFromAI,
  responseFromKeywordImages,
  responseFromKeywords,
} from "../dtos/ai.dto.js";
import {
  getDailyWeatherByUserIdAndDtAndDtype,
  getDailyWeatherByUserIdAndWeatherId,
  patchDailyWeather,
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
import { delay } from "../utils/date.util.js";
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
  let dailyWeather = await getDailyWeatherByUserIdAndWeatherId(
    user.userId,
    weather.id
  );
  if (!dailyWeather) {
    throw new InvalidRequestError("오늘 날씨 값을 찾을 수 없습니다.");
  }

  for (let i = 0; dailyWeather.is_keyword_generating && i <= 11; i++) {
    if (i === 11) {
      throw new InvalidRequestError(
        "키워드 생성이 지연되고 있습니다. 잠시 후 다시 시도해주세요."
      );
    }
    await delay(1000);
    dailyWeather = await getDailyWeatherByUserIdAndWeatherId(
      user.userId,
      weather.id
    );
  }

  let dailyCloth = await getDailyClothByDailyId(dailyWeather.id);

  if (dailyCloth.length === 0) {
    await patchDailyWeather(dailyWeather.id, {
      is_keyword_generating: true,
    });
    const feels_like_user =
      weather.feels_like +
      (user.weather_correction ? user.weather_correction : 0);
    const keywords = await genaiClothingRecommender(
      feels_like_user,
      getSeason()
    );
    await addDailyCloth(dailyWeather.id, keywords);
    dailyCloth = await getDailyClothByDailyId(dailyWeather.id);
    await patchDailyWeather(dailyWeather.id, {
      is_keyword_generating: false,
    });
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
  let dailyWeather = await getDailyWeatherByUserIdAndWeatherId(
    user.userId,
    weather.id
  );
  if (!dailyWeather) {
    throw new InvalidRequestError("오늘 날씨 값을 찾을 수 없습니다.");
  }

  for (let i = 0; dailyWeather.is_keyword_generating && i <= 11; i++) {
    if (i === 11) {
      throw new InvalidRequestError(
        "키워드 생성이 지연되고 있습니다. 잠시 후 다시 시도해주세요."
      );
    }
    await delay(1000);
    dailyWeather = await getDailyWeatherByUserIdAndWeatherId(
      user.userId,
      weather.id
    );
  }

  let dailyCloth = await getDailyClothByDailyId(dailyWeather.id);

  if (dailyCloth.length === 0) {
    await patchDailyWeather(dailyWeather.id, {
      is_keyword_generating: true,
    });
    const feels_like_user =
      weather.feels_like +
      (user.weather_correction ? user.weather_correction : 0);
    const keywords = await genaiClothingRecommender(
      feels_like_user,
      getSeason()
    );
    await addDailyCloth(dailyWeather.id, keywords);
    dailyCloth = await getDailyClothByDailyId(dailyWeather.id);
    await patchDailyWeather(dailyWeather.id, {
      is_keyword_generating: false,
    });
  }

  for (let i = 0; dailyWeather.is_image_generating && i <= 11; i++) {
    if (i === 11) {
      throw new InvalidRequestError(
        "이미지 생성이 지연되고 있습니다. 잠시 후 다시 시도해주세요."
      );
    }
    await delay(1000);
    dailyWeather = await getDailyWeatherByUserIdAndWeatherId(
      user.userId,
      weather.id
    );
  }

  let dailyImages = await getDailyClothImagesByDailyClothId(dailyCloth[0].id);

  if (dailyImages.length === 0) {
    await patchDailyWeather(dailyWeather.id, {
      is_image_generating: true,
    });
    const keywords = dailyCloth[0].ClothKeywords.map((cloth) => cloth.keyword);
    const imagePromises = [
      genaiClothingRecommenderImage(keywords, "male", 0),
      genaiClothingRecommenderImage(keywords, "female", 1),
      genaiClothingRecommenderImage(keywords, "male", 2),
      genaiClothingRecommenderImage(keywords, "female", 3),
    ];

    const imageUrls = await Promise.all(imagePromises);
    dailyImages = await addDailyClothImages(dailyCloth[0].id, imageUrls);
    await patchDailyWeather(dailyWeather.id, {
      is_image_generating: false,
    });
  }
  await patchDailyWeather(dailyWeather.id, {
    is_image_generating: false,
  });
  return responseFromKeywordImages({
    user,
    images: dailyImages,
  });
};
