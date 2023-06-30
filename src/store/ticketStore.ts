import { create } from 'zustand';
import { iTicketStore } from '../types/store/ticket';

const useTicketStore = create<iTicketStore>((set, get) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
  searchByName: 'undefined',
  setSearchByName: (searchByName) => set({ searchByName }),
  notes: [],
  setNotes: (notes) => set({ notes }),
  reminders: [],
  setReminders: (reminders) => set({ reminders }),
  filterTickets: {
    departments: [],
    doctors: [],
    admissionType: [],
    diagnosticType: [],
    startDate: NaN,
    endDate: NaN
  },
  setFilterTickets: (filterTickets) => set({ filterTickets })
}));

export default useTicketStore;
