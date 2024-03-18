import { iEstimate } from '../../types/store/ticket';
import { createEstimate, uploadAndSendEstimate } from './estimate';

export const createEstimateHandler = async (estimate: iEstimate) => {
  try {
    const createdEstimate = await createEstimate(estimate);
    // console.log(createdEstimate);
    return createdEstimate;
  } catch (error) {
    // Handle the error here (e.g., log it or show a user-friendly message)
    console.error('Error creating estimate:', error);
    return null; // Optionally, return null or an error message
  }
};

export const uploadAndSendEstimateHandler = async (
  estimate: File,
  ticket: string
) => {
  return await uploadAndSendEstimate(estimate, ticket);
};
