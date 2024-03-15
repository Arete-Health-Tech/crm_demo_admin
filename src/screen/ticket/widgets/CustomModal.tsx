import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createTimerHandler, getTicketHandler } from "../../../api/ticket/ticketHandler";
import { useParams } from "react-router-dom";
import { iTimer } from "../../../types/store/ticket";
import { Call } from "@mui/icons-material";

import useTicketStore from "../../../store/ticketStore";





const CustomModal = () => {

  const { ticketID } = useParams();
  const {
    tickets,
    filterTickets,
    reminders,
    pageNumber,
    searchByName,
    callRescheduler,
    estimates
  } = useTicketStore();
  const [timer, setTimer] = useState(0);

  const timerRef = useRef<NodeJS.Timer | null>(null);
  const [stoppedTimer, setStoppedTimer] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [chipOpen, setChipOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [formData, setFormData] = useState<iTimer>({
    select: "",
    stoppedTimer: 0,
  });




  const startTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    setChipOpen(true);
    setDialogOpen(true);
  };





  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    setStoppedTimer(timer);
    setShowForm(true);

  };



  const handleFormSubmit = async () => {
    console.log("this is results")
    try {
      setFormData((prevData) => ({
        ...prevData,
        stoppedTimer: stoppedTimer
      }));
      console.log("this is next one")
      const sachin: any = ticketID;
      const result = await createTimerHandler(formData, sachin);
      setTimeout(() => {
        (async () => {
          await getTicketHandler(
            searchByName,
            pageNumber,
            'false',
            filterTickets
          );

        })();
      }, 1000);

      console.log(result, " this is call button")
      // Check if result is truthy (not undefined or null)
      if (result !== undefined && result !== null) {
        setFormData({ select: '' });
        setDialogOpen(false);
        setShowForm(false);
        setTimer(0);
        setChipOpen(false);

        console.log(
          'Form submitted with stopped timer:',
          stoppedTimer,
          'and data:',
          result
        );
        // console.log(result1, " this is result one")
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (showForm && stoppedTimer !== null) {
      setFormData({
        select: "",
        stoppedTimer: stoppedTimer
      });
    }
  }, [showForm, stoppedTimer]);

  const handleButtonClick = (buttonName) => {
    setFormData((prevData) => ({
      ...prevData,
      select: buttonName,
      stoppedTimer: stoppedTimer
    }));
    console.log(`Button ${buttonName} clicked`);
  };

  const isButtonClicked = (buttonName) => formData.select === buttonName;
  return (
    <div>

      <IconButton
        sx={{
          bgcolor: chipOpen ? 'red' : 'green',
          color: 'white'
        }}
        onClick={chipOpen ? stopTimer : startTimer}
      >
        <Call sx={{ fontSize: '1.5rem' }} />
      </IconButton>

      {chipOpen && (
        <Chip
          label={`Timer: ${timer} seconds`}
          // onDelete={stopTimer}
          color="primary"
          variant="filled"
          sx={{
            fontSize: '.7rem' // Adjust the font size as needed
          }}
        />
      )}
      <Dialog
        open={showForm}
        onClose={() => { }}
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-description"
      >
        <DialogTitle id="form-dialog-title">Calling Timer </DialogTitle>
        <DialogContent>
          {/* Render your other form fields here */}
          <Button
            variant={isButtonClicked('DND') ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleButtonClick('DND')}
            sx={{ minWidth: '140px', marginRight: '8px' }}
          >
            DND
          </Button>
          <Button
            variant={
              isButtonClicked('Rescheduled Call') ? 'contained' : 'outlined'
            }
            color="primary"
            onClick={() => handleButtonClick('Rescheduled Call')}
            sx={{ minWidth: '140px', marginRight: '8px' }}
          >
            Rescheduled Call
          </Button>
          <Button
            variant={
              isButtonClicked('Call Completed') ? 'contained' : 'outlined'
            }
            color="primary"
            onClick={() => handleButtonClick('Call Completed')}
            sx={{ minWidth: '140px' }}
          >
            Call Completed
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormSubmit}
            disabled={!formData.select}
            variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomModal;
