import { iScript } from '../../types/store/service';
import { apiClient } from '../apiClient';

export const createScript = async (script: iScript) => {
  const { data } = await apiClient.post('/script', script);
  return data;
};

export const getSingleScript = async (serviceId: string, stageId: string) => {
  const { data } = await apiClient.get(`/script/${serviceId}/${stageId}`);
  return data;
};
