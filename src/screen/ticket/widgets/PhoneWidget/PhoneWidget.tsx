import React, { useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import styles from './PhoneWidget.module.css';
import phoneIcon from '../../../../assets/phoneIcon.svg';
import avatar1 from '../../../../assets/avatar1.svg';
import expandIcon from '../../../../assets/expandIcon.svg';
import collapseIcon from '../../../../assets/collapseIcon.svg';
import { Button } from 'react-bootstrap';
import useTicketStore from '../../../../store/ticketStore';
import CloseModalIcon from '../../../../assets/CloseModalIcon.svg';


const PhoneWidget = () => {
    const { setPhoneModal, phoneModal } = useTicketStore();
    const [sendMessage, setSendMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
            <Box className={phoneModal ? styles.openedModal : ''}>
                {/* this is the modal close icon  */}

                {phoneModal && (
                    <Stack
                        className={styles.reminder_modal_title}
                        direction="row"
                        spacing={1}
                        display="flex"
                        alignItems="center"
                    >
                        <Stack>Phone Call</Stack>

                        <Stack
                            className={styles.modal_close}
                            onClick={() => setPhoneModal(false)}
                        >
                            <img src={CloseModalIcon} alt="" />
                        </Stack>
                    </Stack>
                )}

                {/* Box for showing audio */}
                <Box height={'40vh'}>
                    <Box display={'flex'} justifyContent={'start'} padding={2}>
                        <Box className={styles.callImageIcon}>
                            <img src={phoneIcon} alt="" />
                        </Box>
                        <Box className={styles.phoneReply}>
                            <Box className={styles.audio}>
                                <audio controls>
                                    <source src={''} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </Box>

                            <Box
                                display={'flex'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Box className={styles.phoneReplyDateTime}>
                                    12 April 2024 09:30AM
                                </Box>
                                <Box width="1.25rem" height="1.25rem">
                                    <img src={avatar1} alt="" />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* For chat box  */}
                <Box
                    borderTop={2.5}
                    borderColor="#317AE2"
                    bottom={0}
                    bgcolor="white"
                    height={'25%'}
                >
                    <Box display={'flex'} justifyContent={'end'} marginTop={4} paddingRight={2}>
                        {phoneModal ? (
                            <img
                                src={collapseIcon}
                                alt=""
                                style={{ marginTop: -35, cursor: 'pointer' }}
                                onClick={() => setPhoneModal(false)}
                            />
                        ) : (
                            <img
                                src={expandIcon}
                                alt=""
                                style={{ marginTop: -35, cursor: 'pointer' }}
                                onClick={() => setPhoneModal(true)}
                            />
                        )}
                    </Box>
                    <Box display={'flex'} justifyContent={'center'} color={'#647491'} fontFamily={'Outfit, sans-serif'} fontSize={'1rem'} fontWeight={400}>
                        This a guided text will be added
                    </Box>
                    <Box className={styles.initiateCallButton}>
                        <span>
                            Initiate a Phone Call
                        </span>
                    </Box>
                </Box>
            </Box >
        </>
    );
};

export default PhoneWidget;
