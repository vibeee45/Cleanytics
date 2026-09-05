import axios from 'axios';

const API_BASE_URL = 'https://cleanytics-1.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cleanytics_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const response = await apiClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    if (response.data.access_token) {
      localStorage.setItem('cleanytics_token', response.data.access_token);
    }
    return response.data;
  },

  register: async (email, password, fullName) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      full_name: fullName
    });
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('cleanytics_token');
  }
};

export const datasetsApi = {
  upload: async (file, datasetName) => {
    const formData = new FormData();
    formData.append('file', file);
    if (datasetName) formData.append('name', datasetName);

    const response = await apiClient.post('/datasets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  list: async () => {
    const response = await apiClient.get('/datasets/');
    return response.data;
  },

  clean: async (datasetId, config = {}) => {
    const response = await apiClient.post(`/datasets/${datasetId}/clean`, config);
    return response.data;
  },

  getDownloadUrl: (datasetId) => {
    return `${API_BASE_URL}/datasets/${datasetId}/download`;
  }
};

export const analyticsApi = {
  getDashboard: async () => {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  }
};
