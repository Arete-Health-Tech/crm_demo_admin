import { Box, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Styles from './CallSummaryDashBoard.module.css';
import Callattempted from '../../assets/callAttempted.svg';
import CallButtonIcon from '../../assets/callAnswered.svg';
import ClickedCallButtonIcon from '../../assets/callNotAnswered.svg';
import AssignedVsAttemptedGraph from './AdmissionSummaryWidget/AssignedVsAttemptedGraph';
import AttemptedVsAssigned from './AdmissionSummaryWidget/AttemptedVsAssigned';
import useUserStore from '../../store/userStore';

import DeafaultGraph from './../../assets/Pie Graph Illustration.svg';
import NoData from './../../assets/Error.svg';
import useTicketStore from '../../store/ticketStore';
import { SpinnerDotted } from 'spinners-react';
import useDashboardStore from '../../store/dashboardStore';
import {
  getAdmissionTaskCompletedAbove,
  getTodaysTaskAllAdmission,
  getTodaysTaskCombinedAnsweredNotAnsweredAdmission,
  getTodaysTaskCompletedAdmission,
  getTotalCallAssignedAdmission
} from '../../api/dashboard/dashboard';
interface TodayTaskForAdmin {
  name: string;
  todaysTaskAnsweredForAdmin: number;
  totalcallLAttemptedForAdmin: number;
  totalcallLAnsweredforGraphForAdmin: number;
}

const AdmissionSummary = ({ selectedAgents, dateRange, fetchAgents }) => {
  const { user } = useUserStore.getState();
  const { setDashboardLoaderAdmission, dashboardLoaderAdmission } =
    useTicketStore();
  const {
    admissionSummaryTodayTaskAll,
    setAdmissionSummaryTodayTaskAll,
    admissionSummaryTodayTaskAnswered,
    setAdmissionSummaryTodayTaskAnswered,
    admissionSummaryTodayTaskNotAnswered,
    setAdmissionSummaryTodayTaskNotAnswered,
    admissionSummaryTotalCallAssigned,
    setAdmissionSummaryTotalCallAssigned,
    admissionSummaryTotalcallLAttempted,
    setAdmissionSummaryTotalcallLAttempted,
    admissionSummaryTotalcallLAnsweredforGraph,
    setAdmissionSummaryTotalcallLAnsweredforGraph,
    admissionSummaryTodayCallCompletedAbove,
    setAdmissionSummaryTodayCallCompletedAbove,
    admissionSummaryTotalAnswered,
    setAdmissionSummaryTotalAnswered
  } = useDashboardStore();

  const handleDateFormat = (e) => {
    return e.toISOString().split('T')[0];
  };

  const [todayTaskForAdminAdmission, setTodayTaskForAdminAdmission] = useState<
    TodayTaskForAdmin[]
  >([]);

  useEffect(() => {
    (async () => {
      const payload = {
        StartDate: '',
        EndDate: '',
        representativeId:
          user?.role === 'ADMIN' ? selectedAgents._id : user?._id
      };
      try {
        setDashboardLoaderAdmission(
          admissionSummaryTodayTaskAll === null &&
            admissionSummaryTodayTaskAnswered === null &&
            admissionSummaryTodayTaskNotAnswered === null &&
            admissionSummaryTotalCallAssigned === null &&
            admissionSummaryTotalcallLAttempted === null &&
            admissionSummaryTotalcallLAnsweredforGraph === null &&
            admissionSummaryTodayCallCompletedAbove === null
            ? true
            : false
        );
        if (
          Array.isArray(dateRange) &&
          dateRange.length === 2 &&
          dateRange[0] === '' &&
          dateRange[1] === ''
        ) {
          // This is for today's all task data
          const allData = await getTodaysTaskAllAdmission(payload);
          setAdmissionSummaryTodayTaskAll(allData.count);
          // This is for today's completed tasks above
          const totalCompletedTaskAbove = await getAdmissionTaskCompletedAbove(
            payload
          );

          // Similarly calculate the sum if needed
          const completedTaskSum: number = Object.values(
            totalCompletedTaskAbove.counts as Record<string, number>
          ).reduce((sum, value) => sum + value, 0);

          setAdmissionSummaryTodayCallCompletedAbove(completedTaskSum);
        }
        //This is for todays all completed task data
        const combinedData =
          await getTodaysTaskCombinedAnsweredNotAnsweredAdmission(payload);
        setAdmissionSummaryTodayTaskAnswered(combinedData.answeredCalls);
        setAdmissionSummaryTodayTaskNotAnswered(combinedData.notAnsweredCalls);

        //This is for todays all completed task data
        const completedData = await getTodaysTaskCompletedAdmission(payload);
        setAdmissionSummaryTotalAnswered(completedData.counts);
      } catch (error) {
        console.log(error);
      } finally {
        setDashboardLoaderAdmission(false);
      }
    })();
  }, [selectedAgents]);

  useEffect(() => {
    const data = async () => {
      if (user?.role === 'ADMIN' && selectedAgents._id === '') {
        const updatedTasks: TodayTaskForAdmin[] = []; // Define the array to hold task data

        for (let i = 0; i < fetchAgents.length; i++) {
          const rep = fetchAgents[i];
          const payloads = {
            StartDate: dateRange[0],
            EndDate: dateRange[1],
            representativeId: rep._id
          };

          try {
            // Fetch today's answered task data
            const answeredData = await getTotalCallAssignedAdmission(payloads);
            // Fetch total calls attempted data
            const fetchCombined =
              await getTodaysTaskCombinedAnsweredNotAnsweredAdmission(payloads);
            const totalCallAttempted =
              fetchCombined?.answeredCalls + fetchCombined?.notAnsweredCalls;

            // Fetch total calls answered for graph
            // const totalCallAnsweredForGraph =
            //   await getTotalcallLAnsweredforGraphAdmission(payloads);

            // Push data for this representative
            updatedTasks.push({
              name: rep.firstName, // Representative's name
              todaysTaskAnsweredForAdmin: answeredData?.counts[0]?.count, // Answered tasks
              totalcallLAttemptedForAdmin: totalCallAttempted, // Attempted calls
              totalcallLAnsweredforGraphForAdmin: fetchCombined?.answeredCalls // Answered calls for graph
            });
          } catch (error) {
            console.error(`Error fetching data for ${rep._id}:`, error);
          }
        }
        // setAssignedVsattempted((prevTasks) => [...prevTasks, ...updatedTasks]);
        // Update state after all tasks are fetched
        setTodayTaskForAdminAdmission(updatedTasks);
      } else if (selectedAgents._id !== '' || user?.role === 'REPRESENTATIVE') {
        const payloads = {
          StartDate: dateRange[0],
          EndDate: dateRange[1],
          representativeId: selectedAgents._id
        };
        try {
          // Fetch today's answered task data
          const answeredData = await getTotalCallAssignedAdmission(payloads);
          setAdmissionSummaryTotalCallAssigned(answeredData.counts[0].count);
          // Fetch total calls attempted data
          const fetchCombined =
            await getTodaysTaskCombinedAnsweredNotAnsweredAdmission(payloads);
          const totalCallAttempted =
            fetchCombined?.answeredCalls + fetchCombined?.notAnsweredCalls;
          setAdmissionSummaryTotalcallLAttempted(totalCallAttempted);
          setAdmissionSummaryTotalcallLAnsweredforGraph(
            fetchCombined?.answeredCalls
          );
        } catch (error) {
          console.error(
            `Error fetching data for ${selectedAgents._id}:`,
            error
          );
        }
      }
    };
    data();
  }, [selectedAgents]);

  return (
    <>
      <Stack className={Styles.container_head}>
        <Stack className={Styles.container_head_title}>
          Admission <span>Level</span>
        </Stack>
      </Stack>
      {dashboardLoaderAdmission ? (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(255, 255, 255, 0.5)" // Semi-transparent background
          zIndex={9999} // Ensure it's on top
        >
          <Box
            display="flex"
            flexDirection="column" // Arrange spinner and text vertically
            justifyContent="center"
            alignItems="center"
          >
            <SpinnerDotted
              size={100}
              thickness={100}
              speed={50}
              color="#007BFF"
              // secondaryColor="#D9EBFF"
            />
            <Box mt={2} fontSize="16px" fontWeight="bold">
              {' '}
              {/* Add margin-top to space text below the spinner */}
              Please Wait ...
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Box className={Styles.call_Summary_dashboard}>
            {/* Today's Task */}
            <Stack className={Styles.todat_task}>
              <Stack className={Styles.todat_task_total}>
                <Stack className={Styles.todat_task_common_head}>
                  Today's Task
                </Stack>
                <Stack className={Styles.todat_task_common_count}>
                  {admissionSummaryTodayTaskAll || 0}
                </Stack>
              </Stack>
              <Stack className={Styles.todat_task_completed}>
                <Stack className={Styles.todat_task_common_head}>
                  Today's Task Completed
                </Stack>
                <Stack className={Styles.todat_task_common_count}>
                  {admissionSummaryTodayCallCompletedAbove || 0}
                </Stack>
              </Stack>
            </Stack>

            {/* Calling Data */}
            <Stack className={Styles.calling_data}>
              <Stack className={Styles.call_attempted}>
                <Stack className={Styles.call_common_img}>
                  <img src={Callattempted} alt="" />
                </Stack>
                <Stack className={Styles.call_common_head}>
                  Call Attempted
                </Stack>
                <Stack className={Styles.call_common_count}>
                  {Number(admissionSummaryTodayTaskAnswered) +
                    Number(admissionSummaryTodayTaskNotAnswered)}
                </Stack>
              </Stack>
              <Stack className={Styles.call_answered}>
                <Stack className={Styles.call_common_img}>
                  <img src={CallButtonIcon} alt="" />
                </Stack>
                <Stack className={Styles.call_common_head}>Call Answered</Stack>
                <Stack className={Styles.call_common_count}>
                  {admissionSummaryTodayTaskAnswered || 0}
                </Stack>
              </Stack>
              <Stack className={Styles.call_not_answered}>
                <Stack className={Styles.call_common_img}>
                  <img src={ClickedCallButtonIcon} alt="" />
                </Stack>
                <Stack className={Styles.call_common_head}>
                  Call Not Answered
                </Stack>
                <Stack className={Styles.call_common_count}>
                  {' '}
                  {admissionSummaryTodayTaskNotAnswered || 0}
                </Stack>
              </Stack>
            </Stack>

            {/* Call Answered Not Answered */}
            <Stack className={Styles.answered_notAnswered}>
              <Stack className={Styles.answered_call}>
                <Stack className={Styles.answered_call_head}>
                  Calls Answered
                </Stack>
                <Stack className={Styles.answered_call_content}>
                  <Stack className={Styles.answered_call_total_count}>
                    {' '}
                    <Stack className={Styles.answered_call_total_count_value}>
                      {admissionSummaryTodayTaskAnswered}
                    </Stack>
                    <Stack className={Styles.answered_call_total_count_title}>
                      Call Answered
                    </Stack>
                  </Stack>
                  {Object.entries(admissionSummaryTotalAnswered).length !==
                  0 ? (
                    <Stack className={Styles.answered_call_division}>
                      {Object.entries(admissionSummaryTotalAnswered).map(
                        ([key, value], index) => {
                          return (
                            <Stack
                              className={Styles.answered_call_division_count}
                              key={index}
                            >
                              <Stack className={Styles.division_count_title}>
                                {key}
                              </Stack>
                              <Stack className={Styles.division_count_value}>
                                {String(value)}
                              </Stack>
                            </Stack>
                          );
                        }
                      )}
                    </Stack>
                  ) : (
                    <>
                      <img
                        src={NoData}
                        style={{ width: '100px', height: '100px' }}
                      />
                      <Stack className={Styles.answered_call_division}>
                        No data available
                      </Stack>
                    </>
                  )}
                </Stack>
              </Stack>
              {/* <Stack className={Styles.answered_call}>
            <Stack className={Styles.answered_call_head}>
              Calls Not Answered
            </Stack>
            <Stack className={Styles.answered_call_content}>
              <Stack className={Styles.answered_call_total_count}>
                <Stack className={Styles.answered_call_total_count_value}>
                  {todayTaskNotAnswered}
                </Stack>
                <Stack className={Styles.answered_call_total_count_title}>
                  Call Not Answered
                </Stack>
              </Stack>
              {Object.entries(totalNotAnswered).length !== 0 ? (
                <Stack className={Styles.answered_call_division}>
                  {Object.entries(totalNotAnswered).map(
                    ([key, value], index) => {
                      return (
                        <Stack
                          className={Styles.answered_call_division_count}
                          key={index}
                        >
                          <Stack className={Styles.division_count_title}>
                            {key}
                          </Stack>
                          <Stack className={Styles.division_count_value}>
                            {String(value)}
                          </Stack>
                        </Stack>
                      );
                    }
                  )}
                </Stack>
              ) : (
                <>
                  <img
                    src={NoData}
                    style={{ width: '100px', height: '100px' }}
                  />
                  <Stack className={Styles.answered_call_division}>
                    No data available
                  </Stack>
                </>
              )}
            </Stack>
          </Stack> */}
            </Stack>
            {/* line Graph */}
            <Stack className={Styles.line_graph_container}>
              <Stack className={Styles.line_graph}>
                <Stack className={Styles.line_graph_head}>
                  {' '}
                  Total Calls Assigned Vs. Attempted
                </Stack>
                <Stack className={Styles.bar_graph_component}>
                  {todayTaskForAdminAdmission.length > 0 ||
                  admissionSummaryTotalCallAssigned ||
                  admissionSummaryTotalcallLAttempted ? (
                    <AssignedVsAttemptedGraph
                      callAssigned={admissionSummaryTotalCallAssigned || 0} // assigned
                      callAttemmpted={admissionSummaryTotalcallLAttempted || 0}
                      user={user?.firstName || 'Unknown User'}
                      selectedAgents={
                        selectedAgents || { _id: '', firstName: '' }
                      }
                      todayTaskForAdminAdmission={
                        Array.isArray(todayTaskForAdminAdmission)
                          ? todayTaskForAdminAdmission
                          : []
                      }
                    />
                  ) : (
                    <>
                      <img
                        src={DeafaultGraph}
                        style={{ width: '200px', height: '200px' }}
                      />
                      <Stack sx={{ marginBottom: '30px' }}>
                        No data available
                      </Stack>
                    </>
                  )}
                </Stack>
              </Stack>

              <Stack className={Styles.line_graph}>
                <Stack className={Styles.line_graph_head}>
                  {' '}
                  Total Calls Attempted Vs. Answered
                </Stack>
                <Stack className={Styles.bar_graph_component}>
                  {todayTaskForAdminAdmission.length > 0 ||
                  admissionSummaryTotalcallLAnsweredforGraph ||
                  admissionSummaryTotalcallLAttempted ? (
                    <AttemptedVsAssigned
                      callAttemmpted={admissionSummaryTotalcallLAttempted}
                      callAnswered={admissionSummaryTotalcallLAnsweredforGraph}
                      user={user?.firstName || 'Unknown User'}
                      selectedAgents={
                        selectedAgents || { _id: '', firstName: '' }
                      }
                      todayTaskForAdminAdmission={
                        Array.isArray(todayTaskForAdminAdmission)
                          ? todayTaskForAdminAdmission
                          : []
                      }
                    />
                  ) : (
                    <>
                      <img
                        src={DeafaultGraph}
                        style={{ width: '200px', height: '200px' }}
                      />
                      <Stack sx={{ marginBottom: '30px' }}>
                        No data available
                      </Stack>
                    </>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </>
      )}
    </>
  );
};

export default AdmissionSummary;
