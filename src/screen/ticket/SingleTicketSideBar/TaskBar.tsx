import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Menu,
    MenuItem,
    Modal,
    Stack,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import commentHeader from '../../../assets/commentHeader.svg';
import AddReminderWidget from '../widgets/AddReminderWidget';
import AddCallRescheduler from '../widgets/AddCallRescheduler';
import MinimizeIcon from '@mui/icons-material/Minimize';
import '../singleTicket.css';
import useTicketStore from '../../../store/ticketStore';
import StarIcon from '../../../assets/star.svg';
import EmptyStarIcon from '../../../assets/EmptyStar.svg';
import NotFoundIcon from '../../../assets/NotFoundTask.svg';
import { iTicket } from '../../../types/store/ticket';
import { useParams } from 'react-router-dom';
import {
    getAuditFilterTicketsHandler,
    getTicketHandler
} from '../../../api/ticket/ticketHandler';
import { UNDEFINED } from '../../../constantUtils/constant';
import { format } from 'date-fns';
import { getAuditorCommentCount, markAsReadAuditComment } from '../../../api/ticket/ticket';
import { socket } from '../../../api/apiClient';

const TaskBar = () => {
    const { ticketID } = useParams();
    const boxRef = useRef<HTMLDivElement | null>(null);
    const {
      tickets,
      filterTickets,
      filterTicketsDiago,
      filterTicketsFollowUp,
      isAuditorFilterOn,
      setIsAuditorFilterOn
    } = useTicketStore();
    const { isModalOpenCall, setIsModalOpenCall, searchByName, pageNumber, allAuditCommentCount, setAllAuditCommentCount } = useTicketStore();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [reminderModalOpen, setReminderModalOpen] = useState(false);
    const [auditorCommentsOpen, setAuditorCommentsOpen] = useState(false);
    // const [reschedulerModalOpen, setReschedulerModalOpen] = useState(false);
    const [currentTicket, setCurrentTicket] = useState<iTicket>();
    useEffect(() => {
        const getTicketInfo = (ticketID: string | undefined) => {
            const fetchTicket = tickets.find((element) => ticketID === element._id);
            setCurrentTicket(fetchTicket);
        };
        getTicketInfo(ticketID);
    }, [ticketID, tickets]);

    const handleButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setAnchorEl(null);
        if (option === 'Reminder') {
            setReminderModalOpen(true);
        } else if (option === 'Rescheduler') {
            setIsModalOpenCall(true);
        }
    };

    const handleOptionHover = (option) => {
        // Handle hover logic, such as displaying more information
    };

    // from here the auditor's comment will show
    const auditorOpenCss = {
        display: auditorCommentsOpen ? '' : 'none',
        position: 'fixed',
        bottom: '7%',
        right: '2%',
        zIndex: '999999',
        border: '1px solid #66E6FF',
        borderRadius: 2,
        // padding: 1,
        backgroundColor: 'white',
        color: 'black',
        width: '20vw',
        height: '65vh',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
    };

    const auditorButton = {
        display: 'flex',
        marginLeft: 2,
        height: '2rem',
        maxHeight: '48.5rem',
        padding: '0rem 0.5rem 0rem 0.75rem',
        alignItems: 'center',
        gap: '0.5rem',
        borderRadius: '0.25rem',
        background: '#F6F7F9',
        cursor: 'pointer'
    };

    const auditorbuttonText = {
        display: 'flex',
        alignItem: 'center',
        color: '#080F1A',
        fontFamily: 'Outfit,san-serif',
        fontSize: '0.875rem',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '150 %' /* 1.3125rem */
    };

    const auditCount = {
        display: 'flex',
        width: '1rem',
        height: '1rem',
        padding: '0.625rem',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.625rem',
        borderRadius: '1rem',
        background: '#F94839',
        color: '#FFF',
        fontSize: '0.8rem',
        fontWeight: 500
    };


  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;


    const getTicketAuditorComments = async () => {
        if (!isAuditorFilterOn) {
            await getTicketHandler(UNDEFINED, 1, 'false', newFilter);
        } else {
            await getAuditFilterTicketsHandler();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy hh:mm a');
    };
    const [rating, setRating] = useState(0);

    //This is for closing the box of auditor comment
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                setAuditorCommentsOpen(false); // Close the box when clicking outside
            }
        };

        if (auditorCommentsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [auditorCommentsOpen]);


    const HandleMarkAsReadAuditComment = async () => {
        await markAsReadAuditComment(ticketID)
        const data = await getAuditorCommentCount(); // Resolve the promise here
        setAllAuditCommentCount({
            auditorCommentId: "",
            ticketid: "",
            unreadCount: data, // Set the resolved data here
        });
        await getTicketHandler(searchByName, pageNumber, 'false', newFilter);
    }

    useEffect(() => {

        // Check if socket is connected
        if (!socket.connected) {
            socket.connect();
        }

        const handleNewMessage = (data: any) => {
            setAllAuditCommentCount(data)
            HandleShowAuditorComment()
        };

        // Listen for the 'newMessage' event
        socket.on('auditorCommentAdded', handleNewMessage);

        return () => {
            socket.off('auditorCommentAdded', handleNewMessage); // Remove the event listener
            socket.disconnect();
        };
    }, [allAuditCommentCount]);

    const HandleShowAuditorComment = () => {
        const count = Object.entries(allAuditCommentCount.unreadCount).find(([key, value], index) => key === ticketID)
        return count !== undefined ? count[1] : 0
    }

    return (
        <Box>
            <Box display={'flex'}>
                <Box>
                    <Button
                        className="btn-task"
                        aria-controls="dropdown-menu"
                        aria-haspopup="true"
                        onClick={handleButtonClick}
                        sx={{
                            fontSize: '0.875rem',
                            fontFamily: ` "Outfit", sans-serif`,
                            backgroundColor: '#0566FF',
                            color: '#ffffff',
                            display: 'flex',
                            height: '32px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 'var(--8px, 8px)',
                            flexShrink: 0,
                            padding:
                                'var(--Spacing-0px, 0px) var(--12px, 12px) var(--Spacing-0px, 0px) var(--8px, 8px)',
                            textTransform: 'capitalize',
                            '&:hover': {
                                backgroundColor: '#0566FF'
                            }
                        }}
                    >
                        <Stack display={'flex'} flexDirection={'row'} gap={'3px'}>
                            <Stack> + </Stack>
                            <Stack sx={{ whiteSpace: 'nowrap' }}>New Task</Stack>
                        </Stack>
                    </Button>
                    <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <Menu
                            id="dropdown-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center'
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                            }}
                            sx={{
                                position: 'absolute',
                                left: '26px',
                                top: '-7px',
                                textAlign: 'left'
                            }}
                        >
                            <MenuItem
                                onClick={() => handleOptionClick('Reminder')}
                                onMouseEnter={() => handleOptionHover('Reminder')}
                                sx={{
                                    display: 'flex',
                                    height: '40px',
                                    fontSize: '14px',
                                    padding: '5px 60px 5px 10px',
                                    alignItems: 'center',
                                    gap: 'var(--12px, 12px)',
                                    alignSelf: 'stretch',
                                    fontFamily: `"Outfit",sans-serif`
                                }}
                            >
                                Reminder
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleOptionClick('Rescheduler')}
                                onMouseEnter={() => handleOptionHover('Rescheduler')}
                                sx={{
                                    display: 'flex',
                                    height: '40px',
                                    fontSize: '14px',
                                    padding: '5px 60px 5px 10px',
                                    alignItems: 'center',
                                    gap: 'var(--12px, 12px)',
                                    alignSelf: 'stretch',
                                    fontFamily: `"Outfit",sans-serif`
                                }}
                            >
                                Rescheduler
                            </MenuItem>
                        </Menu>
                    </div>
                </Box>
                {/* Audit Comments */}
                <Box>
                    <Box sx={auditorOpenCss} ref={boxRef}>
                        <Box
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                cursor: 'pointer'
                            }}
                        >
                            <Box p={1} style={auditorbuttonText}>
                                <img src={commentHeader} alt="" />
                                <Stack sx={{ marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>
                                    Auditor Comment
                                </Stack>
                            </Box>
                            <MinimizeIcon onClick={() => setAuditorCommentsOpen(false)} />
                        </Box>
                        <hr style={{ margin: '0rem 0rem' }} />
                        <Box className="commentsBox">
                            {currentTicket?.auditorcomment &&
                                currentTicket.auditorcomment.length > 0 ? (
                                <>
                                    {currentTicket.auditorcomment.map((item, index) => (
                                        <Box className="problemBox" key={index}>
                                            {item?.comments && (
                                                <Box className="problemText">{item?.comments}</Box>
                                            )}
                                            <Box className="problemBottomBox">
                                                <Box className="problemBottomDate">
                                                    {item?.Date
                                                        ? formatDate(item.Date)
                                                        : 'No date available'}
                                                </Box>
                                                {item?.result && (
                                                    <Box
                                                        // className={styles.problemBottomChip}
                                                        className={
                                                            item?.result === 'problem'
                                                                ? 'problemBottomChip'
                                                                : 'solutionBottomChip'
                                                        }
                                                    >
                                                        {item?.result}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <Box className="NotFound-Page">
                                        <img src={NotFoundIcon} />
                                        <Box
                                            textAlign={'center'}
                                            sx={{
                                                font: 'bold',
                                                fontSize: '24px',
                                                fontFamily: 'Outfit,sans-serif'
                                            }}
                                        >
                                            No Audit Comments
                                        </Box>
                                    </Box>
                                </>
                            )}
                        </Box>

                        <Box className="Rating">
                            <Stack className="Rating_title">Audit Rating</Stack>
                            <Stack className="Rating_star">
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
                                            {currentTicket?.auditorcomment &&
                                                currentTicket?.auditorcomment?.length > 0 ? (
                                                currentTicket.auditorcomment[
                                                    currentTicket.auditorcomment.length - 1
                                                ]?.ratings >= star ? (
                                                    <Stack className="Star_icon">
                                                        <img src={StarIcon} alt="starIcon" />
                                                    </Stack>
                                                ) : (
                                                    <Stack className="Star_icon">
                                                        <img src={EmptyStarIcon} alt="EmptyStarIcon" />
                                                    </Stack>
                                                )
                                            ) : 0 >= star ? (
                                                <Stack className="Star_icon">
                                                    <img src={StarIcon} alt="starIcon" />
                                                </Stack>
                                            ) : (
                                                <Stack className="Star_icon">
                                                    <img src={EmptyStarIcon} alt="EmptyStarIcon" />
                                                </Stack>
                                            )}
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Box>
                    </Box>
                    <Box
                        onClick={() => {
                            setAuditorCommentsOpen(true);
                            getTicketAuditorComments();
                            HandleMarkAsReadAuditComment()
                        }}
                        sx={auditorButton}
                    >
                        <img src={commentHeader} alt="" />
                        <Stack style={auditorbuttonText}>Auditor Comment</Stack>
                        {HandleShowAuditorComment() > 0 && <Stack sx={auditCount}>{HandleShowAuditorComment()}</Stack>}
                    </Box>
                </Box>
            </Box>
            <AddReminderWidget
                isModalOpen={reminderModalOpen}
                setIsModalOpen={setReminderModalOpen}
            />
            <AddCallRescheduler />
        </Box>
    );
};

export default TaskBar;
