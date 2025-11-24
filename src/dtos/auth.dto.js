export const bodyToSignUp = (body) => {
  return {
    loginId: body.loginId,
    name: body.name,
    email: body.email,
    password: body.password,
  };
};
export const bodyToSignIn = (body) => {
  return {
    loginId: body.loginId,
    password: body.password,
  };
};

export const responseFromAuth = ({ auth }) => {
  return {
    userId: auth.id,
    createdAt: auth.createdAt,
    updatedAt: auth.updatedAt,
  };
};
