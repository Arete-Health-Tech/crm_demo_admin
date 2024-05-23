
import { Box, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Form, useParams } from 'react-router-dom'
import '../../singleTicket.css';
import ShowPrescription from '../../widgets/ShowPrescriptionModal';
import { iTicket } from '../../../../types/store/ticket';
import useTicketStore from '../../../../store/ticketStore';
import useServiceStore from '../../../../store/serviceStore';
import { iDepartment, iDoctor } from '../../../../types/store/service';

const EditIcon = () => (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="vuesax/linear/edit-2">
            <g id="edit-2">
                <path id="Vector" d="M11.05 3.50002L4.20829 10.7417C3.94996 11.0167 3.69996 11.5584 3.64996 11.9334L3.34162 14.6333C3.23329 15.6083 3.93329 16.275 4.89996 16.1084L7.58329 15.65C7.95829 15.5834 8.48329 15.3084 8.74162 15.025L15.5833 7.78335C16.7666 6.53335 17.3 5.10835 15.4583 3.36668C13.625 1.64168 12.2333 2.25002 11.05 3.50002Z" stroke="#080F1A" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path id="Vector_2" d="M9.90833 4.7085C10.2667 7.0085 12.1333 8.76683 14.45 9.00016" stroke="#080F1A" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path id="Vector_3" d="M2.5 18.8335H17.5" stroke="#080F1A" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </g>
        </g>
    </svg>
);

interface MyComponentProps {
    isPatient: boolean;
}

