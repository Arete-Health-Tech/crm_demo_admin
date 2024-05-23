import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField
} from '@mui/material';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  createTimerHandler,
  getTicketHandler
} from '../../../api/ticket/ticketHandler';
import { useParams } from 'react-router-dom';
import { iTimer } from '../../../types/store/ticket';
import { Call } from '@mui/icons-material';
import CallButtonIcon from '../../../assets/Call button variations.svg';
import ClickedCallButtonIcon from '../../../assets/Call button Clicked.svg';
import MaximizeIcon from '../../../assets/maximize-4.svg';
import add_icon from '../../../assets/add_icon.svg';
import CloseModalIcon1 from '../../../assets/Group 48095853.svg';
import '../singleTicket.css';

import useTicketStore from '../../../store/ticketStore';
import LeadDetail from '../SingleTicketSideBar/LeadDetail/LeadDetail';
import ReactQuill from 'react-quill';

const CustomModal = () => {
  const label = { inputProps: { 'aria-label': 'Size switch demo' } };

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
  const [isVisible, setIsVisible] = useState(false);
  const [note, setNote] = useState('');
  const [formData, setFormData] = useState<iTimer>({
    select: '',
    stoppedTimer: 0
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
    // console.log("this is results")
    try {
      setFormData((prevData) => ({
        ...prevData,
        stoppedTimer: stoppedTimer
      }));
      // console.log("this is next one")
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

      // console.log(result, " this is call button")
      // Check if result is truthy (not undefined or null)
      if (result !== undefined && result !== null) {
        setFormData({ select: '' });
        setDialogOpen(false);
        setShowForm(false);
        setTimer(0);
        setChipOpen(false);

        // console.log(
        //   'Form submitted with stopped timer:',
        //   stoppedTimer,
        //   'and data:',
        //   result
        // );
        // console.log(result1, " this is result one")
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (showForm && stoppedTimer !== null) {
      setFormData({
        select: '',
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
    // console.log(`Button ${buttonName} clicked`);
  };

  const handleClose = () => {
    setChipOpen(false);
    setShowForm(false);

    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    setTimer(0);
  };

  const isButtonClicked = (buttonName) => formData.select === buttonName;

  const [challengeSelected, setChallengeSelected] = useState<string[]>([]);
  const challenges = [
    'Awaiting test results',
    'Awaiting TPA approvals',
    'Bad experience',
    'Under MM',
    'Not happy with Doctor',
    'Financial constraints'
  ];
  const handleChallenge = (challenges) => {
    if (challengeSelected.includes(challenges)) {
      const filteredData = challengeSelected.filter(
        (challenge) => challenge !== challenges
      );
      setChallengeSelected(filteredData);
    } else {
      setChallengeSelected((prevChallenges) => [...prevChallenges, challenges]);
    }
  };

  return (
    <div>
      {chipOpen == true ? (
        <Stack className="Clicked-call" display="flex" flexDirection="row">
          <span className="Clicked-call-icon">
            <img src={ClickedCallButtonIcon} alt="" />
          </span>
          <span className="Clicked-call-text">Calling</span>
          <span
            className="maximize-icon"
            onClick={() => {
              setShowForm(true);
              startTimer();
            }}
          >
            <img src={MaximizeIcon} alt="" />
          </span>
        </Stack>
      ) : (
        <Stack
          className="Callbutton"
          onClick={() => {
            setChipOpen(true);
          }}
        >
          <img src={CallButtonIcon} alt="" />
        </Stack>
      )}

      {/* <IconButton
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
      )} */}

      <Dialog
        // open={showForm}
        open={false}
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
          <Button
            onClick={handleFormSubmit}
            disabled={!formData.select}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Modal
        open={showForm}
        onClose={() => { }}
        style={{ height: '100%' }}
        aria-labelledby="modal-modal-title"
      > */}
      <Drawer
        PaperProps={{ sx: { zIndex: 1000 } }}
        sx={{
          display: { xs: 'none', sm: 'block' },

          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 1100,
            borderTopLeftRadius: '15px',
            borderBottomLeftRadius: '15px'
          }
        }}
        anchor="right"
        open={showForm}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box className="Calling-modal-container">
          {/* <Stack className="modal-close" onClick={handleClose}>
            <img src={CloseModalIcon} />
          </Stack> */}
          <Box
            sx={{
              width: "65%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: '#F6F7F9'
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              display="flex"
              alignItems="center"
              sx={{
                borderBottom: '1px solid #D4DBE5',
                padding: "20px 15px",
                position: 'sticky',
                top: 0
              }}
            >
              <Stack
                className="call-modal-title"
                sx={{ fontSize: '18px !important' }}
              >
                Call with Himanshu Singh Kalkat
              </Stack>
            </Stack>
            <Box
              className="customModalFirstSection"
            >

              <Stack p={2}>
                <Stack sx={{ borderRadius: '1rem', backgroundColor: '#FFF', paddingLeft: 2 }} p={1}>
                  <Stack
                    className="reminder-modal-title"
                    sx={{ fontSize: '14px !important', fontWeight: 500 }}
                  >
                    Disposition
                  </Stack>
                  <Stack className="calling-btn">
                    <button
                      className="call-Button"
                      style={{
                        backgroundColor: isButtonClicked('DNP')
                          ? '#DAE8FF'
                          : '#F6F7F9'
                      }}
                      onClick={() => handleButtonClick('DNP')}
                    >
                      DNP
                    </button>
                    <button
                      className="call-Button"
                      style={{
                        backgroundColor: isButtonClicked('DND')
                          ? '#DAE8FF'
                          : '#F6F7F9'
                      }}
                      onClick={() => handleButtonClick('DND')}
                    >
                      DND
                    </button>
                    <button
                      className="call-Button"
                      style={{
                        backgroundColor: isButtonClicked('Rescheduled Call')
                          ? '#DAE8FF'
                          : '#F6F7F9'
                      }}
                      onClick={() => handleButtonClick('Rescheduled Call')}
                    >
                      Reschedule Call
                    </button>

                    <button
                      style={{
                        backgroundColor: isButtonClicked('Call Completed')
                          ? '#DAE8FF'
                          : '#F6F7F9'
                      }}
                      onClick={() => handleButtonClick('Call Completed')}
                      className="call-Button"
                    >
                      {' '}
                      Call Complete
                    </button>
                  </Stack>
                </Stack>
              </Stack>

              <Stack p={2}>
                <Stack sx={{ borderRadius: '1rem', backgroundColor: '#FFF', paddingLeft: 2 }} p={1}>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Stack
                      className="reminder-modal-title"
                      sx={{ fontSize: '14px !important', fontWeight: 500 }}
                    >
                      Second Opinion
                    </Stack>
                    <Stack>
                      <Switch
                        {...label}
                        defaultChecked
                        size="small"
                        checked={isVisible}
                        onChange={() => setIsVisible(!isVisible)}
                      />
                    </Stack>
                  </Box>
                  {isVisible && (
                    <Stack className="calling-btn">
                      <Box sx={{ width: '100%' }}>
                        <RadioGroup
                          row
                          defaultValue="consulted"
                          name="consultationStatus"
                        >
                          <FormControlLabel
                            value="considering"
                            control={<Radio />}
                            label="Considering Consultation"
                          />
                          <FormControlLabel
                            value="consulted"
                            control={<Radio />}
                            label="Consulted"
                          />
                        </RadioGroup>

                        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                          <TextField
                            required
                            label="Hospital"
                            defaultValue="Kailash Hospital"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                          <TextField
                            required
                            label="Doctor Name"
                            defaultValue="Dr. Amrita Singh"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ marginTop: 2 }}>
                          <TextField
                            label="Additional Information"
                            defaultValue="Got a family reference"
                            multiline
                            rows={4}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                      </Box>
                    </Stack>
                  )}
                </Stack>
              </Stack>

              <Stack p={2}>
                <Stack sx={{ borderRadius: '1rem', backgroundColor: '#FFF', paddingLeft: 2 }} p={1}>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Stack
                      className="reminder-modal-title"
                      sx={{ fontSize: '14px !important', fontWeight: 500 }}
                    >
                      Conversion challenges
                    </Stack>
                  </Box>
                  <Stack className="calling-btn">
                    <Box width={'100%'}>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {challenges.map((challenge, index) => (
                          <Chip
                            key={index}
                            label={challenge}
                            onDelete={() => handleChallenge(challenge)}
                            deleteIcon={
                              challengeSelected.includes(challenge) ? (
                                <img src={CloseModalIcon1} alt="" />
                              ) : (
                                <img src={add_icon} alt="" />
                              )
                            }
                            style={{
                              backgroundColor: challengeSelected.includes(challenge)
                                ? '#DAE8FF'
                                : '#F6F7F9',
                              fontSize: '0.875rem',
                              color: '#000',
                              fontFamily: 'Outfit,san-serif',
                              fontWeight: 400
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>

              <Stack p={2}>
                <Stack sx={{ borderRadius: '1rem', backgroundColor: '#FFF', paddingLeft: 2 }} p={1}>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Stack
                      className="reminder-modal-title"
                      sx={{ fontSize: '14px !important', fontWeight: 500 }}
                    >
                      Add Notes
                    </Stack>
                  </Box>
                  <Stack className="Note_section">
                    <ReactQuill
                      theme="snow"
                      value={note}
                      onChange={(content) => setNote(content)}
                      // className='noteBox'
                      style={{ height: '25vh', width: '100%' }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Box>
            <Box className="submit-call-response">
              <Stack className="Timer">{timer}</Stack>
              <Stack>
                <button
                  className="submit-call-Btn"
                  onClick={handleFormSubmit}
                  disabled={!formData.select}
                  style={{
                    backgroundColor: !formData.select ? '#F6F7F9' : '#0566FF',
                    color: !formData.select ? '#647491' : '#FFF'
                  }}
                >
                  Submit
                </button>
              </Stack>
            </Box>
          </Box>
          <Box
            width="35%"
            sx={{
              borderLeft: '1px solid #D4DBE5',
              padding: ' var(--24px, 15px) 0 var(--24px, 15px) 0'
            }}
          >
            <LeadDetail isLeadDetail={false} />
          </Box>
        </Box>
      </Drawer>

      {/* </Modal> */}
    </div >
  );
};

export default CustomModal;
