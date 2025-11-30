import { StatusCodes } from "http-status-codes";
import {
  requestForCalender,
  requestForCalenderDetail,
} from "../dtos/calender.dto.js";
import {
  getCalenderForUser,
  getCalenderDetailForUser,
} from "../services/calender.service.js";

export const handleGetCalender = async (req, res) => {
  /*
  #swagger.tags = ['Calender']
  #swagger.summary = '캘린더 조회'
  #swagger.description = '캘린더 조회를 위한 API입니다. 시작 날짜와 종료 날짜를 쿼리 파라미터로 전달해야 합니다.'

  #swagger.parameters['startDate'] = {
    in: 'query',
    description: '캘린더 조회 시작 날짜 (YYYY-MM-DD)',
    required: true,
    type: 'string',
    example: '2025-11-01'
  }
  
  #swagger.parameters['endDate'] = {
    in: 'query',
    description: '캘린더 조회 종료 날짜 (YYYY-MM-DD)',
    required: true,
    type: 'string',
    example: '2025-11-30'
  }
  
  #swagger.responses[200] = {
    description: '캘린더 조회 성공',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            resultType: { type: 'string', example: 'SUCCESS' },
            error: { type: 'object', example: null },
            success: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', example: '2025-11-01' },
                  icon: { type: 'string', example: '01n' },
                  weather: { type: 'string', example: 'Rain' },
                  temp_max: { type: 'number', example: 25.5 },
                  temp_min: { type: 'number', example: 15.3 },
                  feeling_status: { type: 'string', example: "적당" },
                  keywords: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['패딩', '목도리', '내복']
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
                  reason: { type: 'string', example: '시작 날짜와 종료 날짜를 입력해주세요.' },
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
  const userId = req.user.id;
  const { startDate, endDate } = req.query;
  const result = await getCalenderForUser(
    requestForCalender(userId, startDate, endDate)
  );
  res.status(StatusCodes.OK).success(result);
};

export const handleGetCalenderDetail = async (req, res) => {
  /*
  #swagger.tags = ['Calender']
  #swagger.summary = '캘린더 상세 조회'
  #swagger.description = '캘린더 상세 조회를 위한 API입니다. 날짜를 경로 파라미터로 전달해야 합니다.'
  #swagger.parameters['date'] = {
    in: 'query',
    description: '캘린더 조회 시작 날짜 (YYYY-MM-DD)',
    required: true,
    type: 'string',
    example: '2025-11-25'
  }
  #swagger.responses[200] = {
    description: '캘린더 상세 조회 성공',
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
                date: { type: 'string', example: '2025-11-15' },
                icon: { type: 'string', example: '01n' },
                weather: { type: 'string', example: 'Rain' },
                temp_max: { type: 'number', example: 22.4 },
                temp_min: { type: 'number', example: 12.8 },
                feeling_status: { type: 'string', example: "적당" },
                text: { type: 'string', example: "오늘은 어제보다 따뜻해졌고, 비가 올 예정이니 우산을 챙기세요." },
                keywords: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  example: ['가디건', '청바지', '운동화']
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
                  reason: { type: 'string', example: '날짜를 입력해주세요.' },
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
  const userId = req.user.id;
  const date = req.query.date;
  const result = await getCalenderDetailForUser(
    requestForCalenderDetail(userId, date)
  );
  res.status(StatusCodes.OK).success(result);
};
