import {
  iCallRescheduler,
  iNote,
  iReminder,
  iTimer
} from '../../types/store/ticket';
import { apiClient } from '../apiClient';

export const getTicket = async (
  name: string,
  pageNumber: number = 1,
  downloadAll: string,
  selectedFilters: any,
  ticketId?: string | null,
  fetchUpdated: boolean = false,
  phone?: any,
  won?: any,
  lose?: any
) => {
  const params = new URLSearchParams(selectedFilters).toString();
  // const timestamp = new Date().getTime();
  const { data } = await apiClient.get(
    `/ticket/?page=${pageNumber}&name=${name}&downloadAll=${downloadAll}&ticketId=${ticketId}&phonev=${phone}&fetchUpdated=${fetchUpdated}&${params}`
  );
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
  // return data;
};

export const updateTicketData = async (payload: {
  stageCode: number;
  subStageCode: {
    active: boolean;
    code: number;
  };
  modifiedDate?: Date;
  ticket: string | undefined;
}) => {
  const { data } = await apiClient.put('/ticket/ticketUpdate', payload);
  return Promise.resolve(data);
};

export const updateTicketSubStage = async (payload: {
  subStageCode: {
    active: boolean;
    code: number;
  };
  ticket: string | undefined;
}) => {
  const { data } = await apiClient.put('/ticket/subStageUpdate', payload);
  return Promise.resolve(data);
};

export const validateTicket = async (ticketId: string) => {
  const result = await apiClient.put('/ticket/validateTicket', { ticketId });
  return result;
};

export const sendTextMessage = async (
  message: string,
  consumerId: string,
  ticketID: string
) => {
  const { data } = await apiClient.post('/flow/message', {
    message,
    consumerId,
    ticketID
  });
  return data;
};

export const getAllNotesByTicketId = async (ticketId: string) => {
  const { data } = await apiClient.get(`ticket/note/${ticketId}`);
  return data;
};

export const createNewNote = async (note: iNote) => {
  const { data } = await apiClient.post('/ticket/note', note);
  return data;
};

export const getAllReminders = async () => {
  const { data } = await apiClient.get(`task/allReminder/`);
  return data;
};

export const createNewReminder = async (reminderData: iReminder) => {
  const { data } = await apiClient.post(`/task/reminder`, reminderData);
  return data;
};

export const getAllCallReschedulerHandler = async () => {
  const { data } = await apiClient.get(`task/allRescheduler/`);
  return data;
};

export const createNewCallRescheduler = async (
  callReschedulerData: iCallRescheduler
) => {
  const { data } = await apiClient.post(
    `/task/reschedular`,
    callReschedulerData
  );
  return data;
};

export const getAllRescheduler = async () => {
  const { data } = await apiClient.get('task/ticketReschedluer');
  return data;
};

export const createTimer = async (timerData: iTimer, ticketId: string) => {
  const { data } = await apiClient.post(
    `/dashboard/ticketStatus/${ticketId}`,
    timerData
  );
  return data;
};

export const getPharmacyTickets = async (
  pageNumber: number,
  pharmacyDateFilter: string,
  pharmacyOrderStatusFilter: string,
  pharmacySearchFilter: string
) => {
  const pharmacyOrderStatusFiltes =
    pharmacyOrderStatusFilter.length == 10
      ? `91${pharmacyOrderStatusFilter}`
      : pharmacyOrderStatusFilter;

  const { data } = await apiClient.get(
    `/pharmacy/pharmacyTickets?page=${pageNumber}&search=${pharmacyOrderStatusFiltes}&date=${pharmacyDateFilter}&pharmacyStatus=${pharmacySearchFilter}`
  );
  console.log(data);
  return data;
};

export const updatePharmacyOrderStatus = async (
  ticketId: string,
  newValue: string
) => {
  const { data } = await apiClient.put(`/pharmacy/updatePharmacyStatus`, {
    ticketId: ticketId,
    pharmacyStatus: newValue
  });
  console.log(data);
  return data;
};
