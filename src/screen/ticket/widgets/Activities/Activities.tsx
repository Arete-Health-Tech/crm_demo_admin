import React, { useState } from 'react';
import styles from './Activities.module.css';
import ArrowUp from '../../../../assets/ArrowUp.svg';
import ArrowDown from '../../../../assets/ArrowDown.svg';
import smsIcon from "../../../../assets/smsIcon.svg";

type Message = {
    id: number;
    time: string;
    content: string;
};

const Activities = () => {
    const messages: Message[] = [
        {
            id: 1,
            time: '09:30AM',
            content: "Hi, I'm not feeling well and would like some advice on what to do."
        },
        {
            id: 2,
            time: '09:30AM',
            content: "Hello John, I'm sorry to hear that you're not feeling well. Could you please describe your symptoms in more detail?"
        },
        {
            id: 3,
            time: '09:30AM',
            content: 'Jenny Wilson added Marvin McKinney to the ticket.'
        },
        {
            id: 4,
            time: '09:30AM',
            content: "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 5,
            time: '09:30AM',
            content: "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 6,
            time: '09:30AM',
            content: "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 7,
            time: '09:30AM',
            content: "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 8,
            time: '09:30AM',
            content: "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 9,
            time: '09:30AM',
            content: "I've been having a headache and a fever since yesterday evening."
        },
    ];

    const [expandedMessages, setExpandedMessages] = useState<boolean[]>(Array(messages.length).fill(true));

    const handleToggle = (index: number) => {
        const newExpandedMessages = [...expandedMessages];
        newExpandedMessages[index] = !newExpandedMessages[index];
        setExpandedMessages(newExpandedMessages);
    };

    return (
        <div className={styles.activity}>
            {messages.map((item, index) => (
                <div key={item.id}>
                    <div
                        className={styles.accordionTypeheader}
                        onClick={() => handleToggle(index)}
                    >
                        <span className={styles.accordionTypeTime}>{item.time}</span>
                        <img src={expandedMessages[index] ? ArrowDown : ArrowUp} alt="" />
                    </div>
                    <div
                        style={
                            expandedMessages[index]
                                ? {
                                    display: 'flex',
                                    height: 'auto',
                                    // display: 'block',
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
                            {item.content}
                            <div className={styles.time}>
                                {item.time}
                            </div>
                        </div>
                    </div>
                    <div
                        style={
                            expandedMessages[index]
                                ? {
                                    display: 'flex',
                                    justifyContent: 'end',
                                    height: 'auto',
                                    // display: 'block',
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
                        <div className={styles.content}>
                            {item.content}
                            <div className={styles.time}>
                                {item.time}
                            </div>
                        </div>
                        <img src={smsIcon} alt="" style={{ marginLeft: 4 }} />
                    </div>
                    <div className={expandedMessages[index] ? "" : styles.forSpacingDiv}></div>
                </div>
            ))}
        </div>
    );
};

export default Activities;
