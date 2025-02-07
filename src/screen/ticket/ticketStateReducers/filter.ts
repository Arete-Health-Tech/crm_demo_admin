import {
  bulkFilterActions,
  bulkFilterActionsDiago,
  bulkFilterActionsFollowUp,
  filterActions,
  filterActionsDiago,
  filterActionsFollowUp
} from './actions/filterAction';
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
export const selectedBulkFiltersState: iTicketFilter = {
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

export const selectedBulkFiltersStateDiago: iTicketFilter = {
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

export const selectedBulkFiltersStateFollowUp: iTicketFilter = {
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

interface actionBulkType {
  type: string;
  payload: any;
}
interface actionBulkTypeDiago {
  type: string;
  payload: any;
}
interface actionBulkTypeFollowup {
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

export function selectedBulkFiltersReducer(
  selectedBulkFiltersState: iTicketFilter,
  action: actionBulkType
): iTicketFilter {
  if (action.type === bulkFilterActions.STAGES) {
    return {
      ...selectedBulkFiltersState,
      stageList: action.payload
    };
  }

  if (action.type === bulkFilterActions.REPRESENTATIVE) {
    return {
      ...selectedBulkFiltersState,
      representative: action.payload
    };
  }
  if (action.type === bulkFilterActions.RESULTS) {
    return {
      ...selectedBulkFiltersState,
      results: action.payload
    };
  }
  //  if (action.type === bulkFilterActions.LOSE) {
  //   return {
  //     ...selectedBulkFiltersState,
  //     lose: action.payload
  //   };
  // }

  if (action.type === bulkFilterActions.ADMISSIONTYPE) {
    return {
      ...selectedBulkFiltersState,
      admissionType: action.payload
    };
  }
  if (action.type === bulkFilterActions.DIAGNOSTICSTYPE) {
    return {
      ...selectedBulkFiltersState,
      diagnosticsType: action.payload
    };
  }

  if (action.type === bulkFilterActions.DATERANGE) {
    return {
      ...selectedBulkFiltersState,
      dateRange: action.payload
    };
  }

  if (action.type === bulkFilterActions.STATUS) {
    return {
      ...selectedBulkFiltersState,
      status: action.payload
    };
  }

  if (action.type === bulkFilterActions.FOLLOWUP) {
    return {
      ...selectedBulkFiltersState,
      followUp: action.payload
    };
  }

  throw new Error('unknown action type');
}
export function selectedBulkFiltersReducerDiago(
  selectedBulkFiltersStateDiago: iTicketFilter,
  action: actionBulkTypeDiago
): iTicketFilter {
  if (action.type === bulkFilterActionsDiago.STAGES) {
    return {
      ...selectedBulkFiltersStateDiago,
      stageList: action.payload
    };
  }

  if (action.type === bulkFilterActionsDiago.REPRESENTATIVE) {
    return {
      ...selectedBulkFiltersStateDiago,
      representative: action.payload
    };
  }
  if (action.type === bulkFilterActionsDiago.RESULTS) {
    return {
      ...selectedBulkFiltersStateDiago,
      results: action.payload
    };
  }
  //  if (action.type === bulkFilterActionsDiago.LOSE) {
  //   return {
  //     ...selectedBulkFiltersStateDiago,
  //     lose: action.payload
  //   };
  // }

  if (action.type === bulkFilterActionsDiago.ADMISSIONTYPE) {
    return {
      ...selectedBulkFiltersStateDiago,
      admissionType: action.payload
    };
  }
  if (action.type === bulkFilterActionsDiago.DIAGNOSTICSTYPE) {
    return {
      ...selectedBulkFiltersStateDiago,
      diagnosticsType: action.payload
    };
  }

  if (action.type === bulkFilterActionsDiago.DATERANGE) {
    return {
      ...selectedBulkFiltersStateDiago,
      dateRange: action.payload
    };
  }

  if (action.type === bulkFilterActionsDiago.STATUS) {
    return {
      ...selectedBulkFiltersStateDiago,
      status: action.payload
    };
  }

  if (action.type === bulkFilterActionsDiago.FOLLOWUP) {
    return {
      ...selectedBulkFiltersStateDiago,
      followUp: action.payload
    };
  }

  throw new Error('unknown action type');
}
export function selectedBulkFiltersReducerFollowUp(
  selectedBulkFiltersStateFollowUp: iTicketFilter,
  action: actionBulkTypeFollowup
): iTicketFilter {
  if (action.type === bulkFilterActionsFollowUp.STAGES) {
    return {
      ...selectedBulkFiltersStateFollowUp,
      stageList: action.payload
    };
  }

  if (action.type === bulkFilterActionsFollowUp.REPRESENTATIVE) {
    return {
      ...selectedBulkFiltersStateFollowUp,
      representative: action.payload
    };
  }
  if (action.type === bulkFilterActionsFollowUp.RESULTS) {
    return {
      ...selectedBulkFiltersStateFollowUp,
      results: action.payload
    };
  }
  //  if (action.type === bulkFilterActionsFollowUp.LOSE) {
  //   return {
  //     ...selectedBulkFiltersStateFollowUp,
  //     lose: action.payload
  //   };
  // }

  if (action.type === bulkFilterActionsFollowUp.ADMISSIONTYPE) {
    return {
      ...selectedBulkFiltersStateFollowUp,
      admissionType: action.payload
    };
  }
  if (action.type === bulkFilterActionsFollowUp.DIAGNOSTICSTYPE) {
    return {
      ...selectedBulkFiltersStateFollowUp,
      diagnosticsType: action.payload
    };
  }

  if (action.type === bulkFilterActionsFollowUp.DATERANGE) {
    return {
      ...selectedBulkFiltersStateFollowUp,
      dateRange: action.payload
    };
  }

  if (action.type === bulkFilterActionsFollowUp.STATUS) {
    return {
      ...selectedBulkFiltersStateFollowUp,
      status: action.payload
    };
  }

  if (action.type === bulkFilterActionsFollowUp.FOLLOWUP) {
    return {
      ...selectedBulkFiltersStateFollowUp,
      followUp: action.payload
    };
  }

  throw new Error('unknown action type');
}
