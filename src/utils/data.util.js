import axios from "axios";
import { getFormattedToday } from "./date.util.js";

export const currentAirPollution = async (
  sidoName,
  numberOfRows = 100,
  pageNo = 1,
  returnType = "json",
  ver = "1.3"
) => {
  try {
    const url = `${process.env.DEFAULT_AIR_POLLUTION_URL}/getCtprvnRltmMesureDnsty?serviceKey=${process.env.DATA_API_KEY}&returnType=${returnType}&numOfRows=${numberOfRows}&pageNo=${pageNo}&sidoName=${sidoName}&ver=${ver}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching current air pollution:", error);
  }
};

export const forecastUltrafineDust = async (
  searchDate = getFormattedToday(),
  numberOfRows = 100,
  pageNo = 1,
  returnType = "json"
) => {
  try {
    const url = `${process.env.DEFAULT_AIR_POLLUTION_URL}/getMinuDustFrcstDspth?serviceKey=${process.env.DATA_API_KEY}&returnType=${returnType}&numOfRows=${numberOfRows}&pageNo=${pageNo}&searchDate=${searchDate}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast ultrafine dust:", error);
  }
};
