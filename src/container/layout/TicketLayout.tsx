import {
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
import TicketFilter from '../../screen/ticket/widgets/TicketFilter';
import DownloadAllTickets from '../../screen/ticket/widgets/DownloadAllTickets';
import dayjs from 'dayjs';
import CustomPagination from './CustomPagination';

const Ticket = () => {
  const { tickets, filterTickets, setSearchByName } = useTicketStore();
  const [filteredTickets, setFilteredTickets] = useState<iTicket[]>();
  const [searchName, setSearchName] = useState<string>('undefined');
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    console.log('val', page);
    setPageNumber(page - 1);
    setPage(page);
  };

  useEffect(() => {
    setPageCount(Math.ceil(tickets.length / 10));
    setPage(1);
    // console.log("ticket count",tickets )
  }, [tickets, filteredTickets]);

  const fetchTicketsOnEmpthySearch = async () => {
    setSearchName('undefined');
    setSearchByName('undefined');
    await getTicketHandler('undefined');
    setPage(1);
  };

  const handleSeachName = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value) {
      setSearchName(value);
    }
    if (value === '') {
      fetchTicketsOnEmpthySearch();
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (searchName && searchName !== 'undefined') {
      if (e.key === 'Enter') {
        await getTicketHandler(searchName);
        setSearchByName(searchName);
      } else {
        fetchTicketsOnEmpthySearch();
      }
    }
  };

  const checkFilterLength = () => {
    let filterLength = 0;
    if (filterTickets.startDate > 0 && filterTickets.endDate > 0) {
      filterLength =
        filterTickets.departments.length +
        filterTickets.admissionType.length +
        filterTickets.diagnosticType.length +
        1;
    } else {
      filterLength =
        filterTickets.departments.length +
        filterTickets.admissionType.length +
        filterTickets.diagnosticType.length;
    }
    return filterLength;
  };

  const filterFn = () => {
    const filteredData = tickets.filter(
      (item: iTicket) =>
        departmentFilterRule(item.prescription[0].departments[0]) &&
        admissionFilterRule(item.prescription[0].admission) &&
        diagnosticsFilterRule(item.prescription[0].diagnostics) &&
        dateRule(item.createdAt)
    );
    setPageCount(Math.ceil(filteredData.length / 10));
    setFilteredTickets(filteredData);
  };

  const departmentFilterRule = (department: string) => {
    return filterTickets.departments.length > 0
      ? filterTickets.departments.includes(department)
      : true;
  };

  const admissionFilterRule = (admission: string) => {
    return filterTickets.admissionType.length > 0
      ? filterTickets.admissionType.includes(admission)
      : true;
  };

  const diagnosticsFilterRule = (diagnostics: string[]) => {
    if (filterTickets.diagnosticType.length > 0) {
      let diagnosticsResult =
        diagnostics.length > 0
          ? diagnostics.every((item) =>
              filterTickets.diagnosticType.includes(item)
            )
          : false;

      return diagnosticsResult;
    } else return true;
  };

  const dateRule = (createdAt: string) => {
    const createdDate = dayjs(createdAt).unix() * 1000;
    if (filterTickets.startDate > 0 && filterTickets.endDate > 0) {
      const isTicketofDate =
        createdDate >= filterTickets.startDate &&
        createdDate < filterTickets.endDate
          ? true
          : false;
      return isTicketofDate;
    } else return true;
  };

  const navigate = useNavigate();

  const currentRoute = useMatch('/ticket');

  const redirectTicket = () => {
    navigate('/ticket');
  };
  window.onload = redirectTicket;

  useEffect(() => {
    // setPageCount(Math.ceil(tickets.length/10));
    (async function () {
      await getTicketHandler(searchName);
      await getDoctorsHandler();
      await getDepartmentsHandler();
      const ticketFilteredLength = checkFilterLength();
      if (ticketFilteredLength > 0) {
        filterFn();
        setPageCount(Math.ceil(ticketFilteredLength / 10));
      }
    })();
  }, [filterTickets]);

  return (
    <Box height={'100vh'} display="flex" position="fixed" width="100%">
      <Box width="25%" position="sticky" top={0}>
        <Box p={1} height={'13vh'} borderBottom={0.5} borderColor="#f0f0f0">
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
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onChange={handleSeachName}
              onKeyDown={handleKeyPress}
            />
            <TicketFilter filterLength={checkFilterLength()} />
          </Stack>
        </Box>
        <Box
          position="relative"
          p={1}
          height={'87vh'}
          sx={{
            overflowY: 'scroll',
            '&::-webkit-scrollbar ': {
              // display: 'none'
            }
          }}
        >
          {checkFilterLength() > 0
            ? filteredTickets
              ? filteredTickets.length > 0
                ? filteredTickets
                    .slice(10 * pageNumber, 10 + 10 * pageNumber)
                    .map((item: iTicket) => (
                      <TicketCard key={item._id} patientData={item} />
                    ))
                : 'No Match Found'
              : 'Loading ...'
            : tickets.length > 0
            ? tickets
                .slice(10 * pageNumber, 10 + 10 * pageNumber)
                .map((item: iTicket) => (
                  <TicketCard key={item._id} patientData={item} />
                ))
            : [0, 1, 2, 3, 4, 5].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  sx={{ borderRadius: 2, my: 1 }}
                  width="100%"
                  height="20%"
                />
              ))}
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
