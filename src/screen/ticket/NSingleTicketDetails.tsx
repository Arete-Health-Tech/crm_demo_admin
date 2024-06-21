/* eslint-disable @typescript-eslint/no-unused-vars */
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
    Transgender,
    Upload
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
    Menu,
    Badge,
    FormHelperText,
    Autocomplete
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SearchIcon from '@mui/icons-material/Search';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import {
    iDepartment,
    iDoctor,
    iScript,
    iService
} from '../../types/store/service';
import QueryResolutionWidget from './widgets/QueryResolutionWidget';
import { getSingleScript } from '../../api/script/script';
import PrescriptionTabsWidget from './widgets/PrescriptionTabsWidget';
import AddNewTaskWidget from './widgets/AddNewTaskWidget';
import {
    getAllReminderHandler,
    getTicketHandler
} from '../../api/ticket/ticketHandler';
import MessagingWidget from './widgets/whatsapp/WhatsappWidget';
import styles from './SingleTicketDetails.module.css';
import ShowPrescription from './widgets/ShowPrescriptionModal';
import {
    assignedToTicket,
    deleteTicket,
    removeFromTicket,
    updateService,
    updateTicketProbability,
    updateTicketSubStage,
    validateTicket
} from '../../api/ticket/ticket';
import { NAVIGATE_TO_TICKET, UNDEFINED } from '../../constantUtils/constant';
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
import { apiClient, socket } from '../../api/apiClient';
import ReschedulerAll from './widgets/ReschedulerAll';
import RemainderAll from './widgets/RemainderAll';
import SingleTicketSideBar from './SingleTicketSideBar/SingleTicketSideBar';
import TaskBar from './SingleTicketSideBar/TaskBar';
import Avatar1 from '../../assets/avatar1.svg';
import NewAvatar from '../../assets/avatar2.svg';
import back_arrow from '../../assets/back_arrow.svg';
import DropDownArrow from '../../assets/DropdownArror.svg';
import KebabMenu from '../../assets/KebabMenu.svg';
import AddAssigneeIcon from '../../assets/add.svg';
import red_remove from '../../assets/red_remove.svg';
import CloseModalIcon from '../../assets/Group 48095853.svg';
import './singleTicket.css';
import SearchBar from '../../container/layout/SearchBar';
import Activities from './widgets/Activities/Activities';
import SmsWidget from './widgets/SmsWidget/SmsWidget';
import PhoneWidget from './widgets/PhoneWidget/PhoneWidget';
import ExpandedModal from './widgets/whatsapp/ExpandedModal';
import ExpandedSmsModal from './widgets/SmsWidget/ExpandedSmsModal';
import ExpandedPhoneModal from './widgets/PhoneWidget/ExpandedPhoneModal';
import {
    collection,
    DocumentData,
    onSnapshot,
    orderBy,
    query
} from 'firebase/firestore';
import { database } from '../../utils/firebase';
import useReprentativeStore from '../../store/representative';
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
interface storeMessage {
    message: string;
    ticket: string;
    unreadCount: number;

    // Add other fields as needed
}

type iPrescription = {
    department: string;
    // subDepartment: string;
    doctor: string;
    admission: null | string;
    symptoms: string | null;
    condition: string | null;
    medicines: string[];
    followUp: Date | number;
    image: string | null;
    isPharmacy: string | null;
    caregiver_name: string | null;
    caregiver_phone: string | null;
    service?: { _id: string; label: string };
};

const initialPrescription = {
    admission: 'none'
};

dayjs.extend(relativeTime);

type Props = {};

