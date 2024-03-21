import { apiClient } from "../apiClient";

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

