import useTicketStore from "../../store/ticketStore";
import {  getAllStageCount, getAllTimerDnd, getAllTimerRescheduledCall, getAllWonAndLoss,  } from "./dashboard";
import { getAllTimerPending } from './dashboard';

import { getAllTimerTodaysTask } from './dashboard';

import { getAllTimerCallCompleted } from './dashboard';



export const getAllTimerStatusHandlerDnd = async () => {
  const { setStatus } = useTicketStore.getState();
  const timers = await getAllTimerDnd();
  setStatus(timers);
  return Promise.resolve(timers);
};

export const getAllTimerStatusHandlerPending = async () => {
  const { setStatus } = useTicketStore.getState();
  const timers = await getAllTimerPending();
  setStatus(timers);
  return Promise.resolve(timers);

};

export const getAllTimerStatusHandlerTodaysTask = async () => {
  const { setStatus } = useTicketStore.getState();
  const timers = await getAllTimerTodaysTask();
  setStatus(timers);
  return Promise.resolve(timers);
};

export const getAllTimerStatusHandlerCallCompleted = async () => {
  const { setStatus } = useTicketStore.getState();
  const timers = await getAllTimerCallCompleted();
  setStatus(timers);
  return Promise.resolve(timers);
};

export const getAllTimerStatusHandlerRescheduledCall = async () => {
  const { setStatus } = useTicketStore.getState();
  const timers = await getAllTimerRescheduledCall();
  setStatus(timers);
  return Promise.resolve(timers);
};

export const getAllWonAndLossHandler = async () => {

  const timers = await getAllWonAndLoss();
console.log(timers," this is won and loss data")
  return timers;
};

export const getAllStageCountHandler = async () => {
  const timers = await getAllStageCount();
  console.log(timers, ' this is satge count');
  return timers;
};