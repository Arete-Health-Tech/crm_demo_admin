import { create } from 'zustand';
import { iTicketStore } from '../types/store/ticket';
import useUserStore from './userStore';

const useTicketStore = create<iTicketStore>((set, get) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
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
  setStatus: (status) => set({ status })
}));

export default useTicketStore;
