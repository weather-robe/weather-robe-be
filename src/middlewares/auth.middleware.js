// 확장성을 위해 일단 남겨둠
import {
  AuthError,
  ExpirationAccessTokenError,
  NotAccessTokenError,
} from "../errors/auth.error.js";
import { getUser } from "../repositories/user.repository.js";
import { parseBearerToken, verifyJwt } from "../utils/jwt.util.js";

export const verifyAccessToken = (req, res, next) => {
  const token = parseBearerToken(req.headers.authorization);
  if (!token) {
    return next(new AuthError("Access Token이 없습니다."));
  }
  try {
    const decoded = verifyJwt(token);

    if (decoded.payload.type !== "AT") {
      return next(new NotAccessTokenError("Access Token이 아닙니다."));
    }

    req.user = req.user || {};
    req.user.userId = decoded.payload.userId;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(ExpirationAccessTokenError("Access Token이 만료되었습니다."));
    }
    return next(new NotAccessTokenError("유효하지 않은 토큰입니다."));
  }
};

// 솔직히 구조는 마음에 안들긴 한데, 일단은 이렇게... 나중에 토큰이나 세션 방식으로 바꾸게 되면 자연스럽게 사라질 듯
export const verifyUserId = async (req, res, next) => {
  const paramUserId = req.params.userId;
  const parseIntedUserId = parseInt(paramUserId, 10);
  const user = await getUser(parseIntedUserId);
  if (!user) {
    return next(new AuthError("존재하지 않는 사용자입니다."));
  }
  req.user = user;
  return next();
};
