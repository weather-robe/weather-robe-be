import ai from "../configs/genai.config.js";
import { genaiModels } from "../models/genai.model.js";

export const genaiClient = async (model, contents) => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
    });
    return response;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

export const clothingRecommenderConfig = Object.freeze({
  systemInstruction:
    "You are an expert weather and clothing consultant. Considering both the apparent temperature and the season, you must ONLY respond with a JSON array containing a maximum of 3 **Korean keywords**.",
  responseMimeType: "application/json",
});

export const genaiClothingRecommender = async (
  temperature,
  season,
  model = genaiModels.GEMINI_2_5_FLASH
) => {
  const contents = `Extract a maximum of 3 clothing recommendation keywords suitable for the apparent temperature of ${temperature}°C during the ${season} season, and return them as a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: clothingRecommenderConfig,
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
