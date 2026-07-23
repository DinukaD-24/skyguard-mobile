import api from './api';

export interface LocationItem {
  id: string;
  userId: string;
  city: string;
  label: string;
  createdAt: string;
}

export const locationService = {
  async getLocations(): Promise<LocationItem[]> {
    const response = await api.get<LocationItem[]>('/locations');
    return response.data;
  },

  async addLocation(city: string, label?: string): Promise<LocationItem> {
    const response = await api.post<LocationItem>('/locations', { city, label });
    return response.data;
  },

  async deleteLocation(id: string): Promise<void> {
    await api.delete(`/locations/${id}`);
  },
};
