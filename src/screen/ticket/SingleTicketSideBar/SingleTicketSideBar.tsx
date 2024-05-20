import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Stack, Tab } from '@mui/material';
import Box from '@mui/material/Box'
import React, { useState, useEffect } from 'react'
import LeadDetail from './LeadDetail/LeadDetail';
import Tasks from './Task/Tasks';
import Document from './Document/Document'
import "../singleTicket.css";
import { BorderRightRounded } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../../api/apiClient';

function SingleTicketSideBar({ reminderLists, reschedulerList }) {
    const [value, setValue] = useState('1');
    let isleaddetail: boolean = true;

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <TabContext value={value} >
            <Box className="box-container">
                <TabList className="tab-list"
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    sx={{
                        '.Mui-selected': {
                            color: "var(--Text-Black, #080F1A) !important",
                        },

                    }}
                >
                    <Tab className='tab-label' label="Lead Details" value="1" style={{ whiteSpace: 'nowrap' }} />
                    <Tab className='tab-label' label="Tasks" value="2" />
                    <Tab className='tab-label' label="Documents" value="3" />
                </TabList>
            </Box>
            <TabPanel sx={{ p: 0, height: '100%' }} value="1">
                <LeadDetail isLeadDetail={isleaddetail} />
            </TabPanel>
            <TabPanel sx={{ p: 0, height: '100%', backgroundColor: "#ffffff" }} value="2">
                <Tasks reminderData={reminderLists} callReschedulerData={reschedulerList} />
            </TabPanel>
            <TabPanel sx={{ p: 0, height: '100%' }} value="3">
                <Document />
            </TabPanel>
        </TabContext>
    )
}

export default SingleTicketSideBar
