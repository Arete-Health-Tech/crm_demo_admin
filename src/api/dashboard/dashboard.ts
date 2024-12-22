import { apiClient } from '../apiClient';
interface TaskFilter {
  StartDate: string; // Or use `Date` if you're passing Date objects
  EndDate: string;
  representativeId: string; // Or `number` if it's numeric
}
export const getAllTimerDnd = async () => {
  const { data } = await apiClient.get('dashboard/dnd');

  return data;
};

export const getAllTimerPending = async () => {
  const { data } = await apiClient.get('dashboard/pending');

  return data;
};
export const getAllTimerTodaysTask = async () => {
  const { data } = await apiClient.get('dashboard/todaytask');

  return data;
};
export const getAllTimerCallCompleted = async () => {
  const { data } = await apiClient.get('dashboard/callCompleted');

  return data;
};
export const getAllTimerRescheduledCall = async () => {
  const { data } = await apiClient.get('dashboard/RescheduleCall');

  return data;
};

export const getAllWonAndLoss = async () => {
  const { data } = await apiClient.get('dashboard/resultData');

  return data;
};

export const getAllStageCount = async () => {
  const { data } = await apiClient.get('dashboard/stageCount');

  return data;
};

export const getAllSubStageCount = async () => {
  const { data } = await apiClient.get('dashboard/substageCount');

  return data;
};

export const getTodaysTaskAll = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskDataAll?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};
export const getTodayTaskCompletedAbove = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskCompletedAbove?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};
export const getFollowUpTaskCompletedAbove = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/FollowUpTaskCompletedAbove?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};
export const getAdmissionTaskCompletedAbove = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskCompletedAddmisionAbove?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

//In this todays task completed data showing the combination
export const getTodaysTaskCombinedAnsweredNotAnswered = async (
  value: TaskFilter
) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskCombined?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

//In this task completed data showing (complete+reschedule+dnd)
export const getTodaysTaskCompleted = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskCompleted?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

//In this todays task completed data showing the combination (Admission)
export const getTodaysTaskCombinedAnsweredNotAnsweredAdmission = async (
  value: TaskFilter
) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskCombinedAdmission?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

//In this todays task completed data showing the combination (Followup)
export const getTodaysTaskCombinedAnsweredNotAnsweredFollowup = async (
  value: TaskFilter
) => {
  const { data } = await apiClient.get(
    `dashboard/combinedFollowUpTasks?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTodaysTaskAnswered = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskAnswered?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTodaysTaskNotAnswered = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskNotAnswered?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTotalCallAssigned = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/totalCallAssignedByRepresentative?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTotalcallLAttempted = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskNotAnswered?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTotalcallLAnsweredforGraph = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskNotAnswered?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTodaysTaskAllAdmission = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskDataaddmision?StartDate=${''}&EndDate=${''}&representativeId=${
      value.representativeId
    }`
  );
  return data;
};

export const getTodaysTaskCompletedAdmission = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskCompletedAddmision?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTodaysTaskAnsweredAdmission = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskAnsweredAddmision?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTodaysTaskNotAnsweredAdmission = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskNotAnsweredAddmision?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTotalCallAssignedAdmission = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/totalCallAssignedByRepresentativeWithPrescription?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTotalcallLAttemptedAdmission = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/totalcalLAttemptedAddmision?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTotalCallAssignedFollowUp = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/totalCallAssignedByRepresentativeWithFollowUp?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

// export const getTotalcallLAnsweredforGraphAdmission = async (
//   value: TaskFilter
// ) => {
//   const { data } = await apiClient.get(
//     `dashboard/TotalCallAnshweredAddmision?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
//   );
//   return data;
// };

export const getTodaysTaskAllFollowup = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/todayTaskDataFollowUp?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTodaysTaskCompletedFollowup = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/FollowUpTaskCompleted?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTodaysTaskAnsweredFollowup = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/FollowUpTaskAnswered?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTodaysTaskNotAnsweredFollowup = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/followUpTaskNotAnswered?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

export const getTotalCallAssignedFollowup = async (value: TaskFilter) => {
  const { data } = await apiClient.get(
    `dashboard/followUpcalLAssigned?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
  );
  return data;
};

// export const getTotalcallLAttemptedFollowup = async (value: TaskFilter) => {
//   const { data } = await apiClient.get(
//     `dashboard/followUpcalLAttempted?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
//   );
//   return data;
// };

// export const getTotalcallLAnsweredforGraphFollowup = async (
//   value: TaskFilter
// ) => {
//   const { data } = await apiClient.get(
//     `dashboard/followUpCallAnshwered?StartDate=${value.StartDate}&EndDate=${value.EndDate}&representativeId=${value.representativeId}`
//   );
//   return data;
// };
