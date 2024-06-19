import React, { useEffect, useState } from 'react';
import styles from './Activities.module.css';
import ArrowUp from '../../../../assets/ArrowUp.svg';
import ArrowDown from '../../../../assets/ArrowDown.svg';
import activityIcon from '../../../../assets/activityIcon.svg';
import smsIcon from '../../../../assets/smsIcon.svg';
import useTicketStore from '../../../../store/ticketStore';
import { useParams } from 'react-router-dom';
import { getActivityData } from '../../../../api/ticket/ticket';

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
        return match ? match[1] : null;
    };

    return (
        <div className={!isAuditor ? styles.activity : styles.auditActivity}>
            {activities !== null && Object.entries(activities).map(([date, messages], index) => (
                <div key={date}>
                    {(handleCheckKey(date) !== 'ticketid' && handleCheckKey(date) !== '') && (
                        <div
                            className={styles.accordionTypeheader}
                            onClick={() => handleToggle(index)}
                        >
                            <span className={styles.accordionTypeTime}>{date}</span>
                            <img src={expandedMessages[index] ? ArrowDown : ArrowUp} alt="" />
                        </div>
                    )}
                    {expandedMessages[index] && Object.entries(messages).map(([key, value]) => (
                        <div key={key}>
                            {handleCheckKey(key) === 'ticketcreated' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'WhatappSend' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={smsIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.content}>
                                        {value}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'Probability' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'SkipEstimate' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'changedSubStage' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'Service' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'OutboundCall' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={smsIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.content}>
                                        {value}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'note' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={smsIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.content}>
                                        {value}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                            {handleCheckKey(key) === 'assingne' && (
                                <div
                                    style={{
                                        display: 'flex',
                                        height: 'auto',
                                        padding: '1rem 0 1rem 2rem',
                                        marginLeft: '2rem',
                                        borderLeft: '1px solid #d4dbe5'
                                    }}
                                >
                                    <img src={activityIcon} alt="" style={{ marginRight: 4 }} />
                                    <div className={styles.otherContent}>
                                        {value}
                                        <div className={styles.time}>{extractDateTime(value)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Activities;
