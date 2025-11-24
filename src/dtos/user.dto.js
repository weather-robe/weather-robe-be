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
