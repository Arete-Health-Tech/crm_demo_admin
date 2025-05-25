import {
  Avatar,
  Badge,
  BadgeProps,
  Box,
  MenuItem,
  Pagination,
  Stack,
  Tooltip,
  TooltipProps,
  Zoom,
  styled,
  tooltipClasses
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './audit.module.css';
import ArrowDownIcon from '../../assets/ArrowDown.svg';
import CheckBoxIcon from '../../assets/AuditCheckBox.svg';
import SearchIcon from '@mui/icons-material/Search';
import SortArrowIcon from '../../assets/SortArrow.svg';
import ConnectorIcon from '../../assets/hierarchy.svg';
import TotalCallIcon from '../../assets/TotalCall.svg';
import TotalRecievedCallIcon from '../../assets/call-received.svg';
import AuditCallIcon from '../../assets/CallAudit.svg';
import CommentIcon from '../../assets/message-search.svg';
import StarIcon from '../../assets/star.svg';
import EmptyStarIcon from '../../assets/EmptyStar.svg';
import Avatar1 from '../../assets/avatar1.svg';
import Avatar2 from '../../assets/avatar2.svg';
import { Style } from '@mui/icons-material';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import useTicketStore from '../../store/ticketStore';
import { UNDEFINED } from '../../constantUtils/constant';
import {
  getAllAuditTicketHandler,
  getAuditFilterTicketsHandler,
  getTicketHandler
} from '../../api/ticket/ticketHandler';
import { getAllNotesWithoutTicketId } from '../../api/notes/allNote';
import {
  getStagesHandler,
  getSubStagesHandler
} from '../../api/stages/stagesHandler';
import { getDoctorsHandler } from '../../api/doctor/doctorHandler';
import { getDepartmentsHandler } from '../../api/department/departmentHandler';
import { getAllServiceFromDbHandler } from '../../api/service/serviceHandler';
import { socket } from '../../api/apiClient';
import { socketEventConstants } from '../../constantUtils/socketEventsConstants';
import CustomPagination from '../../container/layout/CustomPagination';
import { getTicket } from '../../api/ticket/ticket';
import { getRepresntativesHandler } from '../../api/representive/representativeHandler';
import useReprentativeStore from '../../store/representative';
import useServiceStore from '../../store/serviceStore';
import AuditFilters from './AuditFilters';
import NotFoundIcon from '../../assets/NotFoundTask.svg';
import AuditFilterIcon from '../../assets/commentHeader.svg';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#0566FF',
    color: '#ffffff',
    fontSize: 10,
    fontFamily: `"Outfit",sans-serif`
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#0566FF'
  }
}));

const getColor = (probability) => {
  if (probability === 100) return '#08A742';
  if (probability === 75) return '#0566FF';
  if (probability === 50) return '#FFB200';
  if (probability === 25) return '#F94839';
  if (probability === 0) return '#546E7A';
  return 'grey';
};

const getBackgroundColor = (probability) => {
  if (probability === 100) return '#DAF2E3';
  if (probability === 75) return '#DAE8FF';
  if (probability === 50) return '#FFF3D9';
  if (probability === 25) return '#FEE4E1';
  if (probability === 0) return '#E5E9EB';
  return 'grey';
};

const ClearBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -0,
    top: 7,
    // border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    color: '#FFFFFF',
    backgroundColor: 'red'
  }
}));

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

