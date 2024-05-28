import React, { useState } from "react";
import { Box, Button, Menu, MenuItem, Modal, Stack, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import commentHeader from "../../../assets/commentHeader.svg"
import AddReminderWidget from "../widgets/AddReminderWidget";
import AddCallRescheduler from "../widgets/AddCallRescheduler";
import MinimizeIcon from "@mui/icons-material/Minimize";
import "../singleTicket.css";
import useTicketStore from "../../../store/ticketStore";
const TaskBar = () => {
    const { isModalOpenCall, setIsModalOpenCall } = useTicketStore();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [reminderModalOpen, setReminderModalOpen] = useState(false);
    const [auditorCommentsOpen, setAuditorCommentsOpen] = useState(false);
    // const [reschedulerModalOpen, setReschedulerModalOpen] = useState(false);

    const handleButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setAnchorEl(null);
        if (option === "Reminder") {
            setReminderModalOpen(true);
        } else if (option === "Rescheduler") {
            setIsModalOpenCall(true);
        }
    };

    const handleOptionHover = (option) => {
        // Handle hover logic, such as displaying more information
    };

    // from here the auditor's comment will show
    const auditorOpenCss = {
        display: auditorCommentsOpen ? "" : 'none',
        position: "fixed",
        bottom: "7%",
        right: "2%",
        zIndex: "999999",
        border: "1px solid #66E6FF",
        borderRadius: 2,
        padding: 1,
        backgroundColor: "white",
        color: "black",
        width: "20vw",
        height: "65vh"
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
        display: "flex",
        alignItem: 'center',
        color: "#080F1A",
        fontFamily: 'Outfit,san-serif',
        fontSize: '0.875rem',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '150 %', /* 1.3125rem */
    }

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
    }


    return (
        <Box>
            <Box display={'flex'}>
                <Box>
                    <Button className="btn-task"
                        aria-controls="dropdown-menu"
                        aria-haspopup="true"
                        onClick={handleButtonClick}
                        sx={{
                            fontSize: "0.875rem",
                            fontFamily: ` "Outfit", sans-serif`,
                            backgroundColor: "#0566FF",
                            color: "#ffffff",
                            display: "flex",
                            height: "32px",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "var(--8px, 8px)",
                            flexShrink: 0,
                            padding: "var(--Spacing-0px, 0px) var(--12px, 12px) var(--Spacing-0px, 0px) var(--8px, 8px)",
                            textTransform: "capitalize",
                            "&:hover": {
                                backgroundColor: "#0566FF",
                            },
                        }}
                    >
                        <Stack display={'flex'} flexDirection={'row'} gap={'3px'}><Stack> + </Stack><Stack>New Task</Stack></Stack>
                    </Button>
                    <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <Menu
                            id="dropdown-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            sx={{
                                position: 'absolute',
                                left: '26px',
                                top: '-7px',
                                textAlign: 'left',
                            }}
                        >
                            <MenuItem
                                onClick={() => handleOptionClick("Reminder")}
                                onMouseEnter={() => handleOptionHover("Reminder")}
                                sx={{
                                    display: "flex",
                                    height: "40px",
                                    fontSize: "14px",
                                    padding: "5px 60px 5px 10px",
                                    alignItems: "center",
                                    gap: "var(--12px, 12px)",
                                    alignSelf: "stretch",
                                    fontFamily: `"Outfit",sans-serif`,
                                }}
                            >
                                Reminder
                            </MenuItem>
                            <MenuItem
                                onClick={() => handleOptionClick("Rescheduler")}
                                onMouseEnter={() => handleOptionHover("Rescheduler")}
                                sx={{
                                    display: "flex",
                                    height: "40px",
                                    fontSize: "14px",
                                    padding: "5px 60px 5px 10px",
                                    alignItems: "center",
                                    gap: "var(--12px, 12px)",
                                    alignSelf: "stretch",
                                    fontFamily: `"Outfit",sans-serif`
                                }}
                            >
                                Rescheduler
                            </MenuItem>
                        </Menu>
                    </div>
                </Box>
                <Box>
                    <Box sx={auditorOpenCss}>
                        <Box
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                cursor: "pointer",
                            }}
                        >
                            <Box style={auditorbuttonText}>
                                <img src={commentHeader} alt="" />
                                <Stack sx={{ marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>
                                    Auditor Comment
                                </Stack>
                            </Box>
                            <MinimizeIcon onClick={() => setAuditorCommentsOpen(false)} />
                        </Box>
                        <hr style={{ margin: '0.5rem 0rem' }} />
                        <Box className="commentsBox">
                            <Box className="problemBox">
                                <Box className="problemText">
                                    No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                </Box>
                                <Box className="problemBottomBox">
                                    <Box className="problemBottomDate">
                                        12 April 2024 09:30AM
                                    </Box>
                                    <Box className="problemBottomChip">
                                        Problem
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="problemBox">
                                <Box className="problemText">
                                    No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                </Box>
                                <Box className="problemBottomBox">
                                    <Box className="problemBottomDate">
                                        12 April 2024 09:30AM
                                    </Box>
                                    <Box className="solutionBottomChip">
                                        Solution
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="problemBox">
                                <Box className="problemText">
                                    No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                </Box>
                                <Box className="problemBottomBox">
                                    <Box className="problemBottomDate">
                                        12 April 2024 09:30AM
                                    </Box>
                                    <Box className="problemBottomChip">
                                        Problem
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="problemBox">
                                <Box className="problemText">
                                    No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                </Box>
                                <Box className="problemBottomBox">
                                    <Box className="problemBottomDate">
                                        12 April 2024 09:30AM
                                    </Box>
                                    <Box className="solutionBottomChip">
                                        Solution
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="problemBox">
                                <Box className="problemText">
                                    No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                </Box>
                                <Box className="problemBottomBox">
                                    <Box className="problemBottomDate">
                                        12 April 2024 09:30AM
                                    </Box>
                                    <Box className="problemBottomChip">
                                        Problem
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="problemBox">
                                <Box className="problemText">
                                    No follow-up after the patient reported acetaminophen not helping on April 12th. The ticket was marked 'WON' without resolving the patient's concerns, leading to potential dissatisfaction and health risks.
                                </Box>
                                <Box className="problemBottomBox">
                                    <Box className="problemBottomDate">
                                        12 April 2024 09:30AM
                                    </Box>
                                    <Box className="solutionBottomChip">
                                        Solution
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        onClick={() => setAuditorCommentsOpen(true)}
                        sx={auditorButton}
                    >
                        <img src={commentHeader} alt="" />
                        <Stack style={auditorbuttonText}>
                            Auditor Comment
                        </Stack>
                        <Stack sx={auditCount}>
                            3
                        </Stack>
                    </Box>
                </Box>
            </Box>
            <AddReminderWidget isModalOpen={reminderModalOpen} setIsModalOpen={setReminderModalOpen} />
            <AddCallRescheduler />
        </Box >
    );
};

export default TaskBar;