const NSingleTicketDetails = (props: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { ticketID } = useParams();
    const {
        tickets,
        filterTickets,
        reminders,
        pageNumber,
        searchByName,
        callRescheduler,
        estimates,
        isSwitchView,
        setIsSwitchView
    } = useTicketStore();
    const { doctors, departments, stages } = useServiceStore();
    const { representative } = useReprentativeStore();
    const [currentTicket, setCurrentTicket] = useState<iTicket>();
    const [value, setValue] = useState('1');
    const [script, setScript] = useState<iScript>();
    const [isScript, setIsScript] = useState(false);
    const [ticketUpdateFlag, setTicketUpdateFlag] = useState({});
    const [singleReminder, setSingleReminder] = useState<iReminder[] | any[]>([]);
    const [callReschedule, setCallReschedule] = useState<
        iCallRescheduler[] | any[]
    >([]);

    const [open, setOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
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
    });

    const [openModal, setOpenModal] = useState(false);
    const [modalOpenRemainder, setModalOpenRemainder] = useState(false);
    const [modalOpenRescheduler, setModalOpenRescheduler] = useState(false);
    const [matchedObjects, setMatchedObjects] = useState([]);
    const [callReschedulerData, setCallReschedulerData] = useState([]);
    const [admissionTypeClicked, setAmissionTypeClicked] = useState(true);
    const [prescription, setPrescription] = useState<iPrescription>(
        /* @ts-ignore */
        structuredClone(initialPrescription)
    );
    const [validations, setValidations] = useState({
        admission: { message: '', value: false },
        service: { message: '', value: false }
    });
    const [foundServices, setFoundServices] = useState<iService[]>([]);
    const [buttonVariant, setButtonVariant] = useState<string | null>(null);
    const [disableButton, setDisableButton] = useState(false);
    const defaultValidation = { message: '', value: false };
    const [selectedInternalRef, setSelectedInternalRef] = useState('');
    const [inputSearch, setInputSearch] = useState('');

    const handleInternalRefChange = (event) => {
        const value = event.target.value;
        setSelectedInternalRef(value);
        handleInternal(value);
        console.log(value, 'Internal Ref Change ');
    };

    const changePrescriptionValue = (field: any, value: any) => {
        setPrescription((prev: any) => {
            prev[field] = value;
            return { ...prev };
        });
    };

    useEffect(() => {
        /* @ts-ignore */
        setPrescription(structuredClone(initialPrescription));
    }, []);

    const validation = () => {
        const admission = prescription.admission === '';
        setValidations((prev) => {
            prev.admission = admission
                ? { message: 'Invalid Value', value: true }
                : defaultValidation;
            return { ...prev };
        });

        return admission === false;
    };
    const handleInternal = (item: string) => {
        console.log('this is response');
        setButtonVariant(item);
    };

    const findService = async (query: string) => {
        try {
            if (query.length <= 3) return;
            const { data } = await apiClient.get(`/service/search?search=${query}`);
            setFoundServices(data);
        } catch (error) {
            console.log(error);
        }
    };

    // console.log({ representative });

    const handelUploadType = async () => {
        setDisableButton(true);
        const validationCheck = validation();
        if (validationCheck === true) {
            const payload =
            {

                admission: prescription.admission,
                service: prescription?.service?._id

            };
            const ticketId = ticketID;
            const respose = await updateService({

                admission: prescription.admission,
                service: prescription?.service?._id

            }, ticketId);
            setDisableButton(false);
            setAmissionTypeClicked(true);
            getTicketHandler(UNDEFINED, pageNumber, 'false', filterTickets);

            // const url = ticketID !== undefined ? `/ticket/${ticketID}` : `/ticket`;
            // window.location.href = url;
            // window.location.reload();
            // const ticket: any = structuredClone(prescription);
            // delete ticket.department;
            // delete ticket.subDepartment;
            // ticket.departments = [prescription.department];

            // ticket.followup = ticket.followup ? ticket.followup : null;
            // // await createTicketHandler(ticket);
            // setPrescription(structuredClone(initialPrescription));
            // // setDiagnostics([]);
            // setDisableButton(false);

            // // navigate('/');
        } else {
            setDisableButton(false);
        }
    };

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
        if (location.pathname.includes('switchView')) {
            setIsSwitchView(true);
        }
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
    const [probabilityModal, setProbabilityModal] = useState(false);
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

    const probabilityItemStyles = {
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--Text-Black, #080F1A)',
        fontFamily: `"Outfit", sans-serif`,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '150%',
        '&:hover': {
            backgroundColor: 'inherit' // Prevent background change on hover
        }
    };

    const menuItemStyles = {
        color: 'var(--Text-Black, #080F1A)',
        fontFamily: `"Outfit", sans-serif`,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '150%',
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
            const minuteDifference = Math.floor(
                (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
            );
            const formattedTimeDifference = `${hourDifference
                .toString()
                .padStart(2, '0')}:${minuteDifference.toString().padStart(2, '0')}`;
            // console.log(formattedTimeDifference)
            return `${formattedTimeDifference} hrs ago`;
        } else {
            return `${dayDifference} days ago`;
        }
    };

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

    const avatars = [
        { id: 1, src: Avatar1, alt: 'User 1', name: 'Robert Fox' },
        { id: 2, src: NewAvatar, alt: 'User 2', name: 'Floyd Miles' },
        { id: 3, src: Avatar1, alt: 'User 3', name: 'Dianee Russel' },
        { id: 4, src: NewAvatar, alt: 'User 4', name: 'Jack Andreson' },
        { id: 6, src: Avatar1, alt: 'User 5', name: 'Will Smith' }
    ];

    const stackRef = useRef<HTMLDivElement | null>(null);
    const probabilityRef = useRef<HTMLDivElement | null>(null);
    const visibleRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        const isClickOutsideStack =
            stackRef.current && !stackRef.current.contains(event.target as Node);
        const isClickOutsideProbability =
            probabilityRef.current &&
            !probabilityRef.current.contains(event.target as Node);
        const isClickOutsideVisibleRef =
            visibleRef.current && !visibleRef.current.contains(event.target as Node);

        if (isClickOutsideStack) {
            setOp(false);
        }
        if (isClickOutsideProbability) {
            setProbabilityModal(false);
        }
        if (isClickOutsideVisibleRef) {
            setVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [messages, setMessages] = useState<storeMessage[]>([]);

    useEffect(() => {
        // console.log('useEffect is running in NsingleticketCard'); // Check if this logs

        // Check if socket is connected
        if (socket.connected) {
            console.log('Socket connected successfully in NsingleticketCard');
        } else {
            console.log('Socket not connected, attempting to connect...');
            socket.connect();
        }

        const handleNewMessage = (data) => {
            console.log('Received new message ', data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };

        // Listen for the 'newMessage' event
        socket.on('newMessage', handleNewMessage);

        // Clean up the socket connection on component unmount
        return () => {
            socket.off('newMessage', handleNewMessage); // Remove the event listener
            socket.disconnect();
        };
    }, []);

    // console.log({ messages })
    const handleProbability = async (value) => {
        await updateTicketProbability(value, ticketID);
        setProbabilityModal(false);
        getTicketHandler(UNDEFINED, pageNumber, 'false', filterTickets);
        navigate(`/ticket/${ticketID}`);
    };

    // This function is for calling the api of delete lead
    const handleLeadDelete = async () => {
        setDeleteModal(false)
        await deleteTicket(ticketID);
        getTicketHandler(UNDEFINED, pageNumber, 'false', filterTickets);
        await validateTicket(ticketID);
        navigate(NAVIGATE_TO_TICKET);
    };

    //This function is for assigne ticket to different representative
    const handleAddAssigne = async (assigneeId: string) => {
        console.log(assigneeId);
        const res = await assignedToTicket(ticketID, assigneeId);
        getTicketHandler(UNDEFINED, pageNumber, 'false', filterTickets);
        navigate(`/ticket/${ticketID}`);
    };

    //This function is for remove assigne ticket from the representative
    const handleRemoveAssigne = async (assigneeId: string) => {
        console.log(assigneeId);
        const res = await removeFromTicket(ticketID, assigneeId);
        getTicketHandler(UNDEFINED, pageNumber, 'false', filterTickets);
        navigate(`/ticket/${ticketID}`);
    };

    return (
        <>
            <div className={isSwitchView ? 'switch-main-layout' : 'main-layout'}>
                {/* Right Section of Single Ticket Detail Page */}

                <div className="stack-box">
                    <Box
                        className="Ticket-detail-card"
                        p={2}
                    // position="sticky"
                    >
                        {/* Left Side */}
                        <Stack
                            className="Ticket-detail-card-left"
                            display="flex"
                            flexDirection="row"
                        >
                            {isSwitchView && (
                                <Stack
                                    sx={{ cursor: 'pointer' }}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    marginRight={2}
                                    onClick={() => navigate(-1)}
                                >
                                    <img src={back_arrow} alt="" />
                                </Stack>
                            )}
                            <Stack display="flex" flexDirection="column">
                                <Stack display="flex" flexDirection="row">
                                    <Stack className="Ticket-detail-card-left-name">
                                        {patientName(currentTicket)}
                                    </Stack>
                                    <Stack className="Ticket-detail-card-left-Gen-Age">
                                        {currentTicket?.consumer[0]?.gender ? (
                                            <Stack className="Gen-Age">
                                                {currentTicket?.consumer[0]?.gender}
                                            </Stack>
                                        ) : (
                                            <></>
                                        )}
                                        {currentTicket?.consumer[0]?.age ? (
                                            <Stack className="Gen-Age">
                                                {currentTicket?.consumer[0]?.age}
                                            </Stack>
                                        ) : (
                                            <></>
                                        )}
                                    </Stack>
                                </Stack>
                                <Stack className="Ticket-detail-card-left-uhid">
                                    <span>#{currentTicket?.consumer[0]?.uid}</span>
                                </Stack>
                            </Stack>

                            {/* Calling */}

                            <CustomModal />

                            {/* End---- */}
                        </Stack>

                        {/* Right Side */}

                        <Stack className="Ticket-detail-card-right">
                            {/* probability start */}
                            <Box
                                className={
                                    currentTicket?.Probability === 0
                                        ? 'Ticket-probability0'
                                        : currentTicket?.Probability === 25
                                            ? 'Ticket-probability25'
                                            : currentTicket?.Probability === 50
                                                ? 'Ticket-probability50'
                                                : currentTicket?.Probability === 75
                                                    ? 'Ticket-probability75'
                                                    : currentTicket?.Probability === 100
                                                        ? 'Ticket-probability100'
                                                        : 'Ticket-probability0'
                                }
                                // className="Box-assignee"
                                onClick={() => {
                                    setProbabilityModal(true);
                                }}
                            >
                                {/* {currentTicket?.Probability}% */}
                                {!currentTicket?.Probability ? 0 : currentTicket?.Probability}%
                                <span>
                                    <img src={DropDownArrow} alt="" />
                                </span>
                            </Box>

                            <Stack
                                ref={probabilityRef}
                                display={probabilityModal ? 'block' : 'none'}
                                className="probabilty-menu"
                                bgcolor="white"
                            >
                                <Stack
                                    className="modal-close"
                                    onClick={() => setProbabilityModal(false)}
                                    sx={{ border: '1px solid #EBEDF0' }}
                                >
                                    <img src={CloseModalIcon} />
                                </Stack>
                                <MenuItem sx={probabilityItemStyles}>
                                    <Stack className={'Ticket-probability'} marginBottom={'10px'}>
                                        Select Probability
                                    </Stack>
                                    <Stack
                                        display={'flex'}
                                        flexDirection={'row'}
                                        width={'100%'}
                                        justifyContent={'space-between'}
                                    >
                                        <Stack
                                            className="Ticket-probability-0"
                                            onClick={() => handleProbability(0)}
                                        >
                                            0%
                                        </Stack>
                                        <Stack
                                            className="Ticket-probability-25"
                                            onClick={() => handleProbability(25)}
                                        >
                                            25%
                                        </Stack>
                                        <Stack
                                            className="Ticket-probability-50"
                                            onClick={() => handleProbability(50)}
                                        >
                                            50%
                                        </Stack>
                                        <Stack
                                            className="Ticket-probability-75"
                                            onClick={() => handleProbability(75)}
                                        >
                                            75%
                                        </Stack>
                                        <Stack
                                            className="Ticket-probability-100"
                                            onClick={() => handleProbability(100)}
                                        >
                                            100%
                                        </Stack>
                                    </Stack>
                                </MenuItem>
                            </Stack>
                            {/* probability end */}
                            {/* Lead Assignee */}

                            <Box height={'100%'}
                                className="Box-assignee"
                                onClick={() => {
                                    setVisible(!visible);
                                    setOp(false);
                                }}
                            >
                                <Stack direction="row" alignItems="center" marginTop={'3px'}>
                                    <span className="avatar">
                                        {' '}
                                        <Avatar
                                            sx={{
                                                width: '100%',
                                                height: '105%',
                                                fontSize: '12px',
                                                bgcolor: 'orange',
                                                textTransform: 'uppercase',
                                                marginTop: '2px'
                                            }}
                                            alt="User 1"
                                        >
                                            {representative?.filter((item) => item.role === 'REPRESENTATIVE')[0]?.firstName[0]}{representative?.filter((item) => item.role === 'REPRESENTATIVE')[0]?.lastName[0]}
                                        </Avatar>
                                    </span>
                                    <span className="NewAvatar avatar">
                                        {' '}
                                        <Avatar
                                            sx={{
                                                width: '100%',
                                                height: '105%',
                                                fontSize: '12px',
                                                bgcolor: 'orange',
                                                textTransform: 'uppercase',
                                                marginTop: '2px'
                                            }}
                                            alt="User 2"
                                        >
                                            {representative?.filter((item) => item.role === 'REPRESENTATIVE')[1]?.firstName[0]}{representative?.filter((item) => item.role === 'REPRESENTATIVE')[1]?.lastName[0]}
                                        </Avatar>
                                    </span>
                                    <span
                                    // className="DropDownArrow"
                                    >
                                        <img src={DropDownArrow} alt="" />
                                    </span>
                                </Stack>
                            </Box>

                            <Stack
                                ref={visibleRef}
                                display={visible ? 'block' : 'none'}
                                className=" ticket-assigneemenu"
                                bgcolor="white"
                            >

                                <Stack
                                    className="Ticket-Assignee-title"
                                    sx={{ marginLeft: '15px' }}
                                >
                                    Ticket Assignees
                                </Stack>
                                <Stack
                                    className="modal-close"
                                    onClick={handleKebabClose}
                                    sx={{ border: '1px solid #EBEDF0' }}
                                >
                                    <img src={CloseModalIcon} />
                                </Stack>

                                <Stack className="search">
                                    <div className="search-container">
                                        {/* <span className="search-icon">&#128269;</span> */}
                                        <span className="search-icon">
                                            <SearchIcon />
                                        </span>
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder=" Search..."
                                            onChange={(e) => setInputSearch(e.target.value)}
                                        />
                                    </div>
                                </Stack>
                                <Stack className='ticket-asssignee-container'>
                                    {/* <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>
                                    <Stack className="Ticket-Assignee-item" >
                                        <Stack className="Ticket-Assignee-subItem" >
                                            <Stack className="Ticket-Assignee-avatar"><img src={NewAvatar} alt="User 2" /></Stack>
                                            <Stack className="Ticket-Assignee-Name">Jenny Wilson</Stack>
                                        </Stack>
                                        <Stack className="Ticket-Assignee-Owner">Ticket Owner</Stack>
                                    </Stack>
                                </MenuItem> */}

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
                                            const isTicketOwner =
                                                item._id === currentTicket?.assigned?.[0];
                                            const isAssigned = currentTicket?.assigned
                                                ?.slice(1)
                                                .includes(item._id);

                                            return (
                                                <MenuItem key={item._id} sx={menuItemStyles}>
                                                    <Stack className="Ticket-Assignee-item">
                                                        <Stack className="Ticket-Assignee-subItem">
                                                            <Stack className="Ticket-Assignee-avatar">
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
                                                                className="Ticket-Assignee-Name"
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
                                                        {isTicketOwner ? (
                                                            <Stack className="Ticket-Assignee-Owner">
                                                                Ticket Owner
                                                            </Stack>
                                                        ) : isAssigned ? (
                                                            <Stack>
                                                                <img
                                                                    src={red_remove}
                                                                    alt="Remove Assignee"
                                                                    onClick={() => {
                                                                        handleRemoveAssigne(item._id);
                                                                    }}
                                                                />
                                                            </Stack>
                                                        ) : (
                                                            <Stack className="Ticket-Assignee-Operation">
                                                                <img
                                                                    src={AddAssigneeIcon}
                                                                    alt="Add Assignee"
                                                                    onClick={() => {
                                                                        handleAddAssigne(item._id);
                                                                    }}
                                                                />
                                                            </Stack>
                                                        )}
                                                    </Stack>
                                                </MenuItem>
                                            );
                                        })}
                                </Stack>
                            </Stack>


                            {/* end Lead Assignee */}

                            <Stack className="Ticket-LeadAge">
                                {calculatedDate(currentTicket?.date)}
                            </Stack>

                            {/* Kebab Menu */}
                            <Stack component="div">
                                <span onClick={handleClick}>
                                    <img
                                        src={KebabMenu}
                                        alt="Kebab Menu"
                                        style={{ cursor: 'pointer' }}
                                    />
                                </span>
                            </Stack>

                            {/* Options Of Kebab Menu */}
                            <Stack
                                ref={stackRef}
                                display={op ? 'block' : 'none'}
                                className="KebabMenu-item"
                                bgcolor="white"
                            >
                                <Stack className="Kebabmenu-title" sx={{ marginLeft: '15px' }}>
                                    Estimation
                                </Stack>
                                <Estimate setTicketUpdateFlag={setTicketUpdateFlag} />
                                <Stack className="gray-border">{/* Borders */}</Stack>
                                {/* <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>
                                    Set Priority
                                </MenuItem> */}
                                <MenuItem
                                    sx={menuItemStyles}
                                    onClick={() => setAmissionTypeClicked(false)}
                                >
                                    Add Surgery
                                </MenuItem>
                                {/* <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>
                                    Initate RFA
                                </MenuItem> */}
                                <MenuItem sx={menuItemStyles} onClick={() => setDeleteModal(true)}>
                                    {/* <MenuItem sx={menuItemStyles} onClick={handleLeadDelete}> */}
                                    Delete Lead
                                </MenuItem>
                            </Stack>

                            {/* end kebab Menu */}
                        </Stack>
                    </Box>

                    {/* Stage Card Start Here */}

                    <Box p={1} height="27vh">
                        <Box bgcolor={'white'} p={1.5} borderRadius={2}>
                            <StageCard
                                currentTicket={currentTicket}
                                setTicketUpdateFlag={setTicketUpdateFlag}
                            />
                        </Box>
                    </Box>

                    <Box height="0" position="relative" bgcolor="#F1F5F7">
                        <TabContext value={value}>
                            <Box
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    display: 'flex',
                                    justifyContent: 'space-around'
                                }}
                                bgcolor="white"
                            >
                                <TabList
                                    onChange={handleChange}
                                    aria-label="lab API tabs example"
                                    style={{ width: '100%' }}
                                    sx={{
                                        '& .MuiTabs-indicator': {
                                            display: 'none'
                                        },
                                        '.Mui-selected': {
                                            // backgroundColor: "#0566FF !important",
                                            color: '#FFFFFF',
                                            borderBottom: '2px solid #0566FF'
                                        }
                                    }}
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
                                        // label={
                                        //     <Badge
                                        //         badgeContent={2}
                                        //         sx={{
                                        //             '& .MuiBadge-badge': {
                                        //                 color: '#FFF',
                                        //                 backgroundColor: '#F94839',
                                        //                 margin: '-3px',
                                        //                 fontSize: '9px',

                                        //                 height: '20px',
                                        //                 // borderRadius: '80%',
                                        //                 padding: -8
                                        //             }
                                        //         }}
                                        //     >
                                        //         Whatsapp
                                        //     </Badge>
                                        // }
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
                                    {/* <Tab
                                        // label={
                                        //     <Badge
                                        //         badgeContent={8}
                                        //         sx={{
                                        //             '& .MuiBadge-badge': {
                                        //                 color: '#FFF',
                                        //                 backgroundColor: '#F94839',
                                        //                 margin: '-3.6px -4.5px',
                                        //                 fontSize: '10px'
                                        //             }
                                        //         }}
                                        //     >
                                        //         SMS
                                        //     </Badge>
                                        // }
                                        label="SMS"
                                        value="4"
                                        className={
                                            value == '4' ? styles.selectedTab : styles.tabsLabel
                                        }
                                    /> */}
                                    <Tab
                                        // label={
                                        //     <Badge
                                        //         badgeContent={4}
                                        //         sx={{
                                        //             '& .MuiBadge-badge': {
                                        //                 color: '#FFF',
                                        //                 backgroundColor: '#F94839',
                                        //                 margin: '-3px',
                                        //                 fontSize: '9px',

                                        //                 height: '20px',
                                        //                 // borderRadius: '80%',
                                        //                 padding: -8
                                        //             }
                                        //         }}
                                        //     >
                                        //         Phone Calls
                                        //     </Badge>
                                        // }
                                        label="Phone Calls"
                                        value="5"
                                        className={
                                            value == '5' ? styles.selectedTab : styles.tabsLabel
                                        }
                                    />
                                    {/* <Tab
                                        label="Query Resolution"
                                        value="6"
                                        className={
                                            value == '6' ? styles.selectedTab : styles.tabsLabel
                                        }
                                    /> */}
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
                </div>

                {/* Left Section of Single Ticket Detail Page */}

                <div className="sidebar-box">
                    <div className="side-bar">
                        <SingleTicketSideBar
                            reminderLists={matchedObjects}
                            reschedulerList={callReschedulerData}
                        />
                    </div>
                    <div className="task-bar">
                        <TaskBar />
                    </div>
                </div>
            </div>
            {isSwitchView && (
                <>
                    <ExpandedModal />
                    <ExpandedSmsModal />
                    <ExpandedPhoneModal />
                </>
            )}

            {/* Add Surgery Modal */}

            <Modal
                open={!admissionTypeClicked}
                onClose={() => { }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="reminder-modal-container" gap={'10px'}>
                    <Stack
                        className="reminder-modal-title"
                        direction="row"
                        display="flex"
                        alignItems="center"
                    >
                        <Stack className="Add-Surgery-title">Add Surgery</Stack>
                        <Stack
                            className="modal-close"
                            onClick={() => {
                                changePrescriptionValue('admission', 'none');
                                setAmissionTypeClicked(true);
                                setSelectedInternalRef('');
                            }}
                        >
                            <img src={CloseModalIcon} />
                        </Stack>
                    </Stack>

                    <Box>
                        <Stack flexWrap={'wrap'} flexDirection="row" gap={'14px'}>
                            {[
                                'none',
                                'Surgery',
                                'Radiation',
                                'MM',
                                'DC',
                                // 'Internal Reference'
                            ].map((item) => (
                                <button
                                    className="call-Button"
                                    style={{
                                        backgroundColor:
                                            prescription.admission === item ? '#DAE8FF' : '#F6F7F9',
                                        fontSize: '14px'
                                    }}
                                    onClick={() => changePrescriptionValue('admission', item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </Stack>

                        <FormHelperText error={validations.admission.value}>
                            {validations.admission.message}
                        </FormHelperText>

                        {prescription.admission === 'Internal Reference' ? (
                            <Stack my={1.5}>
                                <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ minWidth: 120, m: 0.4 }}
                                >
                                    <InputLabel
                                        id="internal-reference-label"
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontSize: '14px',
                                            fontFamily: 'Outfit,sans-serif'
                                        }}
                                    >
                                        Internal Reference
                                    </InputLabel>
                                    <Select
                                        labelId="internal-reference-label"
                                        value={selectedInternalRef}
                                        onChange={handleInternalRefChange}
                                        label="Internal Reference"
                                        sx={{
                                            '.MuiSelect-select': {
                                                textTransform: 'capitalize',
                                                fontSize: '14px',
                                                fontFamily: 'Outfit,sans-serif'
                                            }
                                        }}
                                    >
                                        {['Med', 'Surg', 'Chemo'].map((item) => (
                                            <MenuItem key={item} value={item} sx={menuItemStyles}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        ) : (
                            // prescription.admission !== 'none' &&
                            prescription.admission === 'Surgery' ? (
                                <Box my={1.5}>
                                    <Autocomplete
                                        size="small"
                                        fullWidth
                                        onChange={(_, newValue) =>
                                            changePrescriptionValue('service', newValue)
                                        }
                                        options={foundServices}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <TextField
                                                onChange={(e) => findService(e.target.value)}
                                                {...params}
                                                label="Service"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: {
                                                        textTransform: 'capitalize',
                                                        fontSize: '14px',
                                                        fontFamily: 'Outfit,sans-serif'
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    style: {
                                                        textTransform: 'capitalize',
                                                        fontSize: '14px',
                                                        fontFamily: 'Outfit,sans-serif'
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                    <FormHelperText
                                        error={validations.service.value}
                                        sx={{
                                            textTransform: 'capitalize',
                                            fontSize: '14px',
                                            fontFamily: 'Outfit,sans-serif'
                                        }}
                                    >
                                        {validations.service.message}
                                    </FormHelperText>
                                </Box>
                            ) : (<></>)
                        )}
                    </Box>

                    <Box display="flex" justifyContent="flex-end">
                        <button
                            className="reminder-cancel-btn"
                            onClick={() => {
                                changePrescriptionValue('admission', 'none');
                                setAmissionTypeClicked(true);
                                setSelectedInternalRef('');
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="reminder-btn"
                            disabled={disableButton}
                            onClick={handelUploadType}
                            style={{
                                backgroundColor: disableButton ? '#F6F7F9' : '#0566FF',
                                color: disableButton ? '#647491' : '#FFF',
                                marginLeft: '10px'
                            }}
                        >
                            {disableButton ? 'Uploading ...' : 'Add Admission Type'}
                        </button>
                    </Box>
                </Box>
            </Modal>

            {/* MODAL for Delete the notes */}

            <Modal
                open={deleteModal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box className={styles.deleteOpenedModal}>
                    <Stack
                        className={styles.delete_reminder_modal_title}
                        direction="row"
                        spacing={1}
                        display="flex"
                        alignItems="center"
                    >
                        <Stack>Delete Lead</Stack>
                        <Stack
                            className={styles.modal_close}
                            onClick={() => setDeleteModal(false)}
                        >
                            <img src={CloseModalIcon} alt="" />
                        </Stack>
                    </Stack>
                    <Box className={styles.deleteNoteText}>
                        Are you sure want to delete this permanently.
                    </Box>
                    <Box className={styles.DeleteNotesFooter}>
                        <Box
                            className={styles.Cancel}
                            onClick={() => setDeleteModal(false)}
                        >
                            Cancel
                        </Box>
                        <Box
                            className={styles.DeleteNoteButton}
                            onClick={handleLeadDelete}
                        >
                            Delete
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Add Surgery modal End */}
        </>
    );
};

export default NSingleTicketDetails;
