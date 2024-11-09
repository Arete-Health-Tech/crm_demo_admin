import React, { useEffect, useState } from 'react';
import styles from './Activities.module.css';
import ArrowUp from '../../../../assets/AddIcon.svg';
import ArrowDown from '../../../../assets/Substract.svg';
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
import DOMPurify from 'dompurify';

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
   
    let sanitizedContent

    const hanleEstimateText = (value: string) => {
        const sanitizedContent = DOMPurify.sanitize(value);
        return sanitizedContent
    }

    const handleLinks = () => {
        const links = document.querySelectorAll<HTMLAnchorElement>('#content-container a');
        links.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            link.addEventListener('click', (event) => {
                event.preventDefault();
                window.open(link.href, '_blank');
            });
        });
    };


    // Effect to add event listeners after component mounts
    useEffect(() => {
        handleLinks();
    }, [sanitizedContent]);

    const activityUi = (value: any) => {
        return (
            <>
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
            </>
        )
    }

    return (
      <div className={!isAuditor ? styles.activity : styles.auditActivity}>
        {activities !== null ? (
          Object.entries(activities)
            .reverse()
            .map(([date, messages], index) => (
              <div key={date} style={{ marginTop: 5 }}>
                {handleCheckKey(date) !== 'ticketid' &&
                  handleCheckKey(date) !== '' && (
                    <div
                      className={styles.accordionTypeheader}
                      onClick={() => handleToggle(index)}
                    >
                      <span className={styles.accordionTypeTime}>{date}</span>
                      <img
                        src={expandedMessages[index] ? ArrowDown : ArrowUp}
                        alt=""
                      />
                    </div>
                  )}
                {expandedMessages[index] &&
                  Object.entries(messages)
                    .reverse()
                    .map(([key, value]) => (
                      <div key={key}>
                        {handleCheckKey(key) === 'ticketcreated' &&
                          activityUi(value)}
                        {handleCheckKey(key) === 'WhatappSend' && (
                          <Box
                            display={'flex'}
                            height={'auto'}
                            padding={'1rem 0 0rem 0rem'}
                            marginLeft={'2rem'}
                            borderLeft={'1px solid #d4dbe5'}
                          >
                            <img
                              src={whtsappIcon}
                              alt=""
                              style={{ marginLeft: 22, marginTop: '-1.5rem' }}
                            />
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
                              <div className={styles.time}>
                                {extractDateTime(value)}
                              </div>
                              {/* </div> */}
                            </Box>
                          </Box>
                        )}
                        {handleCheckKey(key) === 'Probability' &&
                          activityUi(value)}
                        {handleCheckKey(key) === 'SkipEstimate' &&
                          activityUi(value)}
                        {handleCheckKey(key) === 'changedSubStage' &&
                          activityUi(value)}
                        {handleCheckKey(key) === 'Service' && activityUi(value)}
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
                            <img
                              src={phoneIcon}
                              alt=""
                              style={{ marginRight: 4 }}
                            />
                            <div className={styles.callContent}>
                              {value.split('on')[0]}
                              <div className={styles.time}>
                                {extractDateTime(value)}
                              </div>
                            </div>
                          </div>
                        )}
                        {handleCheckKey(key) === 'note' && (
                          <div
                            style={{
                              display: 'flex',
                              height: 'auto',
                              padding: '1rem 0 0rem 2rem',
                              marginLeft: '2rem',
                              borderLeft: '1px solid #d4dbe5'
                            }}
                          >
                            <img
                              src={NotesIcon}
                              alt=""
                              style={{ marginRight: 4 }}
                            />
                            <div className={styles.notestextArea}>
                              {ReactHtmlParser(value.split('is created')[0])}
                              {/* {value} */}
                              <div className={styles.time}>
                                {extractDateTime(value)}
                              </div>
                            </div>
                          </div>
                        )}
                        {handleCheckKey(key) === 'assingne' &&
                          activityUi(value)}
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
                            <img
                              src={activityIcon}
                              alt=""
                              style={{ marginRight: 4 }}
                            />
                            <div className={styles.otherContent}>
                              <div
                                id="content-container"
                                dangerouslySetInnerHTML={{
                                  __html: hanleEstimateText(value)
                                }}
                              />
                              {/* <div className={styles.time}>{extractDateTime(value)}</div> */}
                            </div>
                          </div>
                        )}
                        {handleCheckKey(key) === 'reminder' &&
                          activityUi(value)}
                        {handleCheckKey(key) === 'Rescheduler' &&
                          activityUi(value)}
                        {handleCheckKey(key) === 'Status' && activityUi(value)}
                      </div>
                    ))}
              </div>
            ))
        ) : (
          <Box
            // className="NotFound-Page"
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
          >
            <Stack
              sx={{
                alignItems: 'center',
                textAlign: 'center',
                marginTop: '30px'
              }}
            >
              <img width={'200px'} height={'200px'} src={NotFoundIcon} alt="" />
            </Stack>
            <Box
              textAlign={'center'}
              sx={{
                font: 'bold',
                fontSize: '24px',
                fontFamily: 'Outfit,sans-serif'
              }}
            >
              No Activity Available
            </Box>
          </Box>
        )}
      </div>
    );
};

export default Activities;
