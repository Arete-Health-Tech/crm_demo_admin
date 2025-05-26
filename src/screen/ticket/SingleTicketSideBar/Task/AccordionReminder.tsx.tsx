import React, { useEffect, useRef, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckEmptyIcon from '../../../../assets/Checkbox-null.svg';
import CheckFilledIcon from '../../../../assets/Checkbox-Final.svg';

import '../../singleTicket.css';
import { Box, Grid, Stack } from '@mui/material';
import { setReminderCompleted } from '../../../../api/ticket/ticket';
import {
  getTicketFilterHandler,
  getTicketHandler
} from '../../../../api/ticket/ticketHandler';
import useTicketStore from '../../../../store/ticketStore';
import {
  hasChanges,
  initialFiltersNew,
  oldInitialFilters
} from '../../../../constants/commomFunctions';
import { toast } from 'react-toastify';

function AccordionReminder(props) {
  const [active, setActive] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState('0px');
  const [arrowRotation, setArrowRotation] = useState(0);
  const {
    filterTickets,
    filterTicketsDiago,
    filterTicketsFollowUp,
    searchByName,
    pageNumber,
    filteredLocation
  } = useTicketStore();

  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;

  function toggleAccordion() {
    setActive(!active);
    setHeight(active ? '0px' : `${content?.current?.scrollHeight}px`);
    setArrowRotation(active ? 0 : 180);
  }

  const handleChecked = async () => {
    try {
      const taskData = {
        taskId: props._id,
        completed: true
      };
      await setReminderCompleted(taskData);
      // await getTicketHandler(
      //   searchByName,
      //   pageNumber,
      //   'false',
      //   newFilter
      // );
      try {
        if (hasChanges(newFilter, initialFiltersNew) && !filteredLocation) {
          await getTicketHandler(
            searchByName,
            pageNumber,
            'false',
            oldInitialFilters
          );
        } else {
          await getTicketFilterHandler(
            searchByName,
            pageNumber,
            'false',
            newFilter
          );
        }
      } catch (error) {
        console.log(error);
        //   setDownloadDisable(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <Grid container>
    //     <Grid item xs={12}>

    //     </Grid>
    // </Grid>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div className="accordion__section">
        <div className={`accordion ${active ? 'active' : ''}`}>
          <Stack sx={{ padding: '3px 10px 0px 8px' }}>
            {props.completed ? (
              <img src={CheckFilledIcon} alt="" />
            ) : (
              <img src={CheckEmptyIcon} alt="" onClick={handleChecked} />
            )}
          </Stack>
          <Stack
            style={{
              textDecoration: props.completed ? 'line-through' : 'none'
            }}
            onClick={toggleAccordion}
            className="accordion__title"
          >
            {props.title}
          </Stack>
          <Stack onClick={toggleAccordion} style={{ padding: '0 6px 4px 0' }}>
            <ArrowDropDownIcon
              style={{
                transform: `rotate(${arrowRotation}deg)`,
                transition: 'transform 0.3s ease'
              }}
            />
          </Stack>
        </div>
        <div
          ref={content}
          style={{ maxHeight: `${height}` }}
          className="accordion__content"
        >
          <div
            className="accordion__text"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        </div>
        <div className="accordion_info">
          <Stack className="reminderTime-tag "> {props.date}</Stack>
          <Stack className="reminderTime-tag time-tag"> {props.time}</Stack>
        </div>
      </div>
    </Box>
  );
}

export default AccordionReminder;
