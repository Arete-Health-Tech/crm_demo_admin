import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Skeleton,
  Stack,
  TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useEffect, useState, useRef } from 'react';
import { getTicketHandler } from '../../api/ticket/ticketHandler';
import useTicketStore from '../../store/ticketStore';
import TicketCard from '../../screen/ticket/widgets/TicketCard';
import { iTicket } from '../../types/store/ticket';
import { getDoctorsHandler } from '../../api/doctor/doctorHandler';
import { getDepartmentsHandler } from '../../api/department/departmentHandler';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import DefaultScreen from '../../components/DefaultScreen';
import { ArrowBack } from '@mui/icons-material';
import TicketFilter, {
  ticketFilterCount
} from '../../screen/ticket/widgets/TicketFilter';
import DownloadAllTickets from '../../screen/ticket/widgets/DownloadAllTickets';
import dayjs from 'dayjs';
import CustomPagination from './CustomPagination';
import { UNDEFINED } from '../../constantUtils/constant';
import {
  getStagesHandler,
  getSubStagesHandler
} from '../../api/stages/stagesHandler';
import useServiceStore from '../../store/serviceStore';

const Ticket = () => {
  const {
    tickets,
    filterTickets,
    setSearchByName,
    searchByName,
    ticketCount,
    setTickets,
    ticketCache,
    emptyDataText
  } = useTicketStore();
  // const [filteredTickets, setFilteredTickets] = useState<iTicket[]>();
  const [searchName, setSearchName] = useState<string>(UNDEFINED);
  const [searchError, setSearchError] = useState<string>(
    'Type to search & Enter'
  );
  const [pageCount, setPageCount] = useState<number>(1);
  // const [filterCount, setFilterCount] = useState(0);
  // const [pageNumber, setPageNumber] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  const handlePagination = async (
    event: React.ChangeEvent<unknown>,
    pageNo: number
  ) => {
    console.log('val', pageNo);
    if (pageNo !== page) {
      setTickets([]);
      if (
        ticketCache[pageNo] &&
        ticketCache[pageNo]?.length > 0 &&
        searchName === UNDEFINED &&
        ticketFilterCount(filterTickets) < 1
      ) {
        setTickets(ticketCache[pageNo]);
      } else {
        await getTicketHandler(searchName, pageNo, 'false', filterTickets);
      }
      setPage(pageNo);
    }
  };

  useEffect(() => {
    setPageCount(Math.ceil(ticketCount / 10));
    // console.log("ticket count",tickets )
  }, [tickets, searchByName]);

  const fetchTicketsOnEmpthySearch = async () => {
    setSearchName(UNDEFINED);
    setSearchByName(UNDEFINED);
    await getTicketHandler(UNDEFINED, 1, 'false', filterTickets);
    setPage(1);
  };

  // const handleSeachName = (
  //   e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  // ) => {
  //   const value = e.target.value;
  //   if (value) {
  //     inputSearch.current = value
  //   }
  //   if (value === '') {
  //     fetchTicketsOnEmpthySearch();
  //   }
  // };

  const handleSearchKeyPress = async (e: any) => {
    const value = e.target?.value;
    if (value) {
      setSearchName(value);
    }
    if (e.key === 'Enter') {
      setTickets([]);
      console.log('search name', value);
      if (value === '') {
        fetchTicketsOnEmpthySearch();
        setSearchError('Type to search & Enter');
        return;
      }
      await getTicketHandler(value, 1, 'false', filterTickets);
      setSearchByName(value);
      setSearchError(`remove "${value.toUpperCase()}" to reset & Enter`);
      setPage(1);
    }
  };

  // const checkFilterLength = () => {
  //   let filterLength = 0;
  //   if (filterTickets.startDate > 0 && filterTickets.endDate > 0) {
  //     filterLength =
  //       filterTickets.stageList.length +
  //       filterTickets.admissionType.length +
  //       filterTickets.diagnosticType.length +
  //       1;
  //   } else {
  //     filterLength =
  //       filterTickets.stageList.length +
  //       filterTickets.admissionType.length +
  //       filterTickets.diagnosticType.length;
  //   }
  //   return filterLength;
  // };

  // const filterFn = () => {
  //   const filteredData = tickets.filter(
  //     (item: iTicket) =>
  //       departmentFilterRule(item.prescription[0].departments[0]) &&
  //       admissionFilterRule(item.prescription[0].admission) &&
  //       diagnosticsFilterRule(item.prescription[0].diagnostics) &&
  //       dateRule(item.createdAt)
  //   );
  //   setPageCount(Math.ceil(ticketCount / 10));
  //   setFilteredTickets(filteredData);
  // };

  // const departmentFilterRule = (department: string) => {
  //   return filterTickets.departments.length > 0
  //     ? filterTickets.departments.includes(department)
  //     : true;
  // };

  // const admissionFilterRule = (admission: string) => {
  //   return filterTickets.admissionType.length > 0
  //     ? filterTickets.admissionType.includes(admission)
  //     : true;
  // };

  // const diagnosticsFilterRule = (diagnostics: string[]) => {
  //   if (filterTickets.diagnosticType.length > 0) {
  //     let diagnosticsResult =
  //       diagnostics.length > 0
  //         ? diagnostics.every((item) =>
  //             filterTickets.diagnosticType.includes(item)
  //           )
  //         : false;

  //     return diagnosticsResult;
  //   } else return true;
  // };

  // const dateRule = (createdAt: string) => {
  //   const createdDate = dayjs(createdAt).unix() * 1000;
  //   if (filterTickets.startDate > 0 && filterTickets.endDate > 0) {
  //     const isTicketofDate =
  //       createdDate >= filterTickets.startDate &&
  //       createdDate < filterTickets.endDate
  //         ? true
  //         : false;
  //     return isTicketofDate;
  //   } else return true;
  // };

  const navigate = useNavigate();

  const currentRoute = useMatch('/ticket');

  const redirectTicket = () => {
    navigate('/ticket');
  };
  window.onload = redirectTicket;

  useEffect(() => {
    (async function () {
      await getTicketHandler(UNDEFINED, 1, 'false', filterTickets);
      await getStagesHandler();
      await getSubStagesHandler();
      await getDoctorsHandler();
      await getDepartmentsHandler();
      //   const ticketFilteredLength = checkFilterLength();
      //   if (ticketFilteredLength > 0) {
      //     filterFn();
      //     setPageCount(Math.ceil(ticketCount / 10));
      //   }
    })();
  }, []);

  return (
    <Box height={'100vh'} display="flex" position="fixed" width="100%">
      <Box width="25%" position="sticky" top={0}>
        <Box p={1} height={'16vh'} borderBottom={0.5} borderColor="#f0f0f0">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              onClick={() => navigate('/')}
              color="inherit"
              startIcon={<ArrowBack />}
              sx={{ mb: 1 }}
            >
              Go Back To Dashboard
            </Button>
            <DownloadAllTickets />
          </Stack>

          <Stack direction="row" spacing={1}>
            <TextField
              sx={{ bgcolor: '#f5f7f5', p: 1, borderRadius: 1 }}
              size="small"
              fullWidth
              placeholder="Search Leads"
              id="outlined-start-adornment"
              variant="standard"
              helperText={searchError}
              InputProps={{
                // disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              // onChange={handleSeachName}
              onKeyDown={handleSearchKeyPress}
            />
            <TicketFilter />
          </Stack>
        </Box>
        <Box
          position="relative"
          p={1}
          height={'86vh'}
          sx={{
            overflowY: 'scroll',
            '&::-webkit-scrollbar ': {
              // display: 'none'
            }
          }}
        >
          {tickets.length > 0 ? (
            tickets.map((item: iTicket) => (
              <TicketCard key={item._id} patientData={item} />
            ))
          ) : emptyDataText !== '' ? (
            <Alert
              sx={{
                marginTop: '40px',
                height: '25vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              severity="error"
            >
              NO DATA FOUND
            </Alert>
          ) : (
            [0, 1, 2, 3, 4, 5].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                sx={{ borderRadius: 2, my: 1 }}
                width="100%"
                height="20%"
              />
            ))
          )}
          <div>
            <CustomPagination
              handlePagination={handlePagination}
              pageCount={pageCount}
              page={page}
            />
          </div>
        </Box>
      </Box>
      <Box bgcolor="#E2ECFB" width="75%">
        {currentRoute ? <DefaultScreen /> : <Outlet />}
      </Box>
    </Box>
  );
};

export default Ticket;