const PatientRecord = ({ isPatient }) => {
    const [currentTicket, setCurrentTicket] = React.useState<iTicket>();
    const [isEditing, setIsEditing] = React.useState(false);
    const [diagonsticsTest, setDiagonsticsTest] = React.useState([""]);
    const [isDiagonsticTestEditing, setIsDiagonsticTestEditing] = React.useState(false);
    const {
        tickets,
    } = useTicketStore();
    const [name, setName] = React.useState('John Miller');
    const { ticketID } = useParams();

    useEffect(() => {
        const getTicketInfo = (ticketID: string | undefined) => {
            const fetchTicket = tickets.find((element) => ticketID === element._id);
            setCurrentTicket(fetchTicket);

            if (currentTicket?.prescription?.[0]?.diagnostics?.length > 0) {
                setDiagonsticsTest(currentTicket?.prescription?.[0]?.diagnostics?.length[0]);
            }
        };
        getTicketInfo(ticketID);
        console.log(diagonsticsTest, 'ncdbfndbfndbfn');

    }, [ticketID, tickets, diagonsticsTest])

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted with name:', name);
        setIsEditing(false);
    };

    const handleEditDiagonsticTest = (event) => {
        event.preventDefault();
        // console.log('Form submitted with name:', name);
        setIsDiagonsticTestEditing(false);
    };



    return (
        <>

            {/* Diagnosis */}
            <Box className="Patient-records">
                <Box className='Patient-records-Head'>
                    <Stack className='Patient-records-Heading'>Diagnosis</Stack>

                </Box>
                <Box className='Patient-records-Head'>
                    <Stack className='dot-list'>
                        <span>&#8226;</span>
                    </Stack>
                    <Stack className='Patient-records-data'>Suspected renal impairment or monitoring of known kidney disease</Stack>
                </Box>
            </Box>

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>


            {/* Admission Details */}
            {currentTicket?.prescription[0]?.admission ? (
                <>

                    {currentTicket?.prescription?.[0]?.service && currentTicket?.prescription?.[0]?.service?.name ? (
                        <><Box className="Patient-records">
                            <Box className='Patient-records-Head'>
                                <Stack className='Patient-records-Heading'>Admission Details</Stack>
                                {isPatient ? (<>
                                    <Stack display="flex" flexDirection="row">
                                        {isEditing ? (<Stack >
                                            <button className='save-btn'
                                                onClick={handleSubmit}>
                                                Save
                                            </button>
                                        </Stack>) : (<>
                                            <Stack component='div'
                                                className='edit-icon'
                                                sx={{ marginLeft: isEditing ? "10px" : "0" }}
                                                onClick={() => setIsEditing(true)}>
                                                <EditIcon />
                                            </Stack>
                                        </>)}
                                    </Stack>
                                </>)
                                    : (
                                        <></>
                                    )}
                            </Box>


                            <Box className='Patient-records-Head'>
                                {isEditing ? (<></>) : (<><Stack className='dot-list'>
                                    <span>&#8226;</span>
                                </Stack></>)}

                                {isEditing ? (<>
                                    <Stack className='Patient-records-data'>
                                        <TextField
                                            id="Service Name"
                                            type="text"
                                            label="Service Name"
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ style: { fontSize: '14px' } }}
                                            value={currentTicket.prescription[0].service.name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Stack>
                                </>) : (<>
                                    <Stack className='Patient-records-data'>{currentTicket.prescription[0].service.name}</Stack>
                                </>)}

                            </Box>

                            {isEditing ? (<>
                                <Stack className='Patient-records-data'>
                                    <TextField
                                        id="AdmissionType"
                                        type="text"
                                        label="AdmissionType"
                                        variant="outlined"
                                        size="small"
                                        inputProps={{ style: { fontSize: '14px' } }}
                                        value={currentTicket?.prescription[0]?.admission}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Stack>
                            </>) : (<>
                                <Box className="record-tag pharmacy-tag">{currentTicket?.prescription[0]?.admission} </Box>
                            </>)}

                        </Box>
                        </>
                    ) : (
                        <>
                            <Box className="Patient-records">
                                <Box className='Patient-records-Head'>
                                    <Stack className='Patient-records-Heading'>Admission Details</Stack>

                                    {isPatient ? (<>
                                        <Stack display="flex" flexDirection="row">
                                            {isEditing ? (<Stack >
                                                <button className='save-btn'
                                                    onClick={handleSubmit}>
                                                    Save
                                                </button>
                                            </Stack>) : (<>
                                                <Stack component='div'
                                                    className='edit-icon'
                                                    sx={{ marginLeft: isEditing ? "10px" : "0" }}
                                                    onClick={() => setIsEditing(true)}>
                                                    <EditIcon />
                                                </Stack>
                                            </>)}


                                        </Stack>
                                    </>)
                                        : (
                                            <></>
                                        )}
                                </Box>
                                {isEditing ? (<>
                                    <Stack className='Patient-records-data'>
                                        <TextField
                                            id="AdmissionType"
                                            type="text"
                                            label="AdmissionType"
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ style: { fontSize: '14px' } }}
                                            value={currentTicket?.prescription[0]?.admission}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Stack>
                                </>) : (<>
                                    <Box className="record-tag" sx={{ marginTop: "6px", }}>{currentTicket?.prescription[0]?.admission}</Box>
                                </>)}
                            </Box>
                        </>

                    )}


                    <Stack className="gray-border">
                        {/* Borders */}
                    </Stack>
                </>
            ) : (
                <>
                    {/* Empty */}
                </>
            )}


            {/* Diagnostics Test */}
            {currentTicket?.prescription?.[0]?.diagnostics?.length > 0 ? (
                <>
                    <Box className="Patient-records">
                        <Box className='Patient-records-Head'>
                            <Stack className='Patient-records-Heading'>Diagnostics Test</Stack>
                            {isPatient ? (<>
                                <Stack display="flex" flexDirection="row">
                                    {isDiagonsticTestEditing ? (<Stack >
                                        <button className='save-btn'
                                            onClick={handleEditDiagonsticTest}>
                                            Save
                                        </button>
                                    </Stack>) : (<>

                                        <Stack component='div'
                                            className='edit-icon'
                                            sx={{ marginLeft: isDiagonsticTestEditing ? "10px" : "0" }}
                                            onClick={() => setIsDiagonsticTestEditing(true)}>
                                            <EditIcon />
                                        </Stack>
                                    </>)}


                                </Stack>
                            </>)
                                : (
                                    <></>
                                )}
                        </Box>
                        {currentTicket?.prescription?.[0]?.diagnostics.length > 0 ? (
                            currentTicket?.prescription[0]?.diagnostics.map((diagnostic, index) => (
                                <React.Fragment key={index}>
                                    <Box className='Patient-records-Head'>

                                        {isDiagonsticTestEditing ? (<>
                                            <Stack className='Patient-records-data'>
                                                <TextField
                                                    id="Diagnostics Test"
                                                    type="text"
                                                    label="Diagnostics Test"
                                                    variant="outlined"
                                                    size="small"
                                                    inputProps={{ style: { fontSize: '14px' } }}
                                                    value={diagnostic}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </Stack>
                                        </>) :
                                            (<>
                                                <Stack className='dot-list'>
                                                    <span>&#8226;</span>
                                                </Stack>
                                                <Stack className='Patient-records-data'>{diagnostic}</Stack>
                                            </>)}

                                    </Box>
                                </React.Fragment>
                            ))
                        ) : (
                            <></>
                        )}

                    </Box>

                    <Stack className="gray-border">
                        {/* Borders */}
                    </Stack>

                </>
            ) : (
                <>
                    {/* Empty */}
                </>
            )}

            {/* Pharmacy */}
            <Box className="Patient-records Pharmacy">
                <Box className='Patient-records-Head'>
                    <Stack className='Patient-records-Heading'>Pharmacy</Stack>
                </Box>
                <Box className='Patient-records-Head' display={'flex'} flexDirection={'column'}>
                    {(currentTicket?.prescription?.[0]?.medicines?.length ?? 0) > 0 ? (
                        <>
                            {currentTicket?.prescription[0]?.medicines.map((med, index) => (
                                <React.Fragment key={index} >
                                    <Stack display={'flex'} flexDirection={'row'}>
                                        <Stack className='dot-list'  >
                                            <span>&#8226;</span>
                                        </Stack>
                                        <Stack className='Patient-records-data'>{med}</Stack>
                                    </Stack>

                                </React.Fragment>
                            ))}
                            < Box className="record-tag pharmacy-tag" marginTop={"5px"}>{currentTicket?.prescription[0]?.isPharmacy}</Box>
                        </>
                    ) : (<>
                        <Box className="record-tag pharmacy-tag" sx={{ width: currentTicket?.prescription[0]?.isPharmacy == "Not Advised" ? "102px;" : "width: 132px;" }}>{currentTicket?.prescription[0]?.isPharmacy}</Box>
                    </>
                    )}
                </Box>
            </Box>
        </>
    )
}

export default PatientRecord
