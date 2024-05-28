import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import styles from './SmsWidget.module.css';
import smsIcon from '../../../../assets/smsIcon.svg';
// import avatar1 from '../../../../assets/avatar1.svg';
import expandIcon from '../../../../assets/expandIcon.svg';
import collapseIcon from '../../../../assets/collapseIcon.svg';
import CloseModalIcon from '../../../../assets/CloseModalIcon.svg';
import { Button } from 'react-bootstrap';
import useTicketStore from '../../../../store/ticketStore';
import { Avatar } from '@mui/material';
import useUserStore from '../../../../store/userStore';
const SmsWidget = () => {
    const smsRef = useRef<HTMLTextAreaElement>(null);
    const [sendMessage, setSendMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { setSmsModal, smsModal, isAuditor } = useTicketStore();
    const { user, setUser } = useUserStore();
    const handleFileSelect = async (event) => {
        const selectedFile = event.target.files[0];
        const formData = new FormData();
        formData.append('images', selectedFile);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && sendMessage.trim() !== '') {
            console.log('enter');
        }
    };

    useEffect(() => {
        if (smsRef.current) {
            smsRef.current.style.height = 'auto'; // Reset height to auto to get the actual scrollHeight
            const maxHeight = window.innerHeight * 0.08; // 8vh of the window height
            smsRef.current.style.height = `${Math.min(smsRef.current.scrollHeight, maxHeight)}px`; // Set the height with a max limit of 8vh
        }
    }, [sendMessage]);

    return (
        <>
            <Box className={smsModal ? styles.openedModal : ''}>
                {smsModal && (
                    <Stack
                        className={styles.reminder_modal_title}
                        direction="row"
                        spacing={1}
                        display="flex"
                        alignItems="center"
                    >
                        <Stack>SMS</Stack>
                        <Stack
                            className={styles.modal_close}
                            onClick={() => setSmsModal(false)}
                        >
                            <img src={CloseModalIcon} alt="" />
                        </Stack>
                    </Stack>
                )}

                <Box height={smsModal ? '70vh' : isAuditor ? "40vh" : '46vh'}>
                    <Box display={'flex'} justifyContent={'start'} padding={2}>
                        <Box className={styles.callImageIcon}>
                            <img src={smsIcon} alt="" />
                        </Box>
                        <Box className={styles.smsPatientReply}>
                            Hi, I'm not feeling well and would like some advice on what to do.
                            <Box className={styles.smsPatientReplyDateTime}>
                                12 April 2024 09:30AM
                            </Box>
                        </Box>
                    </Box>

                    <Box display={'flex'} justifyContent={'end'} padding={2}>
                        <Box className={styles.smsReply}>
                            Hi, I'm not feeling well and would like some advice on what to do.
                            <Box
                                display={'flex'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Box className={styles.smsReplyDateTime}>
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
                            <img src={smsIcon} alt="" />
                        </Box>
                    </Box>
                </Box>

                {!isAuditor && <Box
                    borderTop={2.5}
                    borderColor="#317AE2"
                    bottom={0}
                    bgcolor="white"
                    height={smsModal ? '15%' : '25%'}
                >
                    <Stack p={1} spacing={2}>
                        <Box display="flex">
                            <textarea
                                ref={smsRef}
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
                            {!smsModal && <img
                                src={expandIcon}
                                alt=""
                                style={{ width: '1rem', marginLeft: 10, cursor: 'pointer', alignSelf: 'flex-end', marginBottom: '0.5rem' }}
                                onClick={() => setSmsModal(true)}
                            />}
                        </Box>
                    </Stack>
                </Box>}
            </Box>
        </>
    );
};

export default SmsWidget;
