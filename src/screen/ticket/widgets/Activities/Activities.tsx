import React, { useState } from 'react';
import styles from './Activities.module.css';
import { Accordion, Card, useAccordionButton } from 'react-bootstrap';
import ArrowUp from '../../../../assets/ArrowUp.svg';
import ArrowDown from '../../../../assets/ArrowDown.svg';

type PanelState = boolean | false;
type Message = {
    id: number;
    time: string;
    content: string;
};

const Activities = () => {
    const [expanded, setExpanded] = useState<PanelState>(false);

    const messages: Message[] = [
        {
            id: 1,
            time: '09:30AM',
            content:
                "Hi, I'm not feeling well and would like some advice on what to do."
        },
        {
            id: 2,
            time: '09:30AM',
            content:
                "Hello John, I'm sorry to hear that you're not feeling well. Could you please describe your symptoms in more detail?"
        },
        {
            id: 3,
            time: '09:30AM',
            content: 'Jenny Wilson added Marvin McKinney to the ticket.'
        },
        {
            id: 4,
            time: '09:30AM',
            content:
                "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 4,
            time: '09:30AM',
            content:
                "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 4,
            time: '09:30AM',
            content:
                "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 4,
            time: '09:30AM',
            content:
                "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 4,
            time: '09:30AM',
            content:
                "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 4,
            time: '09:30AM',
            content:
                "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 4,
            time: '09:30AM',
            content:
                "I've been having a headache and a fever since yesterday evening."
        },
        {
            id: 4,
            time: '09:30AM',
            content:
                "I've been having a headache and a fever since yesterday evening."
        }
    ];
    return (
        <div className={styles.activity}>
            {messages.map((item, index) => {
                return (
                    <>
                        <div>
                            <div
                                className={styles.accordionTypeheader}
                                onClick={() => setExpanded(!expanded)}
                            >
                                <span className={styles.accordionTypeTime}>{item.time}</span>
                                <img src={expanded ? ArrowDown : ArrowUp} alt="" />
                            </div>
                            {/* <div className={styles.verticalLine}></div> */}
                            <div
                                style={
                                    expanded
                                        ? {
                                            height: 'auto',
                                            display: 'block',
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
                                {item.content}
                            </div>
                        </div>
                        <div className={expanded ? "" : styles.forSpacingDiv}></div>
                    </>
                );
            })}
        </div>
    );
};

export default Activities;
