import React, { useState } from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab } from '@mui/material';
import Box from '@mui/material/Box';
import QueryDocument from './QueryDocument/QueryDocument';
import QueryLeadDetails from './QueryLeadDetails/QueryLeadDetails';

const QueryResolutionSideBar = () => {
    const [value, setValue] = useState('1');


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
                    <Tab className="tab-label" label="Documents" value="2" />
                </TabList>
            </Box>
            <TabPanel
                sx={{
                    p: 0,
                    height: '100%',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}
                value="1"
            >
                <QueryLeadDetails />
            </TabPanel>
            <TabPanel
                sx={{
                    p: 0,
                    height: '104%',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }}
                value="2"
            >
                <QueryDocument />
            </TabPanel>
        </TabContext>
    );
}

export default QueryResolutionSideBar
