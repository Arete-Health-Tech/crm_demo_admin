interface TodayTaskForAdmin {
  name: string;
  totalCallAssigned: number;
  todaysTaskAnsweredForAdmin: number;
  totalcallLAttemptedForAdmin: number;
  totalcallLAnsweredforGraphForAdmin: number;
}
interface TodayTaskForAdminAdmission {
  name: string;
  todaysTaskAnsweredForAdmin: number;
  totalcallLAttemptedForAdmin: number;
  totalcallLAnsweredforGraphForAdmin: number;
}

export interface iDashboardStore {
  callSummaryTodayTaskAll: number | string | null;
  setCallSummaryTodayTaskAll: (
    callSummaryTodayTaskAll: number | string | null
  ) => void;
  callSummaryTodayCallCompletedAbove: number | string | null;
  setCallSummaryTodayCallCompletedAbove: (
    callSummaryTodayCallCompletedAbove: number | string | null
  ) => void;
  callSummaryTotalAnswered: object;
  setCallSummaryTotalAnswered: (callSummaryTotalAnswered: object) => void;
  callSummaryTodayTaskAnswered: number | string | null;
  setCallSummaryTodayTaskAnswered: (
    callSummaryTodayTaskAnswered: number | string | null
  ) => void;
  callSummaryTodayTaskNotAnswered: number | string | null;
  setCallSummaryTodayTaskNotAnswered: (
    callSummaryTodayTaskNotAnswered: number | string | null
  ) => void;
  callSummaryTotalCallGraphAssigned: number | string | null;
  setCallSummaryTotalCallGraphAssigned: (
    callSummaryTotalCallGraphAssigned: number | string | null
  ) => void;
  callSummaryTotalcallLGraphAttempted: number | string | null;
  setCallSummaryTotalcallLGraphAttempted: (
    callSummaryTotalcallLGraphAttempted: number | string | null
  ) => void;
  callSummaryTotalcallLGraphAnsweredforGraph: number | string | null;
  setCallSummaryTotalcallLGraphAnsweredforGraph: (
    callSummaryTotalcallLGraphAnsweredforGraph: number | string | null
  ) => void;

  // Admission Summary
  admissionSummaryTodayTaskAll: number | string | null;
  setAdmissionSummaryTodayTaskAll: (
    admissionSummaryTodayTaskAll: number | string | null
  ) => void;
  admissionSummaryTodayTaskAnswered: number | string | null;
  setAdmissionSummaryTodayTaskAnswered: (
    admissionSummaryTodayTaskAnswered: number | string | null
  ) => void;
  admissionSummaryTodayTaskNotAnswered: number | string | null;
  setAdmissionSummaryTodayTaskNotAnswered: (
    admissionSummaryTodayTaskNotAnswered: number | string | null
  ) => void;
  admissionSummaryTotalCallAssigned: number | string | null;
  setAdmissionSummaryTotalCallAssigned: (
    admissionSummaryTotalCallAssigned: number | string | null
  ) => void;
  admissionSummaryTotalcallLAttempted: number | string | null;
  setAdmissionSummaryTotalcallLAttempted: (
    admissionSummaryTotalcallLAttempted: number | string | null
  ) => void;
  admissionSummaryTotalcallLAnsweredforGraph: number | string | null;
  setAdmissionSummaryTotalcallLAnsweredforGraph: (
    admissionSummaryTotalcallLAnsweredforGraph: number | string | null
  ) => void;
  admissionSummaryTodayCallCompletedAbove: number | string | null;
  setAdmissionSummaryTodayCallCompletedAbove: (
    admissionSummaryTodayCallCompletedAbove: number | string | null
  ) => void;
  admissionSummaryTotalAnswered: object;
  setAdmissionSummaryTotalAnswered: (
    admissionSummaryTotalAnswered: object
  ) => void;

  // Follow Up Summary
  followUpSummaryTodayTaskAll: number | string | null;
  setFollowUpSummaryTodayTaskAll: (
    FollowUpSummaryTodayTaskAll: number | string | null
  ) => void;

  followUpTodayCallCompletedAbove: number | string | null;
  setFollowUptodayCallCompletedAbove: (
    followUpTodayCallCompletedAbove: number | string | null
  ) => void;
  // 1.
  followUpTodayTaskAnswered: number | string | null;
  setFollowUpTodayTaskAnswered: (
    followUpTodayTaskAnswered: number | string | null
  ) => void;
  // 2.
  followUpTodayTaskNotAnswered: number | string | null;
  setFollowUpTodayTaskNotAnswered: (
    followUpTodayTaskNotAnswered: number | string | null
  ) => void;
  //3.
  followUpTotalAnswered: object;
  setFollowUpTotalAnswered: (followUpTotalAnswered: object) => void;
  //4.
  followUpTotalCallGraphAssigned: number | string | null;
  setFollowUpTotalCallGraphAssigned: (
    followUpTotalCallGraphAssigned: number | string | null
  ) => void;
  //5.
  followUpTotalcallLGraphAttempted: number | string | null;
  setFollowUpTotalcallLGraphAttempted: (
    followUpTotalcallLGraphAttempted: number | string | null
  ) => void;
  //6.
  followUpTotalcallLGraphAnsweredforGraph: number | string | null;
  setFollowUpTotalcallLGraphAnsweredforGraph: (
    followUpTotalcallLGraphAnsweredforGraph: number | string | null
  ) => void;

  followUpTodayTaskForAdminAdmission: TodayTaskForAdminAdmission[] | null;
  setFollowUpTodayTaskForAdminAdmission: (
    followUpTodayTaskForAdminAdmission: TodayTaskForAdminAdmission[] | null
  ) => void;
}
