import { useEffect, useState } from 'react';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { NAVIGATE_TO_TICKET, UNDEFINED } from '../../../constantUtils/constant';
import useTicketStore from '../../../store/ticketStore';
import {
  bulkAssignTicketsHandler,
  clearAssigneeTicketsHandler,
  getAllCallReschedulerHandler,
  getAllReminderHandler,
  getTicketHandler
} from '../../../api/ticket/ticketHandler';
import { getAllNotesWithoutTicketId } from '../../../api/notes/allNote';
import {
  getStagesHandler,
  getSubStagesHandler
} from '../../../api/stages/stagesHandler';
import {
  getDoctorsHandler,
  getDoctorsHandlerName
} from '../../../api/doctor/doctorHandler';
import {
  getDepartmentsHandler,
  getDepartmentsHandlerName
} from '../../../api/department/departmentHandler';
import { apiClient } from '../../../api/apiClient';
import { Avatar, Box, MenuItem, Modal, Stack } from '@mui/material';
import styles from './BulkAssign.module.css';
import '../../orders/orderList.css';
import SearchIcon from '@mui/icons-material/Search';
import MediumPr from '../../../assets/MediumPr.svg';
import LowPr from '../../../assets/LowPr.svg';
import HighPr from '../../../assets/HighPr.svg';
import DefaultPr from '../../../assets/DefaultPr.svg';
import NotFoundIcon from '../../../assets/NotFoundTask.svg';
import TicketFilter from '../widgets/TicketFilter';
import CustomPagination from '../../../container/layout/CustomPagination';
import useServiceStore from '../../../store/serviceStore';
import useReprentativeStore from '../../../store/representative';
import FilledCheckBox from '../../../assets/FilledCheckBox.svg';
import EmptyCheckBox from '../../../assets/squareCheckBox-null.svg';
import ConnectorIcon from '../../../assets/hierarchy.svg';
import CloseModalIcon from '../../../assets/Group 48095853.svg';
import AddAssigneeIcon from '../../../assets/add.svg';
import red_remove from '../../../assets/red_remove.svg';
import DnpIcon from '../../../assets/DNP-icon.svg';
import { toast, ToastContainer } from 'react-toastify';
import React from 'react';
import { getRepresntativesHandler } from '../../../api/representive/representativeHandler';
import useUserStore from '../../../store/userStore';
import { SpinnerDotted } from 'spinners-react';
import TicketFilterDiago from '../widgets/TicketFilterDiago';
import TicketFilterFollowup from '../widgets/TicketFilterFollowup';

const menuItemStyles = {
  color: 'var(--Text-Black, #080F1A)',
  fontFamily: `"Outfit", sans-serif`,
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '150%'
};

const datePickerStyle = {
  backgroundColor: '#E1E6EE',
  color: '#000',
  fontFamily: 'Outfit,sans-serif',
  borderRadius: '16px',
  minHeight: '35px',
  padding: '4px 20px',
  border: 'none',
  width: '250px'
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
  lineHeight: '18px'
};

