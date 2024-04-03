import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { iTicket } from '../../../types/store/ticket';
import useTicketStore from '../../../store/ticketStore';

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
        <Box >
            <Card sx={{ display: 'flex', flexDirection: 'row', padding: '12px 7px 28px 12px', borderRadius: '15px' }}>
                <CardContent sx={{ flex: '1 0 auto', wordSpacing: '2px' }}>
                    <Typography component="div" variant="h6">
                        <span style={{ color: "grey", fontSize: '19px' }}>Patient Name:</span> <span style={{ color: "black", fontSize: '19px', fontWeight: "bold" }}>{patientData.patientName}</span>
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        <span style={{ color: "grey", fontSize: '15px' }}>Uhid:</span> <span style={{ color: "black", fontSize: '15px' }}>{patientData.uhid}</span>
                    </Typography>
                    {!isGender && (
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Gender:</span> <span style={{ color: "black", fontSize: '15px' }}>{patientData.gender}</span>
                        </Typography>
                    )}
                    {!isAge && (
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Age:</span> <span style={{ color: "black", fontSize: '15px' }}>{patientData.age}</span>
                        </Typography>
                    )}
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        <span style={{ color: "grey", fontSize: '15px' }}>Mobile Number:</span> <span style={{ color: "black", fontSize: '15px' }}>{patientData.phone}</span>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default PatientCard;
