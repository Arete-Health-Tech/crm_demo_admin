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
import React, { useReducer, useState } from 'react';

import useTicketStore from '../../../store/ticketStore';
import { getStagesHandler } from '../../../api/stages/stagesHandler';

import { iTicketFilter } from '../../../types/store/ticket';
import { getRepresntativesHandler } from '../../../api/representive/representativeHandler';
import {
  selectedFiltersReducer,
  ticketFilterTypes
} from '../ticketStateReducers/filter';
import { filterActions } from '../ticketStateReducers/actions/filterAction';
import { UNDEFINED } from '../../../constantUtils/constant';
import { getTicketHandler } from '../../../api/ticket/ticketHandler';
import useUserStore from '../../../store/userStore';

const drawerWidth = 450;

export const ticketFilterCount = (selectedFilters: iTicketFilter) => {
  const stageListCount = selectedFilters['stageList'].length;
  const representativeCount = selectedFilters['representative'] ? 1 : 0;
  const resultCount = selectedFilters['results'] ? 1 : 0;
  console.log(stageListCount, ' this is stage list count');
  console.log(resultCount, ' this is result counnt');
  const total = stageListCount + representativeCount + resultCount;
  return total;
};

const TicketFilter = (props: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
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
    results: null
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
  const [admissionType, setAdmissionType] = React.useState<string[]>(() => []);
  const [result, setResult] = React.useState('');
  const [diagnosticsType, setDiagnosticsType] = React.useState<string[]>(
    () => []
  );
  const [stagesLabel, setStagesLabels] = React.useState<any>([]);
  const [representativeLabel, setRepresentativeLabel] = React.useState<any>([]);
  // const [selectedStageList, setSelectedStageList] = React.useState<string[]>(
  //   () => []
  // );
  const [selectedFilters, dispatchFilter] = useReducer(
    selectedFiltersReducer,
    initialFilters
  );
  const [startDate, setStartDate] = React.useState<string>();
  const [endDate, setEndDate] = React.useState<string>();
  const [currentReperesentative, setCurrentRepresentative] = useState('');
  const [filterCount, setFilterCount] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedValueLost, setSelectedValueLost] = useState(null);

  const handleStageList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // console.log('val', value);
    if (selectedFilters.stageList.includes(value)) {
      const modifiedStageList = selectedFilters.stageList;
      modifiedStageList.splice(modifiedStageList.indexOf(value), 1);
      // console.log(modifiedStageList, 'moda');
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
  };
  const handleDiagnosticsType = (
    event: React.MouseEvent<HTMLElement>,
    newDiagnostics: string[]
  ) => {
    setDiagnosticsType(newDiagnostics);
  };
  const handleResult = (e: any) => {
    const value = e.target.value;
    console.log(value);
    console.log(value);

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
    setFilterCount(ticketFilterCount(selectedFilters));
    setFilterTickets(selectedFilters);
    props.setPage(1);
    console.log('filter dtata', selectedFilters);
  };

  const handleClearFilter = async () => {
    dispatchFilter({ type: filterActions.STAGES, payload: [] });
    dispatchFilter({ type: filterActions.REPRESENTATIVE, payload: null });
    dispatchFilter({ type: filterActions.RESULTS, payload: null });
    setCurrentRepresentative('');
    setFilterCount(ticketFilterCount(selectedFilters));
    setPageNumber(1);
    setSelectedValue(null);
    setSelectedValueLost(null);
    await getTicketHandler(UNDEFINED, 1, 'false', selectedFilters);

    // setTicketFilters({
    //   stageList: [],
    //   admissionType: [],
    //   diagnosticType: [],
    //   startDate: 0,
    //   endDate: 0
    // });
    // setSelectedStageList((prev) => []);
    // setAdmissionType((prev) => []);
    // setDiagnosticsType((prev) => []);
    // setStartDate((prev) => '');
    // setEndDate((prev) => '');
  };

  const handleToggleChange = (event, newValue) => {
    setSelectedValue(newValue);
  };

  const handleToggleLostChange = (event, newValue) => {
    setSelectedValueLost(newValue);
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
                  backgroundColor: selectedValue === 'Won' ? 'blue' : 'default',
                  color: selectedValue === 'Won' ? 'white' : 'default'
                }}
                onClick={handleToggleChange}
              >
                WON
              </ToggleButton>
              <ToggleButton
                value="Lose"
                style={{
                  backgroundColor:
                    selectedValueLost === 'Lose' ? 'blue' : 'default',
                  color: selectedValueLost === 'Lose' ? 'white' : 'default'
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
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                  type="date"
                />
              </Box>
              <Box>
                <Typography variant="caption">End Date</Typography>
                <TextField
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
