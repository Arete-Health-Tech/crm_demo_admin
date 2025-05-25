import { ticketFilterTypes } from '../screen/ticket/ticketStateReducers/filter';

export const oldInitialFilters = {
  stageList: [],
  representative: null,
  results: null,
  admissionType: [],
  diagnosticsType: [],
  dateRange: [],
  status: [],
  followUp: null
};

//checking the intial state and the updated state
export function hasChanges(newFilter: any, initialState: any) {
  console.log(newFilter);
  console.log(initialState);
  return JSON.stringify(newFilter) === JSON.stringify(initialState);
}
// export function hasChanges(newFilter: any, initialState: any): boolean {
//   console.log(newFilter);
//   console.log(initialState);
//   const commonKeys = Object.keys(newFilter).filter(
//     (key) => key in initialState
//   );
//   console.log(commonKeys);
//   for (const key of commonKeys) {
//     const newValue = normalizeValue(newFilter[key]);
//     const initialValue = normalizeValue(initialState[key]);

//     if (JSON.stringify(newValue) === JSON.stringify(initialValue)) {
//       return true; // Difference found
//     } else {
//       return false;
//     }
//   }

//   return false; // No differences
// }

function normalizeValue(value: any) {
  if (value === null || value === undefined || value === '') {
    return null; // normalize all to null
  }
  return value;
}
// }

export const initialFiltersNew: ticketFilterTypes = {
  stageList: '',
  representative: null,
  results: null,
  admissionType: '',
  diagnosticsType: '',
  dateRange: [],
  status: '',
  followUp: null,
  payerType: ''
};
