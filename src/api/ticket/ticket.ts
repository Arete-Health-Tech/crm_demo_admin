import { iNote, iReminder } from '../../types/store/ticket';
import { apiClient } from '../apiClient';

export const getTicket = async (name: string) => {
  const { data } = await apiClient.get(`/ticket/?name=${name}`);
  return data;
};

export const createTicket = async (prescription: any) => {
  const { data } = await apiClient.post('/ticket', prescription, {
    /* @ts-ignore */
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  console.log(data);
};

export const updateTicketData = async (payload: {
  stageCode?: number;
  subStageCode?: {
    active: boolean;
    code: number;
  };
  ticket: string | undefined;
}) => {
  const { data } = await apiClient.put('/ticket/ticketUpdate', payload);
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
