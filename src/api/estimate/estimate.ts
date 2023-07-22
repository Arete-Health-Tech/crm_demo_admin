import { iEstimate } from '../../types/store/ticket';
import { apiClient } from '../apiClient';

export const createEstimate = async (estimate: iEstimate) => {
  try {
    const { data } = await apiClient.post('/ticket/estimate', estimate);
    console.log(data)
    return data;
  } catch (error) {
    // Handle the error here (e.g., log it or show a user-friendly message)
    console.error('Error creating estimate:', error);
    throw error; // Rethrow the error if needed
  }
};

export const uploadAndSendEstimate = async (estimate: File, ticket: string) => {
  const estimateUpload = new FormData();
  estimateUpload.append('estimate', estimate);
  const { data } = await apiClient.post(
    `/ticket/${ticket}/estimate/upload`,
    estimateUpload,
    {
      //  @ts-ignore
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return data;
};
