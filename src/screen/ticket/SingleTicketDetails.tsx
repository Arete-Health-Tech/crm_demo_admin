/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Add,
  Call,
  CoronavirusOutlined,
  Female,
  InfoOutlined,
  Male,
  MedicalServicesOutlined,
  PendingActionsOutlined,
  ReceiptLongOutlined,
  Transgender
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Fab,
  // IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  TextField,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogContentText,
  Paper,
  Avatar,
  IconButton
} from '@mui/material';
import styles from './SingleTicketDetails.module.css';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import assignedDropDown from '../../assets/assignedDropDown.svg';
import avatar1 from '../../assets/avatar1.svg';
import avatar2 from '../../assets/avatar2.svg';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useTicketStore from '../../store/ticketStore';
import { iCallRescheduler, iReminder, iTicket } from '../../types/store/ticket';
import StageCard from './widgets/StageCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ageSetter } from '../../utils/ageReturn';
import Estimate from './widgets/Estimate';
import useServiceStore from '../../store/serviceStore';
import { getDoctorsHandler } from '../../api/doctor/doctorHandler';
import {
  getStagesHandler,
  getSubStagesHandler
} from '../../api/stages/stagesHandler';
import Rx from '../../assets/Rx.svg';
import Bulb from '../../assets/Vector.svg';
import NotesWidget from './widgets/NotesWidget';
import { iDepartment, iDoctor, iScript } from '../../types/store/service';
import QueryResolutionWidget from './widgets/QueryResolutionWidget';
import { getSingleScript } from '../../api/script/script';
import PrescriptionTabsWidget from './widgets/PrescriptionTabsWidget';
import AddNewTaskWidget from './widgets/AddNewTaskWidget';
import {
  getAllReminderHandler,
  getTicketHandler
} from '../../api/ticket/ticketHandler';
import MessagingWidget from './widgets/whatsapp/WhatsappWidget';
import ShowPrescription from './widgets/ShowPrescriptionModal';
import { updateTicketSubStage } from '../../api/ticket/ticket';
import { UNDEFINED } from '../../constantUtils/constant';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FormControlLabel from '@mui/material/FormControlLabel';
import PDFDocument from '@react-pdf/pdfkit';
import { Document, Page } from 'react-pdf';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosTwoToneIcon from '@mui/icons-material/ArrowForwardIosTwoTone';
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined';

import AWS from 'aws-sdk';
import CustomModal from './widgets/CustomModal';
import { apiClient } from '../../api/apiClient';
import ReschedulerAll from './widgets/ReschedulerAll';
import RemainderAll from './widgets/RemainderAll';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Activities from './widgets/Activities/Activities';
import SmsWidget from './widgets/SmsWidget/SmsWidget';
import PhoneWidget from './widgets/PhoneWidget/PhoneWidget';

const questions = [
  {
    question:
      '	Hi (Patient Name), I am (Agent Name) from Manipal Hospital. Are you comfortable in Hindi or English?',
    responses: ['English', 'Hindi']
  },

  {
    question:
      '	How are you sir? I am calling regarding your admission planned under (Dr. Name) for (Surgery Name) or (Medical Management). What is your preferred date of admission? ',
    responses: [
      'I haven’t made up my mind/ still thinking/ will let you know',
      'Yes, Next week'
    ]
  },
  {
    question:
      'Very well sir, I understand that this is an important decision. From Medanta, I am here to help you in any way possible. Do you have any questions related to your surgery / admission (in case of medical management)?',
    responses: ['Yes', 'No']
  },
  {
    question: '	Tick the Surgical Concerns ',
    responses: [
      'Fear of Surgery',
      'Fear of Hospitalisation',
      'Fear of Pain',
      'Fear of Anaesthesia',
      'Fear of Long Recovery period',
      'Fear of Change in Body Image',
      'Mental Health Concerns',
      'Success Fear ',
      'Fear of Complications',
      'Fear of Finances'
    ]
  },
  {
    question:
      'Is there a preferred date sir/madam? (Mark the date in system).Sure sir, Can you please confirm your mode of payment?',

    responses: ['Cash', 'Insurance', 'Panel']
  },
  {
    question: '	Have you been given a Bill Estimate',
    responses: ['Yes', 'No']
  },
  {
    question:
      'I am initiating an RFA for you. Please mark an advance deposit of 10 thousand rupees to book your bed'
    // responses: ['Cash', 'CGHS/ECHS', 'Corporate', 'NSG', 'TPA']
  },
  // {
  //   question: '	Tick the Surgical Concerns ',
  //   responses: [
  //     'Fear of Surgery',
  //     'Fear of Hospitalisation',
  //     'Fear of Pain',
  //     'Fear of Anaesthesia',
  //     'Fear of Long Recovery period',
  //     'Fear of Change in Body Image',
  //     'Mental Health Concerns',
  //     'Success Fear ',
  //     'Fear of Complications',
  //     'Fear of Finances'
  //   ]
  // },
  {
    question: 'Does the patient have any Caregiver at',
    responses: ['Yes', 'No']
  },
  {
    question: 'Did you Inform the Next Follow-up date to Patient',
    responses: ['Yes', 'No']
  }

  // Add more questions as needed
];
interface iConsumer {
  uid: string;
  firstName: string;
  lastName: string;
  phone: number;
  age: number;
  gender: string;

