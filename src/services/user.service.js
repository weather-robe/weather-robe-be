import {
  responseFromUser,
  responseFromUserWithLocation,
} from "../dtos/user.dto.js";
import {
  getUser,
  patchUserLocation,
  updateUser,
} from "../repositories/user.repository.js";
import { reverseGeocode } from "../utils/geocoder.util.js";

export const userProfile = async (userId) => {
  const user = await getUser(userId);
  if (!user) {
    throw new InvalidRequestError("유저를 찾을 수 없습니다.");
  }
  return responseFromUser({
    user,
  });
};

export const updateUserProfile = async ({ user, updateData }) => {
  const updatedUser = await updateUser(user.id, updateData);
  return responseFromUser({
    user: updatedUser,
  });
};

export const updateUserLocation = async ({ user, locationData }) => {
  const { latitude, longitude } = locationData;
  const { sido, address } = await reverseGeocode(latitude, longitude);
  const updatedUser = await patchUserLocation(user.id, sido);
  return responseFromUserWithLocation({
    user: updatedUser,
    address: address,
  });
};
