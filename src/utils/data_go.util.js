import axios from "axios";
import { getFormattedToday } from "./date.util.js";

export const currentAirPollution = async (
  sidoName,
  returnType = "json",
  numberOfRows = 100,
  pageNo = 1,
  ver = "1.3"
) => {
  try {
    const url = `${process.env.DEFAULT_AIR_POLLUTION_URL}/getCtprvnRltmMesureDnsty?serviceKey=${process.env.DATA_GO_API_KEY}&returnType=${returnType}&numOfRows=${numberOfRows}&pageNo=${pageNo}&sidoName=${sidoName}&ver=${ver}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching current air pollution:", error);
  }
};

export const forecastUltrafineDust = async (
  returnType = "json",
  numberOfRows = 100,
  pageNo = 1,
  searchDate = getFormattedToday()
) => {
  try {
    const url = `${process.env.DEFAULT_AIR_POLLUTION_URL}/getMinuDustFrcstDspth?serviceKey=${process.env.DATA_GO_API_KEY}&returnType=${returnType}&numOfRows=${numberOfRows}&pageNo=${pageNo}&searchDate=${searchDate}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast ultrafine dust:", error);
  }
};
