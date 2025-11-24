import fs from "fs";
import path from "path";

export const saveGeneratedImages = async (
  response,
  outputDir = "generated_images"
) => {
  // 1. 저장 디렉토리 생성 (없으면)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const savedPaths = [];

  // 2. 응답의 candidates 배열 순회
  for (let i = 0; i < response.candidates.length; i++) {
    const candidate = response.candidates[i];

    // 3. inlineData (Base64 이미지 데이터) 추출
    const imagePart = candidate.content.parts.find(
      (part) => part.inlineData && part.inlineData.mimeType.startsWith("image/")
    );

    if (imagePart) {
      const { data, mimeType } = imagePart.inlineData;

      // 파일 확장자 결정 (예: image/jpeg -> .jpeg)
      const extension = mimeType.split("/")[1] || "png";

      // 파일 이름 생성 (예: image_1_timestamp.jpeg)
      const filename = `image_${i + 1}_${Date.now()}.${extension}`;
      const filePath = path.join(outputDir, filename);

      try {
        // 4. Base64 데이터를 Buffer로 변환 (디코딩)
        const imageBuffer = Buffer.from(data, "base64");

        // 5. 파일 시스템에 Buffer를 바이너리 파일로 저장
        fs.writeFileSync(filePath, imageBuffer);
        savedPaths.push(filePath);
      } catch (error) {
        console.error(`Error saving image ${i + 1}:`, error);
      }
    }
  }

  return savedPaths;
};
