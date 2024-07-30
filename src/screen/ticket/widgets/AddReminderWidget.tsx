import { NotificationAddOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControlLabel,
  Modal,

  Stack,
  Switch,
  TextareaAutosize,
  TextField,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createNewReminderHandler, getAllReminderHandler, getAllTaskCountHandler } from '../../../api/ticket/ticketHandler';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CloseModalIcon from "../../../assets/Group 48095853.svg"
import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { fontSize } from 'pdfkit';
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
  isModalOpen: boolean;
  setIsModalOpen: any;

};

const AddReminderWidget = ({
  isModalOpen,
  setIsModalOpen,

}: Props) => {
  const { ticketID } = useParams();
  const [reminderData, setReminderData] = useState({
    date: 0,
    title: '',
    description: '',
    ticket: ticketID!
  });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const [isNotify, setIsNotify] = useState(false);
  const outerTheme = useTheme();
  const checkIsEmpty = () => {
    if (
      reminderData.title.length > 0 &&
      date.length > 0 &&
      time.length > 0
    ) {
      setDisableButton((_) => false);
    } else {
      setDisableButton((_) => true);
    }
  };

  useEffect(() => {
    checkIsEmpty();
    setReminderData({
      ...reminderData,
      date: dayjs(date + ' ' + time).unix() * 1000
    });

  }, [date, time, reminderData.title]);

  const addReminder = async () => {
    const result = await createNewReminderHandler({
      ...reminderData,
      ticket: ticketID
    });
    setReminderData({
      date: 0,
      title: '',
      description: '',
      ticket: ticketID!
    });
    setDate('');
    setTime('');
    setIsModalOpen(false);
    await getAllReminderHandler();
    await getAllTaskCountHandler();
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setReminderData({
      date: 0,
      title: '',
      description: '',
      ticket: ticketID!
    });
    setDate('');
    setTime('');
  }


  return (

    <Modal
      open={isModalOpen}
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
          <Stack className='reminder-modal-title'>
            Create Reminder
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
            <ThemeProvider theme={customTheme(outerTheme)}>
              <TextField className='inputField-placeholder'
                id="outlined-required"
                required
                value={reminderData.title}
                onChange={(e) => {
                  setReminderData((prev) => ({ ...prev, title: e.target.value }));
                  checkIsEmpty();
                }}
                label="Reminder For"
                fullWidth
                InputLabelProps={{
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
            <TextareaAutosize
              className='textarea-autosize'
              id="outlined-required"
              aria-label="minimum height"
              placeholder="Add Comment"
              value={reminderData.description}
              onChange={(e) => {
                setReminderData((prev) => ({
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
                      setDate(e.target.value);
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
                onClick={addReminder}
                style={{
                  backgroundColor: disableButton ? "#F6F7F9" : "#0566FF",
                  color: disableButton ? "#647491" : "#FFF",
                  marginLeft: "10px"
                }}
              >
                Create Reminder
              </button>
            </Box>

          </Box>
        </Box>
      </Box>
    </Modal >


  );
};

export default AddReminderWidget;
