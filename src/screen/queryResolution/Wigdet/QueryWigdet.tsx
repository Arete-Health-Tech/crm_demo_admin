import { Avatar, Box, Stack, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import styles from './query.module.css'
import WhatsappIcon from '../../../assets/whtsappIcon.svg'
import DocumentIcon from '../../../assets/DocumentCircleIcon.svg'
import useUserStore from '../../../store/userStore'

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

const QueryWigdet = () => {
    const queryRef = useRef<HTMLTextAreaElement>(null);
    const [sendMessage, setSendMessage] = useState('');
    const { user, setUser } = useUserStore();
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && sendMessage.trim() !== '') {
            console.log('enter');
        }
    };

    return (
        <>
            <Box >

                <Box height={'72vh'} className={styles.QueryResolution}>

                    <Box display={'flex'} justifyContent={'center'} padding={2}>
                        <Box >
                            <img src={DocumentIcon} alt="" />
                        </Box>
                        <Box className={styles.queryPatient_query}>
                            <Stack className={styles.query_Head}>
                                <Stack>Patient asking about the Insurance claim</Stack>
                                <Stack sx={stageStyles["open"]}>Open</Stack>
                            </Stack>
                            <Stack className={styles.queryPatient_query_content} >
                                Patient inquired about the status of their insurance claim related to the recent surgical procedure. Detailed information about the patient's insurance policy and the claim process has been provided. The patient was advised on the necessary documentation to expedite the claim process. A follow-up appointment has been scheduled.
                            </Stack>
                            <Box
                                display={'flex'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Box className={styles.queryReplyDateTime}>
                                    12 April 2024 09:30AM
                                </Box>
                                <Box width="1.25rem" height="1.25rem">
                                    <Avatar sx={{
                                        fontSize: '8px', bgcolor: 'orange',
                                        height: '1rem',
                                        width: '1rem',
                                        margin: '0.3rem',
                                        marginTop: '8px'
                                    }}>
                                        {user?.firstName[0]?.toUpperCase()}
                                        {user?.lastName[0]?.toUpperCase()}
                                    </Avatar>
                                    {/* <img src={avatar1} alt="" /> */}
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box display={'flex'} justifyContent={'start'} padding={2}>
                        <Box className={styles.callImageIcon}>
                            <img src={WhatsappIcon} alt="" />
                        </Box>
                        <Box className={styles.queryPatientReply}>
                            Hi, I'm not feeling well and would like some advice on what to do.
                            <Box className={styles.queryPatientReplyDateTime}>
                                12 April 2024 09:30AM
                            </Box>
                        </Box>
                    </Box>

                    <Box display={'flex'} justifyContent={'end'} padding={2}>
                        <Box className={styles.queryReply}>
                            Hi, I'm not feeling well and would like some advice on what to do.
                            <Box
                                display={'flex'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Box className={styles.queryReplyDateTime}>
                                    12 April 2024 09:30AM
                                </Box>
                                <Box width="1.25rem" height="1.25rem">
                                    <Avatar sx={{
                                        fontSize: '8px', bgcolor: 'orange',
                                        height: '1rem',
                                        width: '1rem',
                                        margin: '0.3rem',
                                        marginTop: '8px'
                                    }}>
                                        {user?.firstName[0]?.toUpperCase()}
                                        {user?.lastName[0]?.toUpperCase()}
                                    </Avatar>
                                    {/* <img src={avatar1} alt="" /> */}
                                </Box>
                            </Box>
                        </Box>
                        <Box className={styles.callImageIcon}>
                            <img src={WhatsappIcon} alt="" />
                        </Box>
                    </Box>

                </Box>

                <Box
                    borderTop={2.5}
                    borderColor="#317AE2"
                    bottom={0}
                    bgcolor="white"
                    height={'25%'}
                >
                    <Stack p={1} spacing={2}>
                        <Box display="flex">
                            <textarea
                                ref={queryRef}
                                value={sendMessage}
                                onChange={(e) => setSendMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter a Message"
                                className={styles.replytextArea}
                                style={{ maxHeight: '8vh', margin: "0px 8px" }}
                            />
                            <Box
                                className={sendMessage ? styles.sendButtonActive : styles.sendButton}
                            >
                                <Typography className={sendMessage ? styles.sendButtonTextActive : styles.sendButtonText}>
                                    Send
                                </Typography>
                            </Box>

                        </Box>
                    </Stack>
                </Box>
            </Box>
        </>
    )
}

export default QueryWigdet
