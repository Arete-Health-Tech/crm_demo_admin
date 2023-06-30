import { iStage } from '../../types/store/service';
import { apiClient } from '../apiClient';

export const getStages = async () => {
  const { data } = await apiClient.get('/stage/');
  return data;
};

export const getSubStages = async () => {
  const { data } = await apiClient.get('/stage/subStage');
  return data;
};

export const createStage = async (stage: iStage) => {
  const { data } = await apiClient.post('/stage', stage);
  return data;
};
