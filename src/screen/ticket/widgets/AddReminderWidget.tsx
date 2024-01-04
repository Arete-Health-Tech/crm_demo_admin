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
import { createNewReminderHandler, getAllReminderHandler } from '../../../api/ticket/ticketHandler';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: any;
};

const AddReminderWidget = ({ isModalOpen, setIsModalOpen }: Props) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24
  };

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
  
// console.log("date: ",date, "time",time,"\nreminderData",reminderData);
  const checkIsEmpty = () => {
    if (
      reminderData.title.length > 0 &&
      reminderData.description.length > 0 &&
      date.length > 0 &&
      time.length > 0
    ) {
      setDisableButton((_) => false);
    } else {
      setDisableButton((_) => true);
    }
  };

  useEffect(() => {
    setReminderData({
      ...reminderData,
      date: dayjs(date +" "+time).unix() * 1000
    });
  }, [date, time]);

  const addReminder = async () => {
    const result = await createNewReminderHandler({...reminderData, ticket: ticketID});
    console.log("reminder created", result)
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
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack
          direction="row"
          spacing={1}
          display="flex"
          alignItems="center"
          p={2}
          borderBottom={1}
          borderColor="#e9e9e9"
        >
          <NotificationAddOutlined />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create A New Reminder
          </Typography>
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px'
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box p={4}>
          <Stack spacing={2}>
            <TextField
              value={reminderData.title}
              onChange={(e) => {
                setReminderData((prev) => ({ ...prev, title: e.target.value }));
                checkIsEmpty();
              }}
              label="Reminder For"
              variant="standard"
              size="medium"
              fullWidth
            />
            <TextareaAutosize
              value={reminderData.description}
              onChange={(e) => {
                setReminderData((prev) => ({
                  ...prev,
                  description: e.target.value
                }));
                checkIsEmpty();
              }}
              minRows={3}
              maxRows={3}
              placeholder="Reminder Description"
              style={{
                borderBottom: 'inherit',
                borderBottomWidth: 1.5,
                padding: 1,
                outlineColor: 'transparent',
                outline: 0
              }}
            />
          </Stack>
          <Stack mt={2}>
            <Typography color="gray">Select Date & Time</Typography>
            <Box display="flex" justifyContent="space-between">
              <TextField
                value={date}
                variant="standard"
                onChange={(e) => {
                  setDate((prev) => e.target.value);
                  checkIsEmpty();
                }}
                type="date"
                size="medium"
              />
              <TextField
                value={time}
                onChange={(e) => {
                  setTime((prev) => e.target.value);
                  checkIsEmpty();
                }}
                variant="standard"
                type="time"
                size="medium"
              />
            </Box>
            <FormControlLabel
              sx={{ color: 'GrayText', fontSize: '0.8rem', mt: 2 }}
              control={<Switch checked={true} name="updates" />}
              label="Get Reminder Updates on Whatsapp"
            />
          </Stack>
          <Button
            disabled={disableButton}
            onClick={addReminder}
            sx={{ mt: 1 }}
            variant="contained"
            color={'primary'}
          >
            Add Reminder
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddReminderWidget;
