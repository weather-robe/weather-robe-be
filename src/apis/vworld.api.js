import axios from "axios";

export const coordsToAddress = async (latitude, longitude, type = "PARCEL") => {
  try {
    const url = `${process.env.DEFAULT_VWORLD_URL}/address?service=address&request=getAddress&key=${process.env.VWORLD_API_KEY}&point=${longitude},${latitude}&format=json&type=${type}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching address from coordinates:", error);
  }
};

export const addressToCoords = async (address, type = "PARCEL") => {
  try {
    const url = `${process.env.DEFAULT_VWORLD_URL}/address?service=address&request=getcoord&key=${process.env.VWORLD_API_KEY}&address=${address}&format=json&type=${type}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching coordinates from address:", error);
  }
};
