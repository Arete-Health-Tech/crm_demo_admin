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
    Menu,
    Badge,
    ToggleButtonGroup
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ToggleButton from '@mui/lab/ToggleButton';
import SearchIcon from '@mui/icons-material/Search';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from './AuditSingleDetail.module.css';
import MenuItem from '@mui/material/MenuItem';
import { styled, useTheme } from '@mui/material/styles';
import AWS from 'aws-sdk';
import Avatar1 from '../../../assets/avatar1.svg';
import back_arrow from '../../../assets/back_arrow.svg';
import NewAvatar from '../../../assets/Avatar2.svg';
import DropDownArrow from '../../../assets/DropdownArror.svg';
import KebabMenu from '../../../assets/KebabMenu.svg';
import AddAssigneeIcon from '../../../assets/add.svg';
import commentHeader from '../../../assets/commentHeader.svg';
import CloseModalIcon from '../../../assets/Group 48095853.svg';
import './auditSingleTicket.css';
import useTicketStore from '../../../store/ticketStore';
import useServiceStore from '../../../store/serviceStore';
import {
    iCallRescheduler,
    iReminder,
    iTicket
} from '../../../types/store/ticket';
import { iDepartment, iDoctor, iScript } from '../../../types/store/service';
import { apiClient } from '../../../api/apiClient';
import { getSingleScript } from '../../../api/script/script';
import CustomModal from '../../ticket/widgets/CustomModal';
import Estimate from '../../ticket/widgets/Estimate';
import StageCard from '../../ticket/widgets/StageCard';
import Activities from '../../ticket/widgets/Activities/Activities';
import MessagingWidget from '../../ticket/widgets/whatsapp/WhatsappWidget';
import SmsWidget from '../../ticket/widgets/SmsWidget/SmsWidget';
import PhoneWidget from '../../ticket/widgets/PhoneWidget/PhoneWidget';
import QueryResolutionWidget from '../../ticket/widgets/QueryResolutionWidget';
import NotesWidget from '../../ticket/widgets/NotesWidget';
import SingleTicketSideBar from '../../ticket/SingleTicketSideBar/SingleTicketSideBar';
import TaskBar from '../../ticket/SingleTicketSideBar/TaskBar';
import ConnectorIcon from '../../../assets/hierarchy.svg'
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

// Extend ToggleButton props to include selectedcolor
interface CustomToggleButtonProps {
    selectedcolor?: string;
}

const CustomToggleButton = styled(ToggleButton)<CustomToggleButtonProps>(
    ({ selectedcolor }) => ({
        borderRadius: '1rem',
        height: '1.5rem',
        padding: '0.5rem 0.75rem',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '0.75rem',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '150%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        '&.Mui-selected': {
            backgroundColor: selectedcolor,
            '&:hover': {
                backgroundColor: selectedcolor
            }
        },
        '&:not(.Mui-selected)': {
            backgroundColor: '#F5F5F5',
            color: '#647491'
        }
    })
);

type Props = {};

