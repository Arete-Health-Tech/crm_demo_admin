import useTicketStore from '../../store/ticketStore';
import {
  iCallRescheduler,
  iNote,
  iReminder,
  iTicketFilter,
  iTicketFilterOld,
  iTimer
} from '../../types/store/ticket';
import {
  createNewNote,
  getAllNotesByTicketId,
  createTicket,
  getTicket,
  getAllReminders,
  createNewReminder,
  createNewCallRescheduler,
  getAllRescheduler,
  createTimer,
  getPharmacyTickets,
  getAllTaskCount,
  getAuditTickets,
  getAllWhatsAppCount,
  getAuditTicket,
  createNoteActivity,
  bulkAssignTickets,
  clearAssigneeTickets,
  getBulkTicket,
  getSearchedTicket,
  getFilteredTicket
} from './ticket';
import { UNDEFINED } from '../../constantUtils/constant';
import useUserStore from '../../store/userStore';

export const getTicketHandler = async (
  name: string,
  pageNumber: number,
  downloadAll: 'true' | 'false' = 'false',
  selectedFilters: iTicketFilterOld | null,
  ticketId: string = UNDEFINED,
  fetchUpdated: boolean = false
) => {
  const {
    setTickets,
    setTicketCount,
    setTicketCache,
    ticketCache,
    setEmptyDataText,
    setDownloadTickets,
    setLoaderOn,
    filteredLocation
  } = useTicketStore.getState();
  const { user } = useUserStore.getState();
  const phone = user?.phone;

  setLoaderOn(true);
  const data = await getTicket(
    name,
    pageNumber,
    downloadAll,
    selectedFilters,
    ticketId,
    fetchUpdated,
    phone,
    filteredLocation
  );
  const sortedTickets = data.tickets;
  const count = data.count;

  if (sortedTickets.length < 1) {
    setEmptyDataText('No Data Found');
  } else {
    setEmptyDataText('');
  }
  if (name === UNDEFINED && downloadAll === 'false') {
    setTicketCache({ ...ticketCache, [pageNumber]: sortedTickets, count });
  }
  if (downloadAll === 'true') {
    setDownloadTickets(sortedTickets);
    setLoaderOn(false);
    return sortedTickets;
  }
  setTicketCount(count);
  setTickets(sortedTickets);
  setLoaderOn(false);
};

