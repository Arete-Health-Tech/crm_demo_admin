import { ClearAll, Difference, FilterList } from '@mui/icons-material';
import {
  Badge,
  BadgeProps,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useTicketStore from '../../../store/ticketStore';
import { getStagesHandler } from '../../../api/stages/stagesHandler';

import { iTicketFilter } from '../../../types/store/ticket';
import { getRepresntativesHandler } from '../../../api/representive/representativeHandler';
import {
  selectedFiltersReducer,
  ticketFilterTypes
} from '../ticketStateReducers/filter';
import { filterActions } from '../ticketStateReducers/actions/filterAction';
import { NAVIGATE_TO_TICKET, UNDEFINED } from '../../../constantUtils/constant';
import { getTicketHandler } from '../../../api/ticket/ticketHandler';
import useUserStore from '../../../store/userStore';
import { apiClient } from '../../../api/apiClient';
import { validateTicket } from '../../../api/ticket/ticket';

const drawerWidth = 450;
export const ticketFilterCount = (
  selectedFilters: iTicketFilter,
  admissionType: string[],
  diagnosticsType: string[],
  dateRange: string[]
) => {
  const stageListCount = selectedFilters['stageList'].length;
  const representativeCount = selectedFilters['representative'] ? 1 : 0;

  const admissionCount = admissionType ? admissionType.length : 0;
  const diagnosticsCount = diagnosticsType ? diagnosticsType.length : 0;
  const DateCount = dateRange[0] && dateRange[1] ? 1 : 0;

  const resultCount = selectedFilters['results'] ? 1 : 0;

  // console.log(stageListCount, " this is stage list count");
  // console.log(admissionCount, " this is Admission Count")
  // console.log(diagnosticsCount, "this is diagnostic Count")
  // console.log(DateCount, "this is Date Count")
  // console.log(stageListCount, " this is stage list count");
  // console.log(resultCount, " this is result counnt")

  const total = stageListCount + representativeCount + resultCount + admissionCount + diagnosticsCount + DateCount;
  return total;
};
const TicketFilter = (props: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { ticketID } = useParams();
  const navigate = useNavigate();
  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px'
    }
  }));

  const initialFilters: ticketFilterTypes = {
    stageList: [],
    representative: null,
    results: null,
    admissionType: [],
    diagnosticsType: [],
    dateRange: []
  };

  const { setFilterTickets, setPageNumber } = useTicketStore();

  // const [ticketFilters, setTicketFilters] = useState<iTicketFilter>({
  //   stageList: [],
  //   admissionType: [],
  //   diagnosticType: [],
  //   startDate: NaN,
  //   endDate: NaN
  // });

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [admissionType, setAdmissionType] = React.useState<string[]>([]);
  const [result, setResult] = React.useState('');
  const [diagnosticsType, setDiagnosticsType] = React.useState<string[]>(
    () => []
  );
  const [stagesLabel, setStagesLabels] = React.useState<any>([]);
  const [representativeLabel, setRepresentativeLabel] = React.useState<any>([]);

  const [selectedFilters, dispatchFilter] = useReducer(
    selectedFiltersReducer,
    initialFilters
  );
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [dateRange, setDateRange] = React.useState<string[]>(['', '']);
  const [currentReperesentative, setCurrentRepresentative] = useState('');
  const [filterCount, setFilterCount] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedValueLost, setSelectedValueLost] = useState(null);

  ;

  const handleStageList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // console.log('val', value);
    if (selectedFilters.stageList.includes(value)) {
      const modifiedStageList = selectedFilters.stageList;
      modifiedStageList.splice(modifiedStageList.indexOf(value), 1);

      dispatchFilter({
        type: filterActions.STAGES,
        payload: [...modifiedStageList]
      });
      return;
    }
    dispatchFilter({
      type: filterActions.STAGES,
      payload: [...selectedFilters.stageList, value]
    });
  };

  const handleRepresentative = (e: any) => {
    const value = e.target.value;
    if (value) {
      setCurrentRepresentative(value);
      dispatchFilter({ type: filterActions.REPRESENTATIVE, payload: value });
    }
  };

  const handleAdmissionType = (
    event: React.MouseEvent<HTMLElement>,
    newAdmission: string[]
  ) => {
    setAdmissionType(newAdmission);

    dispatchFilter({
      type: filterActions.ADMISSIONTYPE,
      payload: newAdmission
    });

  };


  const handleDiagnosticsType = (
    event: React.MouseEvent<HTMLElement>,
    newDiagnostics: string[]
  ) => {
    setDiagnosticsType(newDiagnostics);
    dispatchFilter({
      type: filterActions.DIAGNOSTICSTYPE,
      payload: newDiagnostics
    });
  };


  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;
    setDateRange(prevState => [startDate, prevState[1]]);
    dispatchFilter({
      type: filterActions.DATERANGE,
      payload: JSON.stringify([startDate, dateRange[1]])
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = e.target.value;
    setDateRange(prevState => [prevState[0], endDate]);
    dispatchFilter({
      type: filterActions.DATERANGE,
      payload: JSON.stringify([dateRange[0], endDate])
    });
  };


  // React.useEffect(() => {
  //   console.log(" AdmissionType", admissionType);
  //   console.log("diagnosticType", diagnosticsType);
  //   console.log("Start Date", dateRange);

  // }, [admissionType, diagnosticsType, dateRange, selectedFilters]);

  // const handleToggleChange = (event, newValue) => {
  //   setSelectedValue(newValue);
  // };

  const handleResult = (e: any) => {
    const value = e.target.value;
    // console.log(value);

    if (value === 'Won') {
      setResult(value);
      dispatchFilter({
        type: filterActions.RESULTS,
        payload: '65991601a62baad220000001'
      });

    } else if (value === 'Lose') {
      setResult(value);
      dispatchFilter({
        type: filterActions.RESULTS,
        payload: '65991601a62baad220000002'
      });

    } else if (value === null) {
      setResult(value);
      dispatchFilter({
        type: filterActions.RESULTS,
        payload: null
      });

    }
    setResult('');
  };



  const handleFilterOpen = () => {
    setIsFilterOpen(true);
  };

  // const departments = [
  //   {
  //     label: 'General and Laparoscopic',
  //     id: '63ce58474dca242deb6a4d41'
  //   },
  //   {
  //     label: 'Surgical oncology ',
  //     id: '63ce59964dca242deb6a4d4c'
  //   },
  //   {
  //     label: 'GI surgery',
  //     id: '63de1ab09c1af160749af88d'
  //   },
  //   { label: 'Neurology', id: '63de1a5d9c1af160749af884' }
  // ];

  React.useEffect(() => {
    (async () => {
      const fetchedStageData = await getStagesHandler();
      const fetchedRepresentative = await getRepresntativesHandler();

      const transformStages = fetchedStageData.map(({ _id, name }) => {
        return {
          id: _id,
          label: name
        };
      });
      const transformRepresentative = fetchedRepresentative.map(
        ({ _id, firstName, lastName }) => {
          const labelName = `${firstName} ${lastName}`;
          return {
            id: _id,
            label: labelName
          };
        }
      );
      setRepresentativeLabel(transformRepresentative);
      setStagesLabels(transformStages);
    })();
  }, []);

  const handleApplyFilter = async () => {
    // console.log(startDate, 'Start');
    // console.log(endDate, 'End');
    // console.log(dayjs(endDate).diff(dayjs(startDate), 'days'), Difference);
    // setTicketFilters({
    //   stageList: selectedStageList,
    //   admissionType: admissionType,
    //   diagnosticType: diagnosticsType,
    //   startDate: startDate ? dayjs(startDate).unix() * 1000 : NaN,
    //   endDate: endDate ? dayjs(endDate).unix() * 1000 + 2000000 : NaN
    // });

    setIsFilterOpen(false);
    setPageNumber(1);
    await getTicketHandler(UNDEFINED, 1, 'false', selectedFilters);
    setFilterCount(ticketFilterCount(selectedFilters, admissionType, diagnosticsType, dateRange));



    setFilterTickets(selectedFilters);

    props.setPage(1);
    if (ticketID) {
      await validateTicket(ticketID);
      navigate(NAVIGATE_TO_TICKET);
    }
    // console.log('filter dtata', selectedFilters);
  };


  const handleClearFilter = async () => {
    dispatchFilter({ type: filterActions.STAGES, payload: [] });
    dispatchFilter({ type: filterActions.REPRESENTATIVE, payload: null });
    dispatchFilter({ type: filterActions.ADMISSIONTYPE, payload: [] });
    dispatchFilter({ type: filterActions.DIAGNOSTICSTYPE, payload: [] });
    dispatchFilter({ type: filterActions.DATERANGE, payload: [] });
    dispatchFilter({ type: filterActions.RESULTS, payload: null });

    setCurrentRepresentative('');
    setFilterCount(ticketFilterCount(selectedFilters, admissionType, diagnosticsType, dateRange));
    setFilterCount(0);
    setPageNumber(1);
    setSelectedValue(null);
    setSelectedValueLost(null);
    setResult(" ")
    setAdmissionType((prev) => []);
    setDiagnosticsType((prev) => []);
    setDateRange(["", ""]);

    await getTicketHandler(UNDEFINED, 1, 'false', selectedFilters);
    // setTicketFilters({
    //   stageList: [],
    //   admissionType: [],
    //   diagnosticType: [],
    //   startDate: 0,
    //   endDate: 0
    // });
    // setSelectedStageList((prev) => []);



    // setStartDate((prev) => '');
    // setEndDate((prev) => '');

    // console.log("clear AdmissionType  inside", admissionType);
    // console.log("clear DiagnosticType inside", diagnosticsType);
    // console.log("clear value Lost", selectedValueLost)
    // console.log("clear DateRange inside", dateRange);


  };

  const handleToggleChange = (event, newValue: any) => {
    setSelectedValue(newValue === selectedValue ? null : newValue);
    setResult(newValue);
  };


  const handleToggleLostChange = (event, newValue: any) => {
    setSelectedValueLost(newValue === selectedValueLost ? null : newValue);
    setResult(newValue);
  };


  return (
    <Box>
      <IconButton onClick={handleFilterOpen}>
        <StyledBadge
          invisible={filterCount <= 0}
          badgeContent={filterCount}
          color="primary"
        >
          <FilterList />
        </StyledBadge>
      </IconButton>

      <Drawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
      >
        <Box>
          <Box
            p={2}
            borderBottom={1}
            borderColor="#f3f3f3"
            display="flex"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1}>
              <FilterList />
              <Typography variant="h6">Add Filter </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                onClick={handleApplyFilter}
                variant="contained"
                sx={{ borderRadius: '3rem' }}
              >
                Apply
              </Button>
              {filterCount > 0 && (
                <Button onClick={handleClearFilter} endIcon={<ClearAll />}>
                  Clear Filters
                </Button>
              )}
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box p={2}>
              <Typography variant="subtitle1" fontWeight={500}>
                Select Stages
              </Typography>
              <FormGroup>
                {stagesLabel.map(({ id, label }) => (
                  <FormControlLabel
                    key={id}
                    control={
                      <Checkbox
                        value={id}
                        onChange={handleStageList}
                        checked={selectedFilters.stageList.includes(id)}
                      />
                    }
                    label={label}
                  />
                ))}
              </FormGroup>
            </Box>
            <Box py={2} px={4}>
              <Typography variant="subtitle1" fontWeight={500}>
                Created By
              </Typography>
              <Select
                size="medium"
                onChange={handleRepresentative}
                value={currentReperesentative}
                sx={{ height: '35px' }}
              >
                {representativeLabel?.map(({ id, label }, index) => {
                  return <MenuItem value={id}>{label}</MenuItem>;
                })}
              </Select>
            </Box>
          </Box>
          <Box p={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              Result
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={result}
              onChange={handleResult}
            >
              <ToggleButton
                value="Won"
                style={{
                  backgroundColor: selectedValue === 'Won' ? '#3949AB14' : 'white',
                  color: selectedValue === 'Won' ? '#3949AB' : 'grey'
                }}
                onClick={handleToggleChange}
              >
                WON
              </ToggleButton>
              <ToggleButton
                value="Lose"
                style={{
                  backgroundColor:
                    selectedValueLost === 'Lose' ? '#3949AB14' : 'white',

                  color: selectedValueLost === 'Lose' ? '#3949AB' : 'grey'
                }}
                onClick={handleToggleLostChange}
              >
                LOST
              </ToggleButton>

            </ToggleButtonGroup>
          </Box>
          <Box p={1}>
            <Typography variant="subtitle1" fontWeight={500}>
              Admission Type
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={admissionType}
              onChange={handleAdmissionType}
            >
              <ToggleButton value="Surgery">Surgery</ToggleButton>
              <ToggleButton value="MM">MM</ToggleButton>
              <ToggleButton value="Radiation">Radiation</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box p={1}>
            <Typography variant="subtitle1" fontWeight={500}>
              Diagnotics Type
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={diagnosticsType}
              onChange={handleDiagnosticsType}
            >
              <ToggleButton value="MRI">MRI</ToggleButton>
              <ToggleButton value="PET-CT">PET-CT</ToggleButton>
              <ToggleButton value="CT-Scan">CT-Scan</ToggleButton>
              <ToggleButton value="Lab">Lab</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box p={1}>
            <Typography variant="subtitle1" fontWeight={500}>
              Select Date Range
            </Typography>
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="caption">Start Date</Typography>
                <TextField
                  fullWidth
                  onChange={handleStartDateChange}
                  value={dateRange[0]}
                  type="date"
                />
              </Box>
              <Box>
                <Typography variant="caption">End Date</Typography>
                <TextField
                  fullWidth
                  onChange={handleEndDateChange}
                  value={dateRange[1]}
                  type="date"
                />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default TicketFilter;
