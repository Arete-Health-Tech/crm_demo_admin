import { apiClient } from '../apiClient';
import { iConsumerRequest } from './consumerHandler';

export const searchConsumer = async (search: string) => {
  try{
   
  const { data } = await apiClient.get(`/consumer/search?search=${search}`);
  
  return data;
  }catch(error){
console.error('Error:');
throw error;
  }
};

export const getConsumerTickets = async (consumerId: string) => {
  const { data } = await apiClient.get(`/ticket/${consumerId}`);
  return data;
};

export const registerConsumer = async (consumer: iConsumerRequest) => {
  const { data } = await apiClient.post('/consumer/register', consumer);
  return data;
};

export const getConsumerByUhid=async (search:string)=>{
  const {data} = await apiClient.get(`/consumer/findConsumer?search=${search}`);
  return data
}