export const getTicketFilterHandler = async (
  name: string,
  pageNumber: number,
  downloadAll: 'true' | 'false' = 'false',
  selectedFilters: iTicketFilter | null,
  ticketId: string = UNDEFINED,
  fetchUpdated: boolean = false
) => {
  const {
    setTickets,
    setTicketCount,
    setTicketCache,
    ticketCache,
    setEmptyDataText,
    setDownloadTickets,
    setLoaderOn,
    filteredLocation
  } = useTicketStore.getState();
  const { user } = useUserStore.getState();
  const phone = user?.phone;

  setLoaderOn(true);
  const data = await getFilteredTicket(
    pageNumber,
    selectedFilters,
    filteredLocation
  );
  const sortedTickets = data.tickets;
  const count = data.count;

  if (sortedTickets.length < 1) {
    setEmptyDataText('No Data Found');
  } else {
    setEmptyDataText('');
  }
  if (name === UNDEFINED && downloadAll === 'false') {
    setTicketCache({ ...ticketCache, [pageNumber]: sortedTickets, count });
  }
  if (downloadAll === 'true') {
    setDownloadTickets(sortedTickets);
    setLoaderOn(false);
    return sortedTickets;
  }
  setTicketCount(count);
  setTickets(sortedTickets);
  setLoaderOn(false);
};
export const getTicketHandlerSearch = async (
  name: string,
  pageNumber: number,
  downloadAll: 'true' | 'false' = 'false',
  selectedFilters: iTicketFilter | null,
  ticketId: string = UNDEFINED,
  fetchUpdated: boolean = false
) => {
  const {
    setTickets,
    setTicketCount,
    setTicketCache,
    ticketCache,
    setEmptyDataText,
    setDownloadTickets,
    setLoaderOn,
    filteredLocation
  } = useTicketStore.getState();
  const { user } = useUserStore.getState();
  const phone = user?.phone;

  setLoaderOn(true);
  const data = await getSearchedTicket(name, pageNumber);
  const sortedTickets = data.tickets;
  const count = data.count;

  if (sortedTickets.length < 1) {
    setEmptyDataText('No Data Found');
  } else {
    setEmptyDataText('');
  }
  if (name === UNDEFINED && downloadAll === 'false') {
    setTicketCache({ ...ticketCache, [pageNumber]: sortedTickets, count });
  }
  if (downloadAll === 'true') {
    setDownloadTickets(sortedTickets);
    setLoaderOn(false);
    return sortedTickets;
  }
  setTicketCount(count);
  setTickets(sortedTickets);
  setLoaderOn(false);
};
export const getBulkTicketHandler = async (
  name: string,
  pageNumber: number,
  downloadAll: 'true' | 'false' = 'false',
  selectedFilters: iTicketFilter | null,
  ticketId: string = UNDEFINED,
  fetchUpdated: boolean = false
) => {
  const {
    setBulkTickets,
    setTicketCount,
    setBulkTicketCache,
    bulkTicketCache,
    setEmptyDataText,
    setDownloadTickets,
    setLoaderOn,
    filteredLocation
  } = useTicketStore.getState();
  const { user } = useUserStore.getState();
  const phone = user?.phone;

  setLoaderOn(true);
  const data = await getBulkTicket(
    name,
    pageNumber,
    downloadAll,
    selectedFilters,
    ticketId,
    fetchUpdated,
    phone,
    filteredLocation
  );
  const sortedBulkTickets = data.tickets;
  const count = data.count;

  if (sortedBulkTickets.length < 1) {
    setEmptyDataText('No Data Found');
  } else {
    setEmptyDataText('');
  }
  if (name === UNDEFINED && downloadAll === 'false') {
    setBulkTicketCache({
      ...bulkTicketCache,
      [pageNumber]: sortedBulkTickets,
      count
    });
  }
  if (downloadAll === 'true') {
    setDownloadTickets(sortedBulkTickets);
    setLoaderOn(false);
    return sortedBulkTickets;
  }
  setTicketCount(count);
  setBulkTickets(sortedBulkTickets);
  setLoaderOn(false);
};

export const getAuditFilterTicketsHandler = async () => {
  const {
    setTickets,
    setTicketCount,
    setTicketCache,
    ticketCache,
    setEmptyDataText,
    setDownloadTickets,
    setLoaderOn
  } = useTicketStore.getState();
  const data = await getAuditTickets();
  const sortedTickets = data.data.tickets;
  const count = data.data.count;

  if (sortedTickets.length < 1) {
    setEmptyDataText('No Data Found');
  } else {
    setEmptyDataText('');
  }

  setTicketCount(count);
  setTickets(sortedTickets);
  setLoaderOn(false);
};

export const getAllAuditTicketHandler = async (
  name: string,
  pageNumber: number = 1,
  downloadAll: 'true' | 'false' = 'false',
  selectedFilters: iTicketFilter | null,
  ticketId: string = UNDEFINED,
  fetchUpdated: boolean = false
) => {
  const {
    setTickets,
    setTicketCount,
    setTicketCache,
    ticketCache,
    setEmptyDataText,
    setDownloadTickets,
    setLoaderOn,
    filteredLocation
  } = useTicketStore.getState();
  const { user } = useUserStore.getState();
  const phone = user?.phone;

  setLoaderOn(true);
  const data = await getAuditTicket(
    name,
    pageNumber,
    downloadAll,
    selectedFilters,
    ticketId,
    fetchUpdated,
    phone,
    filteredLocation
  );
  const sortedTickets = data.tickets;
  const count = data.count;

  if (sortedTickets.length < 1) {
    setEmptyDataText('No Data Found');
  } else {
    setEmptyDataText('');
  }
  if (name === UNDEFINED && downloadAll === 'false') {
    setTicketCache({ ...ticketCache, [pageNumber]: sortedTickets, count });
  }
  if (downloadAll === 'true') {
    setDownloadTickets(sortedTickets);
    setLoaderOn(false);
    return sortedTickets;
  }
  setTicketCount(count);
  setTickets(sortedTickets);
  setLoaderOn(false);
};

