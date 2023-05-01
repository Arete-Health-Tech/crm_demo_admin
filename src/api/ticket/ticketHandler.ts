import useTicketStore from '../../store/ticketStore';
import { iNote, iReminder } from '../../types/store/ticket';
import {
  createNewNote,
  getAllNotes,
  createTicket,
  getTicket,
  getAllReminders,
  createNewReminder
} from './ticket';

export const getTicketHandler = async () => {
  const { setTickets } = useTicketStore.getState();
  const tickets = await getTicket();
  const sortedTickets = tickets.reverse();
  setTickets(sortedTickets);
};

export type iCreateTicket = {
  departments: string[];
  doctor: string;
  admission: string;
  symptoms: string | null;
  condition: string | null;
  medicines: string[];
  followUp: Date | number;
  image: string | null;
  consumer: string;
  service?: { _id: string; label: string };
  diagnostics: string[];
  caregiver_phone: string | null;
  caregiver_name: string | null;
};

export const createTicketHandler = async (
  prescription: iCreateTicket,
  upload: boolean
) => {
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
  prescriptionData.append(
    'diagnostics',
    JSON.stringify(prescription.diagnostics)
  );
  prescription.service &&
    prescriptionData.append('service', prescription.service._id);

  console.log(prescription.image);

  if (!upload) {
    /* @ts-ignore */
    const blob = await (await fetch(prescription.image)).blob();
    prescriptionData.append('image', blob);
    console.log(blob);
  } else {
    prescriptionData.append('image', prescription.image as string);
  }

  return await createTicket(prescriptionData);
};

export const getAllNotesHandler = async (ticketId: string) => {
  const { setNotes } = useTicketStore.getState();
  const notes = await getAllNotes(ticketId);
  setNotes(notes);
};

export const createNotesHandler = async (note: iNote) => {
  const { notes, setNotes } = useTicketStore.getState();
  const noteAdded = await createNewNote(note);
  setNotes([...notes, noteAdded]);
};

export const getAllReminderHandler = async (ticketId: string) => {
  const { setReminders } = useTicketStore.getState();
  const reminders = await getAllReminders(ticketId);
  setReminders(reminders);
};

export const createNewReminderHandler = async (reminderData: iReminder) => {
  const { reminders, setReminders } = useTicketStore.getState();
  const reminderAdded = await createNewReminder(reminderData);
  setReminders([...reminders, reminderAdded]);
};
