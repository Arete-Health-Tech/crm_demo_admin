import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { getTicketHandler } from '../../../api/ticket/ticketHandler';
import { apiClient } from '../../../api/apiClient';
import { useParams } from 'react-router-dom';
import useTicketStore from '../../../store/ticketStore';
import CloseModalIcon from "../../../assets/Group 48095853.svg"
import UploadFileIcon from "../../../assets/UploadFileIcon.svg";
import CheckedActiveIcon from "../../../assets/NotActive.svg"
import documentIcon from "../../../assets/document-text.svg"


function UploadEstimate() {
  const { ticketID } = useParams();
  const {
    filterTickets,
    pageNumber,
    searchByName,
    setViewEstimates,
    setIsEstimateUpload
  } = useTicketStore();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const [noteTextValue, setNoteTextValue] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');

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
    setSelectedOption("");
    setFile(null);
    setUploadFileName("");
  };

  // const handleFileChange = (event: any) => {
  //   setFile(event.target.files[0]);
  //   setFileName(event.target.file[0].name)
  //   console.log(event.target.file[0].name, "estimate file name");

  // };

  const handlePaymentType = (event) => {
    setSelectedOption(event.target.value)
  }

  const handleFileChange = (event) => {
    const files = event.target.files && event.target.files;
    if (files && files.length > 0) {
      // console.log(files[0], "asasdsdaas");
      setFile(files[0]);
      setUploadFileName(`${files[0].name.slice(0, 25)}.........${files[0].name.slice(-6)}`);
    } else {
      console.error('No file selected.');
    }
  };

  const handleNoteTextChange = (event: any) => {
    setNoteTextValue(event.target.value);
  };

  useEffect(() => {
    checkIsEmpty();

  }, [noteTextValue, file])


  const handleSubmit = async () => {
    // console.log(file, " thi sis file")
    const formdata = new FormData();
    if (ticketID !== undefined) {
      formdata.append('ticket', ticketID);
    }
    if (file) {
      formdata.append('estimate', file);
    }
    // console.log(noteTextValue, 'noteTextValue');
    if (noteTextValue) {
      formdata.append('total', noteTextValue);
    }
    // if (selectedOption) {
    //   formdata.append('paymentType', selectedOption);
    // }

    try {
      // console.log("this is inside")
      const { data } = await apiClient.post(
        `/ticket/${ticketID}/estimate/upload`,
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setIsEstimateUpload(true);
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
  const uploadFileRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        id="file-upload"
        style={{ display: 'none' }}
        ref={uploadFileRef}
        type="file"
        onChange={handleFileChange}
      />{' '}
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
              <Box className="file-upload" onClick={() => uploadFileRef.current?.click()}>
                <Stack className="file-upload-title">
                  <label htmlFor="file-upload" style={{ display: "flex", flexDirection: "row" }}> <img className='img-upload' src={UploadFileIcon} alt='' /> Upload Receipt sent by hospital</label>
                </Stack>
                <Stack className="file-upload-Sub" marginTop="12px">Upload one .txt, .doc, .pdf, .docx, .png, .jpg</Stack>
                <Stack className="file-upload-Sub">Max file size 5mb</Stack>
              </Box>
              {file ? (
                <Box className="Uploaded-file">
                  <Stack display={"flex"} flexDirection={'row'} justifyContent={"flex-start"}>
                    <Stack className='Uploaded-Box'><img src={documentIcon} alt='' /></Stack>
                    <Box>
                      <Stack className="file-upload-Sub">{uploadFileName}</Stack>
                      {/* <Stack p={'3px'} className="file-upload-Sub">File Uploaded Successfully</Stack> */}
                    </Box>
                  </Stack>
                  <Stack p={1} sx={{ marginLeft: "250px" }}><img src={CheckedActiveIcon} alt='' /></Stack>
                </Box>
              ) : (
                <>
                </>
              )}
              {/* <TextField
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
              />{' '} */}
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" sx={{
                fontSize: '14px',
                color: 'rgba(128, 128, 128, 0.744)',
                fontFamily: `"Outfit",sans-serif`,
              }}>Payment Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedOption}
                onChange={handlePaymentType}
                label="Payment Type"
                fullWidth
                sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}
              >
                <MenuItem className="reason-option" value="Cash" sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}>
                  Cash
                </MenuItem>
                <MenuItem className="reason-option" value="Insurance/TPA" sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}>Insurance/TPA</MenuItem>
                <MenuItem className="reason-option" value="ECHS" sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}>ECHS</MenuItem>
                <MenuItem className="reason-option" value="Corporate" sx={{
                  fontSize: '14px',
                  color: '#080F1A',
                  fontFamily: `"Outfit",sans-serif`,
                }}>Corporate</MenuItem>
              </Select>
            </FormControl>

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