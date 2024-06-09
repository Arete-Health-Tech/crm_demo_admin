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
  createNotesHandler,
  createTimerHandler,
  getTicketHandler
} from '../../../api/ticket/ticketHandler';
import { useParams } from 'react-router-dom';
import { iNote, iTicket, iTimer } from '../../../types/store/ticket';
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
import { callAgent, createSecondOpinion } from '../../../api/ticket/ticket';
import { toast } from 'react-toastify';

const CustomModal = () => {
  const label = { inputProps: { 'aria-label': 'Size switch demo' } };
  const [currentTicket, setCurrentTicket] = React.useState<iTicket>();
  const { ticketID } = useParams();
  const {
    tickets,
    filterTickets,
    reminders,
    pageNumber,
    searchByName,
    setIsModalOpenCall
  } = useTicketStore();
  const [timer, setTimer] = useState(0);

  const timerRef = useRef<NodeJS.Timer | null>(null);
  const [stoppedTimer, setStoppedTimer] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [chipOpen, setChipOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [note, setNote] = useState('');
  const [secondOpinion, setSecondOpinion] = useState({
    type: '',
    hospital: '',
    doctor: '',
    additionalInfo: ''
  });
  const [challengeSelected, setChallengeSelected] = useState<string[]>([]);
  const [ucid, setUCID] = useState("");
  const [formData, setFormData] = useState<iTimer>({
    select: '',
    stoppedTimer: 0
  });

  useEffect(() => {
    const fetchTicket = tickets.find((element) => ticketID === element._id);
    setCurrentTicket(fetchTicket);
  }, [])


  console.log({ challengeSelected })

  const startTimer = async () => {
    const returnedData = await callAgent("916397401855")
    // const returnedData = await callAgent(currentTicket?.consumer[0]?.phone)
    console.log({ returnedData })
    if (returnedData.status == "Agent is not available") {
      toast.error("Agent is not loggedIn")
      console.log("iinside the not login condition")
      // setOpenAgentModal(true)
    } else if (returnedData.status == "queued successfully") {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      setUCID(returnedData.ucid)
      setChipOpen(true);
      setDialogOpen(true);
    } else {
      toast.error(returnedData.status)
      // setOpenAgentModal(true)
    }
    // setChipOpen(true);
    // setDialogOpen(true);
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

      //This function is for handle the time 
      const result = await createTimerHandler(formData, sachin);

      //This if condition is for checking the notes which is inside the calling drawer 
      if (note !== '<p><br></p>' && note !== "") {
        const data: iNote = {
          text: note,
          ticket: sachin,
          ucid: ucid
        };
        await createNotesHandler(data);
        setNote('');
      }

      const opinion = {
        ...secondOpinion,
        challengeSelected,
        ticketid: ticketID
      };

      await createSecondOpinion(opinion)

      //This if condition is for checking that what disposition we have selected 
      if (formData.select === "Rescheduled Call") {
        setIsModalOpenCall(true)
      }

      // on submit button click after 1 second the ticket data will call 
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
        setSecondOpinion({
          type: '',
          hospital: '',
          doctor: '',
          additionalInfo: ''
        })
        setChallengeSelected([])
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
    // setChipOpen(false);
    setShowForm(false);

    // if (timerRef.current !== null) {
    //   clearInterval(timerRef.current);
    // }
    // setTimer(0);
  };

  const isButtonClicked = (buttonName) => formData.select === buttonName;

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
            }}
          >
            <img src={MaximizeIcon} alt="" />
          </span>
        </Stack>
      ) : (
        <Stack
          className="Callbutton"
          onClick={() => {
            startTimer();
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
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
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
                          name="consultationStatus"
                        >
                          <FormControlLabel
                            value="considering"
                            control={<Radio />}
                            label="Considering Consultation"
                            onClick={() => setSecondOpinion(prevState => ({
                              ...prevState,
                              type: "Considering Consultation"
                            }))}
                          />
                          < FormControlLabel
                            value="consulted"
                            control={<Radio />}
                            label="Consulted"
                            onClick={() => setSecondOpinion(prevState => ({
                              ...prevState,
                              type: "consulted"
                            }))}
                          />
                        </RadioGroup>

                        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                          <TextField
                            required
                            label="Hospital"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            value={secondOpinion.hospital}
                            onChange={(e) => setSecondOpinion(prevState => ({
                              ...prevState,
                              hospital: e.target.value
                            }))}
                          />
                          <TextField
                            required
                            label="Doctor Name"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            value={secondOpinion.doctor}
                            onChange={(e) => setSecondOpinion(prevState => ({
                              ...prevState,
                              doctor: e.target.value
                            }))}
                          />
                        </Box>

                        <Box sx={{ marginTop: 2 }}>
                          <TextField
                            multiline
                            rows={4}
                            label="Additional Information"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            value={secondOpinion.additionalInfo}
                            onChange={(e) => setSecondOpinion(prevState => ({
                              ...prevState,
                              additionalInfo: e.target.value
                            }))}
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
                                <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '50%' }}>
                                  <img src={CloseModalIcon1} alt="" />
                                </div>
                              ) : (
                                <div style={{ backgroundColor: 'white', padding: '5px', borderRadius: '50%' }}>
                                  <img src={add_icon} alt="" />
                                </div>
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
