import {
  Add,
  Close,
  InboxOutlined,
  NotificationAddOutlined,
  PlaylistAddCheckOutlined
} from '@mui/icons-material';
import {
  Box,
  Button,
  Fab,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import React, { useState } from 'react';
import AddReminderWidget from './AddReminderWidget';
import AddCallRescheduler from './AddCallRescheduler';
import useTicketStore from '../../../store/ticketStore';


type Props = {};

const AddNewTaskWidget = (props: Props) => {
  const { isModalOpenCall, setIsModalOpenCall } = useTicketStore();
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isModalOpenCall, setIsModalOpenCall] = useState(false);


  const handleButtonClick = () => {
    setIsModalOpen(true);

  };

  const handleButtonClickRescheduler = () => {

    setIsModalOpenCall(true);
  };
  const handleModalClose = () => {
    // Comment or remove the following line to prevent closing the modal
    setIsModalOpen(false);
    setIsModalOpenCall(false);

  };


  return (
    <Box position="relative">
      <Button
        onClick={handleButtonClick}
        sx={{ border: '1px solid #ccc', marginRight: '8px' }}
      >
        Reminder
      </Button>
      <AddReminderWidget
        isModalOpen={isModalOpen}
        setIsModalOpen={handleModalClose}
      />

      <Button
        onClick={handleButtonClickRescheduler}
        sx={{ border: '1px solid #ccc' }}
      >
        Call Rescheduler
      </Button>
      <AddCallRescheduler />
    </Box>
  );
};

export default AddNewTaskWidget;
