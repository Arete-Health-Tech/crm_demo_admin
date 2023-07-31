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
  ticket: string | undefined;
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
  _id: string;
  consumer: iConsumer[];
  prescription: iPrescription[];
  estimate: iEstimate[];
  creator: string;
  assigned: string;
  stage: string;
  createdAt: string;
  creator: iCreator[];
  subStageCode: {
    active: boolean;
    code: number;
  };
  modifiedDate: Date | string | null;
}

export interface iTicketStore {
  tickets: iTicket[];
  setTickets: (tickets: iTicket[]) => void;
  ticketCount: number;
  setTicketCount: (count: number) => void;
  searchByName: string;
  setSearchByName: (name: string) => void;
  ticketCache: any;
  setTicketCache: (ticketCache: any) => void;
  emptyDataText: string;
  setEmptyDataText: (emptyDataText: string) => void;
  downloadTickets: iTicket[];
  setDownloadTickets: (downloadTickets: iTicket[]) => void;
  notes: iNote[];
  setNotes: (notes: iNote[]) => void;
  reminders: iReminder[];
  setReminders: (reminders: iReminder[]) => void;
  filterTickets: iTicketFilter;
  setFilterTickets: (filterTickets: iTicketFilter) => void;
  loaderOn: boolean;
  setLoaderOn: (loaderOn: boolean) => void;
  pageNumber: number;
  setPageNumber: (pageNumber: number)=> void;
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
  ticket: string | undefined;
  creator?: string;
}

export interface iTicketFilter {
  stageList: any[];
  representative: string | null;
  admissionType?: string[];
  diagnosticType?: string[];
  startDate?: number;
  endDate?: number;
}

export interface iCreator {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
}
