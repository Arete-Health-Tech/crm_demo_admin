import { AxiosResponse } from 'axios';
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
  location?: string | '',
  filteredLocation?: string | '',
  won?: any,
  lose?: any
) => {
  console.log('sahbdhabdhsabdhasbd', location);
  const params = new URLSearchParams(selectedFilters).toString();
  // const timestamp = new Date().getTime();
  const { data } = await apiClient.get(
    `/ticket/?page=${pageNumber}&name=${name}&downloadAll=${downloadAll}&ticketId=${ticketId}&phonev=${phone}&fetchUpdated=${fetchUpdated}&specialty=${location}&specialtyforFilter=${filteredLocation}&${params}`
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

export const validateTicket = async (ticketId: string | undefined) => {
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

export const getAllTaskCount = async () => {
  const { data } = await apiClient.get(`task/taskCount/`);
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

interface ApiResponse {
  status: string;
  ucid: string;
  data: any; // Adjust the type according to the structure of the response data
  // Add other properties if needed
}

export const callAgent = async (
  customerNumber: string | undefined
): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await apiClient.post(
      '/calling/callagent',
      {
        customerNumber: customerNumber
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const uploadEmrFile = async (file: any) => {
  const { data } = await apiClient.post(`/csv/csvdata`, file);
  return Promise.resolve(data);
};
export const uploadDocFile = async (docs: any) => {
  const { data } = await apiClient.post(`/csv/admission`, docs, {
    /* @ts-ignore */
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return Promise.resolve(data);
};

export const updateService = async (
  updatedData: Object,
  ticketId: string | undefined
) => {
  console.log({ updatedData });
  const { data } = await apiClient.put(
    `/ticket/updateService/${ticketId}`,
    updatedData
  );
  return Promise.resolve(data);
};

export const updateTicketProbability = async (
  value: number,
  ticketID: string | undefined
) => {
  const { data } = await apiClient.put(`/ticket/updateProbability`, {
    id: ticketID,
    probability: value
  });
  return Promise.resolve(data);
};

export const deleteTicket = async (ticketID: string | undefined) => {
  const { data } = await apiClient.delete(`/ticket/deleteTicket/${ticketID}`);
  return Promise.resolve(data);
};

export const assignedToTicket = async (
  ticketID: string | undefined,
  representativeid: string | undefined
) => {
  const { data } = await apiClient.put(`/ticket/assignedTicket`, {
    ticketid: ticketID,
    representativeid: representativeid
  });
  return Promise.resolve(data);
};

export const removeFromTicket = async (
  ticketID: string | undefined,
  representativeid: string | undefined
) => {
  const { data } = await apiClient.delete(`/ticket/removeAssignedTicket`, {
    data: {
      ticketid: ticketID,
      representativeid: representativeid
    }
  });
  return Promise.resolve(data);
};
export const createSecondOpinion = async (opinion: any) => {
  const data = await apiClient.post(`/task/opinion`, opinion);
  return Promise.resolve(data);
};
export const createPhoneData = async (phoneData: any) => {
  const data = await apiClient.post(`/ticket/CreatePhoneData`, phoneData);
  return Promise.resolve(data);
};

export const updateNotes = async (updatedNoteData: any) => {
  const data = await apiClient.put(`/ticket/updateNotes`, updatedNoteData);
  return Promise.resolve(data);
};

export const deleteNotes = async (noteId: any) => {
  console.log(noteId);
  const data = await apiClient.delete(`/ticket/deleteNote`, { data: noteId });
  return Promise.resolve(data);
};

export const updateConusmerData = async (
  updatedData: any,
  ticketID: string | undefined
) => {
  const data = await apiClient.put(
    `/ticket/updateConsumer/${ticketID}`,
    updatedData
  );
  return Promise.resolve(data);
};

export const getDocumentsData = async (ticketid: string | undefined) => {
  const data = await apiClient.get(`/task/getDocs/${ticketid}`);
  return Promise.resolve(data);
};

export const setReschedularCompleted = async (taskData: object) => {
  const data = await apiClient.put(`/task/updateTaskRESCHEDULAR`, taskData);
  return Promise.resolve(data);
};

export const setReminderCompleted = async (taskData: object) => {
  const data = await apiClient.put(`/task/updateTaskReminder`, taskData);
  return Promise.resolve(data);
};

export const getActivityData = async (ticketId: string | undefined) => {
  const data = await apiClient.get(`/activity/getActivity/${ticketId}`);
  return Promise.resolve(data);
};

export const getAuditTickets = async () => {
  const data = await apiClient.get(`/ticket/getAuditComments`);
  return Promise.resolve(data);
};

export const getAllWhatsAppCount = async () => {
  const data = await apiClient.get(`/flow/getAllWhatsAppCount`);
  return Promise.resolve(data.data);
};
