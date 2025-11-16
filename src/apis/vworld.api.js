import axios from "axios";

export const coordsToAddress = async (
  latitude = 37.5674,
  longitude = 126.9755
) => {
  try {
    const url = `${process.env.DEFAULT_VWORLD_URL}?service=data&request=GetFeature&data=LT_C_ADSIGG_INFO&geomFilter=POINT(${longitude} ${latitude})&key=${process.env.VWORLD_API_KEY}&geometry=false&format=json`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching address from coordinates:", error);
  }
};
