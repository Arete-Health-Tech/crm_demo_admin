import { iNote, iReminder } from '../../types/store/ticket';
import { apiClient } from '../apiClient';

export const getTicket = async () => {
  const { data } = await apiClient.get('/ticket');
  return data;
};

export const createTicket = async (prescription: any) => {
  const { data } = await apiClient.post('/ticket', prescription, {
    /* @ts-ignore */
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
 console.log("hello")
  console.log(data);
};
export const sendTextMessage = async (message: string, consumerId: string) => {
  console.log(message, consumerId);
  const { data } = await apiClient.post('/flow/message', {
    message,
    consumerId
  });
  return data;
};

export const getAllNotes = async (ticketId: string) => {
  const { data } = await apiClient.get(`ticket/note/${ticketId}`);
  return data;
};

export const createNewNote = async (note: iNote) => {
  const { data } = await apiClient.post('/ticket/note', note);
  return data;
};

export const getAllReminders = async (ticketId: string) => {
  const { data } = await apiClient.get(`task/reminder/${ticketId}`);
  return data;
};

export const createNewReminder = async (reminderData: iReminder) => {
  const { data } = await apiClient.post(`/task/reminder`, reminderData);
  return data;
};
