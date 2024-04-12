import { apiClient } from '../apiClient';

export const getAllNotes = async () => {
  const { data } = await apiClient.get(`task/getallnotes`);
  return data;
};
