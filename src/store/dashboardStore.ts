import { create } from 'zustand';
import { iDashboardStore } from '../types/store/dashboard';

const useDashboardStore = create<iDashboardStore>((set, get) => ({
  callSummaryTodayTaskAll: null,
  setCallSummaryTodayTaskAll: (callSummaryTodayTaskAll) =>
    set({ callSummaryTodayTaskAll }),
  callSummaryTodayCallCompletedAbove: null,
  setCallSummaryTodayCallCompletedAbove: (callSummaryTodayCallCompletedAbove) =>
    set({ callSummaryTodayCallCompletedAbove }),
  callSummaryTotalAnswered: {},
  setCallSummaryTotalAnswered: (callSummaryTotalAnswered) =>
    set({ callSummaryTotalAnswered }),
  callSummaryTodayTaskAnswered: null,
  setCallSummaryTodayTaskAnswered: (callSummaryTodayTaskAnswered) =>
    set({ callSummaryTodayTaskAnswered }),
  callSummaryTodayTaskNotAnswered: null,
  setCallSummaryTodayTaskNotAnswered: (callSummaryTodayTaskNotAnswered) =>
    set({ callSummaryTodayTaskNotAnswered }),
  callSummaryTotalCallGraphAssigned: null,
  setCallSummaryTotalCallGraphAssigned: (callSummaryTotalCallGraphAssigned) =>
    set({ callSummaryTotalCallGraphAssigned }),
  callSummaryTotalcallLGraphAttempted: null,
  setCallSummaryTotalcallLGraphAttempted: (
    callSummaryTotalcallLGraphAttempted
  ) => set({ callSummaryTotalcallLGraphAttempted }),
  callSummaryTotalcallLGraphAnsweredforGraph: null,
  setCallSummaryTotalcallLGraphAnsweredforGraph: (
    callSummaryTotalcallLGraphAnsweredforGraph
  ) => set({ callSummaryTotalcallLGraphAnsweredforGraph }),

  //Admission Summary
  admissionSummaryTodayTaskAll: null,
  setAdmissionSummaryTodayTaskAll: (admissionSummaryTodayTaskAll) =>
    set({ admissionSummaryTodayTaskAll }),
  admissionSummaryTodayTaskAnswered: null,
  setAdmissionSummaryTodayTaskAnswered: (admissionSummaryTodayTaskAnswered) =>
    set({ admissionSummaryTodayTaskAnswered }),
  admissionSummaryTodayTaskNotAnswered: null,
  setAdmissionSummaryTodayTaskNotAnswered: (
    admissionSummaryTodayTaskNotAnswered
  ) => set({ admissionSummaryTodayTaskNotAnswered }),
  admissionSummaryTotalCallAssigned: null,
  setAdmissionSummaryTotalCallAssigned: (admissionSummaryTotalCallAssigned) =>
    set({ admissionSummaryTotalCallAssigned }),
  admissionSummaryTotalcallLAttempted: null,
  setAdmissionSummaryTotalcallLAttempted: (
    admissionSummaryTotalcallLAttempted
  ) => set({ admissionSummaryTotalcallLAttempted }),
  admissionSummaryTotalcallLAnsweredforGraph: null,
  setAdmissionSummaryTotalcallLAnsweredforGraph: (
    admissionSummaryTotalcallLAnsweredforGraph
  ) => set({ admissionSummaryTotalcallLAnsweredforGraph }),
  admissionSummaryTodayCallCompletedAbove: null,
  setAdmissionSummaryTodayCallCompletedAbove: (
    admissionSummaryTodayCallCompletedAbove
  ) => set({ admissionSummaryTodayCallCompletedAbove }),
  admissionSummaryTotalAnswered: {},
  setAdmissionSummaryTotalAnswered: (admissionSummaryTotalAnswered) =>
    set({ admissionSummaryTotalAnswered }),

  // Follow Up Summary
  followUpSummaryTodayTaskAll: null,
  setFollowUpSummaryTodayTaskAll: (followUpSummaryTodayTaskAll) =>
    set({ followUpSummaryTodayTaskAll }),

  followUpTodayCallCompletedAbove: null,
  setFollowUptodayCallCompletedAbove: (followUpTodayCallCompletedAbove) =>
    set({ followUpTodayCallCompletedAbove }),

  followUpTodayTaskAnswered: null,
  setFollowUpTodayTaskAnswered: (followUpTodayTaskAnswered) =>
    set({ followUpTodayTaskAnswered }),

  followUpTodayTaskNotAnswered: null,
  setFollowUpTodayTaskNotAnswered: (followUpTodayTaskNotAnswered) =>
    set({ followUpTodayTaskNotAnswered }),

  followUpTotalAnswered: {},
  setFollowUpTotalAnswered: (followUpTotalAnswered) =>
    set({ followUpTotalAnswered }),

  //4.
  followUpTotalCallGraphAssigned: null,
  setFollowUpTotalCallGraphAssigned: (followUpTotalCallGraphAssigned) =>
    set({ followUpTotalCallGraphAssigned }),
  //5.
  followUpTotalcallLGraphAttempted: null,
  setFollowUpTotalcallLGraphAttempted: (followUpTotalcallLGraphAttempted) =>
    set({ followUpTotalcallLGraphAttempted }),

  //6.
  followUpTotalcallLGraphAnsweredforGraph: null,
  setFollowUpTotalcallLGraphAnsweredforGraph: (
    followUpTotalcallLGraphAnsweredforGraph
  ) => set({ followUpTotalcallLGraphAnsweredforGraph }),

  followUpTodayTaskForAdminAdmission: null,
  setFollowUpTodayTaskForAdminAdmission: (followUpTodayTaskForAdminAdmission) =>
    set({ followUpTodayTaskForAdminAdmission })
}));

export default useDashboardStore;
