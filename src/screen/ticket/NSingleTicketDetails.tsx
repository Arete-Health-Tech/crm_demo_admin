/* eslint-disable jsx-a11y/alt-text */
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
    IconButton,
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
    Menu
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SearchIcon from '@mui/icons-material/Search';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useTicketStore from '../../store/ticketStore';
import { iCallRescheduler, iReminder, iTicket } from '../../types/store/ticket';
import dayjs from 'dayjs';
import StageCard from './widgets/StageCard';
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
import styles from './SingleTicketDetails.module.css'
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
import SingleTicketSideBar from './SingleTicketSideBar/SingleTicketSideBar';
import TaskBar from './SingleTicketSideBar/TaskBar';
import Avatar1 from "../../assets/Avatar.svg"
import Avatar2 from "../../assets/avatar2.svg"
import DropDownArrow from "../../assets/DropdownArror.svg"
import KebabMenu from "../../assets/KebabMenu.svg"
import AddAssigneeIcon from "../../assets/add.svg"
import CloseModalIcon from "../../assets/Group 48095853.svg"
import "./singleTicket.css";
import SearchBar from '../../container/layout/SearchBar';
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

const NSingleTicketDetails = (props: Props) => {
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
    const [callReschedule, setCallReschedule] = useState<iCallRescheduler[] | any[]>([]);

    const [open, setOpen] = useState(false);
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
        gender: '',
        // Add other fields as needed
    });

    const [openModal, setOpenModal] = useState(false);
    const [modalOpenRemainder, setModalOpenRemainder] = useState(false);
    const [modalOpenRescheduler, setModalOpenRescheduler] = useState(false)
    const [matchedObjects, setMatchedObjects] = useState([]);
    const [callReschedulerData, setCallReschedulerData] = useState([]);




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
        setOpen(false);
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
        setModalOpenRemainder(false);
        setModalOpenRescheduler(false);
    };

    // Reminder And Rescheduler Logic

    const compareTimestamps = (a, b) => a.date - b.date;

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

        const showAllReminderData = async () => {
            try {
                const { data } = await apiClient.get('/task/ticketRemainder', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const filteredData = data.filter((val) => val.ticket === ticketID);
                // console.log(filteredData, "reminder ");
                const sortedData = filteredData.sort(compareTimestamps).reverse();
                setMatchedObjects(sortedData);
                setModalOpenRemainder(true);
                if (filteredData.length === 0) {

                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const showAllCallRescheduler = async () => {
            try {
                const { data } = await apiClient.get('/task/ticketReschedluer', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const filteredData = data.filter((val) => val.ticket === ticketID);
                // console.log(filteredData, "rescheduler data");
                const sortedData = filteredData.sort(compareTimestamps).reverse();
                setCallReschedulerData(sortedData);
                setModalOpenRescheduler(true);
                if (filteredData.length === 0) {

                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        showAllReminderData();
        showAllCallRescheduler();
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

    const [visible, setVisible] = useState(false);
    const [isKebabMenu, setIsKebabMenu] = useState(false);
    const [op, setOp] = useState(false);

    const handleClick = () => {
        if (op == true) {
            setOp(false);

        } else {
            setOp(true);
            setVisible(false);
        }
    };

    const handleKebabClose = () => {
        setOp(false);
        setVisible(false);
    };

    const menuItemStyles = {
        color: "var(--Text-Black, #080F1A)",
        fontFamily: `"Outfit", sans-serif`,
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "150%",
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

    const patientName = (ticket) => {
        if (!ticket || !ticket.consumer || ticket.consumer.length === 0) {
            return '';
        }

        const firstName = ticket.consumer[0]?.firstName;
        const lastName = ticket.consumer[0]?.lastName;

        let patientName = '';
        if (firstName && lastName) {
            const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
            const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
            patientName = capitalizedFirstName + ' ' + capitalizedLastName;
        } else if (firstName) {
            patientName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        }

        return patientName;
    };

    const avatars = [
        { id: 1, src: Avatar1, alt: "User 1", name: "Robert Fox" },
        { id: 2, src: Avatar2, alt: "User 2", name: "Floyd Miles" },
        { id: 3, src: Avatar1, alt: "User 3", name: "Dianee Russel" },
        { id: 4, src: Avatar2, alt: "User 4", name: "Jack Andreson" },
        { id: 6, src: Avatar1, alt: "User 5", name: "Will Smith" }
    ];

    console.log("console in nsingleticlet")

    return (
        <div className="main-layout">

            {/* Right Section of Single Ticket Detail Page */}

            <div className="stack-box">
                <Box className="Ticket-detail-card" p={2}
                // position="sticky"
                >
                    {/* Left Side */}
                    <Stack className="Ticket-detail-card-left" display="flex" flexDirection="row" >

                        <Stack display="flex" flexDirection="column" >
                            <Stack display="flex" flexDirection="row">
                                <Stack className="Ticket-detail-card-left-name">
                                    {patientName(currentTicket)}
                                </Stack>
                                <Stack className="Ticket-detail-card-left-Gen-Age">
                                    {currentTicket?.consumer[0]?.gender ? (
                                        <Stack className='Gen-Age'>
                                            {currentTicket?.consumer[0]?.gender}
                                        </Stack>
                                    ) : (
                                        <></>
                                    )}
                                    {currentTicket?.consumer[0]?.age ? (
                                        <Stack className='Gen-Age'>
                                            {currentTicket?.consumer[0]?.age}
                                        </Stack>
                                    ) : (
                                        <></>
                                    )}
                                </Stack>

                            </Stack >
                            <Stack className="Ticket-detail-card-left-uhid" >
                                <span>#{currentTicket?.consumer[0]?.uid}</span>
                            </Stack>
                        </Stack>

                        {/* Calling */}

                        <CustomModal />

                        {/* End---- */}

                    </Stack>

                    {/* Right Side */}
                    <Stack className='Ticket-detail-card-right'>

                        {/* Lead Assignee */}


                        <Box className='Box-assignee' onClick={() => { setVisible(!visible); setOp(false); }}>
                            <Stack
                                direction="row"
                                alignItems="center"
                            >
                                <span className='avatar'> <Avatar src={Avatar1} alt="User 1" /></span>
                                <span className='avatar2 avatar'> <Avatar src={Avatar2} alt="User 2" /></span>
                                <span className='DropDownArrow' >
                                    <img
                                        src={DropDownArrow}
                                        alt=""
                                    />
                                </span>
                            </Stack>
                        </Box>

                        <Stack display={visible ? "block" : "none"}
                            className='KebabMenu-item ticket-assigneemenu' bgcolor="white">
                            <Stack className="Ticket-Assignee-title" sx={{ marginLeft: "15px" }}>Ticket Assignees</Stack>
                            <Stack
                                className='modal-close'
                                onClick={handleKebabClose}
                                sx={{ border: "1px solid #EBEDF0" }}
                            >
                                <img src={CloseModalIcon} />
                            </Stack>

                            <Stack className='search'>
                                <div className="search-container">
                                    {/* <span className="search-icon">&#128269;</span> */}
                                    <span className="search-icon"><SearchIcon /></span>
                                    <input type="text" className="search-input" placeholder=" Search..." />
                                </div>
                            </Stack>


                            <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>
                                <Stack className="Ticket-Assignee-item" >
                                    <Stack className="Ticket-Assignee-subItem" >
                                        <Stack className="Ticket-Assignee-avatar"><img src={Avatar2} alt="User 2" /></Stack>
                                        <Stack className="Ticket-Assignee-Name">Jenny Wilson</Stack>
                                    </Stack>
                                    <Stack className="Ticket-Assignee-Owner">Ticket Owner</Stack>
                                </Stack>
                            </MenuItem>

                            {avatars.map((avatar) => (
                                <MenuItem key={avatar.id} sx={menuItemStyles} onClick={handleKebabClose}>
                                    <Stack className="Ticket-Assignee-item">
                                        <Stack className="Ticket-Assignee-subItem">
                                            <Stack className="Ticket-Assignee-avatar">
                                                <img src={avatar.src} alt={avatar.alt} />
                                            </Stack>
                                            <Stack className="Ticket-Assignee-Name">{avatar.name}</Stack>
                                        </Stack>
                                        <Stack className="Ticket-Assignee-Operation">
                                            <img src={AddAssigneeIcon} alt="Add Assignee" />
                                        </Stack>
                                    </Stack>
                                </MenuItem>
                            ))}

                        </Stack>


                        {/* end Lead Assignee */}


                        <Stack className='Ticket-LeadAge'>
                            {calculatedDate(currentTicket?.date)}
                        </Stack>

                        {/* Kebab Menu */}
                        <Stack component="div" >
                            <span onClick={handleClick}>
                                <img src={KebabMenu} alt='Kebab Menu' />
                            </span>
                        </Stack>

                        <Stack display={op ? "block" : "none"}
                            className='KebabMenu-item' bgcolor="white">
                            <Stack className="Kebabmenu-title" sx={{ marginLeft: "15px" }}>Estimation</Stack>
                            <Estimate setTicketUpdateFlag={setTicketUpdateFlag} />
                            <Stack className="gray-border">
                                {/* Borders */}
                            </Stack>
                            <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>Set Priority</MenuItem>
                            <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>Add Surgery</MenuItem>
                            <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>Initate RFA</MenuItem>
                        </Stack>

                        {/* end kebab Menu */}

                    </Stack>

                </Box>

                {/* Stage Card Start Here */}

                <Box p={1} height="27%"
                >
                    <Box bgcolor={'white'} p={1.5} borderRadius={2}>
                        <StageCard
                            currentTicket={currentTicket}
                            setTicketUpdateFlag={setTicketUpdateFlag}
                        />
                    </Box>
                </Box>
                <Box
                    height="0"
                    position="relative"
                    bgcolor="#F1F5F7"
                >
                    <TabContext value={value}>
                        <Box
                            sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-around' }}
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
                                {/* <Tab
                                    label="Email"
                                    value="3"
                                    className={
                                        value == '3' ? styles.selectedTab : styles.tabsLabel
                                    }
                                /> */}
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
                            {/* <TabPanel value="3" style={{ padding: 0 }}>
                                <QueryResolutionWidget />
                            </TabPanel> */}
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

                {/* End ----- */}



            </div >

            {/* Left Section of Single Ticket Detail Page */}

            <div className="sidebar-box">
                <div className='side-bar'>
                    <SingleTicketSideBar reminderLists={matchedObjects} reschedulerList={callReschedulerData} />
                </div>
                <div className="task-bar">
                    <TaskBar />
                </div>
            </div>
        </div >

    );
};

export default NSingleTicketDetails;
