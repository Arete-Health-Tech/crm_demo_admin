import { iDepartment, iDoctor } from './service';

export interface iConsumer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'M' | 'F' | 'O';
  uid: string;
  address: {
    house: string;
    city: string;
    state: string;
    postalCode: string;
  };
  uhid: string;
}

export interface iEstimate {
  type: number;
  isEmergency: boolean;
  wardDays: number;
  icuDays: number;
  icuType: string;
  paymentType: number;
  insuranceCompany: string;
  insurancePolicyNumber: string;
  insurancePolicyAmount: number;
  service: serviceAdded[];
  investigation: string[];
  procedure: string[];
  investigationAmount: number;
  procedureAmount: number;
  medicineAmount: number;
  equipmentAmount: number;
  bloodAmount: number;
  additionalAmount: number;
  prescription: string;
  ticket: string;
  creator?: string;
  total?: number;
  createdAt?: Date;
}

export interface iPrescrition {
  _id: string;
  admission: null | string;
  service?: iService;
  condition: string;
  consumer: string;
  departments: string[];
  diagnostics: null;
  medicines: string[];
  doctor: string;
  followUp: string;
  image: string;
  symptoms: string;
}

export interface iTicket {
  includes(arg0: (data: any) => boolean): unknown;
  _id: string;
  consumer: iConsumer[];
  prescription: iPrescription[];
  estimate: iEstimate[];
  creator: string;
  assigned: string;
  stage: string;
  createdAt: string;
  creator: iCreator[];
}

export interface iTicketStore {
  tickets: iTicket[];
  setTickets: (tickets: iTicket[]) => void;
  notes: iNote[];
  setNotes: (notes: iNote[]) => void;
  reminders: iReminder[];
  setReminders: (reminders: iReminder[]) => void;
  filterTickets: iTicketFilter;
  setFilterTickets: (filterTickets: iTicketFilter) => void;
}

export interface iNote {
  text: string;
  ticket: string;
  createdAt?: number;
  creator?: string;
  _id?: string;
}

export interface iReminder {
  _id?: string;
  date: number;
  title: string;
  description: string;
  ticket: string;
  creator?: string;
}

export interface iTicketFilter {
  departments: string[];
  admissionType: string[];
  diagnosticType: string[];
  startDate: number;
  endDate: number;
}

export interface iCreator {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
}
