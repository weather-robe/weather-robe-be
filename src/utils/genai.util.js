import ai from "../configs/genai.config.js";
import { genaiModels } from "../models/genai.model.js";
import fs from "fs";
import { uploadImageToS3 } from "./aws.util.js";

export const getGenaiModels = async () => {
  const response = await ai.models.list();
  console.log(response);
  return response.pageInternal.map((model) => model.name);
};

export const genaiClient = async (
  contents,
  model = genaiModels.GEMINI_2_5_FLASH
) => {
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

export const genaiImageClient = async (
  contents,
  model = genaiModels.GEMINI_2_5_FLASH_PREVIEW_IMAGE
) => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
    });
    return response;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const genaiClothingRecommenderImage = async (
  keywords,
  gender = "male", // 'male' 또는 'female'을 받도록 변경
  index = 0, // 파일 저장을 위한 인덱스 추가
  model = genaiModels.GEMINI_2_5_FLASH_IMAGE
) => {
  // 💡 성별에 따른 모델 정보 설정
  let subject;
  if (gender === "male") {
    subject = "a 20s Korean adult male (175cm tall, 70kg weight)";
  } else if (gender === "female") {
    subject = "a 20s Korean adult female (162cm tall, 45kg weight)";
  } else {
    throw new Error("Invalid gender specified. Use 'male' or 'female'.");
  }

  const contents = `
    Generate **one single, distinct, full-body image**.
    
    The image must feature **only one model** against a **solid white background**.
    
    The outfit in the image should be based on the following clothing keywords: **${keywords.join(
      ", "
    )}**. 
    
    The model should be: **${subject}**.
    The image style must be a realistic photo.
    All models must be facing the camera **(front view)**. The clothing items must clearly correspond to the provided keywords. 
    `;

  const response = await ai.models.generateContent({
    model: model,
    contents: contents,
    config: {
      numberOfImages: 1,
    },
  });

  const part = response.candidates[0].content.parts.find((p) => p.inlineData);

  if (part && part.inlineData) {
    const imageData = part.inlineData.data;
    try {
      const imageUrl = await uploadImageToS3(imageData, "daily-cloth-images");
      console.log(`Image successfully uploaded to S3: ${imageUrl}`);
      return imageUrl;
    } catch (s3Error) {
      console.error("S3 Upload Error:", s3Error);
      throw s3Error;
    }
  } else if (response.text) {
    console.log(
      "Image generation failed, received text response instead:",
      response.text
    );
    throw new Error("이미지 생성에 실패했습니다: 텍스트 응답이 반환됨.");
  } else {
    console.log("Image generation failed. No inlineData found.");
    throw new Error("이미지 생성에 실패했습니다: 이미지 데이터 없음.");
  }
};