  // Add other fields as needed
}

interface Ticket {
  consumer: iConsumer[];
  // Add other fields as needed
}

dayjs.extend(relativeTime);

type Props = {};

const SingleTicketDetails = (props: Props) => {
  const { ticketID } = useParams();
  const {
    tickets,
    filterTickets,
    reminders,
    pageNumber,
    searchByName,
    callRescheduler,
    estimates
  } = useTicketStore();
  const { doctors, departments, stages } = useServiceStore();
  const [currentTicket, setCurrentTicket] = useState<iTicket>();
  const [value, setValue] = useState('1');
  const [script, setScript] = useState<iScript>();
  const [isScript, setIsScript] = useState(false);
  const [ticketUpdateFlag, setTicketUpdateFlag] = useState({});
  const [singleReminder, setSingleReminder] = useState<iReminder[] | any[]>([]);
  const [callReschedule, setCallReschedule] = useState<
    iCallRescheduler[] | any[]
  >([]);

  const theme = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedResponses, setSelectedResponses] = useState({});
  const [pdfUrl, setPdfUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedConsumer, setEditedConsumer] = useState<iConsumer>({
    uid: '',
    firstName: '',
    lastName: '',
    phone: 0,
    age: 0,
    gender: ''
    // Add other fields as needed
  });

  const [openModal, setOpenModal] = useState(false);
  const [modalOpenRemainder, setModalOpenRemainder] = useState(false);
  const [modalOpenRescheduler, setModalOpenRescheduler] = useState(false);
  const [matchedObjects, setMatchedObjects] = useState([]);
  const [callReschedulerData, setCallReschedulerData] = useState([]);

  // for version2
  const [assignees, setAssignees] = useState([
    { id: 1, name: 'Jenny Wilson', role: 'Ticket Owner' },
    { id: 2, name: 'Marvin McKinney', role: '' },
    { id: 3, name: 'Courtney Henry', role: '' },
    { id: 4, name: 'Floyd Miles', role: '' },
    { id: 5, name: 'Dianne Russell', role: '' },
    { id: 6, name: 'Robert Fox', role: '' }
  ]);
  const [filter, setFilter] = useState('');
  const [visible, setVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // console.log(currentTicket?.consumer[0]?.age,"this is current ticket")
  // console.log(currentTicket,"this is current ticet")
  // console.log(callRescheduler, ' this is call rescheduler ');
  // remove hanlePhoneCall in FE. post changes of phone call in backend is pending...

  // const handlePhoneCall = async (e: React.SyntheticEvent) => {
  //   const desiredStage = '6494196d698ecd9a9db95e3a';
  //   const currentStage = currentTicket?.stage;
  //   if (currentStage === desiredStage) {
  //     const currentSubStageCode = currentTicket?.subStageCode?.code;

  //     const stageDetail: any = stages?.find(
  //       ({ _id }) => currentTicket?.stage === _id
  //     );
  //     const noOfChilds = stageDetail?.child?.length || 3;
  //     if (
  //       currentSubStageCode &&
  //       (!currentTicket?.prescription[0].admission ||
  //         currentSubStageCode > noOfChilds - 3) &&
  //       currentSubStageCode < noOfChilds
  //     ) {
  //       setOpen(true); // Open the modal

  //       const payload = {
  //         subStageCode: {
  //           active: true,
  //           code: 3
  //         },
  //         ticket: currentTicket?._id
  //       };

  //       const result = await updateTicketSubStage(payload);
  //       setTimeout(() => {
  //         (async () => {
  //           await getTicketHandler(
  //             searchByName,
  //             pageNumber,
  //             'false',
  //             filterTickets
  //           );
  //           setTicketUpdateFlag(result);
  //         })();
  //       }, 1000);
  //     }
  //   }else {
  //      const currentSubStageCode = currentTicket?.subStageCode?.code;

  //      const stageDetail: any = stages?.find(
  //        ({ _id }) => currentTicket?.stage === _id
  //      );
  //      const noOfChilds = stageDetail?.child?.length || 3;
  //      if (
  //        currentSubStageCode &&
  //        (!currentTicket?.prescription[0].admission ||
  //          currentSubStageCode > noOfChilds - 3) &&
  //        currentSubStageCode < noOfChilds
  //      ) {

  //        const payload = {
  //          subStageCode: {
  //            active: true,
  //            code: 3
  //          },
  //          ticket: currentTicket?._id
  //        };

  //        const result = await updateTicketSubStage(payload);
  //        setTimeout(() => {
  //          (async () => {
  //            await getTicketHandler(
  //              searchByName,
  //              pageNumber,
  //              'false',
  //              filterTickets
  //            );
  //            setTicketUpdateFlag(result);
  //          })();
  //        }, 1000);
  //      }
  //   }
  // }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleResponseClick = (response) => {
    setSelectedResponses((prevSelectedResponses) => ({
      ...prevSelectedResponses,
      [currentQuestionIndex]: response
    }));
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const getTicketInfo = (ticketID: string | undefined) => {
    const fetchTicket = tickets.find((element) => ticketID === element._id);
    // console.log(fetchTicket," this is refetched dsfgsdgsdghsdhsdfh");
    setCurrentTicket(fetchTicket);
    return fetchTicket;
  };

  useEffect(() => {
    (async function () {
      const ticketData = getTicketInfo(ticketID);
      // console.log(ticketData," thi s is ticket Data")
      if (currentTicket) {
        setSingleReminder([]);
        setCallReschedule([]);
        const script = await getSingleScript(
          currentTicket?.prescription[0]?.service?._id,
          currentTicket?.stage
        );
        reminders?.map((data) => {
          // console.log("maping", data?.ticket === ticketData?._id);
          if (data?.ticket === ticketData?._id) {
            setSingleReminder([...singleReminder, data]);
          }
        });
        callRescheduler?.map((data) => {
          // console.log("maping", data?.ticket === ticketData?._id);
          if (data?.ticket === ticketData?._id) {
            setCallReschedule([...callReschedule, data]);
          }
        });

        setScript(script);
      }
    })();
  }, [
    ticketID,
    tickets,
    currentTicket,
    ticketUpdateFlag,
    reminders.length,
    reminders,
    // currentTicket?.stage,
    callRescheduler.length,
    callRescheduler
  ]);

  const doctorSetter = (id: string) => {
    return doctors.find((doctor: iDoctor) => doctor._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((department: iDepartment) => department._id === id)
      ?.name;
  };

  function getConsumerIdByDataId(dataArray, dataIdToMatch) {
    for (const obj of dataArray) {
      if (obj._id === dataIdToMatch) {
        return obj.consumer[0]?._id;
      }
    }
    return null; // Return null if no matching dataId found in the data array
  }

  function getEstimateIdByDataId(dataArray, dataIdToMatch) {
    for (const obj of dataArray) {
      if (obj._id === dataIdToMatch) {
        return obj.estimate[0]?._id;
      }
    }
    return null; // Return null if no matching dataId found in the data array
  }

  const consumerId = getConsumerIdByDataId(tickets, ticketID);
  const estimateId = getEstimateIdByDataId(tickets, ticketID);

  const fetchPdfUrl = async () => {
    if (currentTicket?.location) {
      window.open(currentTicket.location, '_blank');
    } else {
      alert('Please create an estimate.');
    }
  };

  const handleIconClickRemainder = async () => {
    try {
      const { data } = await apiClient.get('/task/ticketRemainder', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const filteredData = data.filter((val) => val.ticket === ticketID);
      setMatchedObjects(filteredData);
      setModalOpenRemainder(true);
      if (filteredData.length === 0) {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Now you can access matchedObjects outside the function
  // For example
  const handleIconClickCallRescheduler = async () => {
    try {
      const { data } = await apiClient.get('/task/ticketReschedluer', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const filteredData = data.filter((val) => val.ticket === ticketID);
      setCallReschedulerData(filteredData);
      setModalOpenRescheduler(true);
      if (filteredData.length === 0) {
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCloseModal = () => {
    // Close the modal
    setModalOpenRemainder(false);
    setModalOpenRescheduler(false);
  };

  // console.log(currentTicket," thi sisi currentTicket")

  // for lead assigne
  const handleAddAssignee = (id) => {
    const newAssignees = assignees.map((assignee) =>
      assignee.id === id ? { ...assignee, role: 'New Role' } : assignee
    );
    setAssignees(newAssignees);
  };

  const handleRemoveAssignee = (id) => {
    const newAssignees = assignees.map((assignee) =>
      assignee.id === id ? { ...assignee, role: '' } : assignee
    );
    setAssignees(newAssignees);
  };

  const handleSearch = (event) => {
    setFilter(event.target.value);
  };

  const filteredAssignees = assignees.filter((assignee) =>
    assignee.name.toLowerCase().includes(filter.toLowerCase())
  );
  const opens = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Stack height={'100vh'} direction="row" p={1}>
      <Box width="60%">
        {/* This box is for lead header start*/}
        <Box
          height="10vh"
          p={1}
          borderBottom={0.5}
          borderLeft={0.5}
          borderColor="#F0F0F0"
          display="flex"
          justifyContent="space-between"
          bgcolor="white"
          alignItems="center"
        >
          {/* This Box is for name ,uhid,age and gender */}
          <Box width="32%" display="flex">
            <Box>
              <Box display="flex" alignItems={'center'} textAlign={'center'} width="12rem">
                <Suspense fallback="Loading...">
                  <Typography
                    textTransform="capitalize"
                    fontSize={'1.125rem'}
                    fontWeight={600}
                    fontFamily={'Outfit, sans-serif'}
                    color={'#000'}
                    width="auto"
                    overflow="hidden"
                  >
                    {currentTicket?.consumer[0].firstName}
                    {currentTicket?.consumer[0].lastName}
                  </Typography>
                </Suspense>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2,1fr)"
                  paddingLeft="0.5rem"
                >
                  {currentTicket?.consumer[0].gender === 'M' ? (
                    <Box display="flex" alignItems="center">
                      {/* <Male fontSize="inherit" />{' '} */}
                      <Typography className={styles.gender}>M</Typography>{' '}
                    </Box>
                  ) : currentTicket?.consumer[0].gender === 'F' ? (
                    <Box display="flex" alignItems="center">
                      {/* <Female fontSize="inherit" />{' '} */}
                      <Typography className={styles.gender}>F</Typography>{' '}
                    </Box>
                  ) : currentTicket?.consumer[0].gender === 'O' ? (
                    <Box>
                      {/* <Transgender /> */}
                      <Typography className={styles.gender}>O</Typography>
                    </Box>
                  ) : ''}
                </Box>
                <Typography fontSize="small">
                  {currentTicket?.consumer[0].dob
                    ? ageSetter(currentTicket.consumer[0].dob)[0] +
                    ageSetter(currentTicket.consumer[0].dob)[1]
                    : ''}
                </Typography>
              </Box>
              <Box
                display="grid"
                gridTemplateColumns="repeat(5, 1fr)"
                columnGap={2}
                color={'var(--Text-Light-Grey, #647491)'}
                fontFamily={'Outfit, sans-serif'}
                fontSize={'12px'}
                fontWeight={400}
              >
                <Typography
                  variant="body1"
                  sx={{ fontSize: '.9rem', whiteSpace: 'nowrap' }}
                >
                  #UHI{currentTicket?.consumer[0]?.uid}
                </Typography>
              </Box>
            </Box>
            <Box>
              <CustomModal />
            </Box>
          </Box>

          {/* This Box is for lead assign , lead age and three dots */}

          <Box
            width="35%"
            display={'flex '}
            justifyContent="space-evenly"
            alignItems="center"
          >
            <div>
              <Paper elevation={4} id={styles.paper}>
                <Stack
                  direction="row"
                  alignItems="center"
                  style={{ padding: '4px 8px' }}
                >
                  <Avatar id={styles.avatar} src={avatar1} alt="User 1" />
                  <Avatar id={styles.avatar} src={avatar2} alt="User 2" />
                  <img
                    id={styles.assignedDropdown}
                    src={assignedDropDown}
                    alt=""
                    onClick={() => setVisible(!visible)}
                  />
                </Stack>
              </Paper>
              <div>
                {visible && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <span>Ticket Assignees</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Search"
                      onChange={handleSearch}
                    />
                    <ul>
                      {filteredAssignees.map((assignee) => (
                        <li key={assignee.id}>
                          {assignee.name} ({assignee.role || 'No Role Assigned'}
                          )
                          {assignee.role ? (
                            <button
                              onClick={() => handleRemoveAssignee(assignee.id)}
                            >
                              -
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddAssignee(assignee.id)}
                            >
                              +
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => (
                        setAssignees(assignees), setVisible(false)
                      )}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.leadAge}>
              {dayjs(currentTicket?.createdAt).fromNow()}
            </div>
            <div>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={opens ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={opens ? 'true' : undefined}
                >
                  <MoreHorizIcon />
                </IconButton>
              </Box>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={opens}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                PaperProps={{
                  style: {
                    width: '10vw',
                    marginTop: '2rem'
                  }
                }}
              >
                <MenuItem className={styles.estimationHeader}>
                  ESTIMATION
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  className={styles.estimationHeaderMenu}
                >
                  Create Estimation
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  className={styles.estimationHeaderMenu}
                >
                  Skip Estimation
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  className={styles.estimationHeaderMenu}
                >
                  Set Priority
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  className={styles.estimationHeaderMenu}
                >
                  Add Surgery
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  className={styles.estimationHeaderMenu}
                >
                  Initiate RFA
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  className={styles.estimationHeaderMenuClose}
                >
                  Close Lead{' '}
                </MenuItem>
              </Menu>
            </div>
          </Box>
        </Box>
        {/* This box is for lead header end*/}

        <Stack bgcolor="#F1F5F7" height="90vh" direction="column">
          <Box height="28%">
            <Box bgcolor={'white'} p={1.5}>
              <StageCard
                currentTicket={currentTicket}
                setTicketUpdateFlag={setTicketUpdateFlag}
              />
            </Box>
          </Box>
          <Box
            height="100%"
            style={{ marginBottom: '20px' }}
            position="relative"
            bgcolor="#F1F5F7"
          >
            <TabContext value={value}>
              <Box
                sx={{ borderBottom: 1, borderColor: 'divider' }}
                bgcolor="white"
              >
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                // variant="scrollable"
                // scrollButtons="auto"
                // aria-label="scrollable auto tabs example"
                >
                  <Tab
                    label="Activities"
                    value="1"
                    className={
                      value == '1' ? styles.selectedTab : styles.tabsLabel
                    }
                  />
                  <Tab
                    label="Whatsapp"
                    value="2"
                    className={
                      value == '2' ? styles.selectedTab : styles.tabsLabel
                    }
                  />
                  <Tab
                    label="Email"
                    value="3"
                    className={
                      value == '3' ? styles.selectedTab : styles.tabsLabel
                    }
                  />
                  <Tab
                    label="SMS"
                    value="4"
                    className={
                      value == '4' ? styles.selectedTab : styles.tabsLabel
                    }
                  />
                  <Tab
                    label="Phone Calls"
                    value="5"
                    className={
                      value == '5' ? styles.selectedTab : styles.tabsLabel
                    }
                  />
                  <Tab
                    label="Query Resolution"
                    value="6"
                    className={
                      value == '6' ? styles.selectedTab : styles.tabsLabel
                    }
                  />
                  <Tab
                    label="Notes"
                    value="7"
                    className={
                      value == '7' ? styles.selectedTab : styles.tabsLabel
                    }
                  />
                  {/* <Tab label="Query Resolution" value="3" /> */}
                </TabList>
              </Box>
              <Box sx={{ p: 0, height: '100%', bgcolor: 'white' }}>
                <TabPanel value="1" style={{ paddingRight: 0 }}>
                  <Activities />
                </TabPanel>
                <TabPanel value="2" style={{ padding: 0 }}>
                  <MessagingWidget />
                </TabPanel>
                <TabPanel value="3" style={{ padding: 0 }}>
                  {/* <QueryResolutionWidget /> */}
                </TabPanel>
                <TabPanel value="4" style={{ padding: 0, height: '100%' }}>
                  <SmsWidget />
                </TabPanel>
                <TabPanel value="5" style={{ padding: 0 }}>
                  <PhoneWidget />
                </TabPanel>
                <TabPanel value="6" style={{ padding: 0 }}>
                  <QueryResolutionWidget />
                </TabPanel>
                <TabPanel value="7" style={{ padding: 0 }}>
                  <NotesWidget setTicketUpdateFlag={setTicketUpdateFlag} />
                </TabPanel>
              </Box>
            </TabContext>
          </Box>
        </Stack>
      </Box>
      <Box width="40%" height="100vh" position="relative">
        <Box
          height="10vh"
          p={1}
          bgcolor="white"
          borderBottom={0.5}
          borderLeft={0.5}
          borderColor="#F0F0F0"
          display="flex"
          alignItems="center"
        >
          <Estimate setTicketUpdateFlag={setTicketUpdateFlag} />
        </Box>

        {isScript ? (
          <Box bgcolor="white" height="90vh">
            <Stack p={1}>
              <Typography variant="h6" fontWeight={500}>
                Script Name
              </Typography>

              <Box
                sx={{
                  overflowY: 'scroll',
                  '&::-webkit-scrollbar ': {
                    display: 'none'
                  },
                  height: '100%'
                }}
              >
                <Typography>
                  {script ? script.text : 'Script Not Available'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ) : (
          <Box
            height="83vh"
            sx={{
              overflowX: 'scroll',
              '&::-webkit-scrollbar ': {
                display: 'none'
              }
            }}
          >
            {/* <Stack
              direction="row"
              spacing={2}
              p={1}
              sx={{
                overflowX: 'scroll',
                '&::-webkit-scrollbar ': {
                  display: 'none'
                }
              }}
            >
              <Chip label="Tasks" variant="outlined" color="info" />
              <Chip label="Appointments" variant="outlined" color="info" />
              <Chip label="Documents" variant="outlined" color="info" />
              <Chip label="Estimates" variant="outlined" color="info" />
              <Chip label="Prescriptsions" variant="outlined" color="info" />
            </Stack> */}

            <Stack borderRadius={2} m={1} bgcolor="white">
              <Box p={1} borderBottom={1} borderColor="#f5f5f5">
                <Typography
                  textTransform="uppercase"
                  variant="subtitle1"
                  fontWeight={500}
                >
                  Lead Details
                </Typography>
              </Box>
              <Box p={1}>
                <Stack direction="row" spacing={3} my={1}>
                  <MedicalServicesOutlined htmlColor="gray" />
                  <Typography textTransform={'capitalize'}>
                    {doctorSetter(currentTicket?.prescription[0].doctor!)}
                    {/* (
                    {departmentSetter(
                      currentTicket?.prescription[0].departments[0]!
                    )}
                    ) */}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3} my={1}>
                  <VaccinesOutlinedIcon htmlColor="gray" />
                  <Typography textTransform={'capitalize'}>
                    {departmentSetter(
                      currentTicket?.prescription[0].departments[0]!
                    )}
                  </Typography>
                </Stack>

                {currentTicket?.prescription[0].followUp && (
                  <Stack direction="row" spacing={3} my={1} alignItems="center">
                    <PendingActionsOutlined htmlColor="gray" />
                    <Typography>
                      {dayjs(currentTicket?.prescription[0].followUp).format(
                        'DD/MMM/YYYY '
                      )}
                      <Chip
                        color="primary"
                        label="Follow Up"
                        size="small"
                        sx={{ fontSize: '0.6rem' }}
                      />
                    </Typography>
                  </Stack>
                )}

                <Stack direction="row" spacing={3} my={1}>
                  <img src={Rx} alt="prescriptionIcon" />
                  <ShowPrescription
                    image={currentTicket?.prescription[0]?.image}
                    image1={currentTicket?.prescription[0]?.image1}
                  />
                </Stack>
              </Box>
            </Stack>
            <Stack borderRadius={2} m={1} bgcolor="white">
              <Box
                p={1}
                borderBottom={1}
                borderColor="#f5f5f5"
                display="flex"
                justifyContent="space-between"
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  textTransform="uppercase"
                >
                  Value and Payment Mode
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    disabled={currentTicket?.location ? false : true}
                    startIcon={<ReceiptLongOutlined />}
                    color="primary"
                    onClick={fetchPdfUrl}
                  >
                    View Estimate
                  </Button>
                  {pdfUrl && (
                    <Document file={pdfUrl}>
                      <Page pageNumber={1} />
                    </Document>
                  )}
                </Stack>
              </Box>
              {currentTicket?.estimate[0] ? (
                <Box p={1}>
                  <Stack direction="row" spacing={2}>
                    <Chip
                      color="error"
                      label={`₹${currentTicket?.estimate[0]?.total}`}
                      variant="outlined"
                      size="medium"
                      sx={{
                        fontSize: '1rem'
                      }}
                    />
                    {currentTicket?.estimate[0]?.paymentType ? (
                      <Chip
                        color={
                          currentTicket?.estimate[0].paymentType === 0 ||
                            currentTicket?.estimate[0].paymentType === 1 ||
                            currentTicket?.estimate[0].paymentType === 2
                            ? 'info'
                            : 'default'
                        }
                        label={
                          currentTicket?.estimate[0]?.paymentType === 0
                            ? 'Cash'
                            : currentTicket?.estimate[0]?.paymentType === 1
                              ? 'Insurance'
                              : currentTicket?.estimate[0]?.paymentType === 2
                                ? 'CGHS| ECHS'
                                : 'Payment Type Not Available'
                        }
                        variant="filled"
                        size="medium"
                        sx={{
                          fontSize: '1rem'
                        }}
                      />
                    ) : (
                      <Typography color="GrayText"></Typography>
                    )}
                  </Stack>
                </Box>
              ) : (
                <Box p={1}>No Estimate Available</Box>
              )}
            </Stack>
            <Stack borderRadius={2} m={1} bgcolor="white">
              {currentTicket ? (
                <PrescriptionTabsWidget currentTicket={currentTicket} />
              ) : (
                <Typography>Loading...</Typography>
              )}
            </Stack>
            <Grid container spacing={2}>
              {/* First Box */}
              <Grid item xs={6}>
                <Box
                  sx={{
                    overflowX: 'scroll',
                    '&::-webkit-scrollbar ': {
                      display: 'none'
                    }
                  }}
                  m={1}
                  borderRadius={2}
                  bgcolor="white"
                >
                  <Box p={1} borderBottom={1} borderColor="#f5f5f5">
                    <Grid container alignItems="center" spacing={1} my={1}>
                      <Grid item>
                        <Typography
                          textTransform="uppercase"
                          variant="subtitle1"
                          fontWeight={500}
                        >
                          Reminders
                        </Typography>
                      </Grid>
                      <Tooltip title="View All" style={{ marginLeft: '10px' }}>
                        <Grid item>
                          <ArrowForwardIosTwoToneIcon
                            onClick={handleIconClickRemainder}
                            style={{
                              fontSize: '18px',
                              marginBottom: '5px',
                              marginLeft: '80px'
                            }}
                          />
                        </Grid>
                      </Tooltip>
                      <Dialog
                        open={modalOpenRemainder}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                        fullWidth
                        maxWidth="md"
                      >
                        <DialogTitle id="modal-title">Remainders</DialogTitle>
                        <DialogContent>
                          <DialogContentText id="modal-description">
                            {matchedObjects ? (
                              matchedObjects.length > 0 ? (
                                <RemainderAll data={matchedObjects} />
                              ) : (
                                <Typography variant="body1">
                                  No reminders available
                                </Typography>
                              )
                            ) : (
                              <Typography variant="body1">
                                Loading...
                              </Typography>
                            )}
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleCloseModal}
                            variant="contained"
                            color="primary"
                          >
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Grid>
                  </Box>
                  <Box>
                    {singleReminder[0] ? (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={1}
                        bgcolor={'white'}
                        mb={1} // Optional: Add margin bottom for spacing between reminders
                      >
                        <Box>
                          <Typography>{singleReminder[0].title}</Typography>
                          <Chip
                            size="small"
                            variant="outlined"
                            color="primary"
                            label={dayjs(singleReminder[0].date).format(
                              'DD/MMM/YYYY hh:mm A'
                            )}
                          />
                        </Box>
                        <Box>
                          <Tooltip title={singleReminder[0].description}>
                            <InfoOutlined />
                          </Tooltip>
                        </Box>
                      </Box>
                    ) : (
                      <Typography p={1}>No Reminders Available</Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              {/* Second Box */}
              <Grid item xs={6}>
                <Box
                  sx={{
                    overflowX: 'scroll',
                    '&::-webkit-scrollbar ': {
                      display: 'none'
                    }
                  }}
                  m={1}
                  borderRadius={2}
                  bgcolor="white"
                >
                  <Box p={1} borderBottom={1} borderColor="#f5f5f5">
                    <Grid container alignItems="center" spacing={1} my={1}>
                      <Grid item>
                        <Typography
                          textTransform="uppercase"
                          variant="subtitle1"
                          fontWeight={500}
                        >
                          Callrescheduler
                        </Typography>
                      </Grid>
                      <Tooltip title="View All">
                        <Grid item>
                          <ArrowForwardIosTwoToneIcon
                            onClick={handleIconClickCallRescheduler}
                            style={{
                              fontSize: '18px',
                              marginBottom: '5px',
                              marginLeft: '10px'
                            }}
                          />
                        </Grid>
                      </Tooltip>
                      <Dialog
                        open={modalOpenRescheduler}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                        fullWidth
                        maxWidth="md"
                      >
                        <DialogTitle id="modal-title">
                          All Details Call Rescheduler{' '}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="modal-description">
                            {callReschedulerData ? (
                              callReschedulerData.length > 0 ? (
                                <ReschedulerAll data={callReschedulerData} />
                              ) : (
                                <Typography variant="body1">
                                  No Call Reschedule available
                                </Typography>
                              )
                            ) : (
                              <Typography variant="body1">
                                Loading...
                              </Typography>
                            )}
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleCloseModal}
                            variant="contained"
                            color="primary"
                          >
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Grid>
                  </Box>
                  <Box>
                    {callReschedule.length > 0 ? (
                      callReschedule.map((sed, index) => (
                        <Box
                          key={index}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={1}
                          bgcolor={'white'}
                          mb={1} // Optional: Add margin bottom for spacing between reminders
                        >
                          <Box>
                            <Typography>{sed.title}</Typography>
                            <Chip
                              size="small"
                              variant="outlined"
                              color="primary"
                              label={dayjs(sed.date).format(
                                'DD/MMM/YYYY hh:mm A'
                              )}
                            />
                          </Box>
                          <Box>
                            <Tooltip title={sed.description}>
                              <InfoOutlined />
                            </Tooltip>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography p={1}>No Call Schedule</Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Lead View  */}

        <Box
          height="7vh"
          p={1}
          width="100%"
          position="absolute"
          bottom={0}
          bgcolor="white"
          borderTop={0.5}
          borderLeft={0.5}
          borderColor="#F0F0F0"
          display="flex"
          justifyContent="space-between"
        >
          {/* <Button onClick={() => setIsScript((prev) => !prev)}>
            {!isScript ? 'View Agent Script' : 'Close Script '}
          </Button> */}
          <AddNewTaskWidget />
        </Box>
      </Box>
    </Stack>
  );
};

export default SingleTicketDetails;
