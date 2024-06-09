import { Box, Button, IconButton, MenuItem, Modal, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { getTicketHandler } from '../../../api/ticket/ticketHandler';
import { apiClient } from '../../../api/apiClient';
import { useParams } from 'react-router-dom';
import useTicketStore from '../../../store/ticketStore';
import CloseModalIcon from "../../../assets/Group 48095853.svg"


function UploadEstimate() {
  const { ticketID } = useParams();
  const {
    filterTickets,
    pageNumber,
    searchByName,
    setViewEstimates
  } = useTicketStore();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [noteTextValue, setNoteTextValue] = useState('');
  const [disabled, setDisabled] = useState(true);

  const checkIsEmpty = () => {
    if (
      file !== null &&
      noteTextValue.length > 0

    ) {
      setDisabled((_) => false);
    } else {
      setDisabled((_) => true);
    }
  };

  const handleButtonClick = () => {
    setOpen(true)
  };

  const handleClose = () => {
    setOpen(false);
    setNoteTextValue('');
    setFile(null);
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);

  };

  const handleNoteTextChange = (event: any) => {
    setNoteTextValue(event.target.value);
  };

  useEffect(() => {
    checkIsEmpty();

  }, [noteTextValue, file])


  const handleSubmit = async () => {
    console.log(file, " thi sis file")
    const formdata = new FormData();
    if (ticketID !== undefined) {
      formdata.append('ticket', ticketID);
    }
    if (file) {
      formdata.append('estimate', file);
    }
    console.log(noteTextValue, 'noteTextValue');
    if (noteTextValue) {
      formdata.append('total', noteTextValue);
    }

    try {
      console.log("this is inside")
      const { data } = await apiClient.post(
        `/ticket/${ticketID}/estimate/upload`,
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log(data, "uploaded estimate successfully");
      // try {
      //   const { data } = await apiClient.get(`ticket/uploadestimateData/${ticketID}`);
      //   setViewEstimates(data)
      // } catch (error) {
      //   console.error("Error fetching estimate data:", error);
      // }
      (async () => {
        const result = await getTicketHandler(
          searchByName,
          pageNumber,
          'false',
          filterTickets,

        );
        // setTicketUpdateFlag(result);
      })()
      setNoteTextValue('');
      setFile(null);
      setOpen(false);

    } catch (error) {
      console.error('Error occurred:', error);
    }
  };


  const menuItemStyles = {
    color: "var(--Text-Black, #080F1A)",
    fontFamily: `"Outfit", sans-serif`,
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "150%",
  };

  return (
    <>

      <MenuItem sx={menuItemStyles} onClick={handleButtonClick} ><Stack >Upload Estimate</Stack></MenuItem>

      <Modal
        open={open}
        onClose={() => { }}
        aria-labelledby="modal-modal-title"
      >
        <Box className="reminder-modal-container">
          <Stack
            className='reminder-modal-title'
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
          >
            <Stack className="Add-Surgery-title">
              Upload Estimate
            </Stack>
            <Stack
              className='modal-close'
              onClick={handleClose}
            >
              <img src={CloseModalIcon} />
            </Stack>
          </Stack>
          <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
            <Stack>
              <TextField
                type="file"
                onChange={handleFileChange}
                fullWidth
                inputProps={{ accept: 'application/pdf' }}
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
              />{' '}
            </Stack>
            <Stack>
              <TextField
                label="Total Estimate"
                value={noteTextValue}
                onChange={handleNoteTextChange}
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
            </Stack>

          </Box>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%'
            }}
          >
            <button
              className='reminder-cancel-btn'
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className='reminder-btn'
              onClick={handleSubmit}
              disabled={disabled}
              style={{
                marginLeft: "10px",
                backgroundColor: disabled ? "#F6F7F9" : "#0566FF",
                color: disabled ? "#647491" : "#FFF",

              }}>
              Upload Estimate
            </button>
          </Box>
        </Box>
      </Modal >
    </>
  );
}

export default UploadEstimate