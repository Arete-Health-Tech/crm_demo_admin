import { apiClient } from '../apiClient';

export const login = async (phone: string, password: string) => {
  const { data } = await apiClient.post('/representative/login', {
    firstNameOrPhone: phone,
    password: password
  });
  return data;
};
