import api from './api';

export interface LocationItem {
  id: string;
  userId: string;
  city: string;
  label: string;
  createdAt: string;
}

let memoryLocations: LocationItem[] = [
  { id: '1', userId: '1', city: 'Colombo', label: 'Capital City', createdAt: new Date().toISOString() },
  { id: '2', userId: '1', city: 'Kandy', label: 'Central Hills', createdAt: new Date().toISOString() },
];

export const locationService = {
  async getLocations(): Promise<LocationItem[]> {
    try {
      const response = await api.get<LocationItem[]>('/locations');
      return response.data;
    } catch {
      return memoryLocations;
    }
  },

  async addLocation(city: string, label?: string): Promise<LocationItem> {
    try {
      const response = await api.post<LocationItem>('/locations', { city, label });
      return response.data;
    } catch {
      const newItem: LocationItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: '1',
        city,
        label: label || 'Saved Location',
        createdAt: new Date().toISOString(),
      };
      memoryLocations.unshift(newItem);
      return newItem;
    }
  },

  async deleteLocation(id: string): Promise<void> {
    try {
      await api.delete(`/locations/${id}`);
    } catch {
      memoryLocations = memoryLocations.filter(loc => loc.id !== id);
    }
  },
};
