import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  Modal,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';

import { useEffect, useState, useRef } from 'react';
import {
  getAllReminderHandler,
  getTicketHandler
} from '../../api/ticket/ticketHandler';
import useTicketStore from '../../store/ticketStore';
import TicketCard from '../../screen/ticket/widgets/TicketCard';
import { iReminder, iTicket } from '../../types/store/ticket';
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
import { NAVIGATE_TO_TICKET, UNDEFINED } from '../../constantUtils/constant';
import {
  getStagesHandler,
  getSubStagesHandler
} from '../../api/stages/stagesHandler';
import useServiceStore from '../../store/serviceStore';
import './styles.css';
import { getTicket } from '../../api/ticket/ticket';
import CustomSpinLoader from '../../components/CustomSpinLoader';
import { socket } from '../../api/apiClient';
import { socketEventConstants } from '../../constantUtils/socketEventsConstants';
import useUserStore from '../../store/userStore';

let AllIntervals: any[] = [];

const Ticket = () => {
  const {
    tickets,
    filterTickets,
    setSearchByName,
    searchByName,
    ticketCount,
    setTicketCount,
    setTickets,
    ticketCache,
    emptyDataText,
    
    reminders,
    loaderOn,
    pageNumber,
    setPageNumber,
  } = useTicketStore();
  


  // const [filteredTickets, setFilteredTickets] = useState<iTicket[]>();
  const [searchName, setSearchName] = useState<string>(UNDEFINED);
  const[phone,setPhone]=useState(null)

  const [reminderList, setReminderList] = useState<any[]>([]);
  const [alarmReminderedList, setAlamarReminderList] = useState<iReminder[]>(
    []
  );
  const [ticketReminderPatient, setTicketReminderPatient] = useState<any>(null);
  const [searchError, setSearchError] = useState<string>(
    'Type to search & Enter'
  );
  const [pageCount, setPageCount] = useState<number>(1);
  const [showReminderModal, setShowReminderModal] = useState(false);
  // const [pageNumber, setPageNumber] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();
  const currentRoute = useMatch(NAVIGATE_TO_TICKET);
  const redirectTicket = () => {
    navigate(NAVIGATE_TO_TICKET);
  };

  const handlePagination = async (
    event: React.ChangeEvent<unknown>,
    pageNo: number
  ) => {
    console.log('val', pageNo);
    if (pageNo !== page) {
      setTickets([]);
      // if (
      //   ticketCache[pageNo] &&
      //   ticketCache[pageNo]?.length > 0 &&
      //   searchName === UNDEFINED &&
      //   ticketFilterCount(filterTickets) < 1
      // ) {
      //   setTickets(ticketCache[pageNo]);
      // } else {
      //   await getTicketHandler(searchName, pageNo, 'false', filterTickets);
      // }
      await getTicketHandler(searchName, pageNo, 'false', filterTickets);
      setPage(pageNo);
      setPageNumber(pageNo);
     
      redirectTicket();
    }
  };

  useEffect(() => {
    setPageCount(Math.ceil(ticketCount / 10));
    setPage(pageNumber);
    // console.log("ticket count",tickets )
  }, [tickets, searchByName]);

  const fetchTicketsOnEmpthySearch = async () => {
    setSearchName(UNDEFINED);
    setSearchByName(UNDEFINED);
    // setTicketCount(ticketCache["count"]);
    // setTickets(ticketCache[1]);
    await getTicketHandler(UNDEFINED, 1, 'false', filterTickets);
    setPage(1);
    setPageNumber(1)
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
      setPageNumber(1)
      setPage(1);
      redirectTicket()
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

  window.onload = redirectTicket;

  useEffect(() => {
    (async function () {
      await getTicketHandler(UNDEFINED, 1, 'false', filterTickets);
      await getStagesHandler();
      await getSubStagesHandler();
      await getDoctorsHandler();
      await getDepartmentsHandler();
      await getAllReminderHandler();
    })();
  }, []);

  // const isAlamredReminderExist = (reminder: iReminder) => {
  //   const result = reminderList?.findIndex((data) => data === reminder?._id);
  //   if (result < 0) {
  //     return true;
  //   }
  //   return false;
  // };

  const handleCloseModal = async () => {
    console.log('alaram list', alarmReminderedList);
    const result = await getAllReminderHandler();
    setTimeout(() => {
      setPage(1);
      setPageNumber(1)
      let list = alarmReminderedList;
      list.splice(0, 1);
      setShowReminderModal(false);
      setAlamarReminderList([]);
      setReminderList(result);
    }, 100);
  };

  const clearAllInterval = (AllIntervals: any[]) => {
    AllIntervals?.forEach((interval) => {
      clearInterval(interval);
      // console.log("HEY cleaning", interval)
    });
    AllIntervals = [];
  };

  useEffect(() => {
    const refetchTickets = async () => {
      console.log('Received request of refetch tickets from server');
      await getTicketHandler(UNDEFINED, 1, 'false', filterTickets);
    };

    socket.on(socketEventConstants.REFETCH_TICKETS, refetchTickets);

    return () => {
      socket.off(socketEventConstants.REFETCH_TICKETS, refetchTickets);
    };
  }, []);


  useEffect(() => {
    // console.log('gotham FULL', reminders, 'remindelist', reminderList);
    clearAllInterval(AllIntervals);

    reminders?.forEach((reminderDetail, index) => {
      let alarmInterval: any;

      alarmInterval = setInterval(() => {
        const currentTime = new Date();
        if (
          reminderDetail &&
          reminderDetail.date <= currentTime.getTime() &&
          reminderDetail.date + 11000 > currentTime.getTime()
          // isAlamredReminderExist(reminderDetail)
        ) {
          console.log('Alarm SUCCESS');
          (async () => {
            if (!reminderList.includes(reminderDetail._id)) {
              const data = await getTicket(
                UNDEFINED,
                1,
                'false',
                filterTickets,
                reminderDetail?.ticket,
                true,
                phone
              );
              // setTickets(data.tickets)
              // setTicketCount(data.count)
              // const tiketIndex = ticketCache[1].findIndex((currentData) => {
              //   console.log(
              //     'id check:',
              //     currentData?._id === reminderDetail.ticket
              //   );
              //   return currentData?._id === reminderDetail?.ticket;
              // });
              // if(tiketIndex > -1){
              //   let cacheList =  ticketCache[1];
              //   let removedTicket = cacheList.splice(tiketIndex,1)
              //   setTicketCache ({...ticketCache,1:[...removedTicket,...cacheList]})
              // }else{
              // setTicketCache({
              //   ...ticketCache,
              //   1: [data?.tickets[0], ...ticketCache[1]]
              // });
              // }

              // if (tiketIndex > -1) {
              //   console.log('INDEX OF COLUMN 1:-', tiketIndex);
              //   let cacheList = ticketCache[1];
              //   let removedTicket = cacheList.splice(tiketIndex, 1);
              //   console.log('removed ', removedTicket, 'cacheList', cacheList);
              //   setTicketCache({
              //     ...ticketCache,
              //     1: [...removedTicket, ...cacheList]
              //   });
              //   setTickets([...removedTicket, ...cacheList]);
              // } else {
              //   console.log('data?.tickets[0]', data?.tickets[0]);

              //   setTickets([data?.tickets[0], ...ticketCache[1]]);
              //   setTicketCache({
              //     ...ticketCache,
              //     1: [data?.tickets[0], ...ticketCache[1]]
              //   });
              // }

              setTicketReminderPatient(data?.tickets[0]);
              setAlamarReminderList([...alarmReminderedList, reminderDetail]);
              setReminderList([...reminderList, reminderDetail?._id]);
              redirectTicket();
              setShowReminderModal(true);
            }
          })();

          clearInterval(alarmInterval);
        }
      }, 10000);

      AllIntervals.push(alarmInterval);

      return () => {
        clearAllInterval(AllIntervals);
      };
    });
  }, [reminders]);

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
            <TicketFilter setPage={setPage} />
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
      <Box>
        <Modal
          open={showReminderModal}
          // onClose={() => handleCloseModal()}
        >
          <Box
            sx={{
              position: 'absolute',
              bgcolor: 'white',
              width: '600px',
              height: '400px',
              top: '50%',
              left: '50%',
              border: '0px solid transparent',
              borderRadius: '8px',
              transform: 'translate(-50%, -50%)',
              padding: '10px'
            }}
          >
            <div
              onClick={handleCloseModal}
              style={{
                display: 'flex',
                justifyContent: 'end',
                cursor: 'pointer'
              }}
            >
              <CloseIcon fontSize="large" />
            </div>
            <div className="buzz-animation">
              <NotificationsActiveIcon sx={{ fontSize: '80px' }} />
            </div>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              {ticketReminderPatient && (
                <Typography>{`Reminder for ${(
                  ticketReminderPatient?.consumer[0]?.firstName || 'N/A'
                ).toUpperCase()} `}</Typography>
              )}{' '}
              <Typography fontSize={'18px'} fontWeight={'600'} margin={'10px'}>
                {alarmReminderedList[0]?.title.toUpperCase() || 'N/A'}
              </Typography>
              <Typography margin={'12px'}>
                {alarmReminderedList[0]?.description || 'N/A'}
              </Typography>
              <Chip
                size="medium"
                variant="outlined"
                color="primary"
                label={dayjs(alarmReminderedList[0]?.date).format(
                  'DD/MMM/YYYY hh:mm A '
                )}
              />
            </Box>
          </Box>
        </Modal>
      </Box>

<CustomSpinLoader open={loaderOn} />
    </Box>
  );
};

export default Ticket;
