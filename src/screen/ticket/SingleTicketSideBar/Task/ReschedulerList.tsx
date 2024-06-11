import React from 'react'
import "../../singleTicket.css";
import Accordion from './Accordion';
import { Box } from '@mui/material';

const ReschedulerList = ({ callReschedulerData }) => {
    console.log(callReschedulerData, "indide rescheduler data")

    const separateDate = (timestamp) => {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const dateObj = new Date(timestamp);
        const year = dateObj.getFullYear();
        const monthIndex = dateObj.getMonth(); // Get month index (0-based)
        const month = monthNames[monthIndex];
        const day = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${day} ${month} ${year}`;

        return formattedDate;
    }

    const separateTime = (timestamp) => {
        const dateObj = new Date(timestamp);
        let hours = dateObj.getHours();
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedTime = `${hours}:${minutes} ${ampm}`;
        return formattedTime;
    }


    return (
        <>
            <div style={{ paddingBottom: "150px" }} >
                {(callReschedulerData.length > 0) ?
                    <>
                        {
                            callReschedulerData.map((item, index) => (
                                <Accordion
                                    key={index}
                                    title={item.title !== "" ? item.title : item.selectedLabels[0].label}
                                    content={item.description}
                                    date={separateDate(item.date)}
                                    time={separateTime(item.date)}
                                    completed={item.completed}
                                    _id={item._id}
                                />
                            ))
                        }
                    </>

                    :
                    <>
                        <Box></Box>
                    </>

                }

            </div>
        </>
    )
}

export default ReschedulerList
