import { AxiosResponse } from 'axios';
import {
  iCallRescheduler,
  iNote,
  iReminder,
  iTimer
} from '../../types/store/ticket';
import { apiClient } from '../apiClient';
import useTicketStore from '../../store/ticketStore';
// const { localStorage.getItem('ticketType'), setDownloadDisable } = useTicketStore.getState();

export const getTicket = async (
  name: string,
  pageNumber: number,
  downloadAll: string,
  selectedFilters: any,
  ticketId?: string | null,
  fetchUpdated: boolean = false,
  phone?: any,
  filteredLocation?: string | '',
  won?: any,
  lose?: any
) => {
  console.log(localStorage.getItem('ticketType'));
  console.log('calling from ticketfilter old api', filteredLocation);

  const params = new URLSearchParams(selectedFilters).toString();
  // const timestamp = new Date().getTime();
  const { data } = await apiClient.get(
    `${
      localStorage.getItem('ticketType') === 'Admission'
        ? '/ticket/'
        : localStorage.getItem('ticketType') === 'Diagnostics'
        ? '/diagnostics/getRepresentativediagnosticsTickets/'
        : localStorage.getItem('ticketType') === 'Follow-Up'
        ? '/followUp/FollowUpTickets'
        : '/ticket/'
    }?page=${pageNumber}&name=${
      name !== '' ? name : 'undefined'
    }&downloadAll=${downloadAll}&ticketId=${ticketId}&phonev=${phone}&fetchUpdated=${fetchUpdated}&${params}
    &specialty=${localStorage.getItem(
      'location'
    ) || ''}&specialtyforFilter=${filteredLocation}`
  );
  return data;
};

