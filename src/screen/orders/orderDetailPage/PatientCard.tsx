import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { iTicket } from '../../../types/store/ticket';
import useTicketStore from '../../../store/ticketStore';
import { Stack } from 'react-bootstrap';

interface PatientData {
    patientTicket: iTicket[];
    patientName: string;
    uhid: string;
    phone: string;
    gender: string;
    age: string;
}

const PatientCard = (props) => {
    const {
        tickets,
    } = useTicketStore();

    const { uid } = props;
    const theme = useTheme();

    const [patientData, setPatientData] = React.useState<PatientData>({
        patientTicket: [],
        patientName: localStorage.getItem('patientName') || '',
        uhid: localStorage.getItem('uhid') || '',
        phone: localStorage.getItem('phone') || '',
        gender: localStorage.getItem('gender') || '',
        age: localStorage.getItem('age') || '',
    });

    const [isGender, setIsGender] = React.useState<boolean>(localStorage.getItem('isGen') === 'true');
    const [isAge, setIsAge] = React.useState<boolean>(localStorage.getItem('isAge') === 'true');

    React.useEffect(() => {
        const filteredTickets = tickets.filter(item => item.consumer[0].uid === uid);
        setPatientData(prevState => ({
            ...prevState,
            patientTicket: filteredTickets,
        }));

        handlePatientData(filteredTickets);

    }, [uid, tickets]);

    const handlePatientData = (patientTicket: iTicket[]) => {
        if (patientTicket && patientTicket.length > 0) {
            const patient = patientTicket[0].consumer[0];
            const patientName = handlePatientName(patient.firstName, patient.lastName);

            let gender = '';
            if (patient.gender === 'M') {
                gender = 'Male';
            } else if (patient.gender === 'F') {
                gender = 'Female';
            }

            setPatientData(prevState => ({
                ...prevState,
                patientName: patientName,
                uhid: patient.uid,
                phone: patient.phone,
                gender: gender,
                age: patient.age,
            }));

            setIsGender(patient.gender === null);
            setIsAge(patient.age === null || patient.age === '');

            localStorage.setItem('patientName', patientName);
            localStorage.setItem('uhid', patient.uid);
            localStorage.setItem('phone', patient.phone);
            localStorage.setItem('gender', gender);
            localStorage.setItem('age', patient.age);
            localStorage.setItem('isGen', (patient.gender === null).toString());
            localStorage.setItem('isAge', (patient.age === null || patient.age === '').toString());
        } else {
            console.log("No patient ticket data available.");
        }
    }

    const handlePatientName = (firstName: string, lastName: string) => {
        let patientName = '';
        if (firstName && lastName) {
            const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
            const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
            patientName = capitalizedFirstName + ' ' + capitalizedLastName;
        } else if (firstName) {
            patientName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        }

        return patientName;
    }


    return (
        <>  <Box className='patient-card-container'>
            <Stack className='patient-card-head'>Patient Details</Stack>
            <Stack className='patient-card-detail'>

                <Stack className='patient-card-detail-left'>
                    <Stack className='patient-card-info'>
                        <Stack className='patient-card-info-title'>Name </Stack>
                        <Stack className='patient-card-info-data'>{patientData.patientName} </Stack>
                    </Stack>
                    {!isAge && (<Stack className='patient-card-info'>
                        <Stack className='patient-card-info-title'>Age</Stack>
                        <Stack className='patient-card-info-data'>{patientData.age} </Stack>
                    </Stack>)}
                    <Stack className='patient-card-info'>
                        <Stack className='patient-card-info-title'>Phone Number </Stack>
                        <Stack className='patient-card-info-data'>{patientData.phone} </Stack>
                    </Stack>
                </Stack>

                <Stack className='patient-card-detail-right'>
                    <Stack className='patient-card-info'>
                        <Stack className='patient-card-info-title'>UHID</Stack>
                        <Stack className='patient-card-info-data'>#{patientData.uhid}</Stack>
                    </Stack>
                    {!isGender && (<Stack className='patient-card-info'>
                        <Stack className='patient-card-info-title'>Gender</Stack>
                        <Stack className='patient-card-info-data'>{patientData.gender} </Stack>
                    </Stack>)}
                </Stack>
            </Stack>
        </Box>


        </>
    );
}

export default PatientCard;
