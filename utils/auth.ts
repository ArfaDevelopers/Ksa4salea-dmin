import {jwtDecode} from 'jwt-decode';

export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
};

export const getToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
};
