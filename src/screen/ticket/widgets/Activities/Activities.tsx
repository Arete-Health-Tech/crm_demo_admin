import React, { useEffect, useState } from 'react';
import styles from './Activities.module.css';
import ArrowUp from '../../../../assets/ArrowUp.svg';
import ArrowDown from '../../../../assets/ArrowDown.svg';
import activityIcon from '../../../../assets/activityIcon.svg';
import smsIcon from '../../../../assets/smsIcon.svg';
import whtsappIcon from '../../../../assets/whtsappIcon.svg';
import NotesIcon from '../../../../assets/NotesIcon.svg';
import phoneIcon from '../../../../assets/phoneIcon.svg';
import NotFoundIcon from '../../../../assets/NotFoundTask.svg';
import useTicketStore from '../../../../store/ticketStore';
import { useParams } from 'react-router-dom';
import { getActivityData } from '../../../../api/ticket/ticket';
import ReactHtmlParser from 'html-react-parser';
import { Box, Stack, Typography } from '@mui/material';

type ActivitiesType = Record<string, Record<string, string>>;

const Activities = () => {
    const { isAuditor, tickets, reminders, callRescheduler, estimates } = useTicketStore();
    const { ticketID } = useParams();
    const [activities, setActivities] = useState<ActivitiesType | null>(null);
    const [expandedMessages, setExpandedMessages] = useState<boolean[]>([]);

    useEffect(() => {
        if (activities !== null) {
            setExpandedMessages(Array(Object.keys(activities).length).fill(true));
        } else {
            setExpandedMessages([]);
        }
    }, [activities]);

    const handleToggle = (index: number) => {
        const newExpandedMessages = [...expandedMessages];
        newExpandedMessages[index] = !newExpandedMessages[index];
        setExpandedMessages(newExpandedMessages);
    };

    const handleActivityData = async () => {
        const res = await getActivityData(ticketID);
        console.log(res, "activity data")
        setActivities(res !== null ? res.data : null);
    };

    useEffect(() => {
        handleActivityData();
    }, [ticketID, tickets, reminders, callRescheduler, estimates]);

    const handleCheckKey = (key: string) => {
        return key.split('_')[0];
    };

    const extractDateTime = (message: string): string | null => {
        const regex = /on (.*? \d{2}:\d{2}:\d{2} GMT[+-]\d{4} \(.*?\))/;
        const match = message.match(regex);
        return match ? new Date(match[1]).toDateString() : null;
    };

    const hanleEstimateText = (value: string) => {
        const urlMatch = value.match(/href="([^"]*)"/);
        const url = urlMatch ? urlMatch[1] : '';

        // Remove the HTML tags
        const textWithoutTags = value.replace(/<\/?a[^>]*>/g, '');

        // Replace the URL in the original text with the extracted URL
        return textWithoutTags.replace(/https:\/\/[^ ]*/, url);
    }

    return (
        <div className={!isAuditor ? styles.activity : styles.auditActivity}>
            {activities !== null ? Object.entries(activities).reverse().map(([date, messages], index) => (
                <div key={date} style={{ marginTop: 5 }}>
                    {(handleCheckKey(date) !== 'ticketid' && handleCheckKey(date) !== '') && (
                        <div
                            className={styles.accordionTypeheader}
                            onClick={() => handleToggle(index)}
                        >
                            <span className={styles.accordionTypeTime}>{date}</span>
                            <img src={expandedMessages[index] ? ArrowDown : ArrowUp} alt="" />
                        </div>
                    )}
                    {expandedMessages[index] && Object.entries(messages).reverse().map(([key, value]) => (
                        <div key={key}>
                            {handleCheckKey(key) === 'ticketcreated' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value.split('on')[0]}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'WhatappSend' && (
                                // <div
                                //     style={{
                                //         display: 'flex',
                                //         height: 'auto',
                                //         padding: '1rem 0 1rem 2rem',
                                //         marginLeft: '2rem',
                                //         borderLeft: '1px solid #d4dbe5'
                                //     }}
                                // >
                                //     <img src={smsIcon} alt="" style={{ marginRight: 4 }} />
                                //     <div className={styles.content}>
                                //         {value}
                                //         <div className={styles.time}>{extractDateTime(value)}</div>
                                //     </div>
                                // </div>
                                <Box display={'flex'} height={'auto'} padding={"1rem 0 0rem 0rem"} marginLeft={'2rem'} borderLeft={'1px solid #d4dbe5'}>
                                    <img src={whtsappIcon} alt="" style={{ marginLeft: 22, marginTop: '-1.5rem' }} />
                                    <Box
                                        border={'1px solid #25D366'}
                                        boxShadow=" 0 1px .5px rgba(11,20,26,.13)"
                                        my={2}
                                        marginLeft={0.5}
                                        maxWidth="50%"
                                        p={1}
                                        bgcolor="var(--Communication-Color-Whatsapp-Bg, #DEF8E8)"
                                        borderRadius="10px"
                                    >
                                        {value && (
                                            <Typography
                                                color="var(--Text-Black, #080F1A)"
                                                fontFamily={'Outfit,sans-serif'}
                                                fontSize={'0.875rem'}
                                                fontWeight={400}
                                            >
                                                {value.split('on')[0]}
                                            </Typography>
                                        )}
                                        {/* <div className={styles.content}> */}
                                        {/* {value} */}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                        {/* </div> */}
                                    </Box>
                                </Box>
                            )}
                            {handleCheckKey(key) === 'Probability' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value.split('on')[0]}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'SkipEstimate' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value.split('on')[0]}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'changedSubStage' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value.split('on')[0]}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'Service' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value.split('on')[0]}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'OutboundCall' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={phoneIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.callContent}>
                                        {value.split('on')[0]}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'note' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '1.8rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={NotesIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.notestextArea}>
                                        {ReactHtmlParser(value)}
                                        {/* {value} */}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'assingne' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value.split('on')[0]}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'Estimate' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {hanleEstimateText(value)}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'reminder' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value.split('on')[0]}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'Rescheduler' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value.split('on')[0]}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                             {handleCheckKey(key) === 'Status' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 0rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value.split('on')[0]}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))
                : (
                    <Box
                        // className="NotFound-Page"
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
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
                            No Activity Available
                        </Box>

                    </Box>
                )
            }
        </div>
    );
};

export default Activities;
