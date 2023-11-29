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

type Props = {};

const AddNewTaskWidget = (props: Props) => {
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box position="relative">
      {isTaskOpen && (
        <List
          disablePadding
          sx={{
            width: '200px',
            position: 'absolute',
            zIndex: 2,
            bottom: '8vh',
            right: '2vh',
            bgcolor: 'white',
            transition: 'ease-in-out ',
            transitionDelay: '800ms'
          }}
        >
          <ListItemButton onClick={() => setIsModalOpen(true)}>
            <ListItemIcon>
              <NotificationAddOutlined />
            </ListItemIcon>
            <ListItemText primary="Add New Task" />
          </ListItemButton>
          {/* <ListItemButton>
            <ListItemIcon>
              <PlaylistAddCheckOutlined />
            </ListItemIcon>
            <ListItemText primary="Add New Task" />
          </ListItemButton> */}
        </List>
      )}

      <Fab
        onClick={() => setIsTaskOpen((prev) => !prev)}
        size="small"
        color="primary"
        variant="extended"
      >
        {isTaskOpen ? (
          <>
            <Close /> Close
          </>
        ) : (
          <>
            <Add sx={{ mr: 1 }} /> View Tasks
          </>
        )}
      </Fab>

      <AddReminderWidget
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </Box>
  );
};

export default AddNewTaskWidget;