export const getPharmcyTicketHandler = async () => {
  const {
    setTickets,
    setTicketCount,
    setEmptyDataText,
    setLoaderOn,
    pageNumber,
    pharmacyDateFilter,
    pharmacySearchFilter,
    pharmacyOrderStatusFilter,
    setPharmacyOrderPendingCount,
    setPharmacyOrderReadyCount,
    setPharmacyOrderCompletedCount,
    setPharmacyOrderCancelledCount
  } = useTicketStore.getState();

  setLoaderOn(true);

  try {
    const data = await getPharmacyTickets(
      pageNumber,
      pharmacyDateFilter,
      pharmacySearchFilter,
      pharmacyOrderStatusFilter
    );
    const count = data.count;
    const Pending = data.statusCounts.Pending;
    const Ready = data.statusCounts.Ready;
    const Completed = data.statusCounts.Completed;
    const Cancelled = data.statusCounts.Cancelled;

    if (data.tickets.length < 1) {
      setEmptyDataText('No Data Found');
    } else {
      setEmptyDataText('');
    }

    setTicketCount(count);
    setTickets(data.tickets);
    setPharmacyOrderPendingCount(Pending);
    setPharmacyOrderReadyCount(Ready);
    setPharmacyOrderCompletedCount(Completed);
    setPharmacyOrderCancelledCount(Cancelled);
    setLoaderOn(false);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    // Handle error, show message, etc.
    setLoaderOn(false);
  }
};

export type iCreateTicket = {
  departments: string[];
  doctor: string;
  admission: string;
  symptoms: string | null;
  condition: string | null;
  medicines: string[];
  followUp: Date | number;
  image: string[];
  remarks: string;
  consumer: string;
  isPharmacy: string;
  service?: { _id: string; label: string };
  diagnostics: string[];
  caregiver_phone: string | null;
  caregiver_name: string | null;
};

