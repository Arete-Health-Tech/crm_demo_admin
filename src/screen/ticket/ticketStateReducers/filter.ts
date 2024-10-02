import { filterActions, filterActionsDiago, filterActionsFollowUp } from './actions/filterAction';
import { iTicketFilter } from '../../../types/store/ticket';

export interface ticketFilterTypes {
  stageList: Array<any>;
  representative: string | null;
  results: string | null;

  // ...
  admissionType: string[];
  diagnosticsType: string[];
  dateRange: string[];
  status: string[];
  followUp: Date | null;
}

export const selectedFiltersState: iTicketFilter = {
  stageList: [],
  representative: null,
  results: null,
  //  ....
  admissionType: [],
  diagnosticsType: [],
  dateRange: ['', ''],
  status: [],
  followUp: null
};

export const selectedFiltersStateDiago: iTicketFilter = {
  stageList: [],
  representative: null,
  results: null,
  //  ....
  admissionType: [],
  diagnosticsType: [],
  dateRange: [],
  status: [],
  followUp: null
};

export const selectedFiltersStateFollowUp: iTicketFilter = {
  stageList: [],
  representative: null,
  results: null,
  //  ....
  admissionType: [],
  diagnosticsType: [],
  dateRange: [],
  status: [],
  followUp: null
};

interface actionType {
  type: string;
  payload: any;
}
interface actionTypeDiago {
  type: string;
  payload: any;
}
interface actionTypeFollowup {
  type: string;
  payload: any;
}

export function selectedFiltersReducer(
  selectedFiltersState: iTicketFilter,
  action: actionType
): iTicketFilter {
  if (action.type === filterActions.STAGES) {
    return {
      ...selectedFiltersState,
      stageList: action.payload
    };
  }

  if (action.type === filterActions.REPRESENTATIVE) {
    return {
      ...selectedFiltersState,
      representative: action.payload
    };
  }
  if (action.type === filterActions.RESULTS) {
    return {
      ...selectedFiltersState,
      results: action.payload
    };
  }
  //  if (action.type === filterActions.LOSE) {
  //   return {
  //     ...selectedFiltersState,
  //     lose: action.payload
  //   };
  // }

  if (action.type === filterActions.ADMISSIONTYPE) {
    return {
      ...selectedFiltersState,
      admissionType: action.payload
    };
  }
  if (action.type === filterActions.DIAGNOSTICSTYPE) {
    return {
      ...selectedFiltersState,
      diagnosticsType: action.payload
    };
  }

  if (action.type === filterActions.DATERANGE) {
    return {
      ...selectedFiltersState,
      dateRange: action.payload
    };
  }

  if (action.type === filterActions.STATUS) {
    return {
      ...selectedFiltersState,
      status: action.payload
    };
  }

  if (action.type === filterActions.FOLLOWUP) {
    return {
      ...selectedFiltersState,
      followUp: action.payload
    };
  }

  throw new Error('unknown action type');
}
export function selectedFiltersReducerDiago(
  selectedFiltersStateDiago: iTicketFilter,
  action: actionTypeDiago
): iTicketFilter {
  if (action.type === filterActionsDiago.STAGES) {
    return {
      ...selectedFiltersStateDiago,
      stageList: action.payload
    };
  }

  if (action.type === filterActionsDiago.REPRESENTATIVE) {
    return {
      ...selectedFiltersStateDiago,
      representative: action.payload
    };
  }
  if (action.type === filterActionsDiago.RESULTS) {
    return {
      ...selectedFiltersStateDiago,
      results: action.payload
    };
  }
  //  if (action.type === filterActionsDiago.LOSE) {
  //   return {
  //     ...selectedFiltersStateDiago,
  //     lose: action.payload
  //   };
  // }

  if (action.type === filterActionsDiago.ADMISSIONTYPE) {
    return {
      ...selectedFiltersStateDiago,
      admissionType: action.payload
    };
  }
  if (action.type === filterActionsDiago.DIAGNOSTICSTYPE) {
    return {
      ...selectedFiltersStateDiago,
      diagnosticsType: action.payload
    };
  }

  if (action.type === filterActionsDiago.DATERANGE) {
    return {
      ...selectedFiltersStateDiago,
      dateRange: action.payload
    };
  }

  if (action.type === filterActionsDiago.STATUS) {
    return {
      ...selectedFiltersStateDiago,
      status: action.payload
    };
  }

  if (action.type === filterActionsDiago.FOLLOWUP) {
    return {
      ...selectedFiltersStateDiago,
      followUp: action.payload
    };
  }

  throw new Error('unknown action type');
}
export function selectedFiltersReducerFollowUp(
  selectedFiltersStateFollowUp: iTicketFilter,
  action: actionTypeFollowup
): iTicketFilter {
  if (action.type === filterActionsFollowUp.STAGES) {
    return {
      ...selectedFiltersStateFollowUp,
      stageList: action.payload
    };
  }

  if (action.type === filterActionsFollowUp.REPRESENTATIVE) {
    return {
      ...selectedFiltersStateFollowUp,
      representative: action.payload
    };
  }
  if (action.type === filterActionsFollowUp.RESULTS) {
    return {
      ...selectedFiltersStateFollowUp,
      results: action.payload
    };
  }
  //  if (action.type === filterActionsFollowUp.LOSE) {
  //   return {
  //     ...selectedFiltersStateFollowUp,
  //     lose: action.payload
  //   };
  // }

  if (action.type === filterActionsFollowUp.ADMISSIONTYPE) {
    return {
      ...selectedFiltersStateFollowUp,
      admissionType: action.payload
    };
  }
  if (action.type === filterActionsFollowUp.DIAGNOSTICSTYPE) {
    return {
      ...selectedFiltersStateFollowUp,
      diagnosticsType: action.payload
    };
  }

  if (action.type === filterActionsFollowUp.DATERANGE) {
    return {
      ...selectedFiltersStateFollowUp,
      dateRange: action.payload
    };
  }

  if (action.type === filterActionsFollowUp.STATUS) {
    return {
      ...selectedFiltersStateFollowUp,
      status: action.payload
    };
  }

  if (action.type === filterActionsFollowUp.FOLLOWUP) {
    return {
      ...selectedFiltersStateFollowUp,
      followUp: action.payload
    };
  }

  throw new Error('unknown action type');
}
