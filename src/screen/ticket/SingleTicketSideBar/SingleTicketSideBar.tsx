import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import LeadDetail from './LeadDetail/LeadDetail';
import Tasks from './Task/Tasks';
import Document from './Document/Document';
import '../singleTicket.css';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../../api/apiClient';
import useTicketStore from '../../../store/ticketStore';

function SingleTicketSideBar({ reminderLists, reschedulerList }) {
    const { isAuditor } = useTicketStore();
    const [value, setValue] = useState('1');
    let isleaddetail = true;

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <TabContext value={value}>
            <Box className="box-container">
                <TabList
                    className="tab-list"
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    sx={{
                        '.Mui-selected': {
                            color: 'var(--Text-Black, #080F1A) !important'
                        }
                    }}
                >
                    <Tab
                        className="tab-label"
                        label="Lead Details"
                        value="1"
                        style={{ whiteSpace: 'nowrap' }}
                    />
                    {!isAuditor && <Tab className="tab-label" label="Tasks" value="2" />}
                    <Tab className="tab-label" label="Documents" value="3" />
                </TabList>
            </Box>
            <TabPanel
                sx={{
                    p: 0,
                    height: !isAuditor ? '100%' : '92%',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none' /* For Firefox */,
                    msOverflowStyle: 'none' /* For Internet Explorer and Edge */,
                    '&::-webkit-scrollbar': {
                        display: 'none' /* For Chrome, Safari, and Opera */
                    }
                }}
                value="1"
            >
                <LeadDetail isLeadDetail={isleaddetail} />
            </TabPanel>
            <TabPanel
                sx={{
                    p: 0,
                    height: '100%',
                    backgroundColor: '#ffffff'
                }}
                value="2"
            >
                <Tasks
                    reminderData={reminderLists}
                    callReschedulerData={reschedulerList}
                />
            </TabPanel>
            <TabPanel
                sx={{
                    p: 0,
                    height: !isAuditor ? '100%' : '92%',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none' /* For Firefox */,
                    msOverflowStyle: 'none' /* For Internet Explorer and Edge */,
                    '&::-webkit-scrollbar': {
                        display: 'none' /* For Chrome, Safari, and Opera */
                    }
                }}
                value="3"
            >
                <Document />
            </TabPanel>
        </TabContext>
    );
}

export default SingleTicketSideBar;
