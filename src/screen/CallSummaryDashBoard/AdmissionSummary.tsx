import { Box, Stack, TextField } from '@mui/material';
import React from 'react';
import Styles from './CallSummaryDashBoard.module.css';
import Callattempted from '../../assets/callAttempted.svg';
import CallButtonIcon from '../../assets/callAnswered.svg';
import ClickedCallButtonIcon from '../../assets/callNotAnswered.svg';
import AssignedVsAttemptedGraph from './AdmissionSummaryWidget/AssignedVsAttemptedGraph';
import AttemptedVsAssigned from './AdmissionSummaryWidget/AttemptedVsAssigned';

const AdmissionSummary = () => {
  return (
    <>
      <Stack className={Styles.container_head}>
        <Stack className={Styles.container_head_title}>
          Admission <span>Level</span>
        </Stack>
      </Stack>
      <Box className={Styles.call_Summary_dashboard}>
        {/* Today's Task */}
        <Stack className={Styles.todat_task}>
          <Stack className={Styles.todat_task_total}>
            <Stack className={Styles.todat_task_common_head}>
              Today's Task
            </Stack>
            <Stack className={Styles.todat_task_common_count}>300</Stack>
          </Stack>
          <Stack className={Styles.todat_task_completed}>
            <Stack className={Styles.todat_task_common_head}>
              Today's Task Completed
            </Stack>
            <Stack className={Styles.todat_task_common_count}>100</Stack>
          </Stack>
        </Stack>

        {/* Calling Data */}
        <Stack className={Styles.calling_data}>
          <Stack className={Styles.call_attempted}>
            <Stack className={Styles.call_common_img}>
              <img src={Callattempted} />
            </Stack>
            <Stack className={Styles.call_common_head}>Call Attempted</Stack>
            <Stack className={Styles.call_common_count}>180</Stack>
          </Stack>
          <Stack className={Styles.call_answered}>
            <Stack className={Styles.call_common_img}>
              <img src={CallButtonIcon} />
            </Stack>
            <Stack className={Styles.call_common_head}>Call Answered</Stack>
            <Stack className={Styles.call_common_count}>100</Stack>
          </Stack>
          <Stack className={Styles.call_not_answered}>
            <Stack className={Styles.call_common_img}>
              <img src={ClickedCallButtonIcon} />
            </Stack>
            <Stack className={Styles.call_common_head}>Call Not Answered</Stack>
            <Stack className={Styles.call_common_count}>80</Stack>
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
                  80
                </Stack>
                <Stack className={Styles.answered_call_total_count_title}>
                  Call Answered
                </Stack>
              </Stack>
              <Stack className={Styles.answered_call_division}>
                <Stack className={Styles.answered_call_division_count}>
                  <Stack className={Styles.division_count_title}>
                    {' '}
                    Call Completed
                  </Stack>{' '}
                  <Stack className={Styles.division_count_value}>50</Stack>
                </Stack>
                <Stack className={Styles.answered_call_division_count}>
                  <Stack className={Styles.division_count_title}>
                    {' '}
                    Call Rescheduled
                  </Stack>{' '}
                  <Stack className={Styles.division_count_value}>10</Stack>
                </Stack>
                <Stack className={Styles.answered_call_division_count}>
                  <Stack className={Styles.division_count_title}> DND</Stack>{' '}
                  <Stack className={Styles.division_count_value}>15</Stack>
                </Stack>
                <Stack className={Styles.answered_call_division_count}>
                  <Stack className={Styles.division_count_title}> Won</Stack>{' '}
                  <Stack className={Styles.division_count_value}>20</Stack>
                </Stack>
                <Stack className={Styles.answered_call_division_count}>
                  <Stack className={Styles.division_count_title}> Lost</Stack>{' '}
                  <Stack className={Styles.division_count_value}>10</Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack className={Styles.answered_call}>
            <Stack className={Styles.answered_call_head}>
              Calls Not Answered
            </Stack>
            <Stack className={Styles.answered_call_content}>
              <Stack className={Styles.answered_call_total_count}>
                {' '}
                <Stack className={Styles.answered_call_total_count_value}>
                  100
                </Stack>
                <Stack className={Styles.answered_call_total_count_title}>
                  Call Not Answered
                </Stack>
              </Stack>
              <Stack className={Styles.answered_call_division}>
                <Stack className={Styles.answered_call_division_count}>
                  <Stack className={Styles.division_count_title}>
                    {' '}
                    Not Connected
                  </Stack>{' '}
                  <Stack className={Styles.division_count_value}>10</Stack>
                </Stack>
                <Stack className={Styles.answered_call_division_count}>
                  <Stack className={Styles.division_count_title}> DND</Stack>{' '}
                  <Stack className={Styles.division_count_value}>15</Stack>
                </Stack>
                <Stack className={Styles.answered_call_division_count}>
                  <Stack className={Styles.division_count_title}> Won</Stack>{' '}
                  <Stack className={Styles.division_count_value}>20</Stack>
                </Stack>
                <Stack className={Styles.answered_call_division_count}>
                  <Stack className={Styles.division_count_title}> Lost</Stack>{' '}
                  <Stack className={Styles.division_count_value}>10</Stack>
                </Stack>
              </Stack>
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
              <AssignedVsAttemptedGraph />
            </Stack>
          </Stack>

          <Stack className={Styles.line_graph}>
            <Stack className={Styles.line_graph_head}>
              {' '}
              Total Calls Attempted Vs. Assigned
            </Stack>
            <Stack className={Styles.bar_graph_component}>
              <AttemptedVsAssigned />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default AdmissionSummary;
