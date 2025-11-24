import { StatusCodes } from "http-status-codes";
import { bodyToSignUp, bodyToSignIn } from "../dtos/auth.dto.js";
import { signUp, signIn } from "../services/auth.service.js";

export const handleSignUp = async (req, res, next) => {
  /*
  #swagger.tags = ['Auth']
    #swagger.summary = '회원가입'
    #swagger.description = '회원가입을 위한 API입니다. 이메일, 이름, 아이디, 비밀번호를 포함해 요청해야 합니다.'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              loginId: { type: 'string', example: 'username' },
              email: { type: 'string', example: 'email@email.com' },
              name: { type: 'string', example: '이름' },
              password: { type: 'string', example: '비밀번호' },
            },
            required: ['email', 'name', 'password']
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: '회원가입 성공',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resultType: { type: 'string', example: 'SUCCESS' },
              error: { type: 'object', example: null },
              success: {
                type: 'object',
                properties: {
                  userId: { type: 'number', example: 1 },
                  loginId: { type: 'string', example: 'username' },
                  email: { type: 'string', example: 'email@email.com' },
                  name: { type: 'string', example: '이름' },
                  createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
                  updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: '아이디 또는 이메일 중복',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resultType: { type: 'string', example: 'FAIL' },
              error: {
                type: 'object',
                properties: {
                  errorCode: { type: 'string', example: 'duplicate_email' },
                  reason: { type: 'string', example: '이미 존재하는 아이디 또는 이메일입니다.' },
                  data: { type: 'object', example: null }
                }
              },
              success: { type: 'object', example: null }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: '잘못된 요청',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resultType: { type: 'string', example: 'FAIL' },
              error: {
                type: 'object',
                properties: {
                  errorCode: { type: 'string', example: 'invalid_request' },
                  reason: { type: 'string', example: '요청 데이터가 잘못되었습니다.' },
                  data: { type: 'object', example: null }
                }
              },
              success: { type: 'object', example: null }
            }
          }
        }
      }
    }
*/
  const auth = await signUp(bodyToSignUp(req.body));
  res.status(StatusCodes.OK).success(auth);
};

export const handleSignIn = async (req, res, next) => {
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = '로그인'
    #swagger.description = '로그인을 위한 API입니다. 이메일, 비밀번호를 포함해 요청해야 합니다.'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              loginId: { type: 'string', example: 'username' },
              password: { type: 'string', example: '비밀번호' },
            },
            required: ['email', 'password']
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: '로그인 성공',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resultType: { type: 'string', example: 'SUCCESS' },
              error: { type: 'object', example: null },
              success: {
                type: 'object',
                properties: {
                  userId: { type: 'number', example: 1 },
                  createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
                  updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: '잘못된 요청',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resultType: { type: 'string', example: 'FAIL' },
              error: {
                type: 'object',
                properties: {
                  errorCode: { type: 'string', example: 'invalid_request' },
                  reason: { type: 'string', example: '요청 데이터가 잘못되었습니다.' },
                  data: { type: 'object', example: null }
                }
              },
              success: { type: 'object', example: null }
            }
          }
        }
      }
    }
*/
  const auth = await signIn(bodyToSignIn(req.body));
  res.status(StatusCodes.OK).success(auth);
};