export const getFilteredTicket = async (
  pageNumber: number,
  selectedFilters: any,
  filteredLocation: string,
  phone?: any
) => {
  console.log(selectedFilters);

  let data: any;

  let dateRange: string[] | null = null;
  try {
    if (
      selectedFilters?.dateRange &&
      typeof selectedFilters.dateRange === 'string' &&
      selectedFilters.dateRange !== ''
    ) {
      dateRange = JSON.parse(selectedFilters.dateRange);
    }
  } catch (err) {
    console.error('Failed to parse dateRange:', err);
  }
  const params = new URLSearchParams();

  if (
    localStorage.getItem('ticketType') === 'Admission' ||
    localStorage.getItem('ticketBulkType') === 'Admission'
  ) {
    console.log('calling admission api');
    //Below checking the conditions for calling filter combination api
    if (selectedFilters.results) {
      params.set(
        'result',
        selectedFilters.results === '65991601a62baad220000001' ? 'won' : 'lost'
      );
    }
    if (pageNumber) params.set('page', pageNumber.toString());
    if (selectedFilters.admissionType)
      params.set('admission', selectedFilters.admissionType);
    if (filteredLocation) params.set('location', filteredLocation);
    const location = localStorage.getItem('location');
    if (location && location !== '') {
      params.set('location', location);
    }
    if (dateRange && dateRange[0]) params.set('startDate', dateRange[0]);
    if (dateRange && dateRange[1]) params.set('endDate', dateRange[1]);
    if (selectedFilters.payerType)
      params.set('payerType', selectedFilters.payerType);
    if (selectedFilters.stageList)
      params.set('stage', selectedFilters.stageList);
    if (selectedFilters.status) params.set('status', selectedFilters.status);
    if (phone) params.set('phone', phone);

    // Below checking the count of filters applied one or more
    const countCheck = (selectedFilter: any, location: string) => {
      let count = 0;

      Object.entries(selectedFilter).forEach(([_, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          count += 1;
        } else if (typeof value === 'string' && value.trim() !== '') {
          count += 1;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          count += 1;
        }
      });

      if (location && location !== '') {
        count += 1;
      }
      if (
        localStorage.getItem('location') &&
        localStorage.getItem('location') !== ''
      ) {
        count += 1;
      }
      return count;
    };

    if (countCheck(selectedFilters, filteredLocation) < 2) {
      // Api calls Start

      if (dateRange && dateRange.length === 2) {
        data = await apiClient.get(
          `/filters/datefilter/?startDate=${dateRange[0]}&endDate=${dateRange[1]}&page=${pageNumber}&phone=${phone}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } else if (filteredLocation) {
        data = await apiClient.get(
          `/filters/Specialty/?specialty=${filteredLocation}&page=${pageNumber}&phone=${phone}`
        );
      } else if (
        selectedFilters?.admissionType &&
        typeof selectedFilters.admissionType === 'string' &&
        selectedFilters.admissionType.trim() !== ''
      ) {
        data = await apiClient.get(
          `/filters/Admission/?admission=${selectedFilters.admissionType}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.payerType) {
        data = await apiClient.get(
          `/filters/PayerType/?payertype=${selectedFilters.payerType}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.status) {
        data = await apiClient.get(
          `/filters/status/?status=${selectedFilters.status}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.stageList) {
        data = await apiClient.get(
          `/filters/stage/?stage=${selectedFilters.stageList}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.representative) {
        data = await apiClient.get(
          `/filters/representative/?assigned=${selectedFilters.representative}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.results) {
        data = await apiClient.get(
          `/ticket/Resultfilter/?resultType=${
            selectedFilters.results === '65991601a62baad220000001'
              ? 'won'
              : 'lost'
          }&page=${pageNumber}&phone=${phone}`
        );
      }
    } else {
      console.log(params);
      data = await apiClient.get(`/filters/filter-combo/?${params.toString()}`);
    }
  } else if (
    localStorage.getItem('ticketType') === 'Diagnostics' ||
    localStorage.getItem('ticketBulkType') === 'Diagnostics'
  ) {
    //Below checking the conditions for calling filter combination api
    if (selectedFilters.results) {
      params.set(
        'result',
        selectedFilters.results === '65991601a62baad220000001' ? 'won' : 'lost'
      );
    }
    if (pageNumber) params.set('page', pageNumber.toString());
    if (filteredLocation) params.set('location', filteredLocation);
    const location = localStorage.getItem('location');
    if (location && location !== '') {
      params.set('location', location);
    }
    if (dateRange && dateRange[0]) params.set('startDate', dateRange[0]);
    if (dateRange && dateRange[1]) params.set('endDate', dateRange[1]);
    if (selectedFilters.payerType)
      params.set('payerType', selectedFilters.payerType);
    if (selectedFilters.stageList)
      params.set('stage', selectedFilters.stageList);
    if (selectedFilters.status) params.set('status', selectedFilters.status);
    if (phone) params.set('phone', phone);

    // Below checking the count of filters applied one or more
    const countCheck = (selectedFilter: any, location: string) => {
      let count = 0;

      Object.entries(selectedFilter).forEach(([_, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          count += 1;
        } else if (typeof value === 'string' && value.trim() !== '') {
          count += 1;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          count += 1;
        }
      });

      if (location && location !== '') {
        count += 1;
      }
      if (
        localStorage.getItem('location') &&
        localStorage.getItem('location') !== ''
      ) {
        count += 1;
      }

      return count;
    };

    if (countCheck(selectedFilters, filteredLocation) < 2) {
      // Api calls Start

      if (dateRange && dateRange.length === 2) {
        data = await apiClient.get(
          `/filters/Diagnosticsdatefilter/?startDate=${dateRange[0]}&endDate=${dateRange[1]}&page=${pageNumber}&phone=${phone}`
        );
      } else if (filteredLocation) {
        data = await apiClient.get(
          `/filters/DiagnosticSpecialty/?specialty=${filteredLocation}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.payerType) {
        data = await apiClient.get(
          `/filters/diagnosticsPayerType/?payertype=${selectedFilters.payerType}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.status) {
        data = await apiClient.get(
          `/filters/DiagnosticStatus/?status=${selectedFilters.status}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.stageList) {
        data = await apiClient.get(
          `/filters/DiagnosticStage/?stage=${selectedFilters.stageList}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.representative) {
        data = await apiClient.get(
          `/filters/Diagnosticsrepresentative/?assigned=${selectedFilters.representative}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.results) {
        data = await apiClient.get(
          `/ticket/Resultfilter/?resultType=${
            selectedFilters.results === '65991601a62baad220000001'
              ? 'won'
              : 'lost'
          }&page=${pageNumber}&phone=${phone}`
        );
      }
    } else {
      console.log(params);
      data = await apiClient.get(
        `/filters/diagnostics-combo/?${params.toString()}`
      );
    }
  } else if (
    localStorage.getItem('ticketType') === 'Follow-Up' ||
    localStorage.getItem('ticketBulkType') === 'Follow-Up'
  ) {
    console.log(selectedFilters);
    console.log('inside followup');
    //Below checking the conditions for calling filter combination api
    if (pageNumber) params.set('page', pageNumber.toString());
    if (filteredLocation) params.set('location', filteredLocation);
    const location = localStorage.getItem('location');
    if (location && location !== '') {
      params.set('location', location);
    }
    if (dateRange && dateRange[0]) params.set('startDate', dateRange[0]);
    if (dateRange && dateRange[1]) params.set('endDate', dateRange[1]);
    if (selectedFilters.payerType)
      params.set('payerType', selectedFilters.payerType);
    if (selectedFilters.stageList)
      params.set('stage', selectedFilters.stageList);
    if (selectedFilters.status) params.set('status', selectedFilters.status);
    if (phone) params.set('phone', phone);

    // Below checking the count of filters applied one or more
    const countCheck = (selectedFilter: any, location: string) => {
      let count = 0;

      Object.entries(selectedFilter).forEach(([_, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          count += 1;
        } else if (typeof value === 'string' && value.trim() !== '') {
          count += 1;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          count += 1;
        }
      });

      if (location && location !== '') {
        count += 1;
      }
      if (
        localStorage.getItem('location') &&
        localStorage.getItem('location') !== ''
      ) {
        count += 1;
      }
      return count;
    };
    if (countCheck(selectedFilters, filteredLocation) < 2) {
      // Api calls Start

      if (dateRange && dateRange.length === 2) {
        data = await apiClient.get(
          `/filters/FollowUpDateFilter/?startDate=${dateRange[0]}&endDate=${dateRange[1]}&page=${pageNumber}&phone=${phone}`
        );
      } else if (filteredLocation) {
        data = await apiClient.get(
          `/filters/FollowUpSpecialty/?specialty=${filteredLocation}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.payerType) {
        data = await apiClient.get(
          `/filters/FollowUpPayerType/?payertype=${selectedFilters.payerType}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.status) {
        data = await apiClient.get(
          `/filters/FollowUpstatus/?status=${selectedFilters.status}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.stageList) {
        data = await apiClient.get(
          `/filters/FollowUpStage/?stage=${selectedFilters.stageList}&page=${pageNumber}&phone=${phone}`
        );
      } else if (selectedFilters?.representative) {
        data = await apiClient.get(
          `/filters/FollowUpRepresentative/?assigned=${selectedFilters.representative}&page=${pageNumber}&phone=${phone}`
        );
      }
    } else {
      console.log(params);
      data = await apiClient.get(
        `/filters/FollowUp-combo/?${params.toString()}`
      );
    }
  }

  return data?.data;
};

export const getSearchedTicket = async (
  name: string,
  pageNumber: number,
  phone: any
) => {
  const { data } = await apiClient.get(
    `${
      localStorage.getItem('ticketType') === 'Admission'
        ? '/ticket/search'
        : localStorage.getItem('ticketType') === 'Diagnostics'
        ? '/diagnostics/search/'
        : localStorage.getItem('ticketType') === 'Follow-Up'
        ? '/followUp/search'
        : '/ticket/search'
    }?q=${name}&page=${pageNumber}&phone=${phone}`
  );
  return data;
};

export const getBulkTicket = async (
  name: string,
  pageNumber: number,
  downloadAll: string,
  selectedFilters: any,
  ticketId?: string | null,
  fetchUpdated: boolean = false,
  phone?: any,
  filteredLocation?: string | '',
  won?: any,
  lose?: any
) => {
  const params = new URLSearchParams(selectedFilters).toString();
  // const timestamp = new Date().getTime();
  const { data } = await apiClient.get(
    `${
      localStorage.getItem('ticketBulkType') === 'Admission'
        ? '/ticket/'
        : localStorage.getItem('ticketBulkType') === 'Diagnostics'
        ? '/diagnostics/getRepresentativediagnosticsTickets/'
        : localStorage.getItem('ticketBulkType') === 'Follow-Up'
        ? '/followUp/FollowUpTickets'
        : '/ticket/'
    }?page=${pageNumber}&name=${
      name !== '' ? name : 'undefined'
    }&downloadAll=${downloadAll}&ticketId=${ticketId}&phonev=${phone}&fetchUpdated=${fetchUpdated}&${params}
    &specialty=&specialtyforFilter=${filteredLocation}`
  );
  return data;
};
export const getAllTicketAdmission = async (value: any, location: any) => {
  if (location == 'All') {
    const { data } = await apiClient.get(
      `/ticket/allDownload?month=${value.format('YYYY-MM')}`
    );
    return data;
  } else {
    const { data } = await apiClient.get(
      `/ticket/allDownload?month=${value.format(
        'YYYY-MM'
      )}&location=${location}`
    );
    return data;
  }
};
export const getAllTicketDiagontics = async (value: any, location: any) => {
  if (location == 'All') {
    const { data } = await apiClient.get(
      `/ticket/getAllDownloadTicketDiagnostics?month=${value.format('YYYY-MM')}`
    );
    return data;
  } else {
    const { data } = await apiClient.get(
      `/ticket/getAllDownloadTicketDiagnostics?month=${value.format(
        'YYYY-MM'
      )}&location=${location}`
    );
    return data;
  }
};
export const getAllTicketFollowUp = async (value: any, location: any) => {
  if (location == 'All') {
    const { data } = await apiClient.get(
      `/followUp/followupdownload?month=${value.format('YYYY-MM')}`
    );
    return data;
  } else {
    const { data } = await apiClient.get(
      `/followUp/followupdownload?month=${value.format(
        'YYYY-MM'
      )}&location=${location}`
    );
    return data;
  }
};
export const getAllTicketAdmissionNew = async (
  startDate: any,
  endDate: any,
  phone: any
) => {
  const { data } = await apiClient.get(
    `/download/downloadAdmission?admission=Surgery&phone=${phone}&startDate=${startDate}&endDate=${endDate}`
  );
  return data;
};
export const getAllTicketDiagonticsNew = async (
  startDate: any,
  endDate: any,
  phone: any
) => {
  const { data } = await apiClient.get(
    `/download/downloadDiagnostics?diagnostics=true&phone=${phone}&startDate=${startDate}&endDate=${endDate}`
  );
  return data;
};

export const getAllTicketFollowUpNew = async (
  startDate: any,
  endDate: any,
  phone: any
) => {
  const { data } = await apiClient.get(
    `/download/downloadFollowUp?followup=true&phone=${ phone }&startDate=${ startDate }&endDate=${ endDate }`
    
  );
  return data;
};

export const getticketRescedulerAbove = async (ticketId?: string | null) => {
  // const timestamp = new Date().getTime();
  const { data } = await apiClient.get(
    `/diagnostics/getticketRescedulerAbove?ticket=${ticketId}`
  );
  return data;
};

export const getticketRescedulerAboveAdmission = async (
  ticketId?: string | null
) => {
  // const timestamp = new Date().getTime();
  const { data } = await apiClient.get(
    `/ticket/getticketRescedulerAbove?ticket=${ticketId}`
  );
  return data;
};

export const getTicketAfterNotification = async (
  name: string,
  pageNumber: number = 1,
  downloadAll: string,
  selectedFilters: any,
  ticketId?: string | null,
  fetchUpdated: boolean = false,
  phone?: any,
  filteredLocation?: string | '',
  won?: any,
  lose?: any
) => {
  console.log('inside new function');
  const params = new URLSearchParams(selectedFilters).toString();
  // const timestamp = new Date().getTime();
  const { data } = await apiClient.get(
    `/ticket/getReshedulerTickets/?page=${pageNumber}&name=${name}&downloadAll=${downloadAll}&ticketId=${ticketId}&phonev=${phone}&fetchUpdated=${fetchUpdated}&${params}
    &specialty=${localStorage.getItem(
      'location'
    )}&specialtyforFilter=${filteredLocation}`
  );
  return data;
};

export const getAuditTicket = async (
  name: string,
  pageNumber: number = 1,
  downloadAll: string,
  selectedFilters: any,
  ticketId?: string | null,
  fetchUpdated: boolean = false,
  phone?: any,
  filteredLocation?: string | '',
  won?: any,
  lose?: any
) => {
  const params = new URLSearchParams(selectedFilters).toString();
  // const timestamp = new Date().getTime();
  const { data } = await apiClient.get(
    `/ticket/getAllAuditTicket/?page=${pageNumber}&name=${name}&downloadAll=${downloadAll}&ticketId=${ticketId}&phonev=${phone}&fetchUpdated=${fetchUpdated}&${params}`
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
  const result = await apiClient.put(
    localStorage.getItem('ticketType') === 'Admission'
      ? '/ticket/validateTicket'
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? '/diagnostics/validateDiagnosticsTicket'
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? '/followUp/validateTicket'
      : '/ticket/',
    { ticketId }
  );
  return result;
};
// export const validateTicketDiago = async (ticketId: string | undefined) => {
//   const result = await apiClient.put('/diagnostics/validateDiagnosticsTicket', {
//     ticketId
//   });
//   return result;
// };

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

export const createNewNote = async (note: iNote, disposition: string) => {
  const { data } = await apiClient.post('/ticket/note', {
    ...note,
    disposition: disposition
  });
  return data;
};

export const getAllReminders = async () => {
  const { data } = await apiClient.get(`task/ticketRemainder/`);
  return data;
};

export const createNewReminder = async (reminderData: iReminder) => {
  const { data } = await apiClient.post(`/task/reminder`, {
    ...reminderData,
    ticketType: `${
      localStorage.getItem('ticketType') === 'Admission'
        ? 'admission'
        : localStorage.getItem('ticketType') === 'Diagnostics'
        ? 'diagnostics'
        : localStorage.getItem('ticketType') === 'Follow-Up'
        ? 'followUp'
        : ''
    }`
  });
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
  const { data } = await apiClient.post(`/task/reschedular`, {
    ...callReschedulerData,
    ticketType: `${
      localStorage.getItem('ticketType') === 'Admission'
        ? 'admission'
        : localStorage.getItem('ticketType') === 'Diagnostics'
        ? 'diagnostics'
        : localStorage.getItem('ticketType') === 'Follow-Up'
        ? 'followUp'
        : ''
    }`
  });
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

export const deleteDiagnosticsTicket = async (ticketID: string | undefined) => {
  const { data } = await apiClient.delete(
    `/diagnostics/deleteTicket/${ticketID}`
  );
  return Promise.resolve(data);
};

export const deleteFollowUpTicket = async (ticketID: string | undefined) => {
  const { data } = await apiClient.delete(`/followUp/deleteTicket/${ticketID}`);
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

// Notes Added For activity

export const createNoteActivity = async (notesData) => {
  await apiClient.post('/activity/getNotes', notesData);
};

export const getAuditTickets = async () => {
  const data = await apiClient.get(`/ticket/getAuditComments`);
  return Promise.resolve(data);
};

export const getAllWhatsAppCount = async () => {
  const data = await apiClient.get(`/flow/getAllWhatsAppCount`);
  return Promise.resolve(data.data);
};

export const markAsReadAuditComment = async (ticketID: string | undefined) => {
  const { data } = await apiClient.post(`/ticket/markAuditRead`, {
    ticket: ticketID
  });
  return data;
};

export const getAuditorCommentCount = async () => {
  const { data } = await apiClient.get(`/ticket/auditorCommentCount`);
  return data;
};

export const bulkAssignTickets = async (
  ticketIds: string[],
  representativeIds: string[]
) => {
  try {
    const { data } = await apiClient.put(`/ticket/bulkticketassign`, {
      ticketIds,
      representativeIds
    });
    return data;
  } catch (error) {
    console.error('Error during bulk ticket assignment:', error);
    throw error;
  }
};

export const clearAssigneeTickets = async (ticketIds: string[]) => {
  try {
    const { data } = await apiClient.put(`/ticket/removeAssignee`, {
      ticketIds
    });
    return data;
  } catch (error) {
    console.error('Error during Clearing Assignee for ticket:', error);
    throw error;
  }
};

export const resyncTickets = async (resyncData: Object) => {
  try {
    const { data } = await apiClient.post(`/csv/resyncTicket`, resyncData);
  } catch (error) {
    throw error;
  }
};
export const reSyncAllData = async (date) => {
  console.log(new Date(date));
  try {
    const { data } = await apiClient.post(`/csv/resyncAllTicket`, {
      date: new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      ).toISOString()
    });
  } catch (error) {
    throw error;
  }
};
