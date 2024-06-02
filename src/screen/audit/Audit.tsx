import { Box, MenuItem, Pagination, Stack, Tooltip, TooltipProps, Zoom, styled, tooltipClasses } from '@mui/material';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import styles from "./audit.module.css";
import ArrowDownIcon from '../../assets/ArrowDown.svg';
import CheckBoxIcon from '../../assets/AuditCheckBox.svg';
import SearchIcon from '@mui/icons-material/Search';
import SortArrowIcon from '../../assets/SortArrow.svg'
import ConnectorIcon from '../../assets/hierarchy.svg'
import TotalCallIcon from '../../assets/TotalCall.svg'
import TotalRecievedCallIcon from '../../assets/call-received.svg'
import AuditCallIcon from '../../assets/CallAudit.svg'
import CommentIcon from '../../assets/message-search.svg'
import LikeIcon from '../../assets/like.svg'
import DislikeIcon from '../../assets/dislike.svg'
import Avatar1 from '../../assets/avatar1.svg'
import Avatar2 from '../../assets/Avatar2.svg'
import { Style } from '@mui/icons-material';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import useTicketStore from '../../store/ticketStore';


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
    color: '#0566FF',
  }
}));


const menuItemStyles = {
  color: "var(--Text-Black, #080F1A)",
  fontFamily: `"Outfit", sans-serif`,
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "150%",
};

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

const getAuditValueColor = (auditValue) => {
  if (auditValue === "Good") return '#08A742';
  if (auditValue === "Bad") return '#F94839';
  return '#FFB200';
}
const getAuditValueBackgroundColor = (auditValue) => {
  if (auditValue === "Good") return '#DAF2E3';
  if (auditValue === "Bad") return '#FEE4E1';
  return '#FFF3D9';
}

interface AuditData {
  id: number;
  name: string;
  uhid: string;
  gender: string;
  age: string;
  stage: string;
  subStage: string;
  lastContactedDate: string;
  totalNumberOfCall: number;
  totalNumberOfAttendedCall: number;
  totalNumberOfAuditCall: number;
  probabilty: number;
  totalComments: number;
  auditValue: string;
  // assignee: string;
}

