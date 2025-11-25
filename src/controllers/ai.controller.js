import { StatusCodes } from "http-status-codes";
import {
  sendMessageForGenAI,
  sendMessageForOpenAI,
  getKeywordsFromAI,
  getKeywordImagesFromAI,
} from "../services/ai.service.js";
import { bodyToAI, requestForWeatherKeyword } from "../dtos/ai.dto.js";

export const handleGenAI = async (req, res, next) => {
  /*
  #swagger.tags = ['AI']
  #swagger.summary = 'GenAI 메시지 전송'
  #swagger.description = 'GenAI 메시지를 전송하기 위한 API입니다.'
  #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Hello, AI' },
          },
          required: ['message']
        }
      }
    }
  }
  */
  try {
    const ai = await sendMessageForGenAI(
      req.user.userId,
      bodyToAI(req.body).message
    );
    res.status(StatusCodes.OK).success(ai);
  } catch (err) {
    return next(err);
  }
};

export const handleOpenAI = async (req, res, next) => {
  /*
  #swagger.tags = ['AI']
  #swagger.summary = 'OpenAI 메시지 전송'
  #swagger.description = 'OpenAI 메시지를 전송하기 위한 API입니다.'
  #swagger.requestBody = {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Hello, AI' },
          },
          required: ['message']
        }
      }
    }
  }
  */
  try {
    const ai = await sendMessageForOpenAI(
      req.user.userId,
      bodyToAI(req.body).message
    );
    res.status(StatusCodes.OK).success(ai);
  } catch (err) {
    return next(err);
  }
};

export const handleGetKeywords = async (req, res, next) => {
  /*
  #swagger.tags = ['AI']
  #swagger.summary = '의류 키워드 생성'
  #swagger.description = '사용자와 날씨 정보를 바탕으로 의류 키워드를 생성하는 API입니다.'
  #swagger.responses[200] = {
      description: '의류 키워드 조회 성공',
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
                  user: {
                    type: 'object',
                    properties: {
                      userId: { type: 'number', example: 1 }
                    }
                  },
                  weather: {
                    type: 'object',
                    properties: {
                      text: { type: 'string', example: '오늘은 맑고 따뜻한 날씨입니다.' },
                      keywords: {
                        type: 'array',
                        items: {
                          type: 'string'
                        },
                        example: ["후드티", "청바지", "목도리"]
                      }
                    }
                  }
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
                  reason: { type: 'string', example: '해당 일별 날씨 데이터가 없습니다.' },
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
  const weather = req.weather;
  const result = await getKeywordsFromAI(
    requestForWeatherKeyword(user, weather)
  );
  res.status(StatusCodes.OK).success(result);
};

export const handleGetKeywordImages = async (req, res, next) => {
  /*
  #swagger.tags = ['AI']
  #swagger.summary = '의류 사진 생성'
  #swagger.description = '의류 키워드를 바탕으로 사진을 생성하는 API입니다.'
  #swagger.responses[200] = {
      description: '의류 사진 조회 성공',
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
                  user: {
                    type: 'object',
                    properties: {
                      userId: { type: 'number', example: 1 }
                    }
                  },
                  images: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ["https://image1.com", "https://image2.com", "https://image3.com", "https://image4.com"]
                  }
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
                  reason: { type: 'string', example: '해당 일별 날씨 데이터가 없습니다.' },
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
  const weather = req.weather;
  const result = await getKeywordImagesFromAI(
    requestForWeatherKeyword(user, weather)
  );
  res.status(StatusCodes.OK).success(result);
};
