import { createHashedString } from "../utils/crypto.util.js";

export const requestForUpdateUser = (user, body) => {
  return {
    user,
    updateData: {
      name: body.name,
      password: createHashedString(body.password),
    },
  };
};

export const requestForUpdateUserLocation = (user, body) => {
  return {
    user,
    locationData: {
      latitude: body.latitude,
      longitude: body.longitude,
    },
  };
};

export const responseFromUser = ({ user }) => {
  return {
    userId: user.id,
    loginId: user.loginId,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const responseFromUserWithLocation = ({ user, address }) => {
  return {
    userId: user.id,
    address: `${address.level1} ${address.level2}`,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