const sampleAuditData: AuditData[] = [
  {
    id: 1,
    name: "Simran Kaur",
    uhid: "UHI7842347625",
    gender: "F",
    age: "32",
    stage: "Contacted",
    subStage: "Create Estimate",
    lastContactedDate: "25 May 2024",
    totalNumberOfCall: 11,
    totalNumberOfAttendedCall: 7,
    totalNumberOfAuditCall: 2,
    probabilty: 25,
    totalComments: 3,
    auditValue: "Bad"
  },
  {
    id: 2,
    name: "Yuvraj Singh",
    uhid: "UHI7842347634",
    gender: "M",
    age: "24",
    stage: "New Lead",
    subStage: "Send Engagement",
    lastContactedDate: "24 May 2024",
    totalNumberOfCall: 10,
    totalNumberOfAttendedCall: 5,
    totalNumberOfAuditCall: 3,
    probabilty: 50,
    totalComments: 3,
    auditValue: "Good"
  },
  {
    id: 3,
    name: "Aman Joshi",
    uhid: "UHI7845347635",
    gender: "M",
    age: "26",
    stage: "Contacted",
    subStage: "Add Call Summary",
    lastContactedDate: "24 May 2024",
    totalNumberOfCall: 10,
    totalNumberOfAttendedCall: 5,
    totalNumberOfAuditCall: 3,
    probabilty: 75,
    totalComments: 3,
    auditValue: "Good"
  },
  {
    id: 4,
    name: "Ankit Sharma",
    uhid: "UHI7842347695",
    gender: "M",
    age: "55",
    stage: "Orientation",
    subStage: "Call Patient",
    lastContactedDate: "11 May 2024",
    totalNumberOfCall: 10,
    totalNumberOfAttendedCall: 5,
    totalNumberOfAuditCall: 3,
    probabilty: 25,
    totalComments: 3,
    auditValue: "Bad"
  },
  {
    id: 5,
    name: "Rajiv Thakur",
    uhid: "UHI7842347275",
    gender: "M",
    age: "21",
    stage: "Nurturing",
    subStage: "Call Patient",
    lastContactedDate: "24 April 2024",
    totalNumberOfCall: 8,
    totalNumberOfAttendedCall: 5,
    totalNumberOfAuditCall: 3,
    probabilty: 100,
    totalComments: 6,
    auditValue: "Good"
  },
  {
    id: 6,
    name: "Simran Kaur",
    uhid: "UHI7842347625",
    gender: "F",
    age: "32",
    stage: "Contacted",
    subStage: "Create Estimate",
    lastContactedDate: "25 May 2024",
    totalNumberOfCall: 11,
    totalNumberOfAttendedCall: 7,
    totalNumberOfAuditCall: 2,
    probabilty: 25,
    totalComments: 3,
    auditValue: "Bad"
  },

  {
    id: 7,
    name: "Rajiv Thakur",
    uhid: "UHI7842347275",
    gender: "M",
    age: "21",
    stage: "Nurturing",
    subStage: "Call Patient",
    lastContactedDate: "24 April 2024",
    totalNumberOfCall: 8,
    totalNumberOfAttendedCall: 5,
    totalNumberOfAuditCall: 3,
    probabilty: 100,
    totalComments: 6,
    auditValue: "Good"
  },
  {
    id: 8,
    name: "Simran Kaur",
    uhid: "UHI7842347625",
    gender: "F",
    age: "32",
    stage: "Contacted",
    subStage: "Create Estimate",
    lastContactedDate: "25 May 2024",
    totalNumberOfCall: 11,
    totalNumberOfAttendedCall: 7,
    totalNumberOfAuditCall: 2,
    probabilty: 25,
    totalComments: 3,
    auditValue: "Bad"
  }, {
    id: 9,
    name: "Rajiv Thakur",
    uhid: "UHI7842347275",
    gender: "M",
    age: "21",
    stage: "Nurturing",
    subStage: "Call Patient",
    lastContactedDate: "24 April 2024",
    totalNumberOfCall: 8,
    totalNumberOfAttendedCall: 5,
    totalNumberOfAuditCall: 3,
    probabilty: 100,
    totalComments: 6,
    auditValue: "Good"
  },
  {
    id: 10,
    name: "Simran Kaur",
    uhid: "UHI7842347625",
    gender: "F",
    age: "32",
    stage: "Contacted",
    subStage: "Create Estimate",
    lastContactedDate: "25 May 2024",
    totalNumberOfCall: 11,
    totalNumberOfAttendedCall: 7,
    totalNumberOfAuditCall: 2,
    probabilty: 25,
    totalComments: 3,
    auditValue: "Bad"
  },

  {
    id: 11,
    name: "Rajiv Thakur",
    uhid: "UHI7842347275",
    gender: "M",
    age: "21",
    stage: "Nurturing",
    subStage: "Call Patient",
    lastContactedDate: "24 April 2024",
    totalNumberOfCall: 8,
    totalNumberOfAttendedCall: 5,
    totalNumberOfAuditCall: 3,
    probabilty: 100,
    totalComments: 6,
    auditValue: "Good"
  },
  {
    id: 12,
    name: "Simran Kaur",
    uhid: "UHI7842347625",
    gender: "F",
    age: "32",
    stage: "Contacted",
    subStage: "Create Estimate",
    lastContactedDate: "25 May 2024",
    totalNumberOfCall: 11,
    totalNumberOfAttendedCall: 7,
    totalNumberOfAuditCall: 2,
    probabilty: 25,
    totalComments: 3,
    auditValue: "Bad"
  },

];

