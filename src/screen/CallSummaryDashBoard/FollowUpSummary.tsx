import { Box, CircularProgress, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Styles from './CallSummaryDashBoard.module.css';
import Callattempted from '../../assets/callAttempted.svg';
import CallButtonIcon from '../../assets/callAnswered.svg';
import ClickedCallButtonIcon from '../../assets/callNotAnswered.svg';
import AssignedVsAttemptedGraph from './FollowUpSummaryWidget/AssignedVsAttemptedGraph';
import AttemptedVsAssigned from './FollowUpSummaryWidget/AttemptedVsAssigned';
import CallAnswered from './FollowUpSummaryWidget/CallAnsweredPie';
import CallNotAnswered from './FollowUpSummaryWidget/CallNotAnsweredPie';
import useUserStore from '../../store/userStore';
import {
  getFollowUpTaskCompletedAbove,
  getTodaysTaskAllFollowup,
  getTodaysTaskCombinedAnsweredNotAnsweredFollowup,
  getTodaysTaskCompletedFollowup,
  getTodaysTaskNotAnsweredFollowup,
  getTotalCallAssignedFollowUp,
  getTotalCallAssignedFollowup
} from '../../api/dashboard/dashboard';
import DeafaultGraph from './../../assets/Pie Graph Illustration.svg';
import NoData from './../../assets/Error.svg';
import useTicketStore from '../../store/ticketStore';
import useDashboardStore from '../../store/dashboardStore';

interface TodayTaskForAdmin {
  name: string;
  todaysTaskAnsweredForAdmin: number;
  totalcallLAttemptedForAdmin: number;
  totalcallLAnsweredforGraphForAdmin: number;
}

const FollowUpSummary = ({ selectedAgents, dateRange, fetchAgents }) => {
  const {
    followUpSummaryTodayTaskAll,
    followUpTodayCallCompletedAbove,
    followUpTodayTaskAnswered,
    followUpTodayTaskNotAnswered,
    followUpTotalAnswered,
    followUpTotalCallGraphAssigned,
    followUpTotalcallLGraphAttempted,
    followUpTotalcallLGraphAnsweredforGraph,
    followUpTodayTaskForAdminAdmission,
    setFollowUpSummaryTodayTaskAll,
    setFollowUptodayCallCompletedAbove,
    setFollowUpTodayTaskAnswered,
    setFollowUpTodayTaskNotAnswered,
    setFollowUpTotalAnswered,
    setFollowUpTotalCallGraphAssigned,
    setFollowUpTotalcallLGraphAttempted,
    setFollowUpTotalcallLGraphAnsweredforGraph,
    setFollowUpTodayTaskForAdminAdmission
  } = useDashboardStore();

  console.log('commit');
  const { user } = useUserStore.getState();
  const handleDateFormat = (e) => {
    return e.toISOString().split('T')[0];
  };

  useEffect(() => {
    (async () => {
      const payload = {
        StartDate: '',
        EndDate: '',
        representativeId:
          user?.role === 'ADMIN' ? selectedAgents._id : user?._id
      };
      try {
        if (
          Array.isArray(dateRange) &&
          dateRange.length === 2 &&
          dateRange[0] === '' &&
          dateRange[1] === ''
        ) {
          // This is for today's all task data
          const allData = await getTodaysTaskAllFollowup(payload);
          // setTodayTaskAll(allData.count);
          setFollowUpSummaryTodayTaskAll(allData.count); //store
          // This is for today's completed tasks above
          const totalCompletedTaskAbove = await getFollowUpTaskCompletedAbove(
            payload
          );

          // Similarly calculate the sum if needed
          const completedTaskSum: number = Object.values(
            totalCompletedTaskAbove.counts as Record<string, number>
          ).reduce((sum, value) => sum + value, 0);

          // setTodayCallCompletedAbove(completedTaskSum);
          setFollowUptodayCallCompletedAbove(completedTaskSum); //store
        }

        //This is for todays all completed task data
        const combinedData =
          await getTodaysTaskCombinedAnsweredNotAnsweredFollowup(payload);
        // setTodayTaskCompleted(
        //   combinedData.answeredCalls + combinedData.answeredCalls
        // );
        // setTodayTaskAnswered(combinedData.answeredCalls);
        setFollowUpTodayTaskAnswered(combinedData.answeredCalls); //store
        // setTodayTaskNotAnswered(combinedData.notAnsweredCalls);
        setFollowUpTodayTaskNotAnswered(combinedData.notAnsweredCalls); //store

        //This is for todays all completed task data
        const completedData = await getTodaysTaskCompletedFollowup(payload);

        // setTotalAnswered(completedData.counts);
        setFollowUpTotalAnswered(completedData.counts); // store
      } catch (error) {
        console.log(error);
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
            StartDate: '',
            EndDate: '',
            representativeId: rep._id
          };

          try {
            // Fetch today's answered task data
            const assignedData = await getTotalCallAssignedFollowUp(payloads);

            // Fetch total calls attempted data
            const fetchCombined =
              await getTodaysTaskCombinedAnsweredNotAnsweredFollowup(payloads);
            const totalCallAttempted =
              fetchCombined?.answeredCalls + fetchCombined?.notAnsweredCalls;
            console.log(fetchCombined, 'data 11');
            // Fetch total calls answered for graph
            // const totalCallAnsweredForGraph =
            //   await getTotalcallLAnsweredforGraphAdmission(payloads);

            // Push data for this representative
            updatedTasks.push({
              name: rep.firstName, // Representative's name
              todaysTaskAnsweredForAdmin: assignedData?.counts[0]?.count, // Assigned tasks
              totalcallLAttemptedForAdmin: totalCallAttempted, // Attempted calls
              totalcallLAnsweredforGraphForAdmin:
                fetchCombined?.answeredCalls || 0

              // Answered calls for graph
            });
          } catch (error) {
            console.error(`Error fetching data for ${rep._id}:`, error);
          }
        }

        // Update state after all tasks are fetched
        console.log(updatedTasks, 'data 11');
        if (updatedTasks.length > 0) {
          setFollowUpTodayTaskForAdminAdmission(updatedTasks);
        }
      } else if (selectedAgents._id !== '' || user?.role === 'REPRESENTATIVE') {
        const payloads = {
          StartDate: dateRange[0],
          EndDate: dateRange[1],
          representativeId: selectedAgents._id
        };
        try {
          // Fetch today's answered task data
          const answeredData = await getTotalCallAssignedFollowUp(payloads);
          setFollowUpTotalCallGraphAssigned(answeredData.counts[0].count); //store
          // Fetch total calls attempted data
          const fetchCombined =
            await getTodaysTaskCombinedAnsweredNotAnsweredFollowup(payloads);
          const totalCallAttempted =
            fetchCombined?.answeredCalls + fetchCombined?.notAnsweredCalls;
          setFollowUpTotalcallLGraphAttempted(totalCallAttempted); //store
          setFollowUpTotalcallLGraphAnsweredforGraph(
            fetchCombined?.answeredCalls
          ); //stroe
        } catch (error) {
          console.error(
            `Error fetching data for ${selectedAgents._id}:`,
            error
          );
        }
      }
    };
    data();
  }, [fetchAgents, selectedAgents]);

  return (
    <>
      <Stack className={Styles.container_head}>
        <Stack className={Styles.container_head_title}>
          Follow-up <span>Level</span>
        </Stack>
      </Stack>
      <Box className={Styles.call_Summary_dashboard}>
        {/* Today's Task */}
        <Stack className={Styles.todat_task}>
          <Stack className={Styles.todat_task_total}>
            <Stack className={Styles.todat_task_common_head}>
              Today's Task
            </Stack>
            <Stack className={Styles.todat_task_common_count}>
              {' '}
              {followUpSummaryTodayTaskAll || <CircularProgress size="30px" />}
            </Stack>
          </Stack>
          <Stack className={Styles.todat_task_completed}>
            <Stack className={Styles.todat_task_common_head}>
              Today's Task Completed
            </Stack>
            <Stack className={Styles.todat_task_common_count}>
              {' '}
              {followUpTodayCallCompletedAbove !== null ? (
                followUpTodayCallCompletedAbove
              ) : (
                <CircularProgress size="30px" />
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* Calling Data */}
        <Stack className={Styles.calling_data}>
          <Stack className={Styles.call_attempted}>
            <Stack className={Styles.call_common_img}>
              <img src={Callattempted} alt="" />
            </Stack>
            <Stack className={Styles.call_common_head}>Call Attempted</Stack>
            <Stack className={Styles.call_common_count}>
              {' '}
              {followUpTodayTaskAnswered !== null &&
              followUpTodayTaskNotAnswered !== null ? (
                Number(followUpTodayTaskAnswered ?? 0) +
                Number(followUpTodayTaskNotAnswered ?? 0)
              ) : (
                <CircularProgress size="30px" />
              )}
            </Stack>
          </Stack>
          <Stack className={Styles.call_answered}>
            <Stack className={Styles.call_common_img}>
              <img src={CallButtonIcon} alt="" />
            </Stack>
            <Stack className={Styles.call_common_head}>Call Answered</Stack>
            <Stack className={Styles.call_common_count}>
              {' '}
              {followUpTodayTaskAnswered !== null ? (
                followUpTodayTaskAnswered
              ) : (
                <CircularProgress size="30px" />
              )}
            </Stack>
          </Stack>
          <Stack className={Styles.call_not_answered}>
            <Stack className={Styles.call_common_img}>
              <img src={ClickedCallButtonIcon} alt="" />
            </Stack>
            <Stack className={Styles.call_common_head}>Call Not Answered</Stack>
            <Stack className={Styles.call_common_count}>
              {' '}
              {followUpTodayTaskNotAnswered !== null ? (
                followUpTodayTaskNotAnswered
              ) : (
                <CircularProgress size="30px" />
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* Call Answered Not Answered */}
        <Stack className={Styles.answered_notAnswered}>
          <Stack className={Styles.answered_call}>
            <Stack className={Styles.answered_call_head}>Calls Answered</Stack>
            <Stack className={Styles.answered_call_content}>
              <Stack className={Styles.answered_call_total_count}>
                {' '}
                <Stack className={Styles.answered_call_total_count_value}>
                  {followUpTodayTaskAnswered !== null ? (
                    followUpTodayTaskAnswered
                  ) : (
                    <CircularProgress size="30px" />
                  )}
                </Stack>
                <Stack className={Styles.answered_call_total_count_title}>
                  Call Answered
                </Stack>
              </Stack>
              {Object.entries(followUpTotalAnswered).length !== 0 ? (
                <Stack className={Styles.answered_call_division}>
                  {Object.entries(followUpTotalAnswered).map(
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

        {/* Pie Chart */}
        <Stack className={Styles.line_graph_container}>
          <Stack className={Styles.line_graph}>
            <Stack className={Styles.line_graph_head}> Call Answered</Stack>
            <Stack
              className={Styles.bar_graph_component}
              paddingBottom={'40px'}
            >
              {Object.entries(followUpTotalAnswered).length !== 0 ? (
                <CallAnswered todayTaskAnswered={followUpTotalAnswered} />
              ) : (
                <>
                  <img
                    src={DeafaultGraph}
                    style={{ width: '200px', height: '200px' }}
                  />
                  <Stack sx={{ marginBottom: '30px' }}>No data available</Stack>
                </>
              )}
            </Stack>
          </Stack>

          <Stack className={Styles.line_graph}>
            <Stack className={Styles.line_graph_head}> Call Not Answered</Stack>
            <Stack
              className={Styles.bar_graph_component}
              paddingBottom={'40px'}
            >
              {followUpTodayTaskNotAnswered ? (
                <CallNotAnswered
                  todayTaskNotAnswered={followUpTodayTaskNotAnswered}
                />
              ) : (
                <>
                  <img
                    src={DeafaultGraph}
                    style={{ width: '200px', height: '200px' }}
                  />
                  <Stack sx={{ marginBottom: '30px' }}>No data available</Stack>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* line Graph */}
        <Stack className={Styles.line_graph_container}>
          <Stack className={Styles.line_graph}>
            <Stack className={Styles.line_graph_head}>
              {' '}
              Total Calls Assigned Vs. Attempted
            </Stack>
            <Stack className={Styles.bar_graph_component}>
              {followUpTodayTaskForAdminAdmission &&
              (followUpTodayTaskForAdminAdmission?.length > 0 ||
                followUpTotalCallGraphAssigned) ? (
                <AssignedVsAttemptedGraph
                  callAssigned={followUpTotalCallGraphAssigned}
                  callAttemmpted={followUpTotalcallLGraphAttempted}
                  user={user?.firstName || 'Unknown User'}
                  selectedAgents={selectedAgents || { _id: '', firstName: '' }}
                  todayTaskForAdminAdmission={
                    Array.isArray(followUpTodayTaskForAdminAdmission)
                      ? followUpTodayTaskForAdminAdmission
                      : []
                  }
                />
              ) : (
                <>
                  <img
                    src={DeafaultGraph}
                    style={{ width: '200px', height: '200px' }}
                  />
                  <Stack sx={{ marginBottom: '30px' }}>No data available</Stack>
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
              {(followUpTodayTaskForAdminAdmission &&
                followUpTodayTaskForAdminAdmission[0]
                  .totalcallLAttemptedForAdmin > 0) ||
              followUpTotalcallLGraphAttempted ? (
                <AttemptedVsAssigned //This is attempted vs answered
                  callAttemmpted={followUpTotalcallLGraphAttempted}
                  callAnswered={followUpTotalcallLGraphAnsweredforGraph}
                  user={`${user?.firstName}`}
                  selectedAgents={selectedAgents}
                  todayTaskForAdminAdmission={
                    Array.isArray(followUpTodayTaskForAdminAdmission)
                      ? followUpTodayTaskForAdminAdmission
                      : []
                  }
                />
              ) : (
                <>
                  <img
                    src={DeafaultGraph}
                    style={{ width: '200px', height: '200px' }}
                  />
                  <Stack sx={{ marginBottom: '30px' }}>No data available</Stack>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default FollowUpSummary;
