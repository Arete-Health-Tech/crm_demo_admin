import useConsumerStore from '../../store/consumerStore';
import { iConsumer } from '../../types/store/consumer';
import {
  getConsumerTickets,
  registerConsumer,
  searchConsumer
} from './consumer';

export const searchConsumerHandler = async (search: string) => {
  console.log(search ,"this is seach in handler")
  const { setSearchResults } = useConsumerStore.getState();
  const consumers = await searchConsumer(search);
  console.log(consumers)
  setSearchResults(consumers);
};

export const getConsumerTicketsHandler = async (consumerId: string) => {
  const { setConsumerHistory } = useConsumerStore.getState();
  const tickets = await getConsumerTickets(consumerId);  
  setConsumerHistory(tickets);
};

// export type iConsumerRequest = Omit<iConsumer, '_id'>;
export type iConsumerRequest = iConsumer;

export const registerConsumerHandler = async (consumer: iConsumerRequest) => {
  console.log(consumer);
  return await registerConsumer(consumer);
};
