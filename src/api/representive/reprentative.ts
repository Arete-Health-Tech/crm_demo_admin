import { apiClient } from '../apiClient';

export const getRepresentative = async () => {
  const { data } = await apiClient.get('/representative/all');
  return data;
};
