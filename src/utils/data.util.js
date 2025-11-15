import axios from "axios";
import {
  getFormattedToday,
  getFormattedTime,
  getFormattedYesterday,
} from "./date.util.js";

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
  searchDate = getFormattedToday("dash"),
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

export const currentUltraSrtPop = async (
  nx = 55,
  ny = 127,
  base_date = parseInt(getFormattedTime(new Date())) < 600
    ? getFormattedYesterday()
    : getFormattedToday(),
  base_time = "0600",
  pageNo = 1,
  numOfRows = 100,
  dataType = "json"
) => {
  try {
    const url = `${process.env.DEFAULT_POP_URL}/getUltraSrtNcst?serviceKey=${process.env.DATA_API_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;
    const response = await axios.get(url);
    console.log(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching ultra short-term POP:", error);
  }
};

export const forecastUltraSrtPop = async (
  nx = 55,
  ny = 127,
  base_date = parseInt(getFormattedTime(new Date())) < 600
    ? getFormattedYesterday()
    : getFormattedToday(),
  base_time = "0600",
  pageNo = 1,
  numOfRows = 100,
  dataType = "json"
) => {
  try {
    const url = `${process.env.DEFAULT_POP_URL}/getUltraSrtFcst?serviceKey=${process.env.DATA_API_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;
    const response = await axios.get(url);
    console.log(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching ultra short-term POP forecast:", error);
  }
};

export const forecastSrtPop = async (
  nx = 55,
  ny = 127,
  base_date = parseInt(getFormattedTime(new Date())) < 600
    ? getFormattedYesterday()
    : getFormattedToday(),
  base_time = "0600",
  pageNo = 1,
  numOfRows = 100,
  dataType = "json"
) => {
  try {
    const url = `${process.env.DEFAULT_POP_URL}/getVilageFcst?serviceKey=${process.env.DATA_API_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;
    const response = await axios.get(url);
    console.log(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching short-term POP forecast:", error);
  }
};
