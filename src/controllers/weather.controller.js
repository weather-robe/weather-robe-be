import { StatusCodes } from "http-status-codes";
import {
  getWeatherHourly,
  getWeatherDaily,
  getWeatherToday,
  setFeedbackWeather,
} from "../services/weather.service.js";
import {
  requestForWeatherLocation,
  requestForFeedbackWeather,
} from "../dtos/weather.dto.js";

export const handleGetWeatherToday = async (req, res, next) => {
  /*
    #swagger.tags = ['Weather']
    #swagger.summary = '오늘의 일기예보'
    #swagger.description = '현재, 오늘, 어제 온도 정보를 가져옵니다.'
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              latitude: { type: 'number', example: 37.5665 },
              longitude: { type: 'number', example: 126.978 }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: '오늘의 일기예보 조회 성공',
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
                  current: {
                    type: 'object',
                    properties: {
                      temp: { type: 'number', example: 5.45 },
                      weather: { type: 'string', example: 'Clouds' }
                    }
                  },
                  today: {
                    type: 'object',
                    properties: {
                      temp: { type: 'number', example: 3.1725 },
                      temp_max: { type: 'number', example: 7.24 },
                      temp_min: { type: 'number', example: -1.49 },
                      feels_like: { type: 'number', example: 1.6175 },
                      humidity: { type: 'number', example: 42 },
                      pop: { type: 'number', example: 0 },
                      rain: { type: 'number', nullable: true, example: null },
                      snow: { type: 'number', nullable: true, example: null },
                      wind_text: { type: 'string', example: '약함' },
                      wind_speed: { type: 'number', example: 4.54 },
                      wind_deg: { type: 'number', example: 253 },
                      pm10text: { type: 'string', example: '좋음' },
                      pm10: { type: 'number', example: 10 },
                      pm25text: { type: 'string', example: '좋음' },
                      pm25: { type: 'number', example: 3 }
                    }
                  },
                  yesterday: {
                    type: 'object',
                    properties: {
                      temp: { type: 'number', example: 2.1325 },
                      temp_max: { type: 'number', example: 7.57 },
                      temp_min: { type: 'number', example: -2.4 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  const user = req.user;
  const { latitude, longitude } = req.body;
  const result = await getWeatherToday(
    requestForWeatherLocation(user, latitude, longitude)
  );

  res.status(StatusCodes.OK).success(result);
};

export const handleSetFeedbackWeather = async (req, res, next) => {
  /*
    #swagger.tags = ['Weather']
    #swagger.summary = '날씨 피드백 설정'
    #swagger.description = '적당, 추움, 더움 지정합니다.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              feedback: { type: 'string', example: '적당' }
            },
            required: ['feedback']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: '날씨 피드백 설정 성공',
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
                  daily_weather: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 1 },
                      feedback: { type: 'string', example: '적당' }
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
    #swagger.responses[404] = {
      description: '존재하지 않는 날씨 정보',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resultType: { type: 'string', example: 'FAIL' },
              error: {
                type: 'object',
                properties: {
                  errorCode: { type: 'string', example: 'not_found' },
                  reason: { type: 'string', example: '존재하지 않는 날씨 정보입니다.' },
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
  const { feedback } = req.body;
  const result = await setFeedbackWeather(
    requestForFeedbackWeather(user.id, weather.id, feedback)
  );
  res.status(StatusCodes.OK).success(result);
};

export const handleGetHourlyWeather = async (req, res, next) => {
  /*
    #swagger.tags = ['Weather']
    #swagger.summary = '시간별 일기예보'
    #swagger.description = '48시간 온도 정보를 가져옵니다.'
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              latitude: { type: 'number', example: 37.5665 },
              longitude: { type: 'number', example: 126.978 }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: '시간별 일기예보 조회 성공',
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
                  hourly: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        weatherId: { type: 'number', example: 1 },
                        date: { type: 'string', example: '2023-10-01' },
                        time: { type: 'string', example: '15:00' },
                        temp: { type: 'number', example: 3.1725 },
                        feels_like: { type: 'number', example: 1.6175 },
                        weather: { type: 'string', example: 'Clouds' },
                        pop: { type: 'number', example: 0 },
                        rain: { type: 'number', nullable: true, example: null },
                        humidity: { type: 'number', example: 42 },
                        wind_text: { type: 'string', example: '약함' },
                        wind_speed: { type: 'number', example: 4.54 },
                        wind_deg: { type: 'number', example: 253 }
                      }
                    }
                  },
                  pm10text: { type: 'string', example: '좋음' },
                  pm10: { type: 'number', example: 10 },
                  pm25text: { type: 'string', example: '좋음' },
                  pm25: { type: 'number', example: 3 }
                }
              }
            }
          }
        }
      }
    }
  */
  const user = req.user;
  const { latitude, longitude } = req.body;
  const result = await getWeatherHourly(
    requestForWeatherLocation(user, latitude, longitude)
  );
  res.status(StatusCodes.OK).success(result);
};

export const handleGetDailyWeather = async (req, res, next) => {
  /*
    #swagger.tags = ['Weather']
    #swagger.summary = '일자별 일기예보'
    #swagger.description = '10알 온도 정보를 가져옵니다.'
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              latitude: { type: 'number', example: 37.5665 },
              longitude: { type: 'number', example: 126.978 }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: '날짜별 일기예보 조회 성공',
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
                  daily: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        weatherId: { type: 'number', example: 1 },
                        date: { type: 'string', example: '2023-10-01' },
                        temp: { type: 'object',
                          properties: {
                            max: { type: 'number', example: 7.24 },
                            min: { type: 'number', example: -1.49 },
                            morning: { type: 'number', example: 2.34 },
                            afternoon: { type: 'number', example: 5.67 }
                          }
                        },
                        pop: { type: 'number', example: 0 },
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
  */
  const user = req.user;
  const { latitude, longitude } = req.body;
  const result = await getWeatherDaily(
    requestForWeatherLocation(user, latitude, longitude)
  );
  res.status(StatusCodes.OK).success(result);
};
