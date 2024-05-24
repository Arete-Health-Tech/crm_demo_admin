import { create } from 'zustand';
import { iTicketStore } from '../types/store/ticket';
import useUserStore from './userStore';

const useTicketStore = create<iTicketStore>((set, get) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
  pharmcyTicket: [],
  setPharmcyTickets: (pharmcyTicket) => set({ pharmcyTicket }),
  ticketCount: 0,
  setTicketCount: (ticketCount) => set({ ticketCount }),
  searchByName: 'undefined',
  setSearchByName: (searchByName) => set({ searchByName }),
  ticketCache: { 1: [] },
  setTicketCache: (ticketCache) => set({ ticketCache }),
  emptyDataText: '',
  setEmptyDataText: (emptyDataText) => set({ emptyDataText }),
  downloadTickets: [],
  setDownloadTickets: (downloadTickets) => set({ downloadTickets }),
  notes: [],
  setNotes: (notes) => set({ notes }),
  reminders: [],
  setReminders: (reminders) => set({ reminders }),
  callRescheduler: [],
  setCallRescheduler: (callRescheduler) => set({ callRescheduler }),
  filterTickets: {
    stageList: [],
    representative: null,
    results: null,
    dateRange: []
  },
  setFilterTickets: (filterTickets) => set({ filterTickets }),
  loaderOn: false,
  setLoaderOn: (loaderOn) => set({ loaderOn }),
  pageNumber: 1,
  setPageNumber: (pageNumber) => set({ pageNumber }),
  estimates: [],
  setEstimates: (estimates) => set({ estimates }),
  status: [],
  setStatus: (status) => set({ status }),
  pharmacyDateFilter: '',
  setPharmacyDateFilter: (pharmacyDateFilter) => set({ pharmacyDateFilter }),
  pharmacyOrderStatusFilter: '',
  setPharmacyOrderStatusFilter: (pharmacyOrderStatusFilter) =>
    set({ pharmacyOrderStatusFilter }),
  pharmacySearchFilter: '',
  setPharmacySearchFilter: (pharmacySearchFilter) =>
    set({ pharmacySearchFilter }),
  pharmacyOrderPendingCount: '',
  setPharmacyOrderPendingCount: (pharmacyOrderPendingCount) =>
    set({ pharmacyOrderPendingCount }),
  pharmacyOrderReadyCount: '',
  setPharmacyOrderReadyCount: (pharmacyOrderReadyCount) =>
    set({ pharmacyOrderReadyCount }),
  pharmacyOrderCompletedCount: '',
  setPharmacyOrderCompletedCount: (pharmacyOrderCompletedCount) =>
    set({ pharmacyOrderCompletedCount }),
  pharmacyOrderCancelledCount: '',
  setPharmacyOrderCancelledCount: (pharmacyOrderCancelledCount) =>
    set({ pharmacyOrderCancelledCount }),
  whtsappExpanded: false,
  setWhtsappExpanded: (whtsappExpanded) => set({ whtsappExpanded }),
  smsModal: false,
  setSmsModal: (smsModal) => set({ smsModal }),
  phoneModal: false,
  setPhoneModal: (phoneModal) => set({ phoneModal }),
  noteModal: false,
  setNoteModal: (noteModal) => set({ noteModal }),
  ticketUpdateFlag: {},
  setTicketUpdateFlag: (ticketUpdateFlag) => set({ ticketUpdateFlag }),
  isModalOpenCall: false,
  setIsModalOpenCall: (isModalOpenCall) => set({ isModalOpenCall }),
  isSwitchView: false,
  setIsSwitchView: (isSwitchView) => set({ isSwitchView })
}));

export default useTicketStore;
