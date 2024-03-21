import { filterActions } from './actions/filterAction';
import { iTicketFilter } from '../../../types/store/ticket';

export interface ticketFilterTypes {
  stageList: Array<any>;
  representative: string | null;
  results: string | null;

  // ...
  admissionType: string[];
  diagnosticsType: string[];
  dateRange: string[];




}

export const selectedFiltersState: iTicketFilter = {
  stageList: [],
  representative: null,
  results: null,
  //  ....
  admissionType: [],
  diagnosticsType: [],
  dateRange: ["", ""]


};

interface actionType {
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



  throw new Error('unknown action type');
}
