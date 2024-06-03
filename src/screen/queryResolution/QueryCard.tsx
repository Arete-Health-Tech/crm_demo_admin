import { Box, Stack } from '@mui/material'
import React from 'react'


const baseStyle = {
    fontFamily: 'Outfit, sans-serif',
    color: '#007BFF',
    padding: '0px 8px',
    borderRadius: '10px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 400,
    fontSize: '12px',
    gap: '4px',
    lineHeight: '18px',
};

const stageStyles = {
    'resolved': {
        ...baseStyle,
        color: "#08A742",
        backgroundColor: '#DAF2E3',

    },
    open: {
        ...baseStyle,
        color: "#0566FF",
        backgroundColor: '#DAE8FF',
    },
};

const QueryCard = ({ queryCard }) => {
    return (
        <>
            <Box
                p={2}
                bgcolor={'#FFFFFF'}
                my={1}
                sx={{
                    borderRadius: "var(--16px, 16px)",
                    width: '100%',
                    gap: "12px",
                    // 1px solid #0566FF
                    // borderTop: "1px solid #ACB8CB";
                    // borderRight: isSelected ? "1px solid #ACB8CB" : 'none',
                    // borderLeft: isSelected ? "1px solid #ACB8CB" : 'none',
                    '&:hover': {
                        bgcolor: '#EBEDF0',
                        cursor: 'pointer',
                    }
                }}
            >

                {/* Line 1 */}

                <Box className="ticket-card-line1" sx={{ marginTop: "2px" }}>

                    <Stack className='ticket-card-line1-left'>
                        {/* <Stack sx={stageStyle}> {stageName}</Stack> */}
                        <Stack sx={stageStyles[queryCard.status]}>{queryCard.status}</Stack>
                    </Stack>

                    <Stack className='ticketCard-Uhid'>#{queryCard.uhid}</Stack>

                </Box>

                {/* Line 2 */}

                <Box className="ticket-card-line1 line2">
                    <Stack className='ticket-card-name'>
                        {queryCard.patientName}
                    </Stack>

                    <Stack className='ticket-cardline2-right'>
                        <Stack className="ticket-card-Gender">
                            {queryCard.gender}
                        </Stack>
                        <Stack>{queryCard.age}</Stack>
                    </Stack>
                </Box>

                {/* ------- */}

                <Stack className="docName" marginTop={'5px'}>
                    {queryCard.description}
                </Stack>

                {/*  */}
                <Stack sx={{ borderTop: '2px solid #E1E6EE', marginTop: "10px" }}>
                    {/* Borders */}
                </Stack>


                <Stack className="ticket-card-line3" sx={{ justifyContent: "space-between" }}>

                    <Stack sx={{ display: "flex", flexDirection: "row !important", gap: "5px" }}>
                        <Stack className='Ticket-LeadAge' sx={{ fontSize: "12px !important", padding: "4px 0 0px 0" }}>
                            {queryCard.date}
                        </Stack>
                        <Stack className='Ticket-LeadAge' sx={{ fontSize: "12px !important", padding: "4px 0 0px 0" }}>
                            {queryCard.time}
                        </Stack>
                    </Stack>
                    <Stack sx={{ display: "flex", flexDirection: "row !important", gap: "5px" }}>
                        <Stack className='ticket-card-notification'>{queryCard.notifications}</Stack>
                    </Stack>
                </Stack>


            </Box>
        </>
    )
}

export default QueryCard
