import api from '../config/api';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  register: async (userData) => {
    try{
          const response = await api.post('/auth/register', userData);
    return response.data;
         } catch(error){
          console.error('Register error: ',error.message);
          console.error('Error response : ',error.response);
          throw error;
         }

  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      console.log(response.data.token);
      localStorage.setItem('token', response.data.token);
      const UserDataa=jwtDecode(response.data.token);
      localStorage.setItem('user', JSON.stringify(UserDataa));
      console.log(UserDataa)
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    // const userStr = localStorage.getItem('user');
    // return userStr ? JSON.parse(userStr) : null;
    
  const userData = localStorage.getItem("user");
  if (!userData || userData === "undefined") {
    return null;
  }
  try {
    return JSON.parse(userData);
    console.log();
  } catch (error) {
    console.error("Invalid JSON in localStorage:", error);
    return null;
  }

  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
