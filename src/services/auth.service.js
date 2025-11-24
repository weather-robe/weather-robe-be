import { responseFromUser } from "../dtos/user.dto.js";
import { addUser, getUser } from "../repositories/user.repository.js";
import { getUserSignIn } from "../repositories/auth.repository.js";
import { DuplicateError } from "../errors/auth.error.js";
import { responseFromAuth } from "../dtos/auth.dto.js";
import { createHashedString } from "../utils/crypto.util.js";
import { InvalidRequestError } from "../errors/common.error.js";

export const signUp = async (data) => {
  const hashedPassword = createHashedString(data.password);
  const userId = await addUser({
    loginId: data.loginId,
    email: data.email,
    name: data.name,
    password: hashedPassword,
  });

  if (userId.loginId === null) {
    throw new DuplicateError("이미 존재하는 아이디입니다.", data);
  }
  if (userId.email === null) {
    throw new DuplicateError("이미 존재하는 이메일입니다.", data);
  }

  const user = await getUser(userId);
  return responseFromUser({
    user,
  });
};

export const signIn = async (data) => {
  const hashedPassword = createHashedString(data.password);
  const user = await getUserSignIn({
    loginId: data.loginId,
  });

  if (user === null || user.password !== hashedPassword) {
    throw new InvalidRequestError("이메일 또는 비밀번호가 일치하지 않습니다.");
  }

  const auth = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return responseFromAuth({
    auth,
  });
};
