import { addressToCoords, coordsToAddress } from "../apis/vworld.api.js";

export const reverseGeocode = async (latitude, longitude) => {
  const response = await coordsToAddress(latitude, longitude);
  const data = {
    sido: response.response.result[0].structure.level1,
    address: response.response.result[0].structure,
  };
  return data;
};

export const geocode = async (address) => {
  const response = await addressToCoords(address);
  const data = {
    latitude: response.response.result.point.y,
    longitude: response.response.result.point.x,
  };
  return data;
};