export const createTicketHandler = async (prescription: iCreateTicket) => {
  const prescriptionData = new FormData();
  prescriptionData.append('consumer', prescription.consumer);
  prescriptionData.append(
    'departments',
    JSON.stringify(prescription.departments)
  );
  prescriptionData.append('admission', prescription.admission);
  prescriptionData.append('doctor', prescription.doctor);
  prescriptionData.append('symptoms', prescription.symptoms!);
  prescription.condition &&
    prescriptionData.append('condition', prescription.condition);
  prescription.caregiver_name &&
    prescriptionData.append('caregiver_name', prescription.caregiver_name);
  prescription.caregiver_phone &&
    prescriptionData.append('caregiver_phone', prescription.caregiver_phone);
  prescriptionData.append('medicines', JSON.stringify(prescription.medicines));
  prescriptionData.append('followUp', JSON.stringify(prescription.followUp));
  prescriptionData.append('isPharmacy', prescription.isPharmacy);
  prescriptionData.append(
    'diagnostics',
    JSON.stringify(prescription.diagnostics)
  );
  prescriptionData.append('remarks', prescription.remarks);
  prescription.service &&
    prescriptionData.append('service', prescription.service._id);
  /* @ts-ignore */
  // const blob = await (await fetch(prescription.image)).blob();
  const imageBlobs: Blob[] = [];
  for (const imageUrl of prescription.image) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${imageUrl}`);
      }
      const blob = await response.blob();
      imageBlobs.push(blob); // Append blob to array
    } catch (error) {
      console.error(error);
    }
  }
  imageBlobs.forEach((blob, index) => {
    prescriptionData.append(`image${index}`, blob, `image${index + 1}.jpg`);
  });
  // const formDataArray = Array.from(prescriptionData.entries());
  // prescriptionData.append('image', blob);
  return await createTicket(prescriptionData);
};

export const getAllNotesHandler = async (ticketId: string) => {
  const { setNotes } = useTicketStore.getState();
  const notes = await getAllNotesByTicketId(ticketId);
  setNotes(notes);
};

export const createNotesHandler = async (note: iNote, disposition: string) => {
  const { notes, setNotes } = useTicketStore.getState();
  const noteAdded = await createNewNote(note, disposition);
  setNotes([...notes, noteAdded]);
  return Promise.resolve(noteAdded);
};
// Notes Add in Activity

export const createNoteActivityHandler = async (notesData) => {
  await createNoteActivity(notesData);
};

export const getAllReminderHandler = async () => {
  const { setReminders } = useTicketStore.getState();
  const reminders = await getAllReminders();
  setReminders(reminders);
  return Promise.resolve(reminders);
};

export const createNewReminderHandler = async (reminderData: iReminder) => {
  const { reminders, setReminders } = useTicketStore.getState();
  const reminderAdded = await createNewReminder(reminderData);
  setReminders([...reminders, reminderAdded]);
  return reminderAdded;
};

export const getAllCallReschedulerHandler = async () => {
  const { setCallRescheduler } = useTicketStore.getState();
  const callRescheduler = await getAllRescheduler();
  setCallRescheduler(callRescheduler);
  return Promise.resolve(callRescheduler);
};

export const createNewCallReschedulerHandler = async (
  callReschedulerData: iCallRescheduler
) => {
  const { callRescheduler, setCallRescheduler } = useTicketStore.getState();
  const callReschedulerAdded = await createNewCallRescheduler(
    callReschedulerData
  );
  setCallRescheduler([...callRescheduler, callReschedulerAdded]);
  return callReschedulerAdded;
};

export const getAllReschedulerHandler = async () => {
  const { setCallRescheduler } = useTicketStore.getState();
  const reschedular = await getAllRescheduler();
  setCallRescheduler(reschedular);
};

export const getAllTaskCountHandler = async () => {
  const { setAllTaskCount } = useTicketStore.getState();
  const allTaskCount = await getAllTaskCount();
  setAllTaskCount(allTaskCount);
};

export const getAllWhtsappCountHandler = async () => {
  const { setAllWhtsappCount } = useTicketStore.getState();
  const allWhtsappCount = await getAllWhatsAppCount();
  setAllWhtsappCount(allWhtsappCount);
};

export const createTimerHandler = async (
  timerData: iTimer,
  ticketId: string
) => {
  const { status, setStatus } = useTicketStore.getState();
  const timerAdded = await createTimer(timerData, ticketId);
  const updatedStatus = Array.isArray(status)
    ? [...status, timerAdded]
    : [timerAdded];

  setStatus(updatedStatus);

  return Promise.resolve(timerAdded);
};

function getDate(): string | Blob {
  throw new Error('Function not implemented.');
}

export const bulkAssignTicketsHandler = async (
  ticketIds: string[],
  representativeIds: string[]
) => {
  try {
    const result = await bulkAssignTickets(ticketIds, representativeIds);
    console.log('Tickets assigned successfully:', result);
    return result;
  } catch (error) {
    console.error('Error handling bulk ticket assignment:', error);
    throw error;
  }
};

export const clearAssigneeTicketsHandler = async (ticketIds: string[]) => {
  try {
    const result = await clearAssigneeTickets(ticketIds);
    return result;
  } catch (error) {
    console.error('Error handling bulk ticket assignment:', error);
    throw error;
  }
};
