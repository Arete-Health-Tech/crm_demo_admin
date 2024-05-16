import { NotificationAddOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Switch,
  TextareaAutosize,
  TextField,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  createNewCallReschedulerHandler,
  createNewReminderHandler,
  getAllReminderHandler
} from '../../../api/ticket/ticketHandler';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getAllCallReschedulerHandler } from '../../../api/ticket/ticket';
import { iCallRescheduler } from '../../../types/store/ticket';
import CloseModalIcon from "../../../assets/Group 48095853.svg"
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import NotifyToggle from '../../../assets/NotifyToggle.svg';
import NotNotifyToggle from '../../../assets/NotNotifyToggle.svg';

const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#E0E3E7',
            '--TextField-brandBorderHoverColor': '#B2BAC2',
            '--TextField-brandBorderFocusedColor': '#6F7E8C',
            fontSize: "12px",
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)',

            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: 'var(--TextField-brandBorderColor)',
            fontSize: "14px",
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderHoverColor)',

            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&::before, &::after': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
              fontSize: "14px",
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
              fontSize: "14px",
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
    },
  });

type Props = {

  setIsModalOpenCall: any;
  isModalOpenCall: boolean;
};

const AddCallRescheduler = ({

  setIsModalOpenCall,
  isModalOpenCall
}: Props) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24
  };

  const { ticketID } = useParams();

  const [callReschedulerData, setCallReschedulerData] =
    useState<iCallRescheduler>({
      date: 0,
      title: '',
      description: '',
      ticket: '',
      selectedLabels: [],
      reason: ""
    });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const [isNotify, setIsNotify] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const outerTheme = useTheme();

  const checkIsEmpty = () => {
    if (
      callReschedulerData.title.length > 0 &&
      callReschedulerData.description.length > 0 &&
      date.length > 0 &&
      time.length > 0
    ) {
      setDisableButton((_) => false);
    } else {
      setDisableButton((_) => true);
    }
  };

  useEffect(() => {
    // console.log("dsbdfkbdf", callReschedulerData)
    checkIsEmpty();
    setCallReschedulerData({
      ...callReschedulerData,
      date: dayjs(date + ' ' + time).unix() * 1000
    });
  }, [date, time, callReschedulerData.description.length, callReschedulerData.title.length]);

  const addCAllRescheduler = async () => {
    try {
      const result = await createNewCallReschedulerHandler({
        ...callReschedulerData,
        ticket: ticketID
      });
      setCallReschedulerData({
        date: 0,
        title: '',
        description: '',
        ticket: ticketID!,
        selectedLabels: [],
        reason: ""
      });
      setDate('');
      setTime('');
      setIsModalOpenCall(false);
      await getAllCallReschedulerHandler();
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  const handleReasonToReschedule = (event) => {
    setSelectedOption(event.target.value)
    setCallReschedulerData((prev) => ({
      ...prev,
      title: event.target.value
    }));
  }

  const handleCheckboxChange = (label: string) => () => {
    console.log(label, "selected option");
    const isSelected = callReschedulerData.selectedLabels.some(
      (selectedLabel) => selectedLabel.label === label
    )

    if (isSelected) {
      // If label is already selected, remove it from the array
      setCallReschedulerData((prev) => ({
        ...prev,
        selectedLabels: prev.selectedLabels.filter(
          (selectedLabel) => selectedLabel.label !== label
        )
      }));
    } else {
      // If label is not selected, add it to the array
      setCallReschedulerData((prev) => ({
        ...prev,
        selectedLabels: [...prev.selectedLabels, { label }]
      }));
    }

    checkIsEmpty();
  };

  const closeModal = () => {
    setCallReschedulerData({
      date: 0,
      title: '',
      description: '',
      ticket: ticketID!,
      selectedLabels: [],
      reason: ""
    });
    setSelectedOption("");
    setDate('');
    setTime('');
    setIsModalOpenCall(false);
  }


  return (
    <Modal
      open={isModalOpenCall}
      onClose={() => { }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"

    >
      <Box className="reminder-modal-container">
        <Stack
          className='reminder-modal-title'
          direction="row"
          spacing={1}
          display="flex"
          alignItems="center"
        >
          {/* <NotificationAddOutlined /> */}
          <Stack className='reminder-modal-title'>
            Reschedule the Call
          </Stack>

          <Stack
            className='modal-close'
            onClick={closeModal}
          >
            <img src={CloseModalIcon} />
          </Stack>
        </Stack>
        <Box >
          <Stack spacing={2}>
            {/* <Typography color="gray">Reason for Reschedule</Typography> */}
            {/* <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={callReschedulerData.selectedLabels.some(
                      (label) => label.label === 'Patient/Caregiver Was Busy'
                    )}
                    onChange={handleCheckboxChange(
                      'Patient/Caregiver Was Busy'
                    )}
                  />
                }
                label="Patient/Caregiver Was Busy "
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={callReschedulerData.selectedLabels.some(
                      (label) => label.label === 'Asked to Call Back'
                    )}
                    onChange={handleCheckboxChange('Asked to Call Back')}
                  />
                }
                label="Asked to Call Back"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={callReschedulerData.selectedLabels.some(
                      (label) =>
                        label.label === 'Asked to Call On Alternative Number'
                    )}
                    onChange={handleCheckboxChange(
                      'Asked to Call On Alternative Number'
                    )}
                  />
                }
                label="Asked to Call On Alternative Number"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={callReschedulerData.selectedLabels.some(
                      (label) =>
                        label.label === 'All the Symptoms Were Not Covered'
                    )}
                    onChange={handleCheckboxChange(
                      'All the Symptoms Were Not Covered'
                    )}
                  />
                }
                label="All the Symptoms Were Not Covered"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={callReschedulerData.selectedLabels.some(
                      (label) =>
                        label.label ===
                        'Patient/Caregiver Was Inaudible understandable'
                    )}
                    onChange={handleCheckboxChange(
                      'Patient/Caregiver Was Inaudible understandable'
                    )}
                  />
                }
                label="Patient/Caregiver Was Inaudible understandable"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={callReschedulerData.selectedLabels.some(
                      (label) =>
                        label.label ===
                        'On Hold/Disconnected in the Middle of the Conversation'
                    )}
                    onChange={handleCheckboxChange(
                      'On Hold/Disconnected in the Middle of the Conversation'
                    )}
                  />
                }
                label="On Hold/Disconnected in the Middle of the Conversation"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={callReschedulerData.checkboxes.checkbox5}
                    onChange={handleCheckboxChange(

                      'Patient/Caregiver Was Inaudible/not Understandable'
                    )}
                  />
                }
                label="Patient/Caregiver Was Inaudible/not Understandable"
              />
            </FormGroup> */}

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" sx={{
                fontSize: '14px',
                color: 'rgba(128, 128, 128, 0.744)',
                fontFamily: `"Outfit",sans-serif`,
              }}>Reason For Reschedule</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedOption}
                onChange={handleReasonToReschedule}
                label="Reason For Reschedule"
                fullWidth
                sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}
              >
                <MenuItem className="reason-option" value="Patient/Caregiver Was Busy" sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}>
                  Patient/Caregiver Was Busy
                </MenuItem>
                <MenuItem className="reason-option" value="Asked to Call Back" sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}>Asked to Call Back</MenuItem>
                <MenuItem className="reason-option" value="Asked to Call On Alternative Number" sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}>
                  Asked to Call On Alternative Number
                </MenuItem>
                <MenuItem className="reason-option" value="All the Symptoms Were Not Covered" sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}>
                  All the Symptoms Were Not Covered
                </MenuItem>
                <MenuItem className="reason-option" value="Patient/Caregiver Was Inaudible understandable" sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}>
                  Patient/Caregiver Was Inaudible understandable
                </MenuItem>
                <MenuItem className="reason-option" value="On Hold/Disconnected in the Middle of the Conversation" sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}>
                  On Hold/Disconnected in the Middle of the Conversation
                </MenuItem>
              </Select>
            </FormControl>

            <TextareaAutosize
              className='textarea-autosize'
              id="outlined-required"
              aria-label="minimum height"
              placeholder="Add Comment"
              value={callReschedulerData.description}
              onChange={(e) => {
                setCallReschedulerData((prev) => ({
                  ...prev,
                  description: e.target.value
                }));

              }}
              minRows={5}
              maxRows={5}
            />
          </Stack>
          <Stack mt={2}>
            <Box display="flex" justifyContent="space-between">
              <Box flex="1" sx={{ padding: "0 8px 0 0px" }}>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    required
                    label="Select Date"
                    id="outlined-required"
                    value={date}
                    onChange={(e) => {
                      setDate((prev) => e.target.value);
                      checkIsEmpty();
                    }}
                    fullWidth
                    type="date"
                    size="medium"
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: '14px',
                        color: "rgba(128, 128, 128, 0.744)",
                        fontFamily: `"Outfit", sans-serif`,
                      }
                    }}
                    InputProps={{
                      style: {
                        fontSize: '14px',
                        color: 'var(--Text-Black, #080F1A)',
                        fontFamily: `"Outfit", sans-serif`,
                      }
                    }}
                  />
                </ThemeProvider>
              </Box>
              <Box flex="1" sx={{ padding: "0 0px 0 8px" }}>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    required
                    id="outlined-required"
                    value={time}
                    onChange={(e) => {
                      setTime((prev) => e.target.value);
                      checkIsEmpty();
                    }}
                    fullWidth
                    label='Select Time'
                    type="time"
                    size="medium"
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        fontSize: '14px',
                        color: "rgba(128, 128, 128, 0.744)",
                        fontFamily: `"Outfit",sans-serif`,
                      }
                    }}
                    InputProps={{
                      style: {
                        fontSize: '14px',
                        color: 'var(--Text-Black, #080F1A)',
                        fontFamily: `"Outfit",sans-serif`,
                      }
                    }}
                  />
                </ThemeProvider>
              </Box>
            </Box>

          </Stack>
          <Box display="flex" justifyContent="space-between" sx={{ marginTop: "15px", }}>
            <Box display="flex" sx={{ marginTop: "12px", }}>

              <span
                onClick={() => setIsNotify(prev => !prev)}
                style={{ marginRight: "10px" }}
              >
                {isNotify ?
                  <img src={NotifyToggle} />
                  : <img src={NotNotifyToggle}
                  />}</span>
              <span className='notifywhatspp-text'>Notify on Whatsapp</span>
            </Box>
            <Box display="flex" justifyContent="space-between">

              <button
                className='reminder-cancel-btn'
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className='reminder-btn'
                disabled={disableButton}
                onClick={addCAllRescheduler}
                style={{
                  backgroundColor: disableButton ? "#F6F7F9" : "#0566FF",
                  color: disableButton ? "#647491" : "#FFF",
                  marginLeft: "10px"
                }}
              >
                Reschedule Call
              </button>
            </Box>

          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCallRescheduler;
