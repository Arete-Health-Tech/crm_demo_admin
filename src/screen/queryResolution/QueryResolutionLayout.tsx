import { Alert, Box, Stack } from '@mui/material';
import React, { useEffect } from 'react'
import TicketFilter from '../ticket/widgets/TicketFilter';
import { FilterList } from '@mui/icons-material';
import QueryCard from './QueryCard';
import DefaultScreen from '../../components/DefaultScreen';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SingleQueryDetail from './SingleQueryDetail';
import { getTicketHandler } from '../../api/ticket/ticketHandler';
import { UNDEFINED } from '../../constantUtils/constant';
import { getDoctorsHandler } from '../../api/doctor/doctorHandler';
import { getDepartmentsHandler } from '../../api/department/departmentHandler';
import useTicketStore from '../../store/ticketStore';

const QueryCards = [
    {
        id: 1,
        status: "open",
        uhid: "UHID53647283",
        patientName: "Anoop Sharma",
        gender: "M",
        age: 23,
        description: "Patient asking about the Insurance claim.",
        date: "12 April 2023",
        time: "09:30PM",
        notifications: 2
    },
    {
        id: 2,
        status: "open",
        uhid: "UHID53647284",
        patientName: "Rohit Singh",
        gender: "M",
        age: 30,
        description: "Patient inquiring about prescription refill.",
        date: "13 April 2023",
        time: "10:00AM",
        notifications: 3
    },
    {
        id: 3,
        status: "resolved",
        uhid: "UHID53647285",
        patientName: "Neha Patel",
        gender: "F",
        age: 28,
        description: "Patient needs to schedule a follow-up appointment.",
        date: "14 April 2023",
        time: "11:00AM",
        notifications: 1
    },
    {
        id: 4,
        status: "resolved",
        uhid: "UHID536472345",
        patientName: "Virat Kholi",
        gender: "M",
        age: 35,
        description: "Patient needs to schedule a follow-up appointment.",
        date: "15 April 2023",
        time: "12:00AM",
        notifications: 5
    }
];


const QueryResolutionLayout = () => {

    const currentRoute = useMatch('queryResolutionLayout');

    return (
        <>
            <Box height={'100vh'} display="flex" position="fixed" width="100%">
                <Box
                    bgcolor="#F6F7F9"
                    width="23%"
                    position="sticky"
                    top={0}
                    p={'2rem 0.5rem 2rem 0.5rem'}
                >
                    <Box
                        px={1}
                        height={'15vh'}
                        display={'flex'}
                        flexDirection={'column'}
                        gap={"30%"}
                    >


                        <Stack
                            className="Ticket-Assignee-title"
                            sx={{
                                marginLeft: '3px',
                                fontSize: '24px !important',
                                fontStyle: 'normal',
                                fontWeight: '500'
                            }}
                        >
                            Queries
                        </Stack>



                        <Box display={'flex'} flexDirection={'column'}>
                            <Box
                                display={'flex'}
                                flexDirection={'row'}
                                justifyContent={'space-between'}
                                gap={'10px'}
                            >
                                <Stack width={'95%'} position={'relative'}>
                                    <span className="search-icon">
                                        {' '}
                                        <SearchIcon />
                                    </span>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder=" Search..."
                                    // onKeyDown={handleSearchKeyPress}
                                    />
                                </Stack>

                                <Stack marginRight={'-10px'}>
                                    <FilterList sx={{ color: "#080F1A" }} />
                                </Stack>
                            </Box>
                        </Box>


                    </Box>

                    <Box
                        position="relative"
                        px={1}
                        height={'71vh'}
                        sx={{
                            overflowY: 'scroll',
                            '&::-webkit-scrollbar ': {
                                display: 'none'
                            }
                        }}
                    >
                        {QueryCards.map((queryCard) => (
                            <QueryCard key={queryCard.id} queryCard={queryCard} />
                        ))}

                    </Box>

                    <Box>
                    </Box>
                </Box>

                <Box bgcolor="#F6F7F9" width="73%">
                    {/* {currentRoute ? <DefaultScreen /> : <Outlet />} */}
                    <SingleQueryDetail />
                </Box>

            </Box>
        </>
    )
}

export default QueryResolutionLayout
