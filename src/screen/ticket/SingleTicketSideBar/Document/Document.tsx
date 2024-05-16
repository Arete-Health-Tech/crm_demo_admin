import { Box, Stack } from '@mui/material'
import React from 'react'
import NotFoundIcon from "../../../../assets/NotFoundDocument.svg"
import "../../singleTicket.css"

const Document = () => {
    return (
        <Box className="document-container">
            <Stack><img src={NotFoundIcon} /></Stack>
            <Box className="NotFound-DocumentPage">

                <Stack className='NotFound-text'>No Document Found</Stack>
                <Stack className='NotFound-subtext'>No Document Found</Stack>
            </Box>
        </Box>
    )
}

export default Document
