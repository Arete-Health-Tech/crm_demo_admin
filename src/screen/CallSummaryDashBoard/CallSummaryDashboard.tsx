import { Box, Stack, TextField } from '@mui/material';
import React from 'react';
import Styles from './CallSummaryDashBoard.module.css';
import AdmissionSummary from './AdmissionSummary';
import FollowUpSummary from './FollowUpSummary';
import Callattempted from '../../assets/callAttempted.svg';
import CallButtonIcon from '../../assets/callAnswered.svg';
import ClickedCallButtonIcon from '../../assets/callNotAnswered.svg';
import { Style } from '@mui/icons-material';
import AssignedVsAttemptedGraph from './CallSummaryWidget/AssignedVsAttemptedGraph';
import AttemptedVsAssigned from './CallSummaryWidget/AttemptedVsAssigned';

const CallSummaryDashboard = () => {
  return (
    <>
      <Box className={Styles.call_Summary_dashboard_container}>
        <Box className={Styles.call_Summary_dashboard_container_head}>
          <Stack className={Styles.container_head}>
            <Stack className={Styles.container_head_title}>
              Call Center <span>Performace Summary </span>
            </Stack>
            <Stack className={Styles.container_head_btn}>Call Summary</Stack>
          </Stack>
          <Stack className={Styles.container_head_filter}>
            {/* Date Filters */}

            <Stack direction="row" className={Styles.date_filters}>
              <TextField
                fullWidth
                // onChange={handleStartDateChange}
                // value={auditDateRange[0]}
                size="small"
                type="date"
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: 'Outfit,san-serif' }
                }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0],
                  style: { fontFamily: 'Outfit,san-serif', fontSize: '14px' }
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
                // onChange={handleEndDateChange}
                // value={auditDateRange[1]}
                type="date"
                size="small"
                InputLabelProps={{
                  shrink: true,
                  style: { fontFamily: 'Outfit,san-serif' }
                }}
                inputProps={{
                  // max: new Date().toISOString().split('T')[0],
                  // min: new Date(dateRange[0]).toDateString().split('T')[0],
                  style: { fontFamily: 'Outfit,san-serif', fontSize: '14px' }
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
            </Stack>
            <Stack className={Styles.agent_filter}>Agent Name</Stack>
          </Stack>
        </Box>
        {/* Overall Call Summary */}
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
              <Stack className={Styles.call_common_head}>
                Call Not Answered
              </Stack>
              <Stack className={Styles.call_common_count}>80</Stack>
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
          {/* Bar Graph */}
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

        {/* Admiision Call Summary */}
        <Box className={Styles.admission_Summary_dashboard}>
          <AdmissionSummary />
        </Box>

        {/* Follow Up Call Summary */}
        <Box className={Styles.followup_Summary_dashboard}>
          {' '}
          <FollowUpSummary />
        </Box>
      </Box>
    </>
  );
};

export default CallSummaryDashboard;
