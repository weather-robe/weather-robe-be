import { StatusCodes } from "http-status-codes";
import { getWeatherToday } from "../services/weather.service.js";
import { requestForWeatherToday } from "../dtos/weather.dto.js";

export const handleGetWeatherToday = async (req, res, next) => {
  /*
    #swagger.tags = ['Weather']
    #swagger.summary = '오늘의 일기예보'
    #swagger.description = '현재, 오늘, 어제 온도 정보를 가져옵니다.'    
    #swagger.parameters['latitude'] = {
      in: 'query',
      description: 'latitude가 위치한 장소의 위도. 제공되지 않으면 서울시청으로 기본 설정.',
      required: false,
      type: 'number',
      example: 37.5665
    }
    #swagger.parameters['longitude'] = {
      in: 'query',
      description: 'longitude가 위치한 장소의 경도. 제공되지 않으면 서울시청으로 기본 설정.',
      required: false,
      type: 'number',
      example: 126.978
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
                      wind_speed: { type: 'number', example: 4.54 },
                      wind_deg: { type: 'number', example: 253 },
                      pm10: { type: 'number', example: 10 },
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
  const { latitude, longitude } = req.query;
  const weather = await getWeatherToday(
    requestForWeatherToday(user, latitude, longitude)
  );

  res.status(StatusCodes.OK).success(weather);
};
