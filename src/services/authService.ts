import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserData;
    token: string;
  };
}

// Register new user
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    
    if (response.data.success && response.data.data) {
      // Store token and user data
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userId', response.data.data.user.id);
      localStorage.setItem('memberId', response.data.data.user.id);
      localStorage.setItem('userName', response.data.data.user.fullName);
      localStorage.setItem('userEmail', response.data.data.user.email);
      localStorage.setItem('role', response.data.data.user.role);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Note: Full profile data including state/district/block will be saved by Register component
    }
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed. Please try again.'
    };
  }
};

// Login user
export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', loginData);
    
    if (response.data.success && response.data.data) {
      // Store token and user data
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userId', response.data.data.user.id);
      localStorage.setItem('userName', response.data.data.user.fullName);
      localStorage.setItem('userEmail', response.data.data.user.email);
      localStorage.setItem('role', response.data.data.user.role);
      localStorage.setItem('isLoggedIn', 'true');
    }
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed. Please try again.'
    };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<UserData | null> => {
  try {
    const response = await api.get('/auth/me');
    return response.data.data;
  } catch (error) {
    return null;
  }
};

// Logout user
export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null && localStorage.getItem('isLoggedIn') === 'true';
};

// Get user role
export const getUserRole = (): string | null => {
  return localStorage.getItem('role');
};

export default api;
