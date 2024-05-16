import React, { useState } from "react";
import { Button, Menu, MenuItem, Modal, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddReminderWidget from "../widgets/AddReminderWidget";
import AddCallRescheduler from "../widgets/AddCallRescheduler";
import "../singleTicket.css";
const TaskBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [reminderModalOpen, setReminderModalOpen] = useState(false);
    const [reschedulerModalOpen, setReschedulerModalOpen] = useState(false);

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
            setReschedulerModalOpen(true);
        }
    };

    const handleOptionHover = (option) => {
        // Handle hover logic, such as displaying more information
    };

    return (
        <div>
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
                <p> + </p>New Task
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
            <AddReminderWidget isModalOpen={reminderModalOpen} setIsModalOpen={setReminderModalOpen} />
            <AddCallRescheduler setIsModalOpenCall={setReschedulerModalOpen} isModalOpenCall={reschedulerModalOpen} />
        </div >
    );
};

export default TaskBar;
