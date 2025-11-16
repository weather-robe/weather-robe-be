import { StatusCodes } from "http-status-codes";
import { userProfile } from "../services/user.service.js";

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
