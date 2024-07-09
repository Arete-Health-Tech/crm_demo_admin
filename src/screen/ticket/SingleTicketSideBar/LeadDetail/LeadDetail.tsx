import { Box, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PatientDetail from './PatientDetail'
import useTicketStore from '../../../../store/ticketStore'
import { iTicket } from '../../../../types/store/ticket'
import { useParams } from 'react-router-dom'
import PatientRecord from './PatientRecord'

interface MyComponentProps {
    isLeadDetail: boolean;
}

const LeadDetail: React.FC<MyComponentProps> = ({ isLeadDetail }) => {

    const { ticketID } = useParams();
    const {
        tickets,
    } = useTicketStore();

    const [currentTicket, setCurrentTicket] = useState<iTicket>();
    // console.log(tickets, ticketID);

    useEffect(() => {
        const getTicketInfo = (ticketID: string | undefined) => {
            const fetchTicket = tickets.find((element) => ticketID === element._id);
            setCurrentTicket(fetchTicket);
        }
        getTicketInfo(ticketID);
    }, [ticketID, tickets])

    const formatDate = () => {
        const dateString = currentTicket?.createdAt;
        if (!dateString) {
            return '';
        }
        const date = new Date(dateString);
        const formattedDate = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
        return formattedDate;
    }

    const createdByName = () => {
        const name = currentTicket?.creator[0]?.['firstName'] + " " + currentTicket?.creator[0]?.['lastName'];
        if (!name) {
            return null;
        }
        return name;
    }


    return (
        <Box className="leadDetail-Container">
            <PatientDetail isPatient={isLeadDetail} />

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>



            <PatientRecord isPatient={isLeadDetail} />

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>

            <Box className="additional-detail">
                <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-Heading'>Additional Detail</Stack>
                </Box>
                {createdByName() && createdByName() !== "undefined undefined" && <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-title'>Created By:</Stack>
                    <Stack component='div' className='additional-detail-data' sx={{ textTransform: "capitalize" }}>{createdByName()}
                    </Stack>
                </Box>}
                <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-title'>Created On:</Stack>
                    <Stack component='div' className='additional-detail-data'>{formatDate()}</Stack>
                </Box>
            </Box>

        </Box>
    )
}

export default LeadDetail
