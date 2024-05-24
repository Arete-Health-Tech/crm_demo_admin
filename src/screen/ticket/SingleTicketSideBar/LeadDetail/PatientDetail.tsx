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

interface patientData {
    uhid: string;
    name: string;
    age: string;
    gender: string;
    doctor: string;
    department: string;
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
    } = useTicketStore();

    console.log(doctors[0].departments[0], 'doctors');
    const initialPatientData: patientData = {
        uhid: '',
        name: '',
        age: '',
        gender: '',
        doctor: '',
        department: '',
    };
    const [PatientData, setPatientData] = React.useState<patientData>(initialPatientData)
    const [currentTicket, setCurrentTicket] = React.useState<iTicket>();
    const [isEditing, setIsEditing] = React.useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [name, setName] = React.useState('');


    const patientName = (ticket) => {
        if (!ticket || !ticket.consumer || ticket.consumer.length === 0) {
            return '';
        }

        const firstName = ticket.consumer[0]?.firstName;
        const lastName = ticket.consumer[0]?.lastName;

        let patientName = '';
        if (firstName && lastName) {
            const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
            const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
            patientName = capitalizedFirstName + ' ' + capitalizedLastName;
        } else if (firstName) {
            patientName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        }

        return patientName;
    };

    const doctorSetter = (id: string) => {
        return doctors.find((doctor: iDoctor) => doctor._id === id)?.name;
    };

    const departmentSetter = (id: string) => {
        return departments.find((department: iDepartment) => department._id === id)
            ?.name;
    };

    const patientData = [
        { id: 'uhid', label: 'UHID', value: `#${PatientData.uhid}` },
        { id: 'name', label: 'Name', value: `${PatientData.name}`, setValue: setPatientData },
        { id: 'age', label: 'Age', value: PatientData.age, setValue: setPatientData },
        {
            id: 'gender',
            label: 'Gender',
            value: PatientData.gender,
            setValue: setPatientData
        }, {
            id: 'department', label: 'Department', value: PatientData.department, setValue: setPatientData
        },
        { id: 'doctor', label: 'Doctor', value: PatientData.doctor, setValue: setPatientData }
    ];



    useEffect(() => {
        const getTicketInfo = (ticketID: string | undefined) => {
            const fetchTicket = tickets.find((element) => ticketID === element._id);
            setCurrentTicket(fetchTicket);
            setPatientData(prevData => ({
                ...prevData,
                uhid: `${fetchTicket?.consumer?.[0]?.uid}`,
                name: patientName(fetchTicket),
                age: `${fetchTicket?.consumer?.[0]?.age}`,
                gender: (fetchTicket?.consumer?.[0]?.gender === 'M') ? 'Male' : (fetchTicket?.consumer?.[0]?.gender === 'F') ? 'Female' : '',
                doctor: `${doctorSetter(fetchTicket?.prescription?.[0]?.doctor!)}`,
                department: `${departmentSetter(
                    fetchTicket?.prescription[0]?.departments[0]!
                )}`
            }));
        };
        getTicketInfo(ticketID);
    }, [ticketID, tickets])

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted with name:', name);
        setIsEditing(false);
    };

    const fetchPdfUrl = async () => {
        if (currentTicket?.location) {
            window.open(currentTicket.location, '_blank');
        } else {
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
                <Stack>
                    {isEditing ? (
                        <Box>
                            <Box>
                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>UHID</Stack>
                                    <Stack component='div' className='Patient-detail-data'>#{PatientData.uhid}</Stack>
                                </Box>
                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Name</Stack>
                                    <Stack component='div' className='Patient-detail-data'>
                                        <TextField
                                            id="name"
                                            type="text"
                                            label="Name"
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ style: { fontSize: '14px' } }}
                                            value={PatientData.name}
                                            onChange={(e) => setPatientData(prev => ({
                                                ...prev,
                                                name: e.target.value,
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
                                            value={departments.find((dept) => dept.name === PatientData.department) || null}
                                            onChange={(e, value) => setPatientData((prev) => ({
                                                ...prev,
                                                department: value ? value.name : '',
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
                                            value={doctors.find((dept) => dept.name === PatientData.doctor) || null}
                                            onChange={(e, value) => setPatientData((prev) => ({
                                                ...prev,
                                                doctor: value ? value.name : '',
                                            }))}
                                            options={doctors.filter((item) => PatientData.department)}
                                            // options={doctors.filter((item) =>
                                            //     item.departments.includes(PatientData.department)
                                            // )}

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
                                        <Stack component='div' className='Patient-detail-data'>{field.value}</Stack>
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

                </Stack>
            </Box>

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>

            <Box className="Payment-detail">
                <Box className='Payment-detail-Head'>
                    <Stack className='Payment-detail-Heading'>Value And Payment Mode</Stack>
                </Box>
                {currentTicket?.estimate[0] ? (
                    <Box className="Payment-detail-data">
                        <Stack className='Payment-value'>{'\u20B9'} {currentTicket?.estimate[0]?.total}</Stack>
                        <Chip
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
                        />
                    </Box>
                ) : (
                    <Box className='Patient-records-Head'>
                        <Box p={1} className='Payment-value'>No Estimate Available</Box>
                    </Box>
                )}
                <Stack className='View-Estimation' onClick={fetchPdfUrl}>View Estimate</Stack>
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
