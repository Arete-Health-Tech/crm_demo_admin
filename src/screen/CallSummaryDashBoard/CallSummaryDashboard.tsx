/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Styles from './CallSummaryDashBoard.module.css';
import AdmissionSummary from './AdmissionSummary';
import FollowUpSummary from './FollowUpSummary';
import Callattempted from '../../assets/callAttempted.svg';
import CallButtonIcon from '../../assets/callAnswered.svg';
import ClickedCallButtonIcon from '../../assets/callNotAnswered.svg';
import AssignedVsAttemptedGraph from './CallSummaryWidget/AssignedVsAttemptedGraph';
import AttemptedVsAnswered from './CallSummaryWidget/AttemptedVsAnswered';
import DownArrow from './../../assets/ArrowDown.svg';
import { getRepresntativesHandler } from '../../api/representive/representativeHandler';
import useUserStore from '../../store/userStore';
import {
  getTodaysTaskAll,
  getTodaysTaskAnswered,
  getTodaysTaskCombinedAnsweredNotAnswered,
  getTodaysTaskCompleted,
  getTodaysTaskNotAnswered,
  getTodayTaskCompletedAbove,
  getTotalCallAssigned,
  getTotalcallLAnsweredforGraph,
  getTotalcallLAttempted
} from '../../api/dashboard/dashboard';
import useTicketStore from '../../store/ticketStore';
import DeafaultGraph from './../../assets/Pie Graph Illustration.svg';
import NoData from './../../assets/Error.svg';
import { SpinnerDotted } from 'spinners-react';
import useDashboardStore from '../../store/dashboardStore';
import { TodayTaskForAdmin } from '../../types/store/dashboard';
import { toast } from 'react-toastify';
import { socket } from '../../api/apiClient';
import { reSyncAllData } from '../../api/ticket/ticket';

type Agent = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number | null;
  role: string;
  password: string;
  created_on: string;
  status: boolean | null;
};

