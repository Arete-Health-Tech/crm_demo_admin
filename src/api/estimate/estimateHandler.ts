import { iEstimate } from '../../types/store/ticket';
import { createEstimate, uploadAndSendEstimate } from './estimate';

export const createEstimateHandler = async (estimate: iEstimate) => {
  const createdEstimate = await createEstimate(estimate);
  console.log(createdEstimate);
  return Promise.resolve(createEstimate);
};

export const uploadAndSendEstimateHandler = async (
  estimate: File,
  ticket: string
) => {
  return await uploadAndSendEstimate(estimate, ticket);
};