const stageStyles = {
  'New Lead': {
    ...baseStyle,
    backgroundColor: '#D9EBFF'
  },
  Contacted: {
    ...baseStyle,
    color: '#FFA500',
    backgroundColor: '#FFF2D9'
  },
  Working: {
    ...baseStyle,
    backgroundColor: '#DFF2E3',
    color: '#28A745'
  },
  Orientation: {
    ...baseStyle,
    color: '#20C997',
    backgroundColor: '#DEF7EF'
  },
  Nurturing: {
    ...baseStyle,
    backgroundColor: '#E9E3F6',
    color: '#6F42C1'
  }
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

const baseWonStyle = {
  fontFamily: 'Outfit, sans-serif',
  color: '#fff',
  padding: '0px 8px',
  borderRadius: '10px',
  height: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 400,
  fontSize: '12px',
  gap: '4px',
  lineHeight: '18px',
  backgroundColor: '#08a742'
};

const baseLossStyle = {
  fontFamily: 'Outfit, sans-serif',
  color: '#fff',
  padding: '0px 8px',
  borderRadius: '10px',
  height: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 400,
  fontSize: '12px',
  gap: '4px',
  lineHeight: '18px',
  backgroundColor: '#f94839'
};

let AllIntervals: any[] = [];

function BulkAssign() {
  const { doctors, departments, stages } = useServiceStore();
  const {
    tickets,
    filterTickets,
    filterTicketsDiago,
    filterTicketsFollowUp,
    setSearchByName,
    searchByName,
    ticketCount,
    setTickets,
    pageNumber,
    setPageNumber,
    setDownloadDisable,
    downloadDisable
  } = useTicketStore();
  const { representative } = useReprentativeStore();

  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;

  // const [filteredTickets, setFilteredTickets] = useState<iTicket[]>();
  const [searchName, setSearchName] = useState<string>(UNDEFINED);
  const [searchError, setSearchError] = useState<string>(
    'Type to search & Enter'
  );
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();

  const currentRoute = useMatch(NAVIGATE_TO_TICKET);

  const redirectTicket = () => {
    navigate(
      `${
        localStorage.getItem('ticketType') === 'Admission'
          ? '/admission/'
          : localStorage.getItem('ticketType') === 'Diagnostics'
          ? '/diagnostics/'
          : localStorage.getItem('ticketType') === 'Follow-Up'
          ? '/follow-up'
          : '/ticket/'
      }`
    );
  };
  const { user } = useUserStore.getState();
  console.log(user, 'user');
  const phoneNumber = user?.phone;

  const [isAdminUser, setIsAdminUser] = useState(false);
  const [phone, setPhone] = useState(null);

  const fetchRepresentatives = async () => {
    try {
      const fetchedRepresentative = await getRepresntativesHandler();
      console.log(fetchedRepresentative, 'fetchedRepresentative');

      const mohaliFound = fetchedRepresentative?.some(
        (rep) =>
          rep.phone === phoneNumber && rep.Unit === '66a8bf565f223ac4d7fb6f38'
      );

      const amritsarFound = fetchedRepresentative?.some(
        (rep) =>
          rep.phone === phoneNumber && rep.Unit === '66a4caeaab18bee54eea0866'
      );
      const hoshiarpurFound = fetchedRepresentative?.some(
        (rep) =>
          rep.phone === phoneNumber && rep.Unit === '66bf5f702586bb9ea5598451'
      );
      const nawanshahrFound = fetchedRepresentative?.some(
        (rep) =>
          rep.phone === phoneNumber && rep.Unit === '66bf5f5c2586bb9ea5598450'
      );
      const khannaFound = fetchedRepresentative?.some(
        (rep) =>
          rep.phone === phoneNumber && rep.Unit === '66d5535689e33e0601248a79'
      );

      if (amritsarFound) {
        localStorage.setItem('location', 'Amritsar');
        setIsAdminUser(false);
      } else if (mohaliFound) {
        localStorage.setItem('location', 'Mohali');
        setIsAdminUser(false);
      } else if (hoshiarpurFound) {
        localStorage.setItem('location', 'Hoshiarpur');
        setIsAdminUser(false);
      } else if (nawanshahrFound) {
        localStorage.setItem('location', 'Nawanshahr');
        setIsAdminUser(false);
      } else if (khannaFound) {
        localStorage.setItem('location', 'Khanna');
        setIsAdminUser(false);
      } else {
        localStorage.setItem('location', '');
        setIsAdminUser(true);
      }
    } catch (error) {
      console.error('Error fetching representatives:', error);
    }
  };

  useEffect(() => {
    fetchRepresentatives();
  }, [
    phone
    // [ localStorage.getItem( 'ticketType' ) ]
  ]);

  const handlePagination = async (
    event: React.ChangeEvent<unknown>,
    pageNo: number
  ) => {
    setPageNumber(pageNo);
    if (pageNo !== page) {
      setTickets([]);
      try {
        setDownloadDisable(true);
        await getTicketHandler(searchName, pageNo, 'false', newFilter);
        setDownloadDisable(false);
      } catch {
        toast.error('Error While Fetching Tickets');
        setDownloadDisable(false);
      }
      setPage(pageNo);
      setPageNumber(pageNo);
    }
  };

  useEffect(() => {
    setPageCount(Math.ceil(ticketCount / 10));
    setPage(pageNumber);
    setSelectedTicketIds([]);
  }, [tickets, searchByName]);

  const fetchTicketsOnEmpthySearch = async () => {
    setSearchName(UNDEFINED);
    setSearchByName(UNDEFINED);
    setPage(1);
    setPageNumber(1);
    try {
      setDownloadDisable(true);
      await getTicketHandler(UNDEFINED, 1, 'false', newFilter);
      setDownloadDisable(false);
    } catch {
      toast.error('Error While Fetching Tickets');
      setDownloadDisable(false);
    }
  };

  const handleSearchKeyPress = async (e: any) => {
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
      try {
        setDownloadDisable(true);
        await getTicketHandler(value, 1, 'false', newFilter);
        setDownloadDisable(false);
      } catch {
        toast.error('Error While Fetching Tickets');
        setDownloadDisable(false);
      }
      setSearchByName(value);
      setSearchError(`remove "${value.toUpperCase()}" to reset & Enter`);
      setPageNumber(1);
      setPage(1);
      // redirectTicket()
    }
  };

  // window.onload = redirectTicket;

  useEffect(() => {
    (async function () {
      try {
        setDownloadDisable(true);
        await getTicketHandler(UNDEFINED, 1, 'false', newFilter);
        setDownloadDisable(false);
      } catch {
        toast.error('Error While Fetching Tickets');
        setDownloadDisable(false);
      }
      await getAllNotesWithoutTicketId();
      await getStagesHandler();
      await getSubStagesHandler();
      await getDoctorsHandlerName('');
      await getDepartmentsHandlerName('');
      await getAllReminderHandler();
      await getAllCallReschedulerHandler();
    })();
    setPageNumber(1);
  }, []);

  const calculatedDate = (date: string) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const doctorSetter = (id: string) => {
    return doctors.find((element) => element._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((element) => element._id === id)?.name;
  };

  const handleStage = (stageId: any) => {
    if (stages && stages.length > 0) {
      switch (stageId) {
        case stages[0]?._id:
          return 'New Lead';
        case stages[1]?._id:
          return 'Contacted';
        case stages[2]?._id:
          return 'Working';
        case stages[3]?._id:
          return 'Orientation';
        case stages[4]?._id:
          return 'Nurturing';
        default:
          return 'Unknown';
      }
    }
    return 'Unknown';
  };

  const handleSubStage = (code: any) => {
    switch (code) {
      case 1:
        return 'Send Engagement';
        break;
      case 2:
        return 'Create Estimate';
        break;
      case 3:
        return 'Call Patient';
        break;
      case 4:
        return 'Add Call Summary';
        break;
      default:
        break;
    }
  };

  const handleAssigne = (assignees: any) => {
    // Ensure assignees is an array
    if (!Array.isArray(assignees)) {
      return [];
    }

    return assignees.reduce((result: string[], assigneeId: string) => {
      const rep = representative.find((rep) => rep._id === assigneeId);
      if (rep) {
        const fullName = `${rep.firstName} ${rep.lastName}`;
        // const fullName = `${rep.firstName}`; // Concatenate firstName and lastName
        result.push(fullName);
      }
      return result;
    }, []);
  };

  const [isAssignTicketModal, setIsAssignTicketModal] = useState(false);
  const [isUnAssignTicketModal, setIsUnAssignTicketModal] = useState(false);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [selectedRepresentativeIds, setSelectedRepresentativeIds] = useState<
    string[]
  >([]);

  const [inputSearch, setInputSearch] = useState('');

  const handleAssignedTicketModal = () => {
    setIsAssignTicketModal(true);
    setIsUnAssignTicketModal(false);
  };

  const handleAssignedTicket = async () => {
    console.log(selectedRepresentativeIds, selectedTicketIds, '--------');
    if (selectedRepresentativeIds.length > 0) {
      try {
        const result = await bulkAssignTicketsHandler(
          selectedTicketIds,
          selectedRepresentativeIds
        );

        if (result) {
          toast.success('Tickets Assigned Successfully');
          setSelectedRepresentativeIds([]);
          setSelectedTicketIds([]);
          setIsAssignTicketModal(false);
          try {
            setDownloadDisable(true);
            await getTicketHandler(searchName, pageNumber, 'false', newFilter);
            setDownloadDisable(false);
          } catch {
            toast.error('Error While Fetching Tickets');
            setDownloadDisable(false);
          }
        }
      } catch (error) {
        console.error('Error while assigning tickets:', error);
        toast.error('Error While Assigning Tickets');
        setIsAssignTicketModal(false);
      }
    } else {
      toast.info(
        'Please select a representative to assign the selected tickets.'
      );
    }
  };

  const handleClearAssignedTicketModal = () => {
    setIsAssignTicketModal(false);
    setIsUnAssignTicketModal(true);
  };

  const handleSelectAll = () => {
    if (selectedTicketIds.length === tickets.length) {
      setSelectedTicketIds([]);
    } else {
      const allIds = tickets.map((agent) => agent._id);
      setSelectedTicketIds(allIds);
    }
  };

  const handleSelectRepresentative = (id: string) => {
    setSelectedRepresentativeIds((prevIds) =>
      prevIds.includes(id) ? [] : [id]
    );
  };

  const handleSelectAgent = (id: string) => {
    if (selectedTicketIds.includes(id)) {
      setSelectedTicketIds((prev) => prev.filter((agentId) => agentId !== id));
    } else {
      setSelectedTicketIds((prev) => [...prev, id]);
    }
  };

  const handleClearAssignee = async () => {
    console.log(selectedTicketIds, '--------');
    if (selectedTicketIds.length > 0) {
      try {
        const result = await clearAssigneeTicketsHandler(selectedTicketIds);
        if (result) {
          toast.success('Clear Assignee Successfully');
          setIsUnAssignTicketModal(false);
          setSelectedTicketIds([]);
          try {
            setDownloadDisable(true);
            await getTicketHandler(searchName, pageNumber, 'false', newFilter);
            setDownloadDisable(false);
          } catch {
            toast.error('Error While Fetching Tickets');
            setDownloadDisable(false);
          }
        }
      } catch (error) {
        toast.error('Error While Clearing Assigning');
        setIsUnAssignTicketModal(false);
      }
    } else {
      toast.info('Please Select Tickets.');
    }
  };

  const options = ['Admission', 'Diagnostic', 'Follow-Up'];
  const [selectedOption, setSelectedOption] = useState<string>(options[0]);

  const handleTicketType = (option) => {
    if (option == 'Admission') {
      localStorage.setItem('ticketType', 'Admission');
    } else if (option == 'Diagnostic') {
      localStorage.setItem('ticketType', 'Diagnostics');
    } else {
      localStorage.setItem('ticketType', 'Follow-Up');
    }
    setSelectedOption(option);
    console.log(selectedOption, 'jkjkjk');
  };

  return (
    <>
      {downloadDisable && (
        <>
          <Box
            position="fixed"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="rgba(255, 255, 255, 0.5)" // Semi-transparent background
            zIndex={9999} // Ensure it's on top
          >
            <Box
              display="flex"
              flexDirection="column" // Arrange spinner and text vertically
              justifyContent="center"
              alignItems="center"
            >
              <SpinnerDotted
                size={100}
                thickness={100}
                speed={50}
                color="#007BFF"
                // secondaryColor="#D9EBFF"
              />
              <Box mt={2} fontSize="16px" fontWeight="bold">
                {' '}
                {/* Add margin-top to space text below the spinner */}
                Please Wait ...
              </Box>
            </Box>
          </Box>
        </>
      )}
      <Box className={styles.BulkAsiign_container}>
        {/* Switch View Head */}
        <Box className={styles.BulkAsiign_filters_container}>
          <Stack className={styles.BulkAsiign_container_title}>
            Bulk Assignee
          </Stack>
        </Box>

        {/* Search Bar And Options */}

        <Stack
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          <Box className={styles.tickettype_options}>
            {options.map((option) => (
              <Stack
                key={option}
                className={styles.options_type}
                onClick={() => handleTicketType(option)}
                style={{
                  color: selectedOption === option ? '#080F1A' : '#647491',
                  borderBottom:
                    selectedOption === option ? '2px solid #0566FF' : 'none',
                  cursor: 'pointer',
                  paddingBottom: '5px'
                }}
              >
                {option}
              </Stack>
            ))}
          </Box>
          <Box className={styles.BulkAsiign_filters_container}>
            <Box className={styles.BulkAsiign_filters_left}></Box>

            {/* Search Filter And Filters Component */}
            <Box display={'flex'} flexDirection={'row'} gap={'9px'}>
              {/* Search Filters */}
              <Stack gap={'2px'}>
                <Stack className={styles.search}>
                  <div className={styles.search_container}>
                    <span className={styles.search_icon}>
                      <SearchIcon />
                    </span>
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
                    marginLeft: '5px'
                  }}
                >
                  {searchError && <div>{searchError}</div>}
                </Stack>
              </Stack>
              <Stack marginRight={'-10px'}>
                {selectedOption == 'Admission' ? (
                  <TicketFilter setPage={setPage} />
                ) : selectedOption == 'Diagnostic' ? (
                  <TicketFilterDiago setPage={setPage} />
                ) : (
                  <TicketFilterFollowup setPage={setPage} />
                )}
              </Stack>
            </Box>
          </Box>
        </Stack>
        {/* Tickets Tables */}
        <Box
          sx={{ height: '55% !important' }}
          className={styles.BulkAsiign_table_container}
        >
          <Box height={'100%'}>
            <table
              className={styles.BulkAsiign_table}
              style={{
                height: '95%'
              }}
            >
              <Box sx={{ position: 'sticky' }}>
                <thead>
                  <tr className={styles.BulkAsiign_table_head}>
                    <th className={`${styles.BulkAsiign_table_head_item} `}>
                      <Stack sx={{ marginLeft: '5px', marginTop: '2px' }}>
                        <img
                          src={
                            selectedTicketIds.length === tickets.length
                              ? FilledCheckBox
                              : EmptyCheckBox
                          }
                          // src={EmptyCheckBox}
                          alt="checkbox"
                          onClick={handleSelectAll}
                          style={{ cursor: 'pointer' }}
                        />
                      </Stack>
                    </th>
                    <th
                      className={`${styles.BulkAsiign_table_head_item} ${styles.Bulk_item1}`}
                    >
                      Lead
                    </th>
                    <th
                      className={`${styles.BulkAsiign_table_head_item} ${styles.Bulk_item2}`}
                    >
                      Stage
                    </th>

                    <th
                      className={`${styles.BulkAsiign_table_head_item} ${styles.Bulk_item3}`}
                    >
                      Doctor & Speciality
                    </th>

                    <th
                      className={`${styles.BulkAsiign_table_head_item} ${styles.Bulk_item4}`}
                    >
                      Created On
                    </th>
                    <th
                      className={`${styles.BulkAsiign_table_head_item} ${styles.Bulk_item4}`}
                    >
                      Follow-Up
                    </th>
                    <th
                      className={`${styles.BulkAsiign_table_head_item} ${styles.Bulk_item5}`}
                    >
                      Services
                    </th>
                    <th
                      className={`${styles.BulkAsiign_table_head_item} ${styles.Bulk_item6}`}
                    >
                      Assignee Name
                    </th>
                  </tr>
                </thead>
              </Box>
              <Box
                sx={{
                  height: '95%',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': { width: '4px', marginTop: '100px' },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#DAE8FF',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555'
                  }
                }}
              >
                <tbody>
                  {tickets.length > 0 ? (
                    <>
                      {tickets.map((item) => (
                        <tr
                          key={item._id}
                          className={styles.BulkAsiign_table_body}
                        >
                          {/* CheckBox */}
                          <td
                            className={`${styles.BulkAsiign_table_body_item}`}
                          >
                            <Stack sx={{ marginLeft: '5px', marginTop: '2px' }}>
                              <img
                                src={
                                  selectedTicketIds.includes(item._id)
                                    ? FilledCheckBox
                                    : EmptyCheckBox
                                }
                                // src={EmptyCheckBox}
                                alt="checkbox"
                                onClick={() => handleSelectAgent(item._id)}
                                style={{ cursor: 'pointer' }}
                              />
                            </Stack>
                          </td>
                          {/* Lead */}
                          <td
                            className={`${styles.BulkAsiign_table_body_item} ${styles.Bulk_body_item1}`}
                          >
                            <Stack
                              display={'flex'}
                              flexDirection={'row'}
                              gap={'8px'}
                            >
                              <Stack
                                className={styles.BulkAsiign_name}
                                sx={{ textTransform: 'uppercase !important' }}
                              >
                                {/* {patientName(item)} */}
                                {`${item?.consumer?.[0]?.firstName ?? ''} ${
                                  item?.consumer?.[0]?.lastName ?? ''
                                }`}
                              </Stack>
                              <Stack className={styles.BulkAsiign_GenAge}>
                                {item.consumer[0]?.gender && (
                                  <Stack className={styles.BulkAsiign_Gen}>
                                    {item.consumer[0]?.gender}
                                  </Stack>
                                )}
                                {item.consumer[0]?.age && (
                                  <Stack className={styles.BulkAsiign_Age}>
                                    {' '}
                                    {item.consumer[0]?.age}
                                  </Stack>
                                )}
                              </Stack>
                            </Stack>
                            <Stack className={styles.BulkAsiign_uhid}>
                              #{item.consumer[0]?.uid}
                            </Stack>
                          </td>

                          {/* Stage */}
                          <td
                            className={`${styles.BulkAsiign_table_body_item} ${styles.Bulk_body_item2}`}
                          >
                            <Stack className={styles.BulkAssign_stage}>
                              <Stack>{handleStage(item.stage)}</Stack>{' '}
                              {item.status === 'dnp' && (
                                <Stack
                                  sx={{
                                    width: '18px',
                                    height: '18px'
                                  }}
                                >
                                  <img src={DnpIcon} />
                                </Stack>
                              )}
                            </Stack>
                            <Stack
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Stack className={styles.Audit_connectorIcon}>
                                <img src={ConnectorIcon} />
                              </Stack>
                              <Stack className={styles.BulkAssign_substage}>
                                {/* {item.subStage} */}
                                {handleSubStage(item?.subStageCode?.code)}
                              </Stack>
                            </Stack>
                          </td>

                          {/* Doctor Name and Department */}
                          <td
                            className={`${styles.BulkAsiign_table_body_item} ${styles.Bulk_body_item3}`}
                          >
                            <Stack
                              className={styles.BulkAsiign_doc}
                              sx={{ textTransform: 'capitalize !important' }}
                            >
                              <Stack className={styles.Bulk_doctor}>
                                {doctorSetter(item?.prescription[0]?.doctor)}
                              </Stack>
                              <Stack className={styles.Bulk_dep}>
                                {departmentSetter(
                                  item.prescription[0].departments[0]
                                )}
                              </Stack>
                            </Stack>
                          </td>

                          {/* Lead Age */}
                          <td
                            className={`${styles.BulkAsiign_table_body_item}  ${styles.Bulk_body_item4}`}
                          >
                            <Stack className={styles.BulkAsiign_last_date}>
                              {calculatedDate(item.date)}
                            </Stack>
                          </td>
                          {/* FollowUp Date */}
                          <td
                            className={`${styles.BulkAsiign_table_body_item}  ${styles.Bulk_body_item4}`}
                          >
                            <Stack className={styles.BulkAsiign_last_date}>
                              {calculatedDate(item.prescription[0].followUp) ==
                              '1970-01-01'
                                ? 'Not Mention'
                                : calculatedDate(item.prescription[0].followUp)}
                            </Stack>
                          </td>
                          {/* Services */}
                          <td
                            className={`${styles.BulkAsiign_table_body_item} ${styles.Bulk_body_item5}`}
                          >
                            <Box className="ticket-card-line3">
                              {item.prescription[0].admission ? (
                                <>
                                  <Stack className="ticket-card-line3-tag">
                                    {item.prescription[0].admission}
                                  </Stack>
                                </>
                              ) : (
                                <></>
                              )}
                              {item.prescription[0].diagnostics.length > 0 ? (
                                <>
                                  <Stack className="ticket-card-line3-tag">
                                    Diagonstic
                                  </Stack>
                                </>
                              ) : (
                                <></>
                              )}
                            </Box>
                          </td>
                          <td
                            className={`${styles.BulkAsiign_table_body_item} ${styles.Bulk_body_item6}`}
                          >
                            <div className={styles.hoverContainer}>
                              <Stack>{handleAssigne(item.assigned)[0]}</Stack>
                              {handleAssigne(item.assigned)?.length > 1 && (
                                <Stack className={styles.badgeassigned}>
                                  {'+'}
                                  {handleAssigne(item.assigned)?.length - 1}
                                </Stack>
                              )}
                              {handleAssigne(item.assigned).length > 1 && (
                                <div className={styles.tooltip}>
                                  {handleAssigne(item.assigned)
                                    .slice(1)
                                    .map((name, index) => (
                                      <React.Fragment key={index}>
                                        {name}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      <Box
                        className="NotFound-Page"
                        sx={{
                          width: '90.5vw',
                          height: '30vh'
                        }}
                      >
                        <img src={NotFoundIcon} />
                        <Stack className="NotFound-text">
                          No Ticket Available
                        </Stack>
                        <Stack className="NotFound-subtext">
                          No Data Found
                        </Stack>
                      </Box>
                    </>
                  )}
                </tbody>
              </Box>

              <Box className={styles.BulkAsiign_pagination}>
                <Stack className={styles.AgentConfig_activate_btn}>
                  {selectedTicketIds.length > 0 && (
                    <>
                      <Stack
                        className={styles.activate_btn}
                        onClick={() => {
                          handleAssignedTicketModal();
                        }}
                      >
                        Assign Tickets {'('} {selectedTicketIds.length}
                        {' )'}
                      </Stack>
                      {/* <Stack
                        className={styles.activate_btn}
                        onClick={() => {
                          handleClearAssignedTicketModal();
                        }}
                      >
                        Clear Assignee ( {selectedTicketIds.length} )
                      </Stack> */}
                    </>
                  )}
                </Stack>
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

      {/* MODAL for Bulk Assigned */}
      <Modal
        open={isAssignTicketModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={styles.bulkAssignModal_modal}>
          <Stack
            className={styles.bulkAssignModal_title}
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
          >
            <Stack>
              Assigne Tickets
              {' ('} {selectedTicketIds.length}
              {' )'}
            </Stack>
            <Stack
              className={styles.bulkAssignModal_modal_close}
              onClick={() => {
                setIsAssignTicketModal(false);
                setSelectedRepresentativeIds([]);
              }}
            >
              <img src={CloseModalIcon} alt="" />
            </Stack>
          </Stack>
          <Box className={styles.bulkAssignModal_Note_Text}>
            <Stack className={styles.search}>
              <div className={styles.search_container}>
                {/* <span className="search-icon">&#128269;</span> */}
                <span className="search-icon">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  className={styles.search_input}
                  placeholder=" Search..."
                  onChange={(e) => setInputSearch(e.target.value)}
                />
              </div>
            </Stack>
            <Stack className={styles.ticket_asssignee_container}>
              {representative
                .filter((item) => {
                  const matchesSearch = inputSearch
                    ? item.firstName
                        .toLowerCase()
                        .includes(inputSearch.toLowerCase()) ||
                      item.lastName
                        .toLowerCase()
                        .includes(inputSearch.toLowerCase())
                    : true;

                  return matchesSearch && item.role === 'REPRESENTATIVE';
                })
                ?.map((item) => {
                  return (
                    <MenuItem key={item._id} sx={menuItemStyles}>
                      <Stack className={styles.Ticket_Assignee_item}>
                        <Stack className={styles.Ticket_Assignee_subItem}>
                          <Stack className={styles.Ticket_Assignee_avatar}>
                            <Avatar
                              sx={{
                                width: '20px',
                                height: '20px',
                                fontSize: '10px',
                                bgcolor: 'orange',
                                textTransform: 'uppercase',
                                marginTop: '2px'
                              }}
                            >
                              {item.firstName[0]}
                              {item.lastName[0]}
                            </Avatar>
                          </Stack>
                          <Stack
                            className={styles.Ticket_Assignee_Name}
                            display={'flex'}
                            flexDirection={'row'}
                            gap={'3px'}
                          >
                            <Stack style={{ textTransform: 'capitalize' }}>
                              {item.firstName}
                            </Stack>{' '}
                            <Stack style={{ textTransform: 'capitalize' }}>
                              {item.lastName}
                            </Stack>
                          </Stack>
                        </Stack>

                        <Stack className={styles.Ticket_Assignee_Operation}>
                          <img
                            src={
                              selectedRepresentativeIds.includes(item._id)
                                ? red_remove
                                : AddAssigneeIcon
                            }
                            // src={EmptyCheckBox}
                            alt="checkbox"
                            onClick={() => {
                              handleSelectRepresentative(item._id);
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                        </Stack>
                      </Stack>
                    </MenuItem>
                  );
                })}
            </Stack>
          </Box>
          <Box className={styles.bulkAssignModal_btn}>
            <Box
              className={styles.bulkAssignModal_Cancel}
              onClick={() => {
                setIsAssignTicketModal(false);
                setSelectedRepresentativeIds([]);
              }}
            >
              Cancel
            </Box>
            <Box
              className={styles.buttons_save}
              onClick={() => {
                {
                  handleAssignedTicket();
                }
              }}
            >
              Assign
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* End */}

      {/* MODAL for Bulk Assigned */}
      <Modal
        open={isUnAssignTicketModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={styles.bulkAssignModal_modal}>
          <Stack
            className={styles.bulkAssignModal_title}
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
          >
            <Stack>
              Clear Assignee
              {' ('} {selectedTicketIds.length}
              {' )'}
            </Stack>
            <Stack
              className={styles.bulkAssignModal_modal_close}
              onClick={() => {
                setIsUnAssignTicketModal(false);
                setSelectedRepresentativeIds([]);
              }}
            >
              <img src={CloseModalIcon} alt="" />
            </Stack>
          </Stack>
          <Box className={styles.bulkAssignModal_Note_Text}>
            Are you sure you want to clear the assignee from the selected
            tickets? Keep in mind, you'll need to reassign agents to these
            tickets afterward.
          </Box>
          <Box className={styles.bulkAssignModal_btn}>
            <Box
              className={styles.bulkAssignModal_Cancel}
              onClick={() => {
                setIsUnAssignTicketModal(false);
                setSelectedRepresentativeIds([]);
              }}
            >
              Cancel
            </Box>
            <Box
              className={styles.buttons_save}
              onClick={() => {
                {
                  handleClearAssignee();
                }
              }}
            >
              Clear Assignee
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* End */}
    </>
  );
}

export default BulkAssign;
