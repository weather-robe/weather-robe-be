import { S3_BUCKET_NAME, s3Client } from "../configs/aws.config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export const uploadImageToS3 = async (
  base64Data,
  keyPrefix = "cloth_images"
) => {
  if (!S3_BUCKET_NAME) {
    throw new Error("S3_BUCKET_NAME is not defined in environment variables.");
  }

  const buffer = Buffer.from(base64Data, "base64");

  const fileKey = `${keyPrefix}/${uuidv4()}.png`;

  const uploadParams = {
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
    Body: buffer,
    ContentType: "image/png",
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    const imageUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    return imageUrl;
  } catch (error) {
    console.error("S3 upload failed:", error);
    throw new Error("S3 이미지 업로드에 실패했습니다.");
  }
};
