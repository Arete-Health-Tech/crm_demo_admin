import React, { useEffect, useState } from 'react';
import styles from './Activities.module.css';
import ArrowUp from '../../../../assets/ArrowUp.svg';
import ArrowDown from '../../../../assets/ArrowDown.svg';
import activityIcon from '../../../../assets/activityIcon.svg';
import smsIcon from '../../../../assets/smsIcon.svg';
import useTicketStore from '../../../../store/ticketStore';
import { useParams } from 'react-router-dom';
import { getActivityData } from '../../../../api/ticket/ticket';

type Activity = {
    [key: string]: string;
};

const Activities = () => {
    const { isAuditor, tickets, reminders, callRescheduler, estimates } = useTicketStore();
    const { ticketID } = useParams();
    const [activities, setActivities] = useState<Activity>({});
    const [expandedMessages, setExpandedMessages] = useState<boolean[]>([]);

    // Initialize expandedMessages based on activities length
    useEffect(() => {
        setExpandedMessages(Array(Object.entries(activities).length).fill(true));
    }, [activities]);

    const handleToggle = (index: number) => {
        const newExpandedMessages = [...expandedMessages];
        newExpandedMessages[index] = !newExpandedMessages[index];
        setExpandedMessages(newExpandedMessages);
    };

    const handleActivityData = async () => {
        const ticketId = ticketID;
        const res = await getActivityData(ticketId);
        setActivities(res.data);
    };

    useEffect(() => {
        handleActivityData();
    }, [ticketID, tickets, reminders, callRescheduler, estimates]);

    const handleCheckKey = (key: string) => {
        console.log(key.split('_')[0]);
        return key.split('_')[0];
    };

    const extractDateTime = (message: string): string | null => {
        const regex = /on (.*? \d{2}:\d{2}:\d{2} GMT[+-]\d{4} \(.*?\))/;
        const match = message.match(regex);
        return match ? match[1] : null;
    };

    return (
        <div className={!isAuditor ? styles.activity : styles.auditActivity}>
            {activities && Object.entries(activities).map(([key, value], index) => (
                <div key={key}>
                    {(handleCheckKey(key) !== 'ticketid' && handleCheckKey(key) !== '') && (
                        <div
                            className={styles.accordionTypeheader}
                            onClick={() => handleToggle(index)}
                        >
                            <span className={styles.accordionTypeTime}>{'26/11/2008'}</span>
                            <img src={expandedMessages[index] ? ArrowDown : ArrowUp} alt="" />
                        </div>
                    )}
                    {handleCheckKey(key) === 'ticketcreated' ? (
                        <div
                            style={
                                expandedMessages[index]
                                    ? {
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }
                                    : {
                                        height: 0,
                                        display: 'none',
                                        marginLeft: 60
                                    }
                            }
                        >
                            <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                            <div className={styles.otherContent}>
                                {value}
                                <div className={styles.time}>{extractDateTime(value)}</div>
                            </div>
                        </div>
                    ) : handleCheckKey(key) === 'WhatappSend' ? (
                        <div
                            style={
                                expandedMessages[index]
                                    ? {
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }
                                    : {
                                        height: 0,
                                        display: 'none',
                                        marginLeft: 60
                                    }
                            }
                        >
                            <img src={smsIcon} alt="" style={{ marginRight: 4 }} />
                            <div className={styles.content}>
                                {value}
                                <div className={styles.time}>{extractDateTime(value)}</div>
                            </div>
                        </div>
                    ) : handleCheckKey(key) === 'Probability' ? (
                        <div
                            style={
                                expandedMessages[index]
                                    ? {
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }
                                    : {
                                        height: 0,
                                        display: 'none',
                                        marginLeft: 60
                                    }
                            }
                        >
                            <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                            <div className={styles.otherContent}>
                                {value}
                                <div className={styles.time}>{extractDateTime(value)}</div>
                            </div>
                        </div>
                    ) : handleCheckKey(key) === 'SkipEstimate' ? (
                        <div
                            style={
                                expandedMessages[index]
                                    ? {
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }
                                    : {
                                        height: 0,
                                        display: 'none',
                                        marginLeft: 60
                                    }
                            }
                        >
                            <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                            <div className={styles.otherContent}>
                                {value}
                                <div className={styles.time}>{extractDateTime(value)}</div>
                            </div>
                        </div>
                    ) : handleCheckKey(key) === 'changedSubStage' ? (
                        <div
                            style={
                                expandedMessages[index]
                                    ? {
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }
                                    : {
                                        height: 0,
                                        display: 'none',
                                        marginLeft: 60
                                    }
                            }
                        >
                            <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                            <div className={styles.otherContent}>
                                {value}
                                <div className={styles.time}>{extractDateTime(value)}</div>
                            </div>
                        </div>
                    ) : handleCheckKey(key) === 'Service' ? (
                        <div
                            style={
                                expandedMessages[index]
                                    ? {
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }
                                    : {
                                        height: 0,
                                        display: 'none',
                                        marginLeft: 60
                                    }
                            }
                        >
                            <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                            <div className={styles.otherContent}>
                                {value}
                                <div className={styles.time}>{extractDateTime(value)}</div>
                            </div>
                        </div>
                    ) : handleCheckKey(key) === 'OutboundCall' ? (
                        <div
                            style={
                                expandedMessages[index]
                                    ? {
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }
                                    : {
                                        height: 0,
                                        display: 'none',
                                        marginLeft: 60
                                    }
                            }
                        >
                            <img src={smsIcon} alt="" style={{ marginRight: 4 }} />
                            <div className={styles.content}>
                                {value}
                                <div className={styles.time}>{extractDateTime(value)}</div>
                            </div>
                        </div>
                    ) : handleCheckKey(key) === 'note' ? (
                        <div
                            style={
                                expandedMessages[index]
                                    ? {
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }
                                    : {
                                        height: 0,
                                        display: 'none',
                                        marginLeft: 60
                                    }
                            }
                        >
                            <img src={smsIcon} alt="" style={{ marginRight: 4 }} />
                            <div className={styles.content}>
                                {value}
                                <div className={styles.time}>{extractDateTime(value)}</div>
                            </div>
                        </div>
                    ) : handleCheckKey(key) === 'assingne' ? (
                        <div
                            style={
                                expandedMessages[index]
                                    ? {
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }
                                    : {
                                        height: 0,
                                        display: 'none',
                                        marginLeft: 60
                                    }
                            }
                        >
                            <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                            <div className={styles.otherContent}>
                                {value}
                                <div className={styles.time}>{extractDateTime(value)}</div>
                            </div>
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
};

export default Activities;