const CallSummaryDashboard = () => {
  const { user } = useUserStore.getState();
  const {
    setPageNumber,
    setDashboardLoader,
    dashboardLoader,
    dashboardLoaderAdmission
  } = useTicketStore();
  const {
    callSummaryTodayTaskAll,
    setCallSummaryTodayTaskAll,
    callSummaryTodayCallCompletedAbove,
    setCallSummaryTodayCallCompletedAbove,
    callSummaryTotalAnswered,
    setCallSummaryTotalAnswered,
    callSummaryTodayTaskAnswered,
    setCallSummaryTodayTaskAnswered,
    callSummaryTodayTaskNotAnswered,
    setCallSummaryTodayTaskNotAnswered,
    callSummaryTotalCallGraphAssigned,
    setCallSummaryTotalCallGraphAssigned,
    callSummaryTotalcallLGraphAttempted,
    setCallSummaryTotalcallLGraphAttempted,
    callSummaryTotalcallLGraphAnsweredforGraph,
    setCallSummaryTotalcallLGraphAnsweredforGraph
  } = useDashboardStore();
  const [dateRange, setDateRange] = React.useState<string[]>(['', '']);
  const [fetchAgents, setFetchAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<Agent>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: null,
    role: '',
    password: '',
    created_on: '',
    status: null
  });
  const MenuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleClickOutside = (event: MouseEvent) => {
    const isClickOutsideMenu =
      MenuRef.current && !MenuRef.current.contains(event.target as Node);

    if (isClickOutsideMenu) {
      setIsMenuOpen(false);
    }
  };
  console.log(callSummaryTotalCallGraphAssigned);
  const handleDateFormat = (e) => {
    return e.toISOString().split('T')[0];
  };

  const [todayTaskForAdmin, setTodayTaskForAdmin] = useState<
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
        const data = await getRepresntativesHandler();
        if (data) {
          const filteredData = data.filter(
            (user) => user.role === 'REPRESENTATIVE'
          );
          setFetchAgents(filteredData.reverse());
        }
      } catch (error) {
        console.error('Error fetching representatives:', error);
      }

      try {
        setDashboardLoader(
          callSummaryTodayTaskAll === null &&
            callSummaryTodayCallCompletedAbove === null &&
            callSummaryTodayTaskAnswered === null &&
            callSummaryTodayTaskNotAnswered === null &&
            callSummaryTotalCallGraphAssigned === null &&
            callSummaryTotalcallLGraphAttempted === null &&
            callSummaryTotalcallLGraphAnsweredforGraph === null
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
          const allData = await getTodaysTaskAll(payload);
          localStorage.setItem('allData', JSON.stringify(allData.count));
          const storedData = localStorage.getItem('allData');
          setCallSummaryTodayTaskAll(
            storedData ? (JSON.parse(storedData) as number | string) : 0
          );
          // setTodayTaskAll(allData.count);
          // This is for today's completed tasks above
          const totalCompletedTaskAbove = await getTodayTaskCompletedAbove(
            payload
          );

          // Similarly calculate the sum if needed
          const completedTaskSum: number = Object.values(
            totalCompletedTaskAbove.counts as Record<string, number>
          ).reduce((sum, value) => sum + value, 0);

          setCallSummaryTodayCallCompletedAbove(completedTaskSum);
        }

        //This is for todays all completed task data
        const combinedData = await getTodaysTaskCombinedAnsweredNotAnswered(
          payload
        );
        setCallSummaryTodayTaskAnswered(combinedData.answeredCalls);
        setCallSummaryTodayTaskNotAnswered(combinedData.notAnsweredCalls);

        //This is for todays all completed task data
        const completedData = await getTodaysTaskCompleted(payload);
        setCallSummaryTotalAnswered(completedData.counts);
      } catch (error) {
        setDashboardLoader(false);
      } finally {
        setDashboardLoader(false);
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
            const assignedData = await getTotalCallAssigned(payloads);
            // Fetch total calls attempted data
            const fetchCombined =
              await getTodaysTaskCombinedAnsweredNotAnswered(payloads);

            // Fetch total calls answered for graph
            const totalCallAttempted =
              fetchCombined?.answeredCalls + fetchCombined?.notAnsweredCalls;
            // const totalCallAnsweredForGraph =
            //   await getTotalcallLAnsweredforGraph(payloads);

            // Push data for this representative
            updatedTasks.push({
              name: rep.firstName, // Representative's name
              totalCallAssigned:
                assignedData.counts.length > 0
                  ? assignedData.counts[0].count
                  : 0, //total assigned call to the representative
              todaysTaskAnsweredForAdmin:
                assignedData.counts.length > 0
                  ? assignedData.counts[0].count
                  : 0, // Answered tasks
              totalcallLAttemptedForAdmin: totalCallAttempted || 0, // Attempted calls
              totalcallLAnsweredforGraphForAdmin:
                fetchCombined?.answeredCalls || 0 // Answered calls for graph
            });
          } catch (error) {
            console.error(`Error fetching data for ${rep._id}:`, error);
          }
        }

        setTodayTaskForAdmin(updatedTasks);
      } else if (selectedAgents._id !== '' || user?.role === 'REPRESENTATIVE') {
        const payloads = {
          StartDate: dateRange[0],
          EndDate: dateRange[1],
          representativeId: selectedAgents._id
        };
        try {
          // Fetch today's answered task data
          const assignedData = await getTotalCallAssigned(payloads);
          setCallSummaryTotalCallGraphAssigned(
            assignedData.counts.length > 0 ? assignedData.counts[0].count : 0
          );
          // Fetch total calls attempted data
          const fetchCombined = await getTodaysTaskCombinedAnsweredNotAnswered(
            payloads
          );

          // Fetch total calls answered for graph
          const totalCallAttempted =
            fetchCombined?.answeredCalls + fetchCombined?.notAnsweredCalls;
          setCallSummaryTotalcallLGraphAttempted(totalCallAttempted);
          setCallSummaryTotalcallLGraphAnsweredforGraph(
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
  }, [selectedAgents, fetchAgents]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    setPageNumber(1);
    localStorage.setItem('ticketType', '');
  }, []);

  // const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const startDate = e.target.value;
  //   setDateRange([startDate, dateRange[1]]);
  // };

  // const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const endDate = e.target.value;
  //   setDateRange([dateRange[0], endDate]);
  // };

  const handleRepresentative = (repId: string, agent: Agent) => {
    setIsMenuOpen(false);
    setSelectedAgents(agent);
  };
  const [isSyncing, setIsSyncing] = useState(false);
  // This function is used for re syncing all the data
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    const handleSyncComplete = () => {
      toast.success('Re-sync completed!');
      setIsSyncing(false);
    };

    socket.on('data_synced', handleSyncComplete);

    return () => {
      socket.off('data_synced', handleSyncComplete);
      socket.disconnect();
    };
  }, [isSyncing]);

  const resyncAllData = async () => {
    try {
      toast.success('Re-sync all data in progress ...', { autoClose: 5000 });
      setIsSyncing(true);

      // Start the sync process
      await reSyncAllData(); // This triggers the backend process

      // Polling function to check the status
      // const checkSyncStatus = async () => {
      //   try {
      //     const statusResponse = await fetch('/csv/resyncAllTicket');
      //     const statusData = await statusResponse.json();

      //     if (statusData.status === 'completed') {
      //       toast.success('Re-sync completed!');
      //       setIsSyncing(false);
      //     } else {
      //       // Keep checking every 30 seconds
      //       setTimeout(checkSyncStatus, 30000);
      //     }
      //   } catch (error) {
      //     console.error('Error checking sync status:', error);
      //   }
      // };

      // // Start polling
      // checkSyncStatus();
    } catch (error) {
      console.error('Error while resyncing all data:', error);
    }
  };

  return (
    <>
      <Box className={Styles.call_Summary_dashboard_container}>
        <Box className={Styles.call_Summary_dashboard_container_head}>
          <Stack className={Styles.container_head}>
            <Stack className={Styles.container_head_title}>
              Call Center <span>Performance Summary </span>
            </Stack>
            <Box className="d-flex">
              {user?.role === 'ADMIN' && (
                <Stack className={Styles.resync_btn} onClick={resyncAllData}>
                  {' '}
                  Re-Sync
                </Stack>
              )}
              <Stack className={Styles.container_head_btn}>Call Summary</Stack>
            </Box>
          </Stack>
          <Stack className={Styles.container_head_filter}>
            {/* Date Filters start*/}

            {/* <Stack direction="row" className={Styles.date_filters}>
              <TextField
                fullWidth
                disabled={user?.role !== 'ADMIN'}
                onChange={handleStartDateChange}
                value={
                  user?.role !== 'ADMIN'
                    ? new Date().toISOString().split('T')[0]
                    : dateRange[0]
                }
                size="small"
                type="date"
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: 'Outfit, sans-serif' }
                }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0],
                  style: { fontFamily: 'Outfit, sans-serif', fontSize: '14px' }
                }}
                InputProps={{
                  style: {
                    border: 'none',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px'
                  },
                  disableUnderline: true
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                disabled={user?.role !== 'ADMIN'}
                onChange={handleEndDateChange}
                value={
                  user?.role !== 'ADMIN'
                    ? new Date().toISOString().split('T')[0]
                    : dateRange[1]
                }
                type="date"
                size="small"
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: 'Outfit, sans-serif' }
                }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0],
                  min: dateRange[0],
                  style: { fontFamily: 'Outfit, sans-serif', fontSize: '14px' }
                }}
                InputProps={{
                  style: {
                    border: 'none',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px'
                  },
                  disableUnderline: true
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none'
                    }
                  }
                }}
              />
            </Stack> */}
            {/* Date Filters end*/}

            {/* Agent Option Menu start*/}
            <Stack
              className={Styles.agent_filter}
              onClick={() => {
                if (user?.role === 'ADMIN') {
                  setIsMenuOpen(!isMenuOpen);
                } else {
                  setIsMenuOpen(false);
                }
              }}
            >
              <Stack sx={{ cursor: 'pointer' }}>
                {(selectedAgents.firstName || selectedAgents.lastName) &&
                user?.role === 'ADMIN'
                  ? `${selectedAgents?.firstName} ${' '} ${
                      selectedAgents?.lastName
                    }`
                  : user?.role !== 'ADMIN'
                  ? `${user?.firstName} ${' '} ${user?.lastName}`
                  : 'Agent Name'}
              </Stack>
              <Stack sx={{ marginTop: '8px' }}>
                <img src={DownArrow} alt="" />
              </Stack>
            </Stack>
            {isMenuOpen ? (
              <>
                <Stack
                  ref={MenuRef}
                  display={isMenuOpen ? 'block' : 'none'}
                  className={Styles.menu_item}
                  bgcolor="white"
                >
                  <Stack
                    key={''}
                    className={Styles.menu_options}
                    onClick={() => {
                      handleRepresentative('', {
                        _id: '',
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: null,
                        role: '',
                        password: '',
                        created_on: '',
                        status: null
                      });
                    }}
                  >
                    All
                  </Stack>
                  {fetchAgents &&
                    fetchAgents?.map((agent) => (
                      <Stack
                        key={agent._id}
                        className={Styles.menu_options}
                        onClick={() => {
                          handleRepresentative(agent._id, agent);
                        }}
                      >
                        {agent.firstName} {agent.lastName}
                      </Stack>
                    ))}
                </Stack>
              </>
            ) : (
              <></>
            )}
            {/* Agent Option Menu end*/}
          </Stack>
        </Box>
        <>
          {/* Overall Call Summary */}
          <Box className={Styles.call_Summary_dashboard}>
            {/* Today's Task */}
            <Stack className={Styles.todat_task}>
              <Stack className={Styles.todat_task_total}>
                <Stack className={Styles.todat_task_common_head}>
                  Today's Task
                </Stack>
                <Stack className={Styles.todat_task_common_count}>
                  {callSummaryTodayTaskAll || <CircularProgress size="30px" />}
                </Stack>
              </Stack>
              <Stack className={Styles.todat_task_completed}>
                <Stack className={Styles.todat_task_common_head}>
                  Today's Task Completed
                </Stack>
                <Stack className={Styles.todat_task_common_count}>
                  {callSummaryTodayCallCompletedAbove !== null ? (
                    callSummaryTodayCallCompletedAbove
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
                <Stack className={Styles.call_common_head}>
                  Call Attempted
                </Stack>
                <Stack className={Styles.call_common_count}>
                  {callSummaryTodayTaskAnswered !== null &&
                  callSummaryTodayTaskNotAnswered !== null ? (
                    Number(callSummaryTodayTaskAnswered) +
                    Number(callSummaryTodayTaskNotAnswered)
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
                  {callSummaryTodayTaskAnswered !== null ? (
                    callSummaryTodayTaskAnswered
                  ) : (
                    <CircularProgress size="30px" />
                  )}
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
                  {callSummaryTodayTaskNotAnswered !== null ? (
                    callSummaryTodayTaskNotAnswered
                  ) : (
                    <CircularProgress size="30px" />
                  )}
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
                      {callSummaryTodayTaskAnswered !== null ? (
                        callSummaryTodayTaskAnswered
                      ) : (
                        <CircularProgress size="30px" />
                      )}
                    </Stack>
                    <Stack className={Styles.answered_call_total_count_title}>
                      Call Answered
                    </Stack>
                  </Stack>
                  {Object.keys(callSummaryTotalAnswered).length !== 0 ? (
                    <Stack className={Styles.answered_call_division}>
                      {Object.entries(callSummaryTotalAnswered).map(
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
                      {' '}
                      <img
                        src={NoData}
                        style={{ width: '100px', height: '100px' }}
                        alt=""
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
                    {Object.keys(totalNotAnswered).length !== 0 ? (
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
            {/* Bar Graph */}
            <Stack className={Styles.line_graph_container}>
              <Stack className={Styles.line_graph}>
                <Stack className={Styles.line_graph_head}>
                  Total Calls Assigned Vs. Attempted
                </Stack>
                <Stack className={Styles.bar_graph_component}>
                  {todayTaskForAdmin.length > 0 ||
                  Number(callSummaryTotalCallGraphAssigned) > 0 ||
                  Number(callSummaryTotalcallLGraphAttempted) > 0 ? (
                    <AssignedVsAttemptedGraph
                      callAssigned={callSummaryTotalCallGraphAssigned || 0} // assigned
                      callAttemmpted={callSummaryTotalcallLGraphAttempted}
                      user={user?.firstName || 'Unknown User'}
                      selectedAgents={
                        selectedAgents || { _id: '', firstName: '' }
                      }
                      todayTaskForAdmin={
                        Array.isArray(todayTaskForAdmin)
                          ? todayTaskForAdmin
                          : []
                      }
                    />
                  ) : (
                    <>
                      <img
                        src={DeafaultGraph}
                        style={{ width: '200px', height: '200px' }}
                        alt=""
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
                  Total Calls Attempted Vs. Answered
                </Stack>
                <Stack className={Styles.bar_graph_component}>
                  {todayTaskForAdmin?.[0]?.totalcallLAttemptedForAdmin &&
                  (todayTaskForAdmin[0].totalcallLAttemptedForAdmin > 0 ||
                    Number(callSummaryTotalcallLGraphAttempted) > 0) ? (
                    <AttemptedVsAnswered
                      callAttemmpted={callSummaryTotalcallLGraphAttempted}
                      callAnswered={callSummaryTotalcallLGraphAnsweredforGraph}
                      user={user?.firstName || 'Unknown User'}
                      selectedAgents={
                        selectedAgents ?? { _id: '', firstName: '' }
                      }
                      todayTaskForAdmin={
                        Array.isArray(todayTaskForAdmin)
                          ? todayTaskForAdmin
                          : []
                      }
                    />
                  ) : (
                    <>
                      <img
                        src={DeafaultGraph}
                        style={{ width: '200px', height: '200px' }}
                        alt="No data available"
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

          {/* Admiision Call Summary */}
          <Box className={Styles.admission_Summary_dashboard}>
            <AdmissionSummary
              selectedAgents={selectedAgents}
              dateRange={dateRange}
              fetchAgents={fetchAgents}
            />
          </Box>

          {/* Follow Up Call Summary */}
          <Box className={Styles.followup_Summary_dashboard}>
            {' '}
            <FollowUpSummary
              selectedAgents={selectedAgents}
              dateRange={dateRange}
              fetchAgents={fetchAgents}
            />
          </Box>
        </>
      </Box>
    </>
  );
};

export default CallSummaryDashboard;
