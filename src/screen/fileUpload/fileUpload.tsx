import React, { useRef, useState, ChangeEvent } from 'react'
import { Box, Button, LinearProgress, Modal, Typography } from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { uploadDocFile, uploadEmrFile } from '../../api/ticket/ticket';
import { fontSize } from 'pdfkit';
// import { CSVLink, CSVDownload } from "react-csv";
import Papa from 'papaparse';

const inputStyle = {
    cursor: 'pointer',
    border: '1px solid #1592CB',
    borderRadius: '5px',
    padding: 10,
    width: '8vw',
}
const selectButtonStyle = {
    cursor: 'pointer',
    border: '1px solid #1592CB',
    borderRadius: '5px',
    padding: 5,
    width: '8vw',
    m: 2,
    fontSize: "15px",
    fontWeight: 500,

}

interface CsvRecord {
    [key: string]: string | number;
}

const FileUpload = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<String>("");
    const [uploading, setUploading] = useState<boolean>(false);
    const [selectedButtonUpload, setSelectedButtonUpload] = useState<string>("");
    const [file, setFile] = useState<CsvRecord[]>([]);
    const [docs, setDoc] = useState<CsvRecord[]>([]);
    const [open, setOpen] = useState<boolean>(true);

    const uploadFileRef = useRef<HTMLInputElement>(null);
    const handleUploadCsvFile = async () => {
        console.log(file)
        setUploading(true);
        try {
            if (selectedButtonUpload === "emr") {
                let count = 0;
                console.log(file)
                for (let i = 0; i < file.length; i++) {
                    const apiResponse = await uploadEmrFile([file[i]]);
                    console.log(apiResponse)
                    if (apiResponse.status === "success") {
                        count = count + 1
                        if (count == file.length) {
                            toast.success(apiResponse.message);
                            setOpen(false);
                            setSelectedFile("");
                            setUploading(false);
                            navigate('/ticket');
                            return; // Exit the function after success
                        }
                    } else {
                        toast.error("Error uploading CSV file");
                        setUploading(false);
                    }
                }
            } else if (selectedButtonUpload === "admission") {
                let count = 0;
                console.log(docs)
                for (let i = 0; i < docs.length; i++) {
                    const apiResponse = await uploadDocFile([docs[i]]);
                    console.log(apiResponse)
                    if (apiResponse.status === "success") {
                        count = count + 1
                        if (count == docs.length) {
                            toast.success(apiResponse.message);
                            setOpen(false);
                            setSelectedFile("");
                            setUploading(false);
                            navigate('/ticket');
                            return; // Exit the function after success
                        }
                    } else {
                        toast.error("Error uploading CSV file");
                        setUploading(false);
                    }
                }
            }
        }
        catch (error) {
            console.error('Error uploading file:', error);
            toast.error("Error uploading CSV file");
            setUploading(false);
        }
        // try {
        //     const apiResponse = await uploadEmrFile(selectedButtonUpload === "emr" ? file : docs);
        //     console.log({ apiResponse });
        //     if (apiResponse.status === "success") {
        //         toast.success(apiResponse.message);
        //         setOpen(false);
        //         setSelectedFile("");
        //         setUploading(false);
        //         navigate('/');
        //         return; // Exit the function after success
        //     } else {
        //         toast.error("Error uploading CSV file");
        //         setUploading(false);
        //     }
        // }
    };

    const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
        setFile([])
        const files = event.target.files && event.target.files;
        if (files && files[0] && files[0].type === 'text/csv') {
            setSelectedFile(`${files[0].name.slice(0, 25)}.........${files[0].name.slice(-6)}`);
            const file = files[0];
            Papa.parse(file, {
                header: true, // Indicates that the first row of the CSV file contains column headers
                dynamicTyping: true, // Automatically converts strings that look like numbers into numbers
                skipEmptyLines: true,
                complete: (results: Papa.ParseResult<CsvRecord>) => {
                    console.log('Parsed:', results.data);
                    selectedButtonUpload == "emr" ? setFile(results.data) : setDoc(results.data)
                },
                error: (error) => {
                    console.error('Error parsing:', error);
                }
            });
        } else {
            toast.error('Please select a CSV', {
                position: 'top-center',
            });
        }
    }

    return (
        <>
            <input
                style={{ display: 'none' }}
                ref={uploadFileRef}
                accept=".csv"
                // ,.xlsx,.xls
                onChange={uploadFile}
                type="file"
                name=""
                id=""
                disabled={uploading ? true : false}
            />
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {selectedButtonUpload == "" ?
                    <Box sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}>
                        <Box style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Typography id="modal-modal-title" variant="h5" component="h2" style={{ fontWeight: 500, paddingTop: "10px" }}>
                                Select Anyone For Upload File
                            </Typography>
                            <Box sx={selectButtonStyle}
                                onClick={() => setSelectedButtonUpload("admission")}
                            >
                                <span style={{ whiteSpace: 'nowrap', display: 'flex', justifyContent: 'center' }}> For Admission</span>
                            </Box>
                            <Box sx={selectButtonStyle}
                                onClick={() => setSelectedButtonUpload("emr")}
                            >
                                <span style={{ whiteSpace: 'nowrap', display: 'flex', justifyContent: 'center' }}>  For EMR</span>
                            </Box>
                        </Box>
                        <Box style={{ marginTop: '-3%', cursor: 'pointer' }}>
                            <Typography
                                onClick={() => (
                                    setOpen(false),
                                    setSelectedFile(''),
                                    navigate('/')
                                )}
                            >
                                <ClearIcon />
                            </Typography>
                        </Box>
                    </Box>
                    :
                    < Box sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                    }} >
                        <Typography>
                            <div
                                style={{ display: 'flex', justifyContent: 'end', cursor: 'pointer' }}
                                onClick={() => (
                                    setOpen(false),
                                    setSelectedFile(''),
                                    navigate('/')
                                )}
                            >
                                <ClearIcon />
                            </div>
                        </Typography>
                        <Typography id="modal-modal-title" variant="h4" component="h2" style={{ fontWeight: 500 }}>
                            Please Upload CSV File Here ...
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 3 }}>
                            <div>
                                <span style={inputStyle}
                                    onClick={() => uploadFileRef.current?.click()}
                                >
                                    <FileUploadIcon />
                                    <span
                                        style={{
                                            paddingLeft: 5,
                                            fontSize: 15,
                                            fontWeight: 500
                                        }}
                                    >
                                        Attach File
                                    </span>
                                </span>
                                <span style={{ paddingLeft: 10 }} >
                                    {selectedFile === "" ? "No File Selected" : selectedFile}
                                </span>
                            </div>
                        </Typography>
                        <Typography style={{ display: 'flex', justifyContent: 'end' }}>
                            {/* {!uploading ? <Button
                                style={{ border: '1px solid #1592CB', marginTop: 20, padding: 10, color: '#1592CB' }}
                                onClick={handleUploadCsvFile}
                            >
                                <span style={{ fontSize: 15, fontWeight: 500 }}> Upload</span>
                            </Button> :
                                <Box sx={{ width: '100%', marginTop: 5 }}>
                                    <LinearProgress />
                                </Box>
                            } */}
                            <Button
                                style={{ border: '1px solid #1592CB', marginTop: 20, padding: 10, color: '#1592CB' }}
                                onClick={handleUploadCsvFile}
                                disabled={!uploading ? false : true}
                            >
                                <span style={{ fontSize: 15, fontWeight: 500 }}> {!uploading ? "Upload" : "Please Wait ..."}</span>
                            </Button>
                        </Typography>
                    </Box>
                }
            </Modal >
        </>
    )
}

export default FileUpload
