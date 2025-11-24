import { StatusCodes } from "http-status-codes";
import {
  userProfile,
  updateUserProfile,
  updateUserLocation,
} from "../services/user.service.js";
import {
  requestForUpdateUser,
  requestForUpdateUserLocation,
} from "../dtos/user.dto.js";

export const handleUserProfile = async (req, res, next) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = '유저 프로필 조회'
    #swagger.description = '유저 프로필 조회를 위한 API입니다.'

    #swagger.responses[200] = {
      description: '유저 프로필 조회 성공',
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
                  email: { type: 'string', example: 'email@email.com' },
                  name: { type: 'string', example: '이름' },
                  username: { type: 'string', example: 'username' },
                  avatar: { type: 'string', example: 'avatar.png' },
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
  const userId = req.user.userId;
  const user = await userProfile(userId);
  res.status(StatusCodes.OK).success(user);
};

export const handleUpdateUserProfile = async (req, res, next) => {
  /*
  #swagger.tags = ['User']
  #swagger.summary = '유저 프로필 수정'
  #swagger.description = '유저 프로필 수정을 위한 API입니다.'
  #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', example: '새 이름' },
            password: { type: 'string', example: '새 비밀번호' }
          },
          required: []
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: '유저 프로필 조회 성공',
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
                email: { type: 'string', example: 'email@email.com' },
                name: { type: 'string', example: '이름' },
                username: { type: 'string', example: 'username' },
                avatar: { type: 'string', example: 'avatar.png' },
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
  const user = req.user;
  const result = await updateUserProfile(requestForUpdateUser(user, req.body));
  res.status(StatusCodes.OK).success(result);
};

export const handleUpdateUserLocation = async (req, res, next) => {
  /*
  #swagger.tags = ['User']
  #swagger.summary = '유저 위치 설정'
  #swagger.description = '유저 위치 설정을 위한 API입니다.'
  #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            latitude: { type: 'number', example: 37.5665 },
            longitude: { type: 'number', example: 126.978 }
          },
          required: ['latitude', 'longitude']
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: '유저 위치 설정 성공',
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
                address: { type: 'string', example: '서울특별시 중구' },
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
  const user = req.user;
  const result = await updateUserLocation(
    requestForUpdateUserLocation(user, req.body)
  );
  res.status(StatusCodes.OK).success(result);
};
