import { Alert, Box, Button, Chip, Input, Snackbar, Stack, TextField } from '@mui/material';
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

    const uhid = "UHI3278631232";
    const [name, setName] = React.useState('John Miller');
    const [age, setAge] = React.useState("24");
    const [gender, setGender] = React.useState('Male');
    const [department, setDepartment] = React.useState('Oncology');
    const [doctor, setDoctor] = React.useState('Dr. Sipos Veronika');


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
        { id: 'uhid', label: 'UHID', value: `#${currentTicket?.consumer?.[0]?.uid}` },
        { id: 'name', label: 'Name', value: `${patientName(currentTicket)}`, setValue: setName },
        { id: 'age', label: 'Age', value: currentTicket?.consumer?.[0]?.age, setValue: setAge },
        {
            id: 'gender',
            label: 'Gender',
            value: (currentTicket?.consumer?.[0]?.gender === 'M') ? 'Male' : (currentTicket?.consumer?.[0]?.gender === 'F') ? 'Female' : '',
            setValue: setGender
        }, {
            id: 'department', label: 'Department', value: `${departmentSetter(
                currentTicket?.prescription[0]?.departments[0]!
            )}`, setValue: setDepartment
        },
        { id: 'doctor', label: 'Doctor', value: `${doctorSetter(currentTicket?.prescription?.[0]?.doctor!)}`, setValue: setDoctor }
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
                            </Stack>) : (<></>)}

                            <Stack component='div'
                                className='edit-icon'
                                sx={{ marginLeft: isEditing ? "10px" : "0" }}
                                onClick={() => setIsEditing(true)}>
                                <EditIcon />
                            </Stack>
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
                                            onChange={(e) => setName(e.target.value)}
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
                                            onChange={(e) => setAge(e.target.value)}
                                        />
                                    </Stack>
                                </Box>
                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Gender</Stack>
                                    <Stack component='div' className='Patient-detail-data'>
                                        <TextField
                                            id="gender"
                                            type="text"
                                            label="Gender"
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ style: { fontSize: '14px' } }}
                                            value={PatientData.gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                    </Stack>
                                </Box>
                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Department</Stack>
                                    <Stack component='div' className='Patient-detail-data'>

                                        <TextField
                                            id="department"
                                            type="text"
                                            label="Department"
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ style: { fontSize: '14px' } }}
                                            value={PatientData.department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                        />
                                    </Stack>
                                </Box>
                                <Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Doctor</Stack>
                                    <Stack component='div' className='Patient-detail-data'>
                                        <TextField
                                            id="doctor"
                                            type="text"
                                            label="Doctor"
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ style: { fontSize: '14px' } }}
                                            InputLabelProps={{ style: { fontSize: '14px' } }}
                                            value={PatientData.doctor}
                                            onChange={(e) => setDoctor(e.target.value)}
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
                <Stack className='View-Estimation' onClick={fetchPdfUrl}>View Estimations</Stack>
                {showAlert && (

                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={showAlert}
                        autoHideDuration={4000} onClose={() => setShowAlert(false)}
                    >
                        <Alert severity="warning" >
                            Please Create an Estimations.
                        </Alert>
                    </Snackbar>
                )
                }
            </Box >

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>

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
                            </Box>
                            <Box className='Patient-records-Head'>
                                <Stack className='dot-list'>
                                    <span>&#8226;</span>
                                </Stack>
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
            {(currentTicket?.prescription?.[0]?.diagnostics?.length ?? 0) > 0 ? (
                <>
                    <Box className="Patient-records">
                        <Box className='Patient-records-Head'>
                            <Stack className='Patient-records-Heading'>Diagnostics Test</Stack>
                        </Box>
                        {(currentTicket?.prescription?.[0]?.diagnostics?.length ?? 0) > 0 ? (
                            currentTicket?.prescription[0]?.diagnostics.map((diagnostic, index) => (
                                <React.Fragment key={index}>
                                    <Box className='Patient-records-Head'>

                                        {isEditing ? (<>
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
                <Box className='Patient-records-Head'>
                    {(currentTicket?.prescription?.[0]?.medicines?.length ?? 0) > 0 ? (
                        currentTicket?.prescription[0]?.medicines.map((med, index) => (
                            <React.Fragment key={index}>
                                <Stack className='dot-list'>
                                    <span>&#8226;</span>
                                </Stack>
                                <Stack className='Patient-records-data'>{med}</Stack>
                                <Box className="record-tag pharmacy-tag">{currentTicket?.prescription[0]?.isPharmacy}</Box>
                            </React.Fragment>
                        ))
                    ) : (<>
                        <Box className="record-tag pharmacy-tag" sx={{ width: currentTicket?.prescription[0]?.isPharmacy == "Not Advised" ? "102px;" : "width: 132px;" }}>{currentTicket?.prescription[0]?.isPharmacy}</Box>
                    </>
                    )}
                </Box>
            </Box>
        </>

    )
}

export default PatientDetail

