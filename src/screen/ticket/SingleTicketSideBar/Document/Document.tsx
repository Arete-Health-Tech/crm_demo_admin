import { Box, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import NotFoundIcon from "../../../../assets/NotFoundDocument.svg"
import "../../singleTicket.css"
import UploadDocumentIcon from '../../../../assets/UploadDocument.svg'
import CloseModalIcon from "../../../../assets/Group 48095853.svg";
import UploadFileIcon from "../../../../assets/UploadFileIcon.svg";
import CheckedActiveIcon from "../../../../assets/NotActive.svg"
import documentIcon from "../../../../assets/document-text.svg"
import { UploadFile } from '@mui/icons-material'

interface FileObject {
    file: File | null;
    fileName: string;
    fileTag: string | "";
    timestamp: string;
}

const Document = () => {

    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [disableButton, setDisableButton] = useState(true);
    const [uploadFile, setUploadFile] = useState<FileObject[]>([]);

    const handleOpen = () => {
        setOpen(true);
    };



    const handleClose = () => {
        setFile(null);
        setFileName("");
        setSelectedOption("");
        setOpen(false);
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);

        if (event.target.value !== null) {
            setDisableButton(false);
        }

    };

    const handleFileNameChange = (event) => {
        setFileName(event.target.value);
    }

    const handleSectedOptionChange = (event) => {
        console.log(event.target.value);
        setSelectedOption(event.target.value);
    }

    const handleSubmit = () => {
        const currentDate = new Date();
        const formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(currentDate);
        const newFileObject: FileObject = {
            file: file,
            fileName: fileName,
            fileTag: selectedOption,
            timestamp: formattedDate,
        };
        setUploadFile(prevFiles => [...prevFiles, newFileObject]);
        handleClose();
    }

    return (
        <>
            <Box className="document-container">
                {
                    uploadFile.length === 0 ? (<>

                        <Box marginTop={'70px'}>
                            <Stack><img src={NotFoundIcon} /></Stack>
                            <Box className="NotFound-DocumentPage">

                                <Stack className='NotFound-text'>No Document Found</Stack>
                                <Stack className='NotFound-subtext'>No Document Found</Stack>
                            </Box>
                        </Box>

                    </>)
                        : (<>
                            <Stack>
                                {uploadFile.map((doc, index) => (
                                    <Box key={index} className="Uploaded-document">
                                        <Stack className='Uploaded-Box'><img src={documentIcon} /></Stack>
                                        <Box display="flex" flexDirection="column">
                                            <Stack className="Uploaded-document-fileName">{doc.fileName}</Stack>
                                            <Stack display={'flex'} flexDirection={'row'} gap={"5px"}>
                                                <Stack className="Uploaded-document-date">{doc.timestamp}</Stack>
                                                <Stack className="Uploaded-document-tag">{doc.fileTag}</Stack>
                                            </Stack>

                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </>)
                }

                <Stack width={'100%'} ><button className='Upload-document-btn' onClick={handleOpen}><img src={UploadDocumentIcon} alt='upload' />Upload Document</button></Stack>

                {/* Modal For Uploading Document */}

                <Modal
                    open={open}
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
                            <Stack className='reminder-modal-title' sx={{ fontSize: "18px !important" }}>
                                Upload Document
                            </Stack>
                            <Stack
                                className='modal-close'
                                onClick={handleClose}
                            >
                                <img src={CloseModalIcon} />
                            </Stack>
                        </Stack>


                        <Box className="file-upload">
                            <Stack className="file-upload-title">
                                <label htmlFor="file-upload" style={{ display: "flex", flexDirection: "row" }}> <img className='img-upload' src={UploadFileIcon} /> Upload Receipt sent by hospital</label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                />{' '}
                            </Stack>
                            <Stack className="file-upload-Sub" marginTop="12px">Upload one .txt, .doc, .pdf, .docx, .png, .jpg</Stack>
                            <Stack className="file-upload-Sub">Max file size 5mb</Stack>
                        </Box>

                        {file || fileName !== "" ? (
                            <Box className="Uploaded-file">
                                <Stack className='Uploaded-Box'><img src={documentIcon} /></Stack>
                                <Box display="flex" flexDirection="column">
                                    <Stack className="file-upload-title">
                                        {fileName}
                                    </Stack>
                                    <Stack className="file-upload-Sub">Uploading Completing</Stack>
                                </Box>
                                <Stack p={1} sx={{ marginLeft: "250px" }}><img src={CheckedActiveIcon} /></Stack>
                            </Box>
                        ) : (
                            <>
                            </>
                        )}

                        <TextField
                            required
                            label="Document Name"
                            value={fileName}
                            onChange={handleFileNameChange}
                            fullWidth
                            multiline
                            InputLabelProps={{
                                style: {
                                    fontSize: '14px',
                                    color: 'rgba(128, 128, 128, 0.744)',
                                    fontFamily: `"Outfit",sans-serif`,
                                }
                            }}
                            InputProps={{
                                style: {
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }
                            }}
                            sx={{ marginTop: "12px" }}
                        />

                        <FormControl fullWidth sx={{ marginTop: "12px" }}>
                            <InputLabel id="demo-simple-select-label" sx={{
                                fontSize: '14px',
                                color: 'rgba(128, 128, 128, 0.744)',
                                fontFamily: `"Outfit",sans-serif`,
                            }}>File Tag</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedOption}
                                onChange={handleSectedOptionChange}
                                label="File Tag"
                                fullWidth
                                sx={{
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }}
                            >
                                <MenuItem className="reason-option" value=" Lab Report" sx={{
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }}>
                                    Lab Report
                                </MenuItem>
                                <MenuItem className="reason-option" value="Estimate" sx={{
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }}> Estimate</MenuItem>

                            </Select>
                        </FormControl>

                        <Box
                            sx={{
                                mt: 3,
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
                                onClick={handleSubmit}
                                className='reminder-btn'
                                type='submit'
                                // disabled={disableWonButton}
                                style={{
                                    marginLeft: "10px",
                                    // backgroundColor: disableWonButton ? "#F6F7F9" : "#0566FF",
                                    // color: disableWonButton ? "#647491" : "#FFF",

                                }}
                            >
                                Add a Document
                            </button>
                        </Box>

                    </Box>
                </Modal>

                {/* ---------- End Modal --------- */}

            </Box>

        </>

    )
}

export default Document
