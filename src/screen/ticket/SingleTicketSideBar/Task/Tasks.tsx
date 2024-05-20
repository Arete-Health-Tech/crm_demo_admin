import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Stack, Tab } from '@mui/material';
import React, { useEffect, useState } from 'react'
import '../../singleTicket.css'
import ReminderList from './ReminderList';
import ReschedulerList from './ReschedulerList';
import NotFoundIcon from '../../../../assets/NotFoundTask.svg';


function Tasks({ reminderData, callReschedulerData }) {

    const [value, setValue] = React.useState('1');


    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (
        <Box className="task-container">

            <TabContext value={value}>
                <div className="task-list-container">
                    <TabList className="task-list"
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                        sx={{
                            '& .MuiTabs-indicator': {
                                display: 'none',
                            },
                            '.Mui-selected': {
                                backgroundColor: "#0566FF !important",
                                color: "#FFFFFF",
                                borderBottom: "none"
                            },

                        }}
                    >
                        <Tab className='task-label custom-tab' label="Reminders" value="1" />
                        <Tab className='task-label custom-tab' label="Call Rescheduler" value="2" />
                    </TabList>
                </div>
                <TabPanel className='reminderlist-container' sx={{ p: 0, height: '110%' }} value="1">
                    {reminderData.length > 0 ?
                        <ReminderList reminderData={reminderData} />
                        :
                        <Box className="NotFound-Page">
                            <img src={NotFoundIcon} />
                            <Stack className='NotFound-text'>No Data Found</Stack>
                            <Stack className='NotFound-subtext'>No Data Found</Stack>
                        </Box>}
                </TabPanel>
                <TabPanel className='reminderlist-container' sx={{ p: 0, height: '100%' }} value="2">
                    {callReschedulerData.length > 0 ?
                        <ReschedulerList callReschedulerData={callReschedulerData} />
                        :
                        <Box className="NotFound-Page">
                            <img src={NotFoundIcon} />
                            <Stack className='NotFound-text'>No Data Found</Stack>
                            <Stack className='NotFound-subtext'>No Data Found</Stack>
                        </Box>}
                </TabPanel>
            </TabContext>


        </Box>

    )
}

export default Tasks
