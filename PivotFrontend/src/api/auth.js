// api/auth.js
import api from './axiosInstance';

export const registerUser = (username, email, password) => {
  return api.post('/register-user', null, {
    params: { username, email, password }
  });
};