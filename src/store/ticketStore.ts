import create from 'zustand';
import { iTicketStore } from '../types/store/ticket';
import useUserStore from './userStore';

const useTicketStore = create<iTicketStore>((set, get) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
  bulkTickets: [],
  setBulkTickets: (bulkTickets) => set({ bulkTickets }),
  pharmcyTicket: [],
  setPharmcyTickets: (pharmcyTicket) => set({ pharmcyTicket }),
  ticketCount: 0,
  setTicketCount: (ticketCount) => set({ ticketCount }),
  searchByName: 'undefined',
  setSearchByName: (searchByName) => set({ searchByName }),
  bulkSearchByName: 'undefined',
  setBulkSearchByName: (bulkSearchByName) => set({ bulkSearchByName }),
  ticketCache: { 1: [] },
  setTicketCache: (ticketCache) => set({ ticketCache }),
  bulkTicketCache: { 1: [] },
  setBulkTicketCache: (bulkTicketCache) => set({ bulkTicketCache }),
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
    stageList: '',
    representative: null,
    results: null,
    dateRange: [],
    status: '',
    followUp: null
  },
  setFilterTickets: (filterTickets) => set({ filterTickets }),
  filterTicketsDiago: {
    stageList: '',
    representative: null,
    results: null,
    dateRange: [],
    status: '',
    followUp: null
  },
  setFilterTicketsDiago: (filterTicketsDiago) => set({ filterTicketsDiago }),
  filterTicketsFollowUp: {
    stageList: '',
    representative: null,
    results: null,
    dateRange: [],
    status: '',
    followUp: null
  },
  setFilterTicketsFollowUp: (filterTicketsFollowUp) =>
    set({ filterTicketsFollowUp }),
  BulkFilterTickets: {
    stageList: '',
    representative: null,
    results: null,
    dateRange: [],
    status: '',
    followUp: null
  },
  setBulkFilterTickets: (BulkFilterTickets) => set({ BulkFilterTickets }),
  BulkFilterTicketsDiago: {
    stageList: '',
    representative: null,
    results: null,
    dateRange: [],
    status: '',
    followUp: null
  },
  setBulkFilterTicketsDiago: (BulkFilterTicketsDiago) =>
    set({ BulkFilterTicketsDiago }),
  BulkFilterTicketsFollowUp: {
    stageList: '',
    representative: null,
    results: null,
    dateRange: [],
    status: '',
    followUp: null
  },
  setBulkFilterTicketsFollowUp: (BulkFilterTicketsFollowUp) =>
    set({ BulkFilterTicketsFollowUp }),
  loaderOn: false,
  setLoaderOn: (loaderOn) => set({ loaderOn }),
  pageNumber: 1,
  setPageNumber: (pageNumber) => set({ pageNumber }),
  bulkPageNumber: 1,
  setBulkPageNumber: (bulkPageNumber) => set({ bulkPageNumber }),
  estimates: [],
  setEstimates: (estimates) => set({ estimates }),
  viewEstimates: [],
  setViewEstimates: (viewEstimates) => set({ viewEstimates }),
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
  setIsSwitchView: (isSwitchView) => set({ isSwitchView }),
  isAuditorFilterOn: false,
  setIsAuditorFilterOn: (isAuditorFilterOn) => set({ isAuditorFilterOn }),
  isEstimateUpload: false,
  setIsEstimateUpload: (isEstimateUpload) => set({ isEstimateUpload }),
  isAuditor: false,
  setIsAuditor: (isAuditor) => set({ isAuditor }),
  allTaskCount: [],
  setAllTaskCount: (allTaskCount) => set({ allTaskCount }),
  allAuditCommentCount: {
    auditorCommentId: '',
    ticketid: '',
    unreadCount: {}
  },
  setAllAuditCommentCount: (allAuditCommentCount) =>
    set({ allAuditCommentCount }),
  agentLogin: false,
  setAgentLogin: (agentLogin) => set({ agentLogin }),
  allWhtsappCount: {},
  setAllWhtsappCount: (allWhtsappCount) => set({ allWhtsappCount }),
  filteredLocation: '',
  setFilteredLocation: (filteredLocation) => set({ filteredLocation }),
  // Audit filter variable
  auditStage: '',
  setAuditStage: (auditStage) => set({ auditStage }),
  auditStatus: '',
  setAuditStatus: (auditStatus) => set({ auditStatus }),
  auditResult: '',
  setAuditResult: (auditResult) => set({ auditResult }),
  auditFilterCount: 0,
  setAuditFilterCount: (auditFilterCount) => set({ auditFilterCount }),
  auditDateRange: [''],
  setAuditDateRange: (auditDateRange) => set({ auditDateRange }),
  ticketType: '',
  setTicketType: (ticketType) => set({ ticketType }),
  downloadDisable: false,
  setDownloadDisable: (downloadDisable) => set({ downloadDisable }),
  dashboardLoader: false,
  setDashboardLoader: (dashboardLoader) => set({ dashboardLoader }),
  dashboardLoaderAdmission: false,
  setDashboardLoaderAdmission: (dashboardLoaderAdmission) =>
    set({ dashboardLoaderAdmission })
}));

export default useTicketStore;
