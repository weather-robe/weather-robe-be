import { coordsToAddress } from "../apis/vworld.api.js";

export const reverseGeocode = async (latitude, longitude) => {
  const response = await coordsToAddress(latitude, longitude);
  const data = {
    sig_cd:
      response.response.result.featureCollection.features[0].properties.sig_cd,
    address:
      response.response.result.featureCollection.features[0].properties.full_nm,
  };
  return data;
};
