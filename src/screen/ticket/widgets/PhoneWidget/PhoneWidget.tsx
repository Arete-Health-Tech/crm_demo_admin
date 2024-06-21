import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography, Avatar } from '@mui/material';
import styles from './PhoneWidget.module.css';
import phoneIcon from '../../../../assets/phoneIcon.svg';
import expandIcon from '../../../../assets/expandIcon.svg';
import collapseIcon from '../../../../assets/collapseIcon.svg';
import { Button } from 'react-bootstrap';
import useTicketStore from '../../../../store/ticketStore';
import CloseModalIcon from '../../../../assets/CloseModalIcon.svg';
import useUserStore from '../../../../store/userStore';
import { iTicket } from '../../../../types/store/ticket';
import { useParams } from 'react-router-dom';
import NotFoundIcon from '../../../../assets/NotFoundTask.svg';

const PhoneWidget = () => {
    const { ticketID } = useParams();
    const { setPhoneModal, phoneModal, isAuditor, tickets } = useTicketStore();
    const [sendMessage, setSendMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { user } = useUserStore();
    const [currentTicket, setCurrentTicket] = useState<iTicket>();
    const [durations, setDurations] = useState<{ [key: string]: number }>({});

    const getTicketInfo = (ticketID: string | undefined) => {
        const fetchTicket = tickets.find((element) => ticketID === element._id);
        setCurrentTicket(fetchTicket);
        return fetchTicket;
    };

    const getAudioDuration = (url: string) => {
        return new Promise<number>((resolve, reject) => {
            const audio = new Audio(url);
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration);
            });
            audio.addEventListener('error', (e) => {
                reject(e);
            });
        });
    };

    useEffect(() => {
        const updateDurations = async () => {
            if (currentTicket?.phoneData) {
                const newDurations: { [key: string]: number } = {};
                for (const item of currentTicket.phoneData) {
                    if (item.recording) {
                        try {
                            const duration = await getAudioDuration(item.recording);
                            newDurations[item.recording] = duration;
                        } catch (e) {
                            console.error('Error loading audio:', e);
                        }
                    }
                }
                setDurations(newDurations);
            }
        };

        updateDurations();
    }, [currentTicket]);

    useEffect(() => {
        getTicketInfo(ticketID);
    }, [ticketID]);

    const hasRecording = currentTicket?.phoneData?.some((item) => item.recording !== null && durations[item.recording] > 0);

    const uniqueRecordings = new Set();

    return (
        <>
            <Box className={phoneModal ? styles.openedModal : ''}>
                {phoneModal && (
                    <Stack
                        className={styles.reminder_modal_title}
                        direction="row"
                        spacing={1}
                        display="flex"
                        alignItems="center"
                    >
                        <Stack>Phone Call</Stack>
                        <Stack className={styles.modal_close} onClick={() => setPhoneModal(false)}>
                            <img src={CloseModalIcon} alt="" />
                        </Stack>
                    </Stack>
                )}

                <Box className={!isAuditor ? styles.phoneBox : styles.AuditorphoneBox}>
                    {!hasRecording ? (
                        // <Box className={styles.noData}>
                        //     No data available
                        // </Box>
                        <Box
                            // className="NotFound-Page"
                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'center'}
                            sx={{
                                borderBottomLeftRadius: "20px",
                                borderBottomRightRadius: "20px"
                            }}
                        >
                            <Stack sx={{
                                alignItems: "center",
                                textAlign: "center",
                                marginTop: "30px",

                            }}><img width={'200px'} height={'200px'} src={NotFoundIcon} />
                            </Stack>
                            <Box textAlign={'center'} sx={{
                                font: "bold",
                                fontSize: "24px",
                                fontFamily: "Outfit,sans-serif"
                            }}>
                                No Data Available
                            </Box>

                        </Box>
                    ) : (
                        currentTicket?.phoneData?.map((item, index) => {
                            if (item.recording !== null && durations[item.recording] > 0 && !uniqueRecordings.has(item.recording)) {
                                uniqueRecordings.add(item.recording);
                                return (
                                    <Box key={index} display={'flex'} justifyContent={'start'} padding={2}>
                                        <Box className={styles.callImageIcon}>
                                            <img src={phoneIcon} alt="" />
                                        </Box>
                                        <Box className={styles.phoneReply}>
                                            <Box className={styles.audio}>
                                                <audio controls>
                                                    <source src={item.recording} type="audio/mpeg" />
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </Box>
                                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                                <Box className={styles.phoneReplyDateTime}>
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
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            }
                        })
                    )}
                </Box>

                {!isAuditor && (
                    <Box borderTop={2.5} borderColor="#317AE2" bottom={0} bgcolor="white" height={'25%'}>
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
                            <span>Initiate a Phone Call</span>
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default PhoneWidget;
