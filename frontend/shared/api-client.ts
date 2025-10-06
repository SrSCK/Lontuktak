import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const apiClient = {
  // Analysis endpoints
  async getAnalytics() {
    const response = await api.get<ApiResponse>('/analysis/dashboard');
    return response.data;
  },

  // Prediction endpoints
  async getPredictions(params: any) {
    const response = await api.post<ApiResponse>('/predict', params);
    return response.data;
  },

  // Stock Management endpoints
  async getStockLevels() {
    const response = await api.get<ApiResponse>('/stock/levels');
    return response.data;
  },

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    const response = await api.post<ApiResponse>('/auth/login', credentials);
    return response.data;
  },

  async signup(userData: { email: string; password: string; name: string }) {
    const response = await api.post<ApiResponse>('/auth/signup', userData);
    return response.data;
  },
};