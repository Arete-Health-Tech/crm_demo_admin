import { Box, Stack } from '@mui/material';
import React from 'react'
import QueryResolutionSideBar from './QueryResoltuionSIdeBar/QueryResolutionSideBar';
import QueryWigdet from './Wigdet/QueryWigdet';


const SingleQueryDetail = () => {
    return (
        <>
            <div className={"main-layout"}>

                {/* Left Side  */}

                <div className="stack-box">

                    <Box
                        className="Ticket-detail-card"
                        p={2}
                    >
                        <Stack
                            className="Ticket-detail-card-left"
                            display="flex"
                            flexDirection="row"
                        >
                            <Stack display="flex" flexDirection="column">
                                <Stack display="flex" flexDirection="row">
                                    <Stack className="Ticket-detail-card-left-name">
                                        Anoop Sharma
                                    </Stack>
                                    <Stack className="Ticket-detail-card-left-Gen-Age">

                                        <Stack className="Gen-Age">
                                            M
                                        </Stack>
                                        <Stack className="Gen-Age">
                                            23
                                        </Stack>

                                    </Stack>
                                </Stack>
                                <Stack className="Ticket-detail-card-left-uhid">
                                    <span>#UHID53647283</span>
                                </Stack>
                            </Stack>
                        </Stack>

                    </Box>

                    {/* Query Message Wigdet */}
                    <Box>
                        <QueryWigdet />
                    </Box>


                </div>

                {/* Right SideBar  */}
                <div className="sidebar-box" >
                    <div className="queryside-bar">
                        <QueryResolutionSideBar />
                    </div>
                </div >

            </div>
        </>
    )
}

export default SingleQueryDetail
