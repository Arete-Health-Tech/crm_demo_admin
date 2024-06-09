import { useEffect, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { NAVIGATE_TO_TICKET, UNDEFINED } from "../../../constantUtils/constant";
import useTicketStore from '../../../store/ticketStore';
import { getAllCallReschedulerHandler, getAllReminderHandler, getTicketHandler } from "../../../api/ticket/ticketHandler";
import { getAllNotesWithoutTicketId } from "../../../api/notes/allNote";
import { getStagesHandler, getSubStagesHandler } from "../../../api/stages/stagesHandler";
import { getDoctorsHandler } from "../../../api/doctor/doctorHandler";
import { getDepartmentsHandler } from "../../../api/department/departmentHandler";
import { iCallRescheduler, iReminder } from "../../../types/store/ticket";
import { socketEventConstants } from "../../../constantUtils/socketEventsConstants";
import { socket } from "../../../api/apiClient";
import { getTicket } from "../../../api/ticket/ticket";
import { getAllStageCountHandler } from "../../../api/dashboard/dashboardHandler";
import { Box, Chip, Modal, Stack, Typography } from "@mui/material";
import styles from "./switchView.module.css";
import "../../orders/orderList.css"
import { DatePicker } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxIcon from '../../../assets/AuditCheckBox.svg';
import MediumPr from '../../../assets/MediumPr.svg'
import LowPr from '../../../assets/LowPr.svg'
import HighPr from '../../../assets/HighPr.svg'
import DefaultPr from '../../../assets/DefaultPr.svg'
import AuditFilterIcon from '../../../assets/commentHeader.svg'
import SortArrowIcon from '../../../assets/SortArrow.svg'
import ActiveToggleIcon from '../../../assets/ActiveToggle.svg'
import TicketFilter from "../widgets/TicketFilter";
import CustomPagination from "../../../container/layout/CustomPagination";
import useServiceStore from "../../../store/serviceStore";
import { iStage } from "../../../types/store/service";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from "dayjs";
import DownloadAllTickets from "../widgets/DownloadAllTickets";


const datePickerStyle = {
  backgroundColor: '#E1E6EE',
  color: "#000",
  fontFamily: "Outfit,sans-serif",
  borderRadius: '16px',
  minHeight: "35px",
  padding: "4px 20px",
  border: "none",
  width: "250px"
};

const baseStyle = {
  fontFamily: 'Outfit, sans-serif',
  color: '#007BFF',
  padding: '0px 8px',
  borderRadius: '16px',
  height: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 400,
  fontSize: '12px',
  gap: '4px',
  lineHeight: '18px',
};

const stageStyles = {
  'New Lead': {
    ...baseStyle,
    backgroundColor: '#D9EBFF',

  },
  Contacted: {
    ...baseStyle,
    color: "#FFA500",
    backgroundColor: '#FFF2D9',
  },
  Working: {
    ...baseStyle,
    backgroundColor: '#DFF2E3',
    color: '#28A745',
  },
  Orientation: {
    ...baseStyle,
    color: "#20C997",
    backgroundColor: '#DEF7EF',
  },
  Nurturing: {
    ...baseStyle,
    backgroundColor: '#E9E3F6',
    color: '#6F42C1',
  },
};

const getColor = (probability) => {
  if (probability === 100) return '#08A742';
  if (probability === 75) return '#0566FF';
  if (probability === 50) return '#FFB200';
  if (probability === 25) return '#F94839';
  if (probability === 0) return '#546E7A';
  return '#546E7A';
};

const getBackgroundColor = (probability) => {
  if (probability === 100) return '#DAF2E3';
  if (probability === 75) return '#DAE8FF';
  if (probability === 50) return '#FFF3D9';
  if (probability === 25) return '#FEE4E1';
  if (probability === 0) return '#E5E9EB';
  return '#E5E9EB';
};

let AllIntervals: any[] = [];

function SwitchViewTable() {
  const { ticketID } = useParams();
  const { doctors, departments, allServices, stages } = useServiceStore();
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
    callRescheduler,
    loaderOn,
    pageNumber,
    setPageNumber,
    isSwitchView,
    setIsSwitchView,
    setIsAuditor
  } = useTicketStore();


  // const [filteredTickets, setFilteredTickets] = useState<iTicket[]>();
  const [searchName, setSearchName] = useState<string>(UNDEFINED);
  const [phone, setPhone] = useState(null);

  const [reminderList, setReminderList] = useState<any[]>([]);
  const [callReschedulerList, setcallReschedulerList] = useState<any[]>([]);

  const [alarmReminderedList, setAlamarReminderList] = useState<iReminder[]>(
    []
  );
  const [alarmCallReschedulerList, setAlarmCallReschedulerList] = useState<
    iCallRescheduler[]
  >([]);
  const [ticketReminderPatient, setTicketReminderPatient] = useState<any>(null);
  const [ticketCallReschedulerPatient, setTicketCallReschedulerPatient] =
    useState<any>(null);

  const [searchError, setSearchError] = useState<string>(
    'Type to search & Enter'
  );

  const [pageCount, setPageCount] = useState<number>(1);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCallReschedulerModal, setShowCallReschedulerModal] =
    useState(false);

  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();
  const currentRoute = useMatch(NAVIGATE_TO_TICKET);
  const redirectTicket = () => {
    navigate(NAVIGATE_TO_TICKET);
  };
  const [stageCount, setStageCount] = useState(0);
  const [newLead, setNewLead] = useState(0);
  const [contacted, setContacted] = useState(0);
  const [working, setWorking] = useState(0);
  const [orientation, setOrientation] = useState(0);
  const [nurturing, setNurturing] = useState(0);

  const handlePagination = async (
    event: React.ChangeEvent<unknown>,
    pageNo: number
  ) => {
    setPageNumber(pageNo)
    if (pageNo !== page) {
      // console.log(pageNo)
      // console.log(page)
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

      // redirectTicket();
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
    setPage(1);
    setPageNumber(1)
    // console.log({ filterTickets }, "002");
    await getTicketHandler(UNDEFINED, 1, 'false', filterTickets);
  };

  const handleSearchKeyPress = async (e: any) => {
    // console.log("e", e)
    const value = e.target?.value;
    if (value) {
      setSearchName(value);
    }
    if (e.key === 'Enter') {
      setTickets([]);

      if (value === '') {
        fetchTicketsOnEmpthySearch();
        setSearchError('Type to search & Enter');
        // redirectTicket()
        return;
      }
      // console.log({ filterTickets }, "003");
      await getTicketHandler(value, 1, 'false', filterTickets);
      setSearchByName(value);
      setSearchError(`remove "${value.toUpperCase()}" to reset & Enter`);
      setPageNumber(1)
      setPage(1);
      // redirectTicket()
    }

  };

  window.onload = redirectTicket;

  useEffect(() => {
    (async function () {
      // console.log({ filterTickets }, "006");
      await getTicketHandler(UNDEFINED, 1, 'false', filterTickets);
      await getAllNotesWithoutTicketId();
      await getStagesHandler();
      await getSubStagesHandler();
      await getDoctorsHandler();
      await getDepartmentsHandler();
      await getAllReminderHandler();
      await getAllCallReschedulerHandler();
    })();
    setPageNumber(1)
  }, []);

  const handleCloseModal = async () => {

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


  const handleCloseCallReschedulerModal = async () => {

    const result = await getAllCallReschedulerHandler();

    setTimeout(() => {
      setPage(1);
      setPageNumber(1);
      let list = alarmCallReschedulerList;
      list.splice(0, 1);
      setShowCallReschedulerModal(false);
      setAlarmCallReschedulerList([]);
      setcallReschedulerList(result);
    }, 100);


  }

  const clearAllInterval = (AllIntervals: any[]) => {
    AllIntervals?.forEach((interval) => {
      clearInterval(interval);
      // console.log("HEY cleaning", interval)
    });
    AllIntervals = [];
  };

  useEffect(() => {
    const refetchTickets = async () => {
      const copiedFilterTickets = { ...filterTickets };
      let pageNumber = page
      if (ticketID) {

      } else {
        await getTicketHandler(searchName, pageNumber, 'false', copiedFilterTickets);
      }

    };

    socket.on(socketEventConstants.REFETCH_TICKETS, refetchTickets);

    return () => {
      socket.off(socketEventConstants.REFETCH_TICKETS, refetchTickets);
    };
  }, [filterTickets, page, searchName]);

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

          (async () => {
            if (!reminderList.includes(reminderDetail._id)) {

              const data = await getTicket(
                UNDEFINED,
                1,
                'false',
                filterTickets,
                // selectedFilters,
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
              // redirectTicket();
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

  useEffect(() => {
    // console.log('gotham FULL', reminders, 'remindelist', reminderList);
    clearAllInterval(AllIntervals);
    callRescheduler?.forEach((callRescheduleDetail, index) => {
      let alarmInterval: any;

      alarmInterval = setInterval(() => {
        const currentTime = new Date();
        if (
          callReschedulerList &&
          callRescheduleDetail.date <= currentTime.getTime() &&
          callRescheduleDetail.date + 11000 > currentTime.getTime()
          // isAlamredReminderExist(reminderDetail)
        ) {

          (async () => {
            if (!callReschedulerList.includes(callRescheduleDetail?._id)) {

              const data = await getTicket(
                UNDEFINED,
                1,
                'false',
                filterTickets,
                callRescheduleDetail?.ticket,
                true,
                phone
              );

              setTicketCallReschedulerPatient(data?.tickets[0]);
              setAlarmCallReschedulerList([
                ...alarmCallReschedulerList,
                callRescheduleDetail
              ]);
              setcallReschedulerList([
                ...callReschedulerList,
                callRescheduleDetail?._id
              ]);
              // redirectTicket();
              setShowCallReschedulerModal(true);
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
  }, [callRescheduler]);

  const { setFilterTickets } = useTicketStore();
  const initialFilters = {
    stageList: [],
    representative: null,
    results: null,
    admissionType: [],
    diagnosticsType: [],
    dateRange: [],
    status: []
  };

  // console.log(tickets, "switch view ")

  const backToDashboard = () => {

    getTicketHandler(UNDEFINED, 1, 'false', initialFilters);
    setFilterTickets(initialFilters);
    // navigate('/')
    navigate('/ticket')
  }


  useEffect(() => {
    getAllStageCountHandler()
      .then((timerData) => {
        if (timerData && timerData.tickets) {
          const data = timerData.tickets.length;
          setStageCount(data);
        } else {
          timerData.ticketsCountByStage.forEach((item) => {
            switch (item.stage) {
              case '6494196d698ecd9a9db95e3a':
                // console.log(item.count, "new lead");
                setNewLead(item.count);
                break;
              case '649598d9586b137ea9086788':
                setContacted(item.count);
                break;
              case '649ace47bda0ea4d79a1ec38':
                setWorking(item.count);
                break;
              case '649acdbbbda0ea4d79a1ec36':
                setOrientation(item.count);
                break;
              case '649ace20bda0ea4d79a1ec37':
                setNurturing(item.count);
                break;
              default:
                break;
            }
          });

        }

      })
      .catch((error) => {
        console.error('Error fetching timer data:', error);
        // Handle the error here
      });
  }, []);

  const cardsData = [
    {
      id: 1,
      title: 'New Lead',
      content: newLead,
      color: '#cddefe'
    }, {
      id: 2,
      title: 'Contacted',
      content: contacted,
      color: '#cddefe'
    },
    {
      id: 3,
      title: 'Working',
      content: working,
      color: '#fff1cc'
    },
    {
      id: 4,
      title: 'Orientation',
      content: orientation,
      color: '#dbf0e7'
    },
    {
      id: 5,
      title: 'Nurturing',
      content: nurturing,
      color: '#f7c0bb'
    }
  ];

  const patientName = (ticket) => {
    if (!ticket || !ticket.consumer || ticket.consumer.length === 0) {
      return '';
    }

    const firstName = ticket.consumer[0]?.firstName;
    const lastName = ticket.consumer[0]?.lastName;

    let patientName = '';
    if (firstName && lastName) {
      const capitalizedFirstName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      const capitalizedLastName =
        lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
      patientName = capitalizedFirstName + ' ' + capitalizedLastName;
    } else if (firstName) {
      patientName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    }

    return patientName;
  };

  const calculatedDate = (date: any) => {
    const creationDate = new Date(date);

    // Get today's date
    const today = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = today.getTime() - creationDate.getTime();

    // Calculate the difference in days
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (dayDifference < 1) {
      // Calculate the difference in hours
      const hourDifference = Math.floor(timeDifference / (1000 * 60 * 60));
      const minuteDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const formattedTimeDifference = `${hourDifference.toString().padStart(2, '0')}:${minuteDifference.toString().padStart(2, '0')}`;
      // console.log(formattedTimeDifference)
      return `${formattedTimeDifference} hrs ago`
    } else {
      return `${dayDifference} days ago`
    }
  }

  const doctorSetter = (id: string) => {
    return doctors.find((element) => element._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((element) => element._id === id)?.name;
  };

  const getStageName = (ticket) => {

    const stageDetail: any = stages?.find(
      ({ _id }) => ticket?.stage === _id
    );

    return stageDetail.name;
  }

  const [dates, setDates] = useState([null, null]);

  const handleDateRange = (dates, dateStrings) => {
    setDates(dateStrings);
  }


  return (<>
    <Box className={styles.SwitchView_container}>

      {/* Switch View Head */}
      <Box className={styles.SwitchView_filters_container}>
        <Stack className={styles.SwitchView_container_title} >
          Tickets
        </Stack>

        <Stack display={'flex'} flexDirection={'row'}>
          <Stack><DownloadAllTickets /></Stack>
          <Stack
            sx={{
              marginTop: '5px',
              marginRight: '10px',
              cursor: 'pointer',

            }}
            onClick={() => {
              backToDashboard();
              setIsSwitchView(false);
            }}
          >
            <img
              src={ActiveToggleIcon}
              alt="switch View"
              style={{
                fill: "blue"
              }}
            />
          </Stack>
          <Stack
            sx={{
              marginTop: '5px',
              color: '#000',
              fontFamily: 'Outfit,sanserif',
              fontSize: '14px'
            }}
          >
            Switch view
          </Stack>
        </Stack>
      </Box>

      {/* Switch View Filters */}
      <Box className={styles.SwitchView_filters_container}>

        {/* Date Filter */}
        <Box className={styles.SwitchView_filters_left}>
          {/* Date Filters */}
          <Stack>
            <DatePicker.RangePicker
              style={datePickerStyle}
              onChange={handleDateRange}
            />
            <style>{`
                    .ant-picker-range .ant-picker-input input::placeholder {
                     color: black; /* Change this to your desired color */
                    }
                   `}</style>

          </Stack>
        </Box>

        {/* Search Filter And Filters Component */}
        <Box display={'flex'} flexDirection={'row'} gap={'9px'}>
          {/* Search Filters */}
          <Stack gap={'2px'}>
            <Stack className={styles.search}>
              <div className={styles.search_container}>
                <span className={styles.search_icon}><SearchIcon /></span>
                <input
                  type="text"
                  className={styles.search_input}
                  placeholder=" Search..."
                  onKeyDown={handleSearchKeyPress}
                />
              </div>
            </Stack>
            <Stack
              sx={{
                fontFamily: `Outfit,sanserif`,
                fontSize: '13px',
                color: '#647491',
                marginLeft: "5px"

              }}
            >
              {searchError && <div>{searchError}</div>}
            </Stack>
          </Stack>


          {/* Filter Component */}
          <Stack sx={{
            marginTop: "10px",
            marginRight: '-10px',
            width: "24px",
            height: "24px"
          }}>
            <img src={AuditFilterIcon} alt="Audit Filter" />
          </Stack>
          <Stack marginRight={'-10px'}>
            <TicketFilter setPage={setPage} />
          </Stack>
        </Box>
      </Box>

      {/* Stages Data  */}
      <Box className="OrderType-container">
        {cardsData.map((card) => (
          <>
            <Stack className='OrderType-card' sx={{ borderLeft: card.id !== 1 ? "1px solid var(--Borders-Light-Grey, #D4DBE5)" : "none" }}>
              <Stack className='OrderType-card-title'>{card.title}</Stack>
              <Stack className='OrderType-card-value'>{card.content ? card.content : 0}</Stack>
            </Stack>
          </>

        ))}
      </Box>

      {/* Tickets Tables */}
      <Box sx={{ height: "55% !important" }} className={styles.SwitchView_table_container}>

        <Box height={'100%'}>
          <table className={styles.SwitchView_table} style={{
            height: '95%'
          }}>
            <Box sx={{ position: "sticky" }}>
              <thead>
                <tr className={styles.SwitchView_table_head}>

                  <th className={`${styles.SwitchView_table_head_item}`} >Lead</th>
                  <th className={`${styles.SwitchView_table_head_item} ${styles.Switch_item2}`} >Lead Age</th>
                  <th className={`${styles.SwitchView_table_head_item} ${styles.Switch_item3}`} >Doctor</th>
                  <th className={`${styles.SwitchView_table_head_item} ${styles.Switch_item4}`} >Specialty</th>
                  <th className={`${styles.SwitchView_table_head_item} ${styles.Switch_item6}`} >Lead status</th>
                  <th className={`${styles.SwitchView_table_head_item} ${styles.Switch_item5}`} >Services</th>
                  <th className={`${styles.SwitchView_table_head_item} ${styles.Switch_item7}`} >Probability</th>
                  <th className={`${styles.SwitchView_table_head_item} ${styles.Switch_item7}`} >Priority</th>

                </tr>
              </thead>
            </Box>
            <Box sx={{
              height: "95%", overflowY: 'auto',
              '&::-webkit-scrollbar': { width: '4px', marginTop: "100px" },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#DAE8FF', borderRadius: '4px' },
              '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' }
            }}>
              <tbody>
                {tickets.map(item => (
                  <tr key={item._id} className={styles.SwitchView_table_body}
                    onClick={() => navigate(`${item._id}`)}>

                    {/* Lead */}
                    <td className={`${styles.SwitchView_table_body_item}`}>
                      <Stack display={'flex'} flexDirection={'row'} gap={'8px'}>
                        <Stack className={styles.SwitchView_name} sx={{ textTransform: "capitalize" }}>
                          {patientName(item)}
                        </Stack>
                        <Stack className={styles.SwitchView_GenAge}>
                          {item.consumer[0]?.gender && <Stack className={styles.SwitchView_Gen}>{item.consumer[0]?.gender}</Stack>}
                          {item.consumer[0]?.age && <Stack className={styles.SwitchView_Age}> {item.consumer[0]?.age}</Stack>}
                        </Stack>
                      </Stack>
                      <Stack className={styles.SwitchView_uhid}>
                        #{item.consumer[0]?.uid}
                      </Stack>
                    </td>

                    {/* Lead Age */}
                    <td className={`${styles.SwitchView_table_body_item}  ${styles.Switch_body_item2}`}  >
                      <Stack className={styles.SwitchView_last_date}>
                        {calculatedDate(item.date)}
                      </Stack>
                    </td>

                    {/* Doctor Name */}
                    <td className={`${styles.SwitchView_table_body_item} ${styles.Switch_body_item3}`} >
                      <Stack className={styles.SwitchView_last_date} sx={{ textTransform: "capitalize !important" }}>
                        {doctorSetter(item?.prescription[0]?.doctor)}
                      </Stack>
                    </td>

                    {/* Department */}
                    <td className={`${styles.SwitchView_table_body_item} ${styles.Switch_body_item4}`} >
                      <Stack className={styles.SwitchView_last_date} sx={{ textTransform: "capitalize !important" }}>
                        {departmentSetter(item.prescription[0].departments[0])}
                      </Stack>
                    </td>


                    {/* LeadStatus */}
                    <td className={`${styles.SwitchView_table_body_item} ${styles.Switch_body_item6}`} >
                      <Stack sx={stageStyles[getStageName(item)]}> {getStageName(item)}</Stack>
                    </td>

                    {/* Services */}
                    <td className={`${styles.SwitchView_table_body_item} ${styles.Switch_body_item5}`} >

                      <Box className="ticket-card-line3">
                        {item.prescription[0].admission ? (<>
                          <Stack className='ticket-card-line3-tag'>{item.prescription[0].admission}</Stack>
                        </>
                        )
                          :
                          (<></>)
                        }
                        {item.prescription[0].diagnostics.length > 0 ? (<>
                          <Stack className='ticket-card-line3-tag'>Diagonstic</Stack>
                        </>
                        )
                          :
                          (<></>)
                        }
                      </Box>

                    </td>


                    {/* Probabilty */}
                    <td className={`${styles.SwitchView_table_body_item} ${styles.Switch_body_item7}`} >
                      <Stack className={styles.SwitchView_Prob}
                        sx={{
                          color: getColor(item?.Probability),
                          backgroundColor: getBackgroundColor(item?.Probability),
                        }}
                      >{!item?.Probability ? 0 : item?.Probability}%</Stack>
                    </td>

                    {/* Priority */}
                    <td className={`${styles.SwitchView_table_body_item} ${styles.Switch_body_item7}`} >
                      {item.estimate.length === 0 ? (<>
                        <Stack className="Priority-tag"> <img src={DefaultPr} alt="DefaultPr" /><span style={{ fontSize: "12px" }}>N/A</span></Stack>
                      </>) : (
                        <>
                          <Stack className="Priority-tag">{220 > 15000 ?
                            (<><img src={HighPr} alt="" />High</>)
                            : 220 < 4500 && 450 < 2220 ?
                              (<><img src={MediumPr} alt="" />Medium</>)
                              : (<><img src={LowPr} alt="" />Low</>)}
                          </Stack>

                        </>)
                      }
                    </td>


                  </tr>
                ))}
              </tbody>
            </Box>

            <Box className={styles.SwitchView_pagination}>
              <CustomPagination
                handlePagination={handlePagination}
                pageCount={pageCount}
                page={pageNumber}
              />
            </Box>
          </table>
        </Box>
      </Box>
    </Box>

    {/* Modal For Reminder  */}
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
            <Typography
              fontSize={'18px'}
              fontWeight={'600'}
              margin={'10px'}
            >
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

    {/* Modal For Rescheduler */}
    <Box>
      <Modal
        open={showCallReschedulerModal}
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
            onClick={handleCloseCallReschedulerModal}
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
            {ticketCallReschedulerPatient && (
              <Typography>{`Call Rescheduler for ${(
                ticketCallReschedulerPatient?.consumer[0]?.firstName ||
                'N/A'
              ).toUpperCase()} `}</Typography>
            )}{' '}
            <Typography
              fontSize={'18px'}
              fontWeight={'600'}
              margin={'10px'}
            >
              {alarmCallReschedulerList[0]?.selectedLabels
                ? alarmCallReschedulerList[0].selectedLabels
                  .map((label) => label.label)
                  .join(', ')
                  .toUpperCase()
                : 'N/A'}
            </Typography>
            <Typography margin={'12px'}>
              {alarmCallReschedulerList[0]?.description || 'N/A'}
            </Typography>
            <Chip
              size="medium"
              variant="outlined"
              color="primary"
              label={dayjs(alarmCallReschedulerList[0]?.date).format(
                'DD/MMM/YYYY hh:mm A '
              )}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  </>

  )
}

export default SwitchViewTable;