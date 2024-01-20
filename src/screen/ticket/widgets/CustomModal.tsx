import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from "@mui/material";
import React,{ useEffect, useRef, useState, useCallback } from 'react';
import { createTimerHandler } from "../../../api/ticket/ticketHandler";
import { useParams } from "react-router-dom";
import { iTimer } from "../../../types/store/ticket";





const CustomModal = () => {

 const { ticketID } = useParams();

  const [timer, setTimer] = useState(0);
 
     const timerRef = useRef<NodeJS.Timer | null>(null);
      const [stoppedTimer, setStoppedTimer] = useState<number | null>(null);
      const [dialogOpen, setDialogOpen] = useState(false);
      const [showForm, setShowForm] = useState(false);
      const [formData, setFormData] = useState<iTimer>({
       select:"",
        stoppedTimer: 0,
      });



 
 const startTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000); 
    setDialogOpen(true);
  };


  

 const handleCloseDialog = () => {
     setDialogOpen(false);
  setStoppedTimer(null);
   setShowForm(false);
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
const sachin:any = ticketID ;
    const result = await createTimerHandler(formData , sachin);
console.log(" thirds")
    // Check if result is truthy (not undefined or null)
    if (result !== undefined && result !== null) {
      setFormData({ select: '' });
      setDialogOpen(false);
      setShowForm(false);
      setTimer(0);

      console.log(
        'Form submitted with stopped timer:',
        stoppedTimer,
        'and data:',
        result
      );
    }
  } catch (error) {
    console.log(error);
  }
};

   useEffect(() => {
        if (showForm && stoppedTimer !== null) {
       setFormData({
        select:"",
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
      <Button
        type="button"
        onClick={startTimer}
        variant="contained"
        color="primary"
      >
        Timer
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="timer-dialog-title"
        aria-describedby="timer-dialog-description"
      >
        <DialogTitle id="timer-dialog-title">Timer</DialogTitle>
        <DialogContent>
          <DialogContentText id="timer-dialog-description">
            Timer: {timer} seconds
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={stopTimer} variant="contained" color="secondary">
            Stop
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
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
          <Button onClick={handleFormSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomModal;
