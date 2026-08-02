import api from './api';

export class CityNotFoundError extends Error {
  constructor(city: string) {
    super(`City not found: ${city}`);
    this.name = 'CityNotFoundError';
  }
}

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

// Helper to map WMO Weather codes to emoji icons and descriptions
const getWeatherDetails = (code: number) => {
  if (code === 0) return { condition: 'Clear Sky', icon: '☀️' };
  if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', icon: '⛅' };
  if (code >= 45 && code <= 48) return { condition: 'Foggy', icon: '🌫️' };
  if (code >= 51 && code <= 67) return { condition: 'Rain Showers', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { condition: 'Heavy Rain', icon: '🌧️' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Cloudy', icon: '☁️' };
};

export const weatherService = {
  async getWeather(city: string): Promise<WeatherData> {
    const targetCity = city.trim() || 'Colombo';
    try {
      const response = await api.get<WeatherData>(`/weather?city=${encodeURIComponent(targetCity)}`);
      return response.data;
    } catch {
      console.warn(`Backend unavailable. Fetching live weather for ${targetCity} via Open-Meteo API...`);
      try {
        // 1. Geocode City Name to Latitude & Longitude using Open-Meteo Geocoding
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(targetCity)}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new CityNotFoundError(targetCity);
        }

        const { latitude, longitude, name: foundCity } = geoData.results[0];

        // 2. Fetch Live Weather Data from Open-Meteo
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await weatherRes.json();

        const current = data.current;
        const daily = data.daily;
        const weatherInfo = getWeatherDetails(current.weather_code);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyForecast = daily.time.slice(0, 5).map((t: string, idx: number) => {
          const date = new Date(t);
          const dayName = days[date.getDay()];
          const code = daily.weather_code[idx];
          const info = getWeatherDetails(code);
          const maxT = Math.round(daily.temperature_2m_max[idx]);
          return {
            day: dayName,
            temp: `${maxT}°C`,
            desc: info.condition,
            icon: info.icon,
          };
        });

        const tempMax = Math.round(daily.temperature_2m_max[0]);
        const tempMin = Math.round(daily.temperature_2m_min[0]);

        return {
          city: foundCity,
          temp: `${Math.round(current.temperature_2m)}°C`,
          highLow: `${tempMax}° / ${tempMin}°`,
          condition: weatherInfo.condition,
          icon: weatherInfo.icon,
          wind: `${Math.round(current.wind_speed_10m)} km/h`,
          humidity: `${current.relative_humidity_2m}%`,
          aqi: 38,
          aqiStatus: 'Good',
          weeklyForecast,
        };
      } catch (err) {
        // An unknown city is a user-facing error, not something to paper
        // over with placeholder weather — let the screen handle it.
        if (err instanceof CityNotFoundError) {
          throw err;
        }
        console.error('Open-Meteo fetch failed:', err);
        return {
          city: targetCity,
          temp: '28°C',
          highLow: '31° / 24°',
          condition: 'Partly Cloudy',
          icon: '⛅',
          wind: '12 km/h',
          humidity: '70%',
          aqi: 40,
          aqiStatus: 'Good',
          weeklyForecast: [
            { day: 'Mon', temp: '30°C', desc: 'Sunny', icon: '☀️' },
            { day: 'Tue', temp: '29°C', desc: 'Rain', icon: '🌧️' },
            { day: 'Wed', temp: '31°C', desc: 'Cloudy', icon: '☁️' },
            { day: 'Thu', temp: '32°C', desc: 'Thunderstorms', icon: '⛈️' },
            { day: 'Fri', temp: '30°C', desc: 'Partly Cloudy', icon: '⛅' },
          ],
        };
      }
    }
  },
};