const Audit: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuditor } = useTicketStore();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [openStageFilter, setOpenStageFilter] = useState(false);
  const [openAuditValueFilter, setOpenAuditValueFilter] = useState(false);
  const [openAgentNameFilter, setOpenAgentNameFilter] = useState(false);


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const offset = (currentPage - 1) * itemsPerPage;
  const currentPageData = sampleAuditData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sampleAuditData.length / itemsPerPage);


  return (
    <Box className={styles.Audit_container}>

      <Stack className={styles.Audit_container_title} >
        Audit
      </Stack>

      <Box className={styles.Audit_filters_container}>

        <Box className={styles.Audit_filters_left}>

          {/* Date Filters */}
          <Stack>
            <DatePicker.RangePicker
              style={datePickerStyle}
            />
            <style>{`
                    .ant-picker-range .ant-picker-input input::placeholder {
                     color: black; /* Change this to your desired color */
                    }
                   `}</style>

          </Stack>

          {/* Stage Filter */}
          <Stack className={styles.Audit_stage_filter}>
            <Stack className={styles.Audit_filters} onClick={() => {
              setOpenStageFilter(!openStageFilter);
              setOpenAuditValueFilter(false);
              setOpenAgentNameFilter(false);
            }}>
              <span className={styles.Audit_filters_title}>
                {/* {pharmacyOrderStatusFilter ? pharmacyOrderStatusFilter === "Pending" ? "Processing" : pharmacyOrderStatusFilter : "All Orders"} */}
                Stages
                {/* All Orders */}
              </span>
              <span className={styles.Audit_filters_icon}><img src={ArrowDownIcon} alt="Arrow-Down" /></span>
            </Stack >
            <Stack display={openStageFilter ? "block" : "none"}
              className={styles.Audit_filters_options} bgcolor="white"
            >
              <MenuItem sx={menuItemStyles}
              // onClick={() => handleOrderTypeStatusFilter("Pending")}
              >
                New Lead
              </MenuItem>
              <MenuItem
                sx={menuItemStyles}
              // onClick={() => handleOrderTypeStatusFilter("Ready")}
              >
                Contacted
              </MenuItem>
              <MenuItem
                sx={menuItemStyles}
              // onClick={() => handleOrderTypeStatusFilter("Ready")}
              >
                Working
              </MenuItem>
              <MenuItem
                sx={menuItemStyles}
              // onClick={() => handleOrderTypeStatusFilter("Ready")}
              >
                Orientation
              </MenuItem>
              <MenuItem
                sx={menuItemStyles}
              // onClick={() => handleOrderTypeStatusFilter("Ready")}
              >
                Nurturing
              </MenuItem>
            </Stack>
          </Stack>

          {/* Audit Value Filters */}
          <Stack className={styles.Audit_stage_filter}>
            <Stack className={styles.Audit_filters} onClick={() => {
              setOpenAuditValueFilter(!openAuditValueFilter);
              setOpenStageFilter(false);
              setOpenAgentNameFilter(false);
            }}>
              <span className={styles.Audit_filters_title}>
                {/* {pharmacyOrderStatusFilter ? pharmacyOrderStatusFilter === "Pending" ? "Processing" : pharmacyOrderStatusFilter : "All Orders"} */}
                Audit Value
                {/* All Orders */}
              </span>
              <span className={styles.Audit_filters_icon}><img src={ArrowDownIcon} alt="Arrow-Down" /></span>
            </Stack>
            <Stack display={openAuditValueFilter ? "block" : "none"}
              className={styles.Audit_filters_options} bgcolor="white"
            >
              <MenuItem sx={menuItemStyles} >
                Good
              </MenuItem>
              <MenuItem
                sx={menuItemStyles}>
                Bad
              </MenuItem>

            </Stack>
          </Stack>

          {/* Agent Name Filters */}
          <Stack className={styles.Audit_stage_filter}>
            <Stack className={styles.Audit_filters} onClick={() => {
              setOpenAgentNameFilter(!openAgentNameFilter);
              setOpenAuditValueFilter(false);
              setOpenStageFilter(false);
            }}>
              <span className={styles.Audit_filters_title}>
                Agent Name
              </span>
              <span className={styles.Audit_filters_icon}><img src={ArrowDownIcon} alt="Arrow-Down" /></span>
            </Stack>
            <Stack display={openAgentNameFilter ? "block" : "none"}
              className={styles.Audit_filters_options} bgcolor="white"
            >
              <MenuItem sx={menuItemStyles} >
                Sachin Foa
              </MenuItem>
              <MenuItem
                sx={menuItemStyles}>
                Ayush Jain
              </MenuItem>

            </Stack>
          </Stack>

        </Box>

        {/* Search Filters */}
        <Stack className={styles.search}>
          <div className={styles.search_container}>
            <span className={styles.search_icon}><SearchIcon /></span>
            <input type="text"
              className={styles.search_input}
              placeholder=" Search..."
            />
          </div>
        </Stack>

      </Box>

      <Box className={styles.Audit_table_container}>

        <Box height={'100%'}>
          <table className={styles.Audit_table} style={{
            height: '95%'
          }}>
            <Box sx={{ position: "sticky" }}>
              <thead>
                <tr className={styles.Audit_table_head}>
                  <th className={styles.Audit_table_head_item1}> <img src={CheckBoxIcon} /> </th>
                  <th className={`${styles.Audit_table_head_item}`}>
                    Lead
                    <Stack sx={{ marginLeft: "5px", marginTop: "2px" }}>
                      <img src={SortArrowIcon} alt="sortArrow" />
                    </Stack>
                  </th>
                  <th className={`${styles.Audit_table_head_item} ${styles.item2}`}>Stage</th>
                  <th className={`${styles.Audit_table_head_item} ${styles.item3}`}>Last Contacted</th>
                  <th className={`${styles.Audit_table_head_item} ${styles.item4}`}>Calls</th>
                  <th className={`${styles.Audit_table_head_item} ${styles.item5}`}>Probabilty</th>
                  <th className={`${styles.Audit_table_head_item} ${styles.item6}`}>Comments</th>
                  <th className={`${styles.Audit_table_head_item} ${styles.item7}`}>Audit Value</th>
                  <th className={`${styles.Audit_table_head_item} ${styles.item8}`}>Assignee</th>
                  {/* Add other headers as needed */}
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
                {currentPageData.map(item => (
                  <tr key={item.id} className={styles.Audit_table_body}
                    onClick={() => {
                      setIsAuditor(true);
                      navigate(`/auditSingleTicketDetail/${"6652bf7accee77aaeaf8afb2"}`);
                    }}>
                    <td className={styles.Audit_table_body_item1}>
                      <img src={CheckBoxIcon} />
                    </td>
                    {/* Lead */}
                    <td className={`${styles.Audit_table_body_item}`}>

                      <Stack display={'flex'} flexDirection={'row'} gap={'8px'}>
                        <Stack className={styles.Audit_name}>
                          {item.name}
                        </Stack>
                        <Stack className={styles.Audit_GenAge}>
                          <Stack className={styles.Audit_Gen}>{item.gender}</Stack>
                          <Stack className={styles.Audit_Age}> {item.age}</Stack>
                        </Stack>
                      </Stack>
                      <Stack className={styles.Audit_uhid}>
                        #{item.uhid}
                      </Stack>

                    </td>

                    {/* Stage */}
                    <td className={`${styles.Audit_table_body_item} ${styles.body_item2}`}>
                      <Stack className={styles.Audit_stage}>
                        {item.stage}
                      </Stack>
                      <Stack sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: '4px'
                      }}
                      >
                        <Stack className={styles.Audit_connectorIcon}>
                          <img src={ConnectorIcon} />
                        </Stack>
                        <Stack className={styles.Audit_substage}>
                          {item.subStage}
                        </Stack>
                      </Stack>
                    </td>

                    {/* Last Contacted */}
                    <td className={`${styles.Audit_table_body_item} ${styles.body_item3}`}>
                      <Stack className={styles.Audit_last_date}>
                        {item.lastContactedDate}
                      </Stack>
                    </td>

                    {/* Calls */}
                    <td className={`${styles.Audit_table_body_item} ${styles.body_item4}`}>
                      <Stack display={"flex"} flexDirection={"row"} gap={"16px"}>
                        <LightTooltip
                          title="Total Calls"

                          disableInteractive
                          placement="top"
                          TransitionComponent={Zoom}
                        >
                          <Stack className={styles.Audit_CallValues}>
                            <Stack className={styles.Audit_CallIcon}><img src={TotalCallIcon} /></Stack>
                            <Stack className={styles.Audit_call_value}>{item.totalNumberOfCall}</Stack>
                          </Stack>
                        </LightTooltip>
                        <LightTooltip
                          title="Recieved Calls"
                          disableInteractive
                          placement="top"
                          TransitionComponent={Zoom}
                        >
                          <Stack className={styles.Audit_CallValues}>
                            <Stack className={styles.Audit_CallIcon}><img src={TotalRecievedCallIcon} /></Stack>
                            <Stack className={styles.Audit_call_value}>{item.totalNumberOfAttendedCall}</Stack>
                          </Stack>
                        </LightTooltip>
                        <LightTooltip
                          title="Audit Calls"
                          disableInteractive
                          placement="top"
                          TransitionComponent={Zoom}
                        >
                          <Stack className={styles.Audit_CallValues}>
                            <Stack className={styles.Audit_CallIcon}><img src={AuditCallIcon} /></Stack>
                            <Stack className={styles.Audit_call_value}>{item.totalNumberOfAuditCall}</Stack>
                          </Stack>
                        </LightTooltip>
                      </Stack>
                    </td>

                    {/* Probabilty */}
                    <td className={`${styles.Audit_table_body_item} ${styles.body_item5}`}>

                      <Stack className={styles.Audit_Prob}
                        sx={{
                          color: getColor(item.probabilty),
                          backgroundColor: getBackgroundColor(item.probabilty),
                        }}
                      > {item.probabilty}%</Stack>

                    </td>

                    {/* Comments */}
                    <td className={`${styles.Audit_table_body_item} ${styles.body_item6}`}>
                      <Stack className={styles.Audit_commentValue}>
                        <Stack className={styles.Audit_call_value}>{item.totalComments}</Stack>
                        <Stack className={styles.Audit_CallIcon}><img src={CommentIcon} /></Stack>
                      </Stack>
                    </td>

                    {/* Audit Value */}
                    <td className={`${styles.Audit_table_body_item} ${styles.body_item7}`}>
                      <Stack className={styles.Audit_Audit_value}
                        sx={{
                          color: getAuditValueColor(item.auditValue),
                          backgroundColor: getAuditValueBackgroundColor(item.auditValue),
                        }}
                      > {item.auditValue !== "" ? item.auditValue == "Good" ? <img src={LikeIcon} /> : <img src={DislikeIcon} /> : "-"} {item.auditValue}</Stack>
                    </td>

                    {/* Assignee */}
                    <td className={`${styles.Audit_table_body_item} ${styles.body_item8}`}>
                      <Stack className={styles.Audit_assigne_avatar}>
                        <Stack>
                          <img src={Avatar1} />
                        </Stack>
                        <Stack className={styles.Audit_assigne_Avatar2}>
                          <img src={Avatar2} />
                        </Stack>
                      </Stack>
                    </td>

                  </tr>
                ))}
              </tbody>
            </Box>

            <Box className={styles.Audit_pagination}>
              <Pagination
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
              />
            </Box>
          </table>


        </Box>



      </Box>


    </Box>
  );
};

export default Audit;
