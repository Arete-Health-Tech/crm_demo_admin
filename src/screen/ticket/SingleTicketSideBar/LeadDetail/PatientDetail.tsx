import { Alert, Autocomplete, Box, Button, Chip, FormControl, Input, InputLabel, MenuItem, Select, Snackbar, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Form, useParams } from 'react-router-dom'
import '../../singleTicket.css';
import ShowPrescription from '../../widgets/ShowPrescriptionModal';
import { iTicket } from '../../../../types/store/ticket';
import useTicketStore from '../../../../store/ticketStore';
import useServiceStore from '../../../../store/serviceStore';
import { iDepartment, iDoctor } from '../../../../types/store/service';
import { Interface } from 'readline';
import { updateConusmerData } from '../../../../api/ticket/ticket';
import { getTicketHandler } from '../../../../api/ticket/ticketHandler';
import { apiClient } from '../../../../api/apiClient';

interface patientData {
    uhid: string;
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
    doctor: string;
    department: string;
    remarks: string | "";
}

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

const PatientDetail: React.FC<MyComponentProps> = ({ isPatient }) => {


    const { ticketID } = useParams();
    const { doctors, departments, stages } = useServiceStore();
    const {
        tickets,
        filterTickets,
        searchByName,
        pageNumber,
        viewEstimates,
        setViewEstimates,
        isEstimateUpload,
        setIsEstimateUpload,
        isAuditor
    } = useTicketStore();

    // console.log(doctors[0].departments[0], 'doctors');
    const initialPatientData: patientData = {
        uhid: '',
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        doctor: '',
        department: '',
        remarks: ""
    };
    const [PatientData, setPatientData] = React.useState<patientData>(initialPatientData)
    const [currentTicket, setCurrentTicket] = React.useState<iTicket>();
    const [isEditing, setIsEditing] = React.useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');


    useEffect(() => {
        const fetchEstimateData = async () => {

            if (ticketID) {
                try {
                    const { data } = await apiClient.get(`ticket/uploadestimateData/${ticketID}`);
                    setViewEstimates(data)
                    // console.log(data, "uploadestimate----")
                } catch (error) {
                    console.error("Error fetching estimate data:", error);
                }
            } else {
                console.error("Ticket ID is undefined.");
            }
        }

        // console.log(estimates2, "fetchEstimateData");
        fetchEstimateData();
        setIsEstimateUpload(false);
    }, [ticketID, isEstimateUpload]);

    const doctorSetter = (id: string) => {
        return doctors.find((doctor: iDoctor) => doctor._id === id)?.name;
    };

    const departmentSetter = (id: string) => {
        return departments.find((department: iDepartment) => department._id === id)
            ?.name;
    };
    console.log(PatientData.remarks, "PatientData.remarks")
    const patientData = [
        { id: 'uhid', label: 'UHID', value: `#${PatientData.uhid}` },
        { id: 'Name', label: 'Name', value: `${PatientData.firstName} ${PatientData.lastName}`, setValue: setPatientData },
        { id: 'age', label: 'Age', value: PatientData.age, setValue: setPatientData },
        {
            id: 'gender',
            label: 'Gender',
            value: PatientData.gender,
            setValue: setPatientData
        }, {
            id: 'remarks', label: "Remark", value: PatientData.remarks, setValue: setPatientData
        },
        {
            id: 'department', label: 'Department', value: PatientData.department, setValue: setPatientData
        },
        { id: 'doctor', label: 'Doctor', value: PatientData.doctor, setValue: setPatientData }
    ];

    // console.log(doctors, departments,)

    useEffect(() => {
        const getTicketInfo = (ticketID: string | undefined) => {
            const fetchTicket = tickets.find((element) => ticketID === element._id);
            setCurrentTicket(fetchTicket);
            setPatientData(prevData => ({
                ...prevData,
                uhid: `${fetchTicket?.consumer?.[0]?.uid}`,
                firstName: `${fetchTicket?.consumer?.[0]?.firstName ?? ''}`,
                lastName: `${fetchTicket?.consumer?.[0]?.lastName ?? ''}`,
                remarks: `${fetchTicket?.prescription[0]?.remarks == " " ? "No Remark" : fetchTicket?.prescription[0]?.remarks}`,
                age: `${fetchTicket?.consumer?.[0]?.age && fetchTicket?.consumer?.[0]?.age}`,
                gender: (fetchTicket?.consumer?.[0]?.gender === 'M') ? 'Male' : (fetchTicket?.consumer?.[0]?.gender === 'F') ? 'Female' : '',
                doctor: `${fetchTicket?.prescription?.[0]?.doctor}`,
                department: `${fetchTicket?.prescription[0]?.departments[0]}`

            }));
        };
        getTicketInfo(ticketID);
    }, [ticketID, tickets])

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log('Form submitted with name:', PatientData);
        const updatedData = {
            "consumer": {
                "firstName": PatientData.firstName,
                "lastName": PatientData.lastName,
                "gender": PatientData.gender === "Male" ? "M" : PatientData.gender === "Female" ? "F" : "",
                "age": PatientData.age,

            },
            "prescription": {
                doctor: PatientData.doctor,
                departments: [PatientData.department]

            }
        }
        await updateConusmerData(updatedData, ticketID)
        await getTicketHandler(
            searchByName,
            pageNumber,
            'false',
            filterTickets
        );
        setIsEditing(false);
    };

    const fetchPdfUrl = async () => {
        if (currentTicket?.location) {
            window.open(currentTicket.location, '_blank');
        } else {
            setShowAlert(true);
        }
    };

    const fetchUploadPdfUrl = async () => {
        if (viewEstimates[viewEstimates.length - 1]?.total) {
            window.open(viewEstimates[viewEstimates.length - 1].location, '_blank');
        }
        // if (viewEstimates[viewEstimates.length - 1].location) {
        //     window.open(viewEstimates[viewEstimates.length - 1].location, '_blank');
        // } 
        else {
            setShowAlert(true);
        }
    };

    return (
        <>
            <Box className="Patient-detail">
                <Box className='Patient-detail-Head'>
                    <Stack className='Patient-detail-Heading'>Patient Details</Stack>
                    {isPatient ? (<>
                        <Stack display="flex" flexDirection="row">
                            {isEditing ? (<Stack display="flex" flexDirection="row">
                                <button className='cancel-btn'
                                    onClick={() => setIsEditing(false)}>
                                    cancel
                                </button>
                                <button className='save-btn'
                                    onClick={handleSubmit}>
                                    Save
                                </button>
                            </Stack>) : (<>
                                {!isAuditor && <Stack component='div'
                                    className='edit-icon'
                                    sx={{ marginLeft: isEditing ? "10px" : "0" }}
                                    onClick={() => setIsEditing(true)}>
                                    <EditIcon />
                                </Stack>}
                            </>)}


                        </Stack>
                    </>)
                        : (
                            <></>
                        )}
                </Box>
                <Stack>
                    {isEditing ? (
                        <Box>
                            <Box>
                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>UHID</Stack>
                                    <Stack component='div' className='Patient-detail-data'>#{PatientData.uhid}</Stack>
                                </Box>
                                {PatientData?.remarks !== "No" ? < Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Remark</Stack>
                                    <Stack component='div' className='Patient-detail-data'>{PatientData.remarks}</Stack>
                                </Box> : <></>}
                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>First Name</Stack>
                                    <Stack component='div' className='Patient-detail-data'>
                                        <TextField
                                            id="firstName"
                                            type="text"
                                            label="First Name"
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ style: { fontSize: '14px' } }}
                                            value={PatientData.firstName}
                                            onChange={(e) => setPatientData(prev => ({
                                                ...prev,
                                                firstName: e.target.value,
                                            }))}
                                            InputProps={{
                                                style: {
                                                    textTransform: 'capitalize',
                                                    fontSize: '14px',
                                                    fontFamily: 'Outfit,sans-serif'
                                                },
                                            }}
                                        />
                                    </Stack>
                                </Box>

                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Last Name</Stack>
                                    <Stack component='div' className='Patient-detail-data'>
                                        <TextField
                                            id="lastName"
                                            type="text"
                                            label="Last Name"
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ style: { fontSize: '14px' } }}
                                            value={PatientData.lastName}
                                            onChange={(e) => setPatientData(prev => ({
                                                ...prev,
                                                lastName: e.target.value,
                                            }))}
                                            InputProps={{
                                                style: {
                                                    textTransform: 'capitalize',
                                                    fontSize: '14px',
                                                    fontFamily: 'Outfit,sans-serif'
                                                },
                                            }}
                                        />
                                    </Stack>
                                </Box>
                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Age</Stack>
                                    <Stack component='div' className='Patient-detail-data'>
                                        <TextField
                                            id="age"
                                            type='number'
                                            label="Age"
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ style: { fontSize: '14px' } }}
                                            value={PatientData.age}
                                            onChange={(e) => setPatientData(prev => ({
                                                ...prev,
                                                age: e.target.value,
                                            }))}
                                            InputProps={{
                                                style: {
                                                    textTransform: 'capitalize',
                                                    fontSize: '14px',
                                                    fontFamily: 'Outfit,sans-serif'
                                                },
                                            }}
                                        />
                                    </Stack>
                                </Box>
                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Gender</Stack>
                                    <Stack component='div' className='Patient-detail-data'>

                                        <FormControl variant="outlined" size="small" fullWidth>
                                            <InputLabel id="gender-label">Gender</InputLabel>
                                            <Select
                                                labelId="gender-label"
                                                id="gender"
                                                value={PatientData.gender}
                                                onChange={(e) => setPatientData(prev => ({
                                                    ...prev,
                                                    gender: e.target.value,
                                                }))}
                                                label="Gender"
                                                style={{ textTransform: 'capitalize', fontSize: '14px', fontFamily: 'Outfit,sans-serif' }}
                                                inputProps={{ style: { fontSize: '14px' } }}
                                            >
                                                <MenuItem value="Male" sx={{
                                                    fontSize: '14px',
                                                    fontFamily: 'Outfit,sans-serif'
                                                }}>
                                                    Male
                                                </MenuItem>
                                                <MenuItem value="Female" sx={{
                                                    fontSize: '14px',
                                                    fontFamily: 'Outfit,sans-serif'
                                                }}>
                                                    Female
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Box>
                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Department</Stack>
                                    <Stack component='div' className='Patient-detail-data'>

                                        <Autocomplete
                                            size="small"
                                            fullWidth
                                            value={departments.find((dept) => dept._id === PatientData.department) || null}
                                            onChange={(e, value) => setPatientData((prev) => ({
                                                ...prev,
                                                department: value ? `${value._id}` : '',
                                            }))}
                                            renderOption={(props, option) => (
                                                <li {...props} style={{ textTransform: 'capitalize', fontFamily: "sans-serif", fontSize: "12px" }}>
                                                    {option.name}
                                                </li>
                                            )}
                                            getOptionLabel={(option) => option.name}
                                            options={departments.filter((item) => item.parent === null)}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Department"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        style: {
                                                            textTransform: 'capitalize',
                                                            fontSize: '14px',
                                                            fontFamily: 'Outfit,sans-serif'
                                                        },
                                                    }}
                                                />
                                            )}
                                        />

                                    </Stack>
                                </Box>

                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Doctor</Stack>
                                    <Stack component='div' className='Patient-detail-data'>
                                        <Autocomplete
                                            size="small"
                                            disablePortal
                                            renderOption={(props, option) => (
                                                <li {...props} style={{ textTransform: 'capitalize', fontFamily: "sans-serif", fontSize: "12px" }}>
                                                    {option.name}
                                                </li>
                                            )}
                                            fullWidth
                                            value={doctors.find((dept) => dept._id === PatientData.doctor) || null}
                                            onChange={(e, value) => setPatientData((prev) => ({
                                                ...prev,
                                                doctor: value ? value._id : '',
                                            }))}
                                            options={doctors.filter((item) => item.departments.includes(PatientData.department))}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => <TextField {...params}
                                                label="Doctor"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: {
                                                        textTransform: 'capitalize',
                                                        fontSize: '14px',
                                                        fontFamily: 'Outfit,sans-serif'
                                                    },
                                                }}
                                            />}
                                        />
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            {patientData.map((field) => (
                                (field.value !== null && field.value !== undefined && field.value !== "") ? (
                                    <Box key={field.id} className='Patient-detail-Head'>
                                        <Stack className='Patient-detail-title'>{field.label}</Stack>
                                        <Stack component='div' className='Patient-detail-data'>{
                                            field.label === "Department" ? departmentSetter(field.value) : field.label === "Doctor" ? doctorSetter(field.value) : (field.value)
                                        }</Stack>
                                    </Box>
                                ) : (
                                    <React.Fragment key={field.id} />
                                )
                            ))}

                            <Stack>
                                <ShowPrescription
                                    image={currentTicket?.prescription[0]?.image}
                                    image1={currentTicket?.prescription[0]?.image1}
                                /></Stack>
                        </>
                    )}

                </Stack >
            </Box >

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>

            {
                (currentTicket?.opinion !== undefined && currentTicket?.opinion?.length > 0) && <Box className="Patient-records">
                    <Box className='additional-detail-Head'>
                        <Stack className='additional-detail-Heading'>SECOND OPINIONS</Stack>
                    </Box>
                    <Box className='additional-detail-Head'>
                        <Stack className='additional-detail-title'>Hospital</Stack>
                        <Stack component='div' className='additional-detail-data' sx={{ textTransform: "capitalize" }}> {currentTicket?.opinion[currentTicket?.opinion?.length - 1]?.hospital ? currentTicket?.opinion[currentTicket?.opinion?.length - 1]?.hospital : "No Data Available"}
                        </Stack>
                    </Box>
                    <Box className='additional-detail-Head'>
                        <Stack className='additional-detail-title'>Doctor Name</Stack>
                        <Stack component='div' className='additional-detail-data'>{currentTicket?.opinion[currentTicket?.opinion?.length - 1]?.doctor ? currentTicket?.opinion[currentTicket?.opinion?.length - 1]?.doctor : "No Data Available"}</Stack>
                    </Box>
                    <Box className='additional-detail-Head'>
                        <Stack className='additional-detail-title'>Remark</Stack>
                        <Stack component='div' className='additional-detail-data'>{currentTicket?.opinion[currentTicket?.opinion?.length - 1]?.additionalInfo ? currentTicket?.opinion[currentTicket?.opinion?.length - 1]?.additionalInfo : "No Data Available"}</Stack>
                    </Box>
                </Box>
            }

            {
                (currentTicket?.opinion !== undefined && currentTicket?.opinion?.length > 0) && <Stack className="gray-border">
                    {/* Borders */}
                </Stack>
            }
            {
                (currentTicket?.opinion && currentTicket?.opinion?.length !== 0) ? (<>
                    {(currentTicket?.opinion[0]?.challengeSelected?.length !== 0) ? (<>
                        <Box className="Patient-records">
                            <Box className='additional-detail-Head'>
                                <Stack className='additional-detail-Heading'>CONVERSION CHALLENGES</Stack>
                            </Box>
                            {currentTicket?.opinion[0]?.challengeSelected?.map((item) => (
                                <Box className='additional-detail-Head' key={item}>
                                    <Stack className='record-tag pharmacy-tag' width={'10.2vw'} sx={{ color: "#080F1A" }}>
                                        {item}
                                    </Stack>
                                </Box>
                            ))}
                        </Box >
                        <Stack className="gray-border">
                            {/* Borders */}
                        </Stack>
                    </>) : (<></>)}

                </>) : (<></>)
            }


            <Box className="Payment-detail">
                <Box className='Payment-detail-Head'>
                    <Stack className='Payment-detail-Heading'>Value And Payment Mode</Stack>
                </Box>
                {viewEstimates[viewEstimates.length - 1] ? (
                    <Box className="Payment-detail-data">
                        {/* <Stack className='Payment-value'>{'\u20B9'} {currentTicket?.estimate[0]?.total}</Stack> */}
                        <Stack className='Payment-value'>{'\u20B9'} {viewEstimates[viewEstimates.length - 1]?.total}</Stack>
                        <Stack className='ticket-card-line3-tag'>
                            {viewEstimates[viewEstimates.length - 1]?.paymentType}
                        </Stack>
                        {/* <Chip
                            label={
                                currentTicket?.estimate[0]?.paymentType === 0
                                    ? 'Cash'
                                    : currentTicket?.estimate[0]?.paymentType === 1
                                        ? 'Insurance'
                                        : currentTicket?.estimate[0]?.paymentType === 2
                                            ? 'CGHS| ECHS'
                                            : 'Payment Type Not Available'
                            }
                            size="medium"
                            sx={{
                                backgroundColor: '#DAE8FF',
                                color: '#080F1A',
                                fontSize: '0.875rem',
                                fontFamily: `'Outfit', sans-serif`,
                                padding: 0,
                            }}
                        /> */}
                    </Box>
                ) : (
                    <Box className='Patient-records-Head'>
                        <Box p={1} className='Payment-value'>No Estimate Available</Box>
                    </Box>
                )}
                <Stack className='View-Estimation' onClick={fetchUploadPdfUrl}>View Estimate</Stack>
                {/* <Stack className='View-Estimation' onClick={fetchPdfUrl}>View Estimate</Stack> */}
                {showAlert && (

                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={showAlert}
                        autoHideDuration={4000} onClose={() => setShowAlert(false)}
                    >
                        <Alert severity="warning" >
                            Please Create an Estimate.
                        </Alert>
                    </Snackbar>
                )
                }
            </Box >
        </>

    )
}

export default PatientDetail

