import api from './api';

export interface WeatherData {
  city: string;
  temp: string;
  highLow: string;
  condition: string;
  icon: string;
  wind: string;
  humidity: string;
  aqi: number;
  aqiStatus: string;
  weeklyForecast: Array<{
    day: string;
    temp: string;
    desc: string;
    icon: string;
  }>;
}

export const weatherService = {
  async getWeather(city: string): Promise<WeatherData> {
    const response = await api.get<WeatherData>(`/weather?city=${encodeURIComponent(city)}`);
    return response.data;
  },
};
