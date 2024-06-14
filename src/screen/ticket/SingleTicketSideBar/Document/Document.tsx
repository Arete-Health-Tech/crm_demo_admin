import { Alert, Box, CircularProgress, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import NotFoundIcon from "../../../../assets/NotFoundDocument.svg"
import "../../singleTicket.css"
import UploadDocumentIcon from '../../../../assets/UploadDocument.svg'
import CloseModalIcon from "../../../../assets/Group 48095853.svg";
import UploadFileIcon from "../../../../assets/UploadFileIcon.svg";
import CheckedActiveIcon from "../../../../assets/NotActive.svg"
import documentIcon from "../../../../assets/document-text.svg"
import { UploadFile } from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import { apiClient } from '../../../../api/apiClient'
import CheckIcon from '@mui/icons-material/Check';
import { getDocumentsData } from '../../../../api/ticket/ticket'
import useTicketStore from '../../../../store/ticketStore'
interface UploadedFileObject {
    document: string;
    tag: string;
    ticketid: string | "";
    _id: string;
    name: string;
    date: Date;
}

const Document = () => {
    const uploadFileRef = useRef<HTMLInputElement>(null);
    const { ticketID } = useParams();
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadFileName, setUploadFileName] = useState("");
    const [fileName, setFileName] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [disableButton, setDisableButton] = useState(true);
    const [uploadedFile, setUploadedFile] = useState<UploadedFileObject[]>([]);
    const [isUploaded, setIsUploaded] = useState(false);
    const {
        isAuditor,
        setIsAuditor
    } = useTicketStore();
    const checkIsEmpty = () => {
        if (
            file !== null
            // &&
            // fileName !== ""
        ) {
            setDisableButton((_) => false);
        } else {
            setDisableButton((_) => true);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        checkIsEmpty();
    }, [file])

    const handleClose = () => {
        setFile(null);
        setFileName("");
        setSelectedOption("");
        setOpen(false);
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

    const handleFileNameChange = (event) => {
        setFileName(event.target.value);

    }

    const handleSectedOptionChange = (event) => {
        // console.log(event.target.value);
        setSelectedOption(event.target.value);
    }



    const documentsData = async () => {
        const ticketid = ticketID
        try {
            const response = await getDocumentsData(ticketid);
            setUploadedFile(response.data.content)
            // console.log(response.data.content,document);
            setLoading(false);
        } catch (error) {
            setUploadedFile([])
            console.log("no data found")
        }
    }

    const handleSubmit = async () => {
        try {
            if (!file) {
                console.error('File is null.');
                return;
            }
            // console.log(file, "inisde")
            const formData = new FormData();
            formData.append('document', file);
            formData.append('tag', selectedOption);
            formData.append('ticketid', `${ticketID}`);

            // const { data } = await apiClient.post('/task/uploadDocs', formData);
            // console.log(data, "data");
            const { data } = await apiClient.post(
                `/task/uploadDocs`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data) {
                console.log(data, 'document upload successful');
                setIsUploaded(true);
                documentsData()
                handleClose();
            } else {
                console.error('Error uploading document:', data);
            }
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };
    useEffect(() => {
        documentsData()
    }, [ticketID])

    function convertToReadableDate(isoDateString) {
        const date = new Date(isoDateString);

        // Get the day, month, and year components
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        // Define an array of month names
        const monthNames = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];

        // Get the month name using the month index
        const monthName = monthNames[monthIndex];

        // Format the date as "day month year"
        return `${day} ${monthName} ${year}`;
    }

    return (
        <>

            <input
                id="file-upload"
                style={{ display: 'none' }}
                ref={uploadFileRef}
                type="file"
                onChange={handleFileChange}
            />{' '}
            <Box className={!isAuditor ? "document-container" : "Audit-document-container"}>
                {loading ? (
                    <> <Box marginTop={'70px'}>
                        <CircularProgress />
                    </Box>
                    </>
                ) : uploadedFile?.length === 0 ? (<>

                    <Box marginTop={'70px'}>
                        <Stack><img src={NotFoundIcon} alt='' /></Stack>
                        <Box className="NotFound-DocumentPage">

                            <Stack className='NotFound-text'>No Document Found</Stack>
                            <Stack className='NotFound-subtext'>No Document Found</Stack>
                        </Box>
                    </Box>

                </>)
                    : (<>
                        <Stack>
                            {uploadedFile.map((doc, index) => (
                                <a href={doc.document} target='blank' style={{ textDecoration: "none" }}>
                                    <Box key={index} className="Uploaded-document">
                                        <Stack className='Uploaded-document-icon'><img width="16px" height={'16px'} src={documentIcon} alt='' /></Stack>
                                        <Box display="flex" flexDirection="column">
                                            {doc.name && <Stack className="Uploaded-document-fileName">{doc.name}</Stack>}
                                            <Stack display={'flex'} flexDirection={'row'} gap={"5px"}>
                                                {doc.date && <Stack className="Uploaded-document-date">{convertToReadableDate(doc.date)}</Stack>
                                                }
                                                <Stack className="Uploaded-document-tag">{doc.tag}</Stack>
                                            </Stack>

                                        </Box>
                                    </Box>
                                </a>
                            ))}
                        </Stack>
                    </>)
                }

                {!isAuditor && <Stack width={'100%'} ><button className='Upload-document-btn' onClick={handleOpen}><img src={UploadDocumentIcon} alt='upload' />Upload Document</button></Stack>}
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
                            <Stack className='modal-close'
                                onClick={handleClose}
                            >
                                <img src={CloseModalIcon} alt='' />
                            </Stack>
                        </Stack>

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
                            required
                            id="outlined-required"
                            label="Document Name"
                            value={fileName}
                            onChange={handleFileNameChange}
                            fullWidth
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
                        /> */}

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
                                <MenuItem className="reason-option" value="Radiology Report" sx={{
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }}> Radiology Report</MenuItem>
                                <MenuItem className="reason-option" value="TPA Report" sx={{
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }}> TPA Report</MenuItem>
                                <MenuItem className="reason-option" value="PPA Report" sx={{
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }}> PPA Report</MenuItem>
                                <MenuItem className="reason-option" value="RFA Report" sx={{
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }}> RFA Report</MenuItem>
                                <MenuItem className="reason-option" value="Payment Slip" sx={{
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }}> Payment Slip</MenuItem>
                                <MenuItem className="reason-option" value="ID Card" sx={{
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }}>ID Card</MenuItem>
                                <MenuItem className="reason-option" value="Others" sx={{
                                    fontSize: '14px',
                                    color: '#080F1A',
                                    fontFamily: `"Outfit",sans-serif`,
                                }}>Others</MenuItem>

                            </Select>
                        </FormControl>
                        {isUploaded && <Box marginTop={'5px'}> <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Document Uploaded SuccessFully.
                        </Alert></Box>}
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
                                disabled={disableButton}
                                style={{
                                    marginLeft: "10px",
                                    backgroundColor: disableButton ? "#F6F7F9" : "#0566FF",
                                    color: disableButton ? "#647491" : "#FFF",

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