const Audit: React.FC = () => {
  const navigate = useNavigate();
  const { stages } = useServiceStore();
  const { setIsAuditor } = useTicketStore();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [searchName, setSearchName] = useState<string>(UNDEFINED);
  const {
    tickets,
    filterTickets,
    filterTicketsDiago,
    filterTicketsFollowUp,
    setSearchByName,
    searchByName,
    ticketCount,
    setTicketCount,
    setTickets,
    ticketCache,
    emptyDataText,
    loaderOn,
    pageNumber,
    setPageNumber,
    isAuditorFilterOn,
    setIsAuditorFilterOn
  } = useTicketStore();
  const { representative } = useReprentativeStore();
  const redirectTicket = () => {
    navigate('/auditDetails');
  };

  const [searchError, setSearchError] = useState<string>(
    'Type to search & Enter'
  );
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  // const navigate = useNavigate();

  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;

  useEffect(() => {
    localStorage.setItem('location', '');
  });

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
        redirectTicket();
        return;
      }
      if (!isAuditorFilterOn) {
        await getAllAuditTicketHandler(value, 1, 'false', newFilter);
      }
      setSearchByName(value);
      setSearchError(`remove "${value.toUpperCase()}" to reset & Enter`);
      setPageNumber(1);
      setPage(1);
      redirectTicket();
    }
  };

  useEffect(() => {
    setPageCount(Math.ceil(ticketCount / 10));
    setPage(pageNumber);
  }, [tickets, searchByName]);

  const fetchTicketsOnEmpthySearch = async () => {
    setSearchName(UNDEFINED);
    setSearchByName(UNDEFINED);
    setPage(1);
    setPageNumber(1);
    if (!isAuditorFilterOn) {
      await getAllAuditTicketHandler(UNDEFINED, 1, 'false', newFilter);
    }
  };

  const handlePagination = async (
    event: React.ChangeEvent<unknown>,
    pageNo: number
  ) => {
    setPageNumber(pageNo);
    if (pageNo !== page) {
      setTickets([]);
      if (!isAuditorFilterOn) {
        await getAllAuditTicketHandler(searchName, pageNo, 'false', newFilter);
      }
      setPage(pageNo);
      setPageNumber(pageNo);

      redirectTicket();
    }
  };
  window.onload = redirectTicket;

  useEffect(() => {
    (async function () {
      if (!isAuditorFilterOn) {
        await getAllAuditTicketHandler(UNDEFINED, 1, 'false', newFilter);
      }
      await getAllNotesWithoutTicketId();
      await getStagesHandler();
      await getSubStagesHandler();
      await getDoctorsHandler();
      await getDepartmentsHandler();
      await getAllServiceFromDbHandler();
      await getRepresntativesHandler();
    })();
    setPageNumber(1);
  }, []);

  useEffect(() => {
    const refetchTickets = async () => {
      const copiedFilterTickets = { ...newFilter };
      let pageNumber = page;

      if (!isAuditorFilterOn) {
        await getAllAuditTicketHandler(
          searchName,
          pageNumber,
          'false',
          copiedFilterTickets
        );
      }
    };

    // socket.on(socketEventConstants.REFETCH_TICKETS, refetchTickets);

    return () => {
      socket.off(socketEventConstants.REFETCH_TICKETS, refetchTickets);
    };
  }, [newFilter, page, searchName]);

  const { setFilterTickets } = useTicketStore();

  const initialFilters = {
    stageList: "",
    representative: null,
    results: null,
    admissionType: "",
    diagnosticsType: "",
    dateRange: [],
    status: "",
    followUp: null
  };

  console.log(tickets, '----------------');

  const calculateRecivedCall = (phoneCalls: any) => {
    let count = 0;

    if (Array.isArray(phoneCalls) && phoneCalls.length > 0) {
      phoneCalls.forEach((item) => {
        if (item?.recording !== null) {
          count++;
        }
      });
    }

    return count;
  };

  const handleStage = (stageId: any) => {
    if (stages) {
      switch (stageId) {
        case stages[0]._id:
          return 'New Lead';
          break;
        case stages[1]._id:
          return 'Contacted';
          break;
        case stages[2]._id:
          return 'Working';
          break;
        case stages[3]._id:
          return 'Orientation';
          break;
        case stages[4]._id:
          return 'Nurturing';
          break;
        default:
          break;
      }
    } else {
      return 'Unknown';
    }
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
        const initials = `${rep.firstName.charAt(0)}${rep.lastName.charAt(0)}`;
        result.push(initials);
      }
      return result;
    }, []);
  };

  const handleAuditorFilter = async () => {
    await getAuditFilterTicketsHandler();
    setIsAuditorFilterOn(true);
  };

  const handleClearAuditorFilter = async () => {
    await getAllAuditTicketHandler(UNDEFINED, 1, 'false', initialFilters);
    setIsAuditorFilterOn(false);
  };

  const formateLastActivity = (item: any) => {
    if (item == null) {
      return null;
    }
    const timestamp = item;
    const date = new Date(timestamp);
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const day = date.getUTCDate();
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    const formattedDate = `${day} ${month} ${year}`;
    return formattedDate;
  };

  return (
    <Box className={styles.Audit_container}>
      <Stack className={styles.Audit_container_title}>Audit</Stack>

      <Box className={styles.Audit_filters_container}>
        <Box className={styles.Audit_filters_left}>
          <AuditFilters setPage={setPage} />
        </Box>

        <Box display={'flex'} flexDirection={'row'} gap={'5px'}>
          <Box display={'flex'} flexDirection={'column'}>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              gap={'10px'}
            >
              <Stack width={'95%'} position={'relative'}>
                <span className="search-icon">
                  {' '}
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  className="search-input"
                  placeholder=" Search..."
                  onKeyDown={handleSearchKeyPress}
                />
              </Stack>
            </Box>
            <Box
              sx={{
                fontFamily: `Outfit,sanserif`,
                fontSize: '13px',
                color: '#647491'
              }}
            >
              {searchError && <div>{searchError}</div>}
            </Box>
          </Box>
          <Stack className="AuditorFilterIcon">
            {isAuditorFilterOn ? (
              <LightTooltip
                title="Clear Audit Filter"
                disableInteractive
                placement="top"
                TransitionComponent={Zoom}
              >
                <ClearBadge badgeContent={'x'} color="error">
                  <img
                    src={AuditFilterIcon}
                    alt="Audit Filter"
                    onClick={handleClearAuditorFilter}
                  />
                </ClearBadge>
              </LightTooltip>
            ) : (
              <LightTooltip
                title="Apply Audit Filter"
                disableInteractive
                placement="top"
                TransitionComponent={Zoom}
              >
                <img
                  src={AuditFilterIcon}
                  onClick={handleAuditorFilter}
                  alt="Audit Filter"
                />
              </LightTooltip>
            )}
          </Stack>
        </Box>
      </Box>

      <Box className={styles.Audit_table_container}>
        <Box height={'100%'}>
          <table
            className={styles.Audit_table}
            style={{
              height: '95%'
            }}
          >
            <Box sx={{ position: 'sticky' }}>
              <thead>
                <tr className={styles.Audit_table_head}>
                  <th className={`${styles.Audit_table_head_item}`}>
                    Lead
                    <Stack sx={{ marginLeft: '5px', marginTop: '2px' }}>
                      <img src={SortArrowIcon} alt="sortArrow" />
                    </Stack>
                  </th>
                  <th
                    className={`${styles.Audit_table_head_item} ${styles.item00}`}
                  ></th>
                  <th
                    className={`${styles.Audit_table_head_item} ${styles.item2}`}
                  >
                    Stage
                  </th>
                  <th
                    className={`${styles.Audit_table_head_item} ${styles.item3}`}
                  >
                    Last Contacted
                  </th>
                  <th
                    className={`${styles.Audit_table_head_item} ${styles.item4}`}
                  >
                    Calls
                  </th>
                  <th
                    className={`${styles.Audit_table_head_item} ${styles.item5}`}
                  >
                    Probabilty
                  </th>
                  <th
                    className={`${styles.Audit_table_head_item} ${styles.item6}`}
                  >
                    Comments
                  </th>
                  <th
                    className={`${styles.Audit_table_head_item} ${styles.item7}`}
                  >
                    Audit Value
                  </th>
                  <th
                    className={`${styles.Audit_table_head_item} ${styles.item8}`}
                  >
                    Assignee
                  </th>
                  {/* Add other headers as needed */}
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
                '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' }
              }}
            >
              <tbody>
                {tickets.length > 0 ? (
                  <>
                    {tickets.map((item) => (
                      <tr
                        key={item._id}
                        className={styles.Audit_table_body}
                        onClick={() => {
                          setIsAuditor(true);
                          // navigate(`/auditSingleTicketDetail/${"6652bf7accee77aaeaf8afb2"}`);
                          navigate(`/auditSingleTicketDetail/${item._id}`);
                        }}
                      >
                        {/* Lead */}
                        <td className={`${styles.Audit_table_body_item}`}>
                          <Stack
                            display={'flex'}
                            flexDirection={'row'}
                            gap={'8px'}
                          >
                            <Stack
                              className={styles.Audit_name}
                              sx={{ textTransform: 'capitalize !important' }}
                            >
                              {`${item?.consumer?.[0]?.firstName ?? ''} ${
                                item?.consumer?.[0]?.lastName ?? ''
                              }`}
                            </Stack>
                            <Stack className={styles.Audit_GenAge}>
                              {item.consumer[0]?.gender && (
                                <Stack className={styles.Audit_Gen}>
                                  {item.consumer[0]?.gender}
                                </Stack>
                              )}
                              {item.consumer[0]?.age && (
                                <Stack className={styles.Audit_Age}>
                                  {' '}
                                  {item.consumer[0]?.age}
                                </Stack>
                              )}
                            </Stack>
                          </Stack>
                          <Stack className={styles.Audit_uhid}>
                            #{item.consumer[0]?.uid}
                          </Stack>
                        </td>
                        <td
                          className={`${styles.Audit_table_body_item} ${styles.body_item00}`}
                        >
                          <Stack
                            sx={
                              item.result === '65991601a62baad220000002'
                                ? baseLossStyle
                                : item.result === '65991601a62baad220000001'
                                ? baseWonStyle
                                : undefined
                            }
                          >
                            {item.result === '65991601a62baad220000002'
                              ? 'Loss'
                              : item.result === '65991601a62baad220000001'
                              ? 'Won'
                              : ''}
                          </Stack>
                        </td>
                        {/* Stage */}
                        <td
                          className={`${styles.Audit_table_body_item} ${styles.body_item2}`}
                        >
                          <Stack className={styles.Audit_stage}>
                            {handleStage(item.stage)}
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
                            <Stack className={styles.Audit_substage}>
                              {/* {item.subStage} */}
                              {handleSubStage(item?.subStageCode?.code)}
                            </Stack>
                          </Stack>
                        </td>

                        {/* Last Contacted */}
                        <td
                          className={`${styles.Audit_table_body_item} ${styles.body_item3}`}
                        >
                          <Stack className={styles.Audit_last_date}>
                            {/* {item.lastContactedDate} */}
                            {/* 23 April 2023 */}
                            {item?.lastActivity
                              ? formateLastActivity(item?.lastActivity)
                              : 'Not Contacted'}
                          </Stack>
                        </td>

                        {/* Calls */}
                        <td
                          className={`${styles.Audit_table_body_item} ${styles.body_item4}`}
                        >
                          <Stack
                            display={'flex'}
                            flexDirection={'row'}
                            gap={'16px'}
                          >
                            <LightTooltip
                              title="Total Calls"
                              disableInteractive
                              placement="top"
                              TransitionComponent={Zoom}
                            >
                              <Stack className={styles.Audit_CallValues}>
                                <Stack className={styles.Audit_CallIcon}>
                                  <img src={TotalCallIcon} />
                                </Stack>
                                <Stack className={styles.Audit_call_value}>
                                  {item?.phoneData?.length ?? 0}
                                </Stack>
                              </Stack>
                            </LightTooltip>
                            <LightTooltip
                              title="Recieved Calls"
                              disableInteractive
                              placement="top"
                              TransitionComponent={Zoom}
                            >
                              <Stack className={styles.Audit_CallValues}>
                                <Stack className={styles.Audit_CallIcon}>
                                  <img src={TotalRecievedCallIcon} />
                                </Stack>
                                <Stack className={styles.Audit_call_value}>
                                  {calculateRecivedCall(item?.phoneData)}
                                </Stack>
                              </Stack>
                            </LightTooltip>
                            {/* Audit Call */}
                            {/* <LightTooltip
                            title="Audit Calls"
                            disableInteractive
                            placement="top"
                            TransitionComponent={Zoom}
                          >
                            <Stack className={styles.Audit_CallValues}>
                              <Stack className={styles.Audit_CallIcon}><img src={AuditCallIcon} /></Stack>
                              <Stack className={styles.Audit_call_value}>
                                
                                0
                              </Stack>
                            </Stack>
                          </LightTooltip> */}
                          </Stack>
                        </td>

                        {/* Probabilty */}
                        <td
                          className={`${styles.Audit_table_body_item} ${styles.body_item5}`}
                        >
                          <Stack
                            className={styles.Audit_Prob}
                            sx={{
                              color: getColor(item?.Probability ?? 0),
                              backgroundColor: getBackgroundColor(
                                item?.Probability ?? 0
                              )
                            }}
                          >
                            {' '}
                            {item?.Probability ?? 0}%
                          </Stack>
                        </td>

                        {/* Comments */}
                        <td
                          className={`${styles.Audit_table_body_item} ${styles.body_item6}`}
                        >
                          <Stack className={styles.Audit_commentValue}>
                            <Stack className={styles.Audit_call_value}>
                              {item?.auditorcomment?.length ?? '0'}
                            </Stack>
                            <Stack className={styles.Audit_CallIcon}>
                              <img src={CommentIcon} />
                            </Stack>
                          </Stack>
                        </td>

                        {/* Audit Value */}
                        <td
                          className={`${styles.Audit_table_body_item} ${styles.body_item7}`}
                        >
                          <Stack className={styles.Audit_Audit_value}>
                            {[1, 2, 3, 4, 5].map((star) => {
                              return (
                                <Stack
                                  key={star} // Add a key to avoid React warning
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '4px',
                                    justifyContent: 'left'
                                  }}
                                >
                                  {item?.auditorcomment?.length > 0 ? (
                                    item.auditorcomment[
                                      item.auditorcomment.length - 1
                                    ]?.ratings >= star ? (
                                      <Stack className={styles.Star_icon}>
                                        <img src={StarIcon} alt="starIcon" />
                                      </Stack>
                                    ) : (
                                      <Stack className={styles.Star_icon}>
                                        <img
                                          src={EmptyStarIcon}
                                          alt="EmptyStarIcon"
                                        />
                                      </Stack>
                                    )
                                  ) : 0 >= star ? (
                                    <Stack className={styles.Star_icon}>
                                      <img src={StarIcon} alt="starIcon" />
                                    </Stack>
                                  ) : (
                                    <Stack className={styles.Star_icon}>
                                      <img
                                        src={EmptyStarIcon}
                                        alt="EmptyStarIcon"
                                      />
                                    </Stack>
                                  )}
                                </Stack>
                              );
                            })}
                          </Stack>
                        </td>

                        {/* Assignee */}
                        <td
                          className={`${styles.Audit_table_body_item} ${styles.body_item8}`}
                        >
                          <Stack className={styles.Audit_assigne_avatar}>
                            {handleAssigne(item?.assigned).map((i, index) => {
                              if (index === 0) {
                                return (
                                  <>
                                    <Avatar
                                      sx={{
                                        width: '35px',
                                        height: '35px',
                                        fontSize: '10px',
                                        bgcolor: 'orange',
                                        textTransform: 'uppercase',
                                        marginTop: '2px'
                                      }}
                                    >
                                      {i}
                                    </Avatar>
                                  </>
                                );
                              }

                              return null;
                            })}
                            {handleAssigne(item?.assigned).map((i, index) => {
                              if (index === 1) {
                                return (
                                  <>
                                    <Avatar
                                      sx={{
                                        width: '35px',
                                        height: '35px',
                                        fontSize: '10px',
                                        bgcolor: '#0096FF',
                                        textTransform: 'uppercase',
                                        marginTop: '2px',
                                        position: 'relative',
                                        right: '14px'
                                      }}
                                    >
                                      {i}
                                    </Avatar>
                                  </>
                                );
                              }

                              return null;
                            })}
                          </Stack>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    <Box
                      className="NotFound-Page"
                      sx={{
                        width: '90.5vw'
                      }}
                    >
                      <img src={NotFoundIcon} />
                      <Stack className="NotFound-text">
                        No Ticket Available
                      </Stack>
                      <Stack className="NotFound-subtext">No Data Found</Stack>
                    </Box>
                  </>
                )}
              </tbody>
            </Box>

            <Box className={styles.Audit_pagination}>
              {/* <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                sx={{
                  fontFamily: "Outfit,sans-serif",
                  padding: '10px 0 10px 25px',
                  '& .MuiPaginationItem-root': {
                    fontFamily: 'Outfit, sans-serif',
                    '&.Mui-selected': {
                      backgroundColor: '#0566FF',
                      color: '#FFFFFF',
                    },
                  },
                }}
              /> */}
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
  );
};

export default Audit;
