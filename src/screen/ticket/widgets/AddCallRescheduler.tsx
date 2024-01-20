import { NotificationAddOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
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
import {
  createNewCallReschedulerHandler,
  createNewReminderHandler,
  getAllReminderHandler
} from '../../../api/ticket/ticketHandler';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getAllCallReschedulerHandler } from '../../../api/ticket/ticket';
import { iCallRescheduler } from '../../../types/store/ticket';

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
      date: 0, // Set an initial value for date (replace with your actual initialization logic)
      title: '',
      description: '',
      ticket: '',
      selectedLabels: []
    });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [disableButton, setDisableButton] = useState(true);

  // console.log("date: ",date, "time",time,"\nreminderData",reminderData);
  const checkIsEmpty = () => {
    if (
      
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
    setCallReschedulerData({
      ...callReschedulerData,
      date: dayjs(date + ' ' + time).unix() * 1000
    });
  }, [date, time]);

  const addReminder = async () => {
    try {
      const result = await createNewCallReschedulerHandler({
        ...callReschedulerData,
        ticket: ticketID
      });

      console.log('Reminder created:', result);

      setCallReschedulerData({
        date: 0,
        title: '',
        description: '',
        ticket: ticketID!,
        selectedLabels: []
      });

      setDate('');
      setTime('');
      setIsModalOpenCall(false);

      // Assuming getAllCallReschedulerHandler returns a promise
      await getAllCallReschedulerHandler();
    } catch (error) {
      console.error('Error creating reminder:', error);
      // Handle error here, e.g., show a notification to the user
    }
  };

   const handleCheckboxChange = (label:string) => () => {
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
         selectedLabels: [...prev.selectedLabels, {label}]
       }));
     }

     checkIsEmpty();
   };

  return (
    <Modal
      open={isModalOpenCall}
      onClose={() => setIsModalOpenCall(false)}
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
            Create A New Callrescheduler
          </Typography>
          <IconButton
            onClick={() => setIsModalOpenCall(false)}
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
            <Typography color="gray">Reason for Reschedule</Typography>
            <FormGroup>
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
              {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={callReschedulerData.checkboxes.checkbox5}
                    onChange={handleCheckboxChange(
                     
                      'Patient/Caregiver Was Inaudible/not Understandable'
                    )}
                  />
                }
                label="Patient/Caregiver Was Inaudible/not Understandable"
              /> */}
            </FormGroup>
            <TextareaAutosize
              value={callReschedulerData.description}
              onChange={(e) => {
                setCallReschedulerData((prev) => ({
                  ...prev,
                  description: e.target.value
                }));
                checkIsEmpty();
              }}
              minRows={3}
              maxRows={3}
              placeholder="Other Comments"
              style={{
                border:"1px solid grey",
                // borderBottom: 'inherit',
                // borderBottomWidth: 1.5,
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
            
          </Stack>
          <Button
            disabled={disableButton}
            onClick={addReminder}
            sx={{ mt: 1 }}
            variant="contained"
            color={'primary'}
          >
            Add Callrescheduler
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCallRescheduler;
