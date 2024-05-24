import React, { useRef, useState } from 'react';
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
    const [sendMessage, setSendMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { setSmsModal, smsModal } = useTicketStore();
    const { user, setUser } = useUserStore();
    const handleFileSelect = async (event) => {
        const selectedFile = event.target.files[0];
        //  console.log(selectedFile,"thisi s selected file")
        const formData = new FormData();

        // Append each Blob to the FormData object
        // console.log(consumerId, 'this is consimer id ');
        formData.append('images', selectedFile);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && sendMessage.trim() !== '') {
            // console.log('press enter');
            console.log('enter');
        }
    };

    return (
        <>
            <Box className={smsModal ? styles.openedModal : ''}>
                {/* this is the modal close icon  */}

                {smsModal && (
                    <Stack
                        className={styles.reminder_modal_title}
                        direction="row"
                        spacing={1}
                        display="flex"
                        alignItems="center"
                    >
                        {/* <NotificationAddOutlined /> */}
                        <Stack>SMS</Stack>

                        <Stack
                            className={styles.modal_close}
                            onClick={() => setSmsModal(false)}
                        >
                            <img src={CloseModalIcon} alt="" />
                        </Stack>
                    </Stack>
                )}

                {/* Box for showing messages */}
                <Box height={smsModal ? '70vh' : '38vh'}>
                    {/* patient reply box start */}
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
                    {/* patient reply box end */}

                    {/* reply box start */}

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
                                <Avatar sx={{ fontSize: '8px', bgcolor: 'orange' ,
                              height: '1rem',
                              width: '1rem',
                              margin: '0.3rem',
                              marginTop:'8px'
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
                    {/* reply box end */}
                </Box>

                {/* For sending the with chat box  */}
                <Box
                    borderTop={2.5}
                    borderColor="#317AE2"
                    bottom={0}
                    bgcolor="white"
                    height={smsModal ? '15%' : '25%'}
                >
                    <Stack p={1} spacing={2}>
                        <Box display="flex">
                            <textarea
                                value={sendMessage}
                                onChange={(e) => setSendMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter a Message"
                                style={{
                                    border: 0,
                                    width: '100%',
                                    height: '10vh',
                                    resize: 'none'
                                }}
                            />
                            {smsModal ? (
                                <img
                                    src={collapseIcon}
                                    alt=""
                                    style={{ marginTop: -35, cursor: 'pointer' }}
                                    onClick={() => setSmsModal(false)}
                                />
                            ) : (
                                <img
                                    src={expandIcon}
                                    alt=""
                                    style={{ marginTop: -35, cursor: 'pointer' }}
                                    onClick={() => setSmsModal(true)}
                                />
                            )}
                        </Box>
                        <Box display="flex" justifyContent="end" style={{ marginTop: -2 }}>
                            <Box
                                style={{
                                    cursor: sendMessage ? 'pointer' : 'not-allowed'
                                }}
                            >
                                <Typography color={sendMessage ? 'blue' : 'gray'}>
                                    Send
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </>
    );
};

export default SmsWidget;
