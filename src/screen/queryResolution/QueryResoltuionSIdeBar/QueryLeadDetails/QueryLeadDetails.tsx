import { Alert, Box, Chip, Snackbar, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useTicketStore from '../../../../store/ticketStore';
import { useParams } from 'react-router-dom';
import { iTicket } from '../../../../types/store/ticket';
import PatientDetail from '../../../ticket/SingleTicketSideBar/LeadDetail/PatientDetail';
import PatientRecord from '../../../ticket/SingleTicketSideBar/LeadDetail/PatientRecord';
import useServiceStore from '../../../../store/serviceStore';
import { iDepartment, iDoctor } from '../../../../types/store/service';
import ShowPrescription from '../../../ticket/widgets/ShowPrescriptionModal';

interface patientData {
    uhid: string;
    name: string;
    age: string;
    gender: string;
    doctor: string;
    department: string;
}

const QueryLeadDetails = () => {
    // const { ticketID } = useParams();
    const ticketID = '6658278d8b21346f1b437fc5';
    const { doctors, departments, stages } = useServiceStore();
    const {
        tickets,
    } = useTicketStore();
    const [showAlert, setShowAlert] = useState(false);

    const initialPatientData: patientData = {
        uhid: '',
        name: '',
        age: '',
        gender: '',
        doctor: '',
        department: '',
    };

    const [PatientData, setPatientData] = React.useState<patientData>(initialPatientData)
    const [currentTicket, setCurrentTicket] = useState<iTicket>();
    // console.log(tickets, ticketID);

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
        }
        getTicketInfo(ticketID);
    }, [ticketID, tickets])

    const formatDate = () => {
        const dateString = currentTicket?.createdAt;
        if (!dateString) {
            return '';
        }
        const date = new Date(dateString);
        const formattedDate = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
        return formattedDate;
    }

    const createdByName = () => {
        const name = currentTicket?.creator[0]?.['firstName'] + " " + currentTicket?.creator[0]?.['lastName'];
        if (!name) {
            return 'Unknown';
        }
        return name;
    }


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


    const fetchPdfUrl = async () => {
        if (currentTicket?.location) {
            window.open(currentTicket.location, '_blank');
        } else {
            setShowAlert(true);
        }
    };

    return (
        <Box
            className="leadDetail-Container"
        >

            <Box className="Patient-detail">
                <Box className='Patient-detail-Head'>
                    <Stack className='Patient-detail-Heading'>Patient Details</Stack>
                </Box>
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
                    />
                </Stack>
            </Box>

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>

            <Box className="Patient-records">
                <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-Heading'>SECOND OPINIONS</Stack>
                </Box>
                <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-title'>Hospital</Stack>
                    <Stack component='div' className='additional-detail-data' sx={{ textTransform: "capitalize" }}> Kalash Hospital
                    </Stack>
                </Box>
                <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-title'>Doctor Name</Stack>
                    <Stack component='div' className='additional-detail-data'>Dr. Amrita Singh</Stack>
                </Box>
                <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-title'>Remark</Stack>
                    <Stack component='div' className='additional-detail-data'>Family reference</Stack>
                </Box>
            </Box>

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>

            <Box className="Patient-records">
                <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-Heading'>CONVERSION CHALLENGES</Stack>
                </Box>
                <Box className='additional-detail-Head'>
                    <Stack className='record-tag pharmacy-tag' width={'10vw'} sx={{ color: "#080F1A" }}>Financial constraints</Stack>
                </Box>
                <Box className='additional-detail-Head'>
                    <Stack className='record-tag pharmacy-tag' width={'10vw'} sx={{ color: "#080F1A" }}>Awaiting Test Result</Stack>
                </Box>
            </Box>

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>

            {/* Estimate */}

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

            <Stack className="gray-border">
                {/* Borders */}
            </Stack>


            {/* Admission Name */}

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
                                <Stack className='Patient-records-data'>{currentTicket.prescription[0].service.name}</Stack>
                            </Box>
                            <Box className="record-tag pharmacy-tag">{currentTicket?.prescription[0]?.admission} </Box>
                        </Box>
                        </>
                    ) : (
                        <>
                            <Box className="Patient-records">
                                <Box className='Patient-records-Head'>
                                    <Stack className='Patient-records-Heading'>Admission Details</Stack>
                                </Box>
                                <Box className="record-tag" sx={{ marginTop: "6px", }}>{currentTicket?.prescription[0]?.admission}</Box>

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
                        </Box>
                        {currentTicket?.prescription?.[0]?.diagnostics.length > 0 ? (
                            currentTicket?.prescription[0]?.diagnostics.map((diagnostic, index) => (
                                <React.Fragment key={index}>
                                    <Box className='Patient-records-Head'>
                                        <Stack className='dot-list'>
                                            <span>&#8226;</span>
                                        </Stack>
                                        <Stack className='Patient-records-data'>{diagnostic}</Stack>

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
            {(currentTicket?.prescription?.[0]?.medicines?.length ?? 0) > 0 ? (<>
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


                <Stack className="gray-border">
                    {/* Borders */}
                </Stack>
            </>) : (<></>)}






            {/* Creator data */}
            <Box className="additional-detail">
                <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-Heading'>Additional Detail</Stack>
                </Box>
                <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-title'>Created By:</Stack>
                    <Stack component='div' className='additional-detail-data' sx={{ textTransform: "capitalize" }}>{createdByName()}
                    </Stack>
                </Box>
                <Box className='additional-detail-Head'>
                    <Stack className='additional-detail-title'>Created On:</Stack>
                    <Stack component='div' className='additional-detail-data'>{formatDate()}</Stack>
                </Box>
            </Box>

        </Box>
    )
}

export default QueryLeadDetails