const AuditSinglePageDetail = (props: Props) => {
    const navigate = useNavigate();
    const { ticketID } = useParams();
    const {
        tickets,
        filterTickets,
        reminders,
        pageNumber,
        searchByName,
        callRescheduler,
        estimates,
        isAuditor,
        setIsAuditor
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
        gender: ''
        // Add other fields as needed
    });

    const [openModal, setOpenModal] = useState(false);
    const [modalOpenRemainder, setModalOpenRemainder] = useState(false);
    const [modalOpenRescheduler, setModalOpenRescheduler] = useState(false);
    const [matchedObjects, setMatchedObjects] = useState([]);
    const [callReschedulerData, setCallReschedulerData] = useState([]);

    // this state defines the audit comment
    const [selected, setSelected] = useState('problem');

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
        setIsAuditor(true)
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
    const [probability, setProbability] = useState(0);
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
        lineHeight: '150%'
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

    console.log('console in nsingleticlet');

    const stackRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (stackRef.current && !stackRef.current.contains(event.target as Node)) {
            setOp(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChangeAuditSwitch = (
        event: React.MouseEvent<HTMLElement>,
        newSelected: string | null
    ) => {
        if (newSelected !== null) {
            setSelected(newSelected);
        }
    };

    const [auditorComment, setAuditorComment] = useState('');

    const handleComment = (event) => {
        setAuditorComment(event.target.value);
    };

    return (
        <div className={styles.main_layout}>
            {/* Right Section of Single Ticket Detail Page */}

            <div className={styles.stack_box}>
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
                        {isAuditor && <Stack sx={{ cursor: 'pointer' }} display={'flex'} justifyContent={'center'} marginRight={2} onClick={() => navigate(-1)}>
                            <img src={back_arrow} alt="" />
                        </Stack>}
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

                        {!isAuditor && <CustomModal />}
                        {/* End---- */}
                    </Stack>

                    {/* Right Side */}

                    <Stack className="Ticket-detail-card-right">
                        {/* probability start */}
                        <Box
                            className={
                                probability === 0
                                    ? 'Ticket-probability0'
                                    : probability === 25
                                        ? 'Ticket-probability25'
                                        : probability === 50
                                            ? 'Ticket-probability50'
                                            : probability === 75
                                                ? 'Ticket-probability75'
                                                : 'Ticket-probability100'
                            }
                            // className="Box-assignee"
                            onClick={() => {
                                if (!isAuditor) {
                                    setProbability(probability);
                                    setProbabilityModal(true);
                                }
                            }}
                        >
                            {probability}%
                            {/* <span>
                                <img src={DropDownArrow} alt="" />
                            </span> */}
                        </Box>

                        <Stack
                            display={probabilityModal ? 'block' : 'none'}
                            className="KebabMenu-item ticket-assigneemenu"
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
                                <Stack className={'Ticket-probability'}>
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
                                        onClick={() => {
                                            setProbability(0);
                                            setProbabilityModal(false);
                                        }}
                                    >
                                        0%
                                    </Stack>
                                    <Stack
                                        className="Ticket-probability-25"
                                        onClick={() => {
                                            setProbability(25);
                                            setProbabilityModal(false);
                                        }}
                                    >
                                        25%
                                    </Stack>
                                    <Stack
                                        className="Ticket-probability-50"
                                        onClick={() => {
                                            setProbability(50);
                                            setProbabilityModal(false);
                                        }}
                                    >
                                        50%
                                    </Stack>
                                    <Stack
                                        className="Ticket-probability-75"
                                        onClick={() => {
                                            setProbability(75);
                                            setProbabilityModal(false);
                                        }}
                                    >
                                        75%
                                    </Stack>
                                    <Stack
                                        className="Ticket-probability-100"
                                        onClick={() => {
                                            setProbability(100);
                                            setProbabilityModal(false);
                                        }}
                                    >
                                        100%
                                    </Stack>
                                </Stack>
                            </MenuItem>
                        </Stack>
                        {/* probability end */}
                        {/* Lead Assignee */}

                        <Box
                            className={styles.Box_assignee}
                            onClick={() => {
                                if (!isAuditor) {
                                    setVisible(!visible);
                                    setOp(false);
                                }
                            }}
                        >
                            <Stack direction="row" alignItems="center">
                                <span className="avatar">
                                    {' '}
                                    <Avatar src={Avatar1} alt="User 1" />
                                </span>
                                <span className="avatar2 avatar">
                                    {' '}
                                    <Avatar src={NewAvatar} alt="User 2" />
                                </span>
                                {!isAuditor && <span className="DropDownArrow">
                                    <img src={DropDownArrow} alt="" />
                                </span>}
                            </Stack>
                        </Box>

                        <Stack
                            display={visible ? 'block' : 'none'}
                            className="KebabMenu-item ticket-assigneemenu"
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
                                    />
                                </div>
                            </Stack>

                            <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>
                                <Stack className="Ticket-Assignee-item">
                                    <Stack className="Ticket-Assignee-subItem">
                                        <Stack className="Ticket-Assignee-avatar">
                                            <img src={NewAvatar} alt="User 2" />
                                        </Stack>
                                        <Stack className="Ticket-Assignee-Name">Jenny Wilson</Stack>
                                    </Stack>
                                    <Stack className="Ticket-Assignee-Owner">Ticket Owner</Stack>
                                </Stack>
                            </MenuItem>

                            {avatars.map((avatar) => (
                                <MenuItem
                                    key={avatar.id}
                                    sx={menuItemStyles}
                                    onClick={handleKebabClose}
                                >
                                    <Stack className="Ticket-Assignee-item">
                                        <Stack className="Ticket-Assignee-subItem">
                                            <Stack className="Ticket-Assignee-avatar">
                                                <img src={avatar.src} alt={avatar.alt} />
                                            </Stack>
                                            <Stack className="Ticket-Assignee-Name">
                                                {avatar.name}
                                            </Stack>
                                        </Stack>
                                        <Stack className="Ticket-Assignee-Operation">
                                            <img src={AddAssigneeIcon} alt="Add Assignee" />
                                        </Stack>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Stack>

                        {/* end Lead Assignee */}

                        <Stack className="Ticket-LeadAge">
                            {calculatedDate(currentTicket?.date)}
                        </Stack>

                        {/* Kebab Menu */}
                        {!isAuditor && <Stack component="div">
                            <span onClick={handleClick}>
                                <img
                                    src={KebabMenu}
                                    alt="Kebab Menu"
                                    style={{ cursor: 'pointer' }}
                                />
                            </span>
                        </Stack>}

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
                            <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>
                                Set Priority
                            </MenuItem>
                            <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>
                                Add Surgery
                            </MenuItem>
                            <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>
                                Initate RFA
                            </MenuItem>
                            <MenuItem sx={menuItemStyles} onClick={handleKebabClose}>
                                Delete Lead
                            </MenuItem>
                        </Stack>

                        {/* end kebab Menu */}
                    </Stack>
                </Box>

                {/* Stage Card Start Here */}

                <Box>

                    <Box display={'flex'} >
                        <Box>
                            {!isAuditor &&
                                <Box p={1} height="27vh">
                                    <Box bgcolor={'white'} p={1.5} borderRadius={2}>
                                        <StageCard
                                            currentTicket={currentTicket}
                                            setTicketUpdateFlag={setTicketUpdateFlag}
                                        />
                                    </Box>
                                </Box>
                            }
                            <Box p={2} px={4}>
                                <Stack className={styles.Audit_stage}>
                                    New Lead
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
                                        Call Completed By Patient
                                    </Stack>
                                </Stack>
                            </Box>



                            {/* End ----- */}

                            {/* Tab list Start here */}
                            <Box height="10vh" position="relative" bgcolor="#F1F5F7" width={'47vw'}>
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
                                            style={{ width: '95%' }}
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
                                                label={
                                                    <Badge
                                                        badgeContent={4}
                                                        sx={{
                                                            '& .MuiBadge-badge': {
                                                                color: '#FFF',
                                                                backgroundColor: '#F94839',
                                                                margin: '-3px',
                                                                fontSize: '10px'
                                                            }
                                                        }}
                                                    >
                                                        Whatsapp
                                                    </Badge>
                                                }
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
                                                label={
                                                    <Badge
                                                        badgeContent={8}
                                                        sx={{
                                                            '& .MuiBadge-badge': {
                                                                color: '#FFF',
                                                                backgroundColor: '#F94839',
                                                                margin: '-4px',
                                                                // marginLeft: '-3px',

                                                                fontSize: '10px'
                                                            }
                                                        }}
                                                    >
                                                        SMS
                                                    </Badge>
                                                }
                                                value="4"
                                                className={
                                                    value == '4' ? styles.selectedTab : styles.tabsLabel
                                                }
                                            />
                                            <Tab
                                                label={
                                                    <Badge
                                                        badgeContent={4}
                                                        sx={{
                                                            '& .MuiBadge-badge': {
                                                                color: '#FFF',
                                                                backgroundColor: '#F94839',
                                                                margin: '-3px',
                                                                fontSize: '10px'
                                                            }
                                                        }}
                                                    >
                                                        Phone Calls
                                                    </Badge>
                                                }
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
                            {/* Tab list End */}
                        </Box>
                        <Box borderLeft={'1px solid #D4DBE5'} width={'40%'}>
                            <Box className={styles.showCommentHeader}>
                                <Stack>
                                    <img src={commentHeader} alt="" />
                                </Stack>
                                <Stack className={styles.showCommentHeaderText}>
                                    Auditor’s Comments
                                </Stack>
                            </Box>
                            <Box className={styles.commentsBox}>
                                <Box className={styles.problemBox}>
                                    <Box className={styles.problemText}>
                                        No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                    </Box>
                                    <Box className={styles.problemBottomBox}>
                                        <Box className={styles.problemBottomDate}>
                                            12 April 2024 09:30AM
                                        </Box>
                                        <Box className={styles.problemBottomChip}>
                                            Problem
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className={styles.problemBox}>
                                    <Box className={styles.problemText}>
                                        No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                    </Box>
                                    <Box className={styles.problemBottomBox}>
                                        <Box className={styles.problemBottomDate}>
                                            12 April 2024 09:30AM
                                        </Box>
                                        <Box className={styles.solutionBottomChip}>
                                            Solution
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className={styles.problemBox}>
                                    <Box className={styles.problemText}>
                                        No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                    </Box>
                                    <Box className={styles.problemBottomBox}>
                                        <Box className={styles.problemBottomDate}>
                                            12 April 2024 09:30AM
                                        </Box>
                                        <Box className={styles.problemBottomChip}>
                                            Problem
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className={styles.problemBox}>
                                    <Box className={styles.problemText}>
                                        No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                    </Box>
                                    <Box className={styles.problemBottomBox}>
                                        <Box className={styles.problemBottomDate}>
                                            12 April 2024 09:30AM
                                        </Box>
                                        <Box className={styles.solutionBottomChip}>
                                            Solution
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className={styles.problemBox}>
                                    <Box className={styles.problemText}>
                                        No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                    </Box>
                                    <Box className={styles.problemBottomBox}>
                                        <Box className={styles.problemBottomDate}>
                                            12 April 2024 09:30AM
                                        </Box>
                                        <Box className={styles.problemBottomChip}>
                                            Problem
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className={styles.problemBox}>
                                    <Box className={styles.problemText}>
                                        No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                    </Box>
                                    <Box className={styles.problemBottomBox}>
                                        <Box className={styles.problemBottomDate}>
                                            12 April 2024 09:30AM
                                        </Box>
                                        <Box className={styles.solutionBottomChip}>
                                            Solution
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box className={styles.auditorComment}>
                        <Box className={styles.auditorCommenttextArea}>
                            <textarea
                                placeholder="write a message"
                                value={auditorComment}
                                onChange={handleComment}
                            />
                        </Box>
                        <Box className={styles.auditorCommentButtons}>
                            <Box display="flex">
                                <ToggleButtonGroup
                                    value={selected}
                                    exclusive
                                    onChange={handleChangeAuditSwitch}
                                    aria-label="problem solution switch"
                                    sx={{
                                        display: 'flex'
                                    }}
                                >
                                    <CustomToggleButton
                                        value="problem"
                                        aria-label="problem"
                                        selectedcolor="#fee4e1"
                                        className={
                                            selected === 'problem' ? styles.problem : styles.solution
                                        }
                                        style={{
                                            color: selected === 'problem' ? '#f94839' : '#647491'
                                        }}
                                    >
                                        Problem
                                    </CustomToggleButton>
                                    <CustomToggleButton
                                        value="solution"
                                        aria-label="solution"
                                        selectedcolor="#E6F4EA"
                                        className={
                                            selected === 'solution' ? styles.solution : styles.problem
                                        }
                                        style={{
                                            color: selected === 'solution' ? '#00C853' : '#647491'
                                        }}
                                    >
                                        Solution
                                    </CustomToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                            <Box className={styles.add_comment}>Add Comment</Box>
                        </Box>
                    </Box>
                </Box>
            </div>

            {/* Left Section of Single Ticket Detail Page */}

            <div className={styles.sidebar_box}>
                <div className={styles.side_bar}>
                    <SingleTicketSideBar
                        reminderLists={matchedObjects}
                        reschedulerList={callReschedulerData}
                    />
                </div>
            </div>
        </div >
    );
};

export default AuditSinglePageDetail;
