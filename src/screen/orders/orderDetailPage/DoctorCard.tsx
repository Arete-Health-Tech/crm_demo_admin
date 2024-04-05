
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import useTicketStore from '../../../store/ticketStore';
import { iTicket } from '../../../types/store/ticket';
import { getDoctors } from '../../../api/doctor/doctor';
import { getDepartments } from '../../../api/department/department';
import useServiceStore from '../../../store/serviceStore';

interface DoctorData {
    admissionType: string;
    diagonstics: string[];
    diagonsticType: string;
    docName: string;
    deptName: string;
}

const DoctorCard = ({ uid }) => {
    const { tickets } = useTicketStore();
    const { departments, doctors, setDoctors, setDepartments } = useServiceStore();
    const [doctorData, setDoctorData] = useState<DoctorData>({
        admissionType: localStorage.getItem('admissionType') || '',
        diagonstics: JSON.parse(localStorage.getItem('diagonstics') || '[]') as string[], // Parse as array
        diagonsticType: localStorage.getItem('diagnosticType') || '',
        docName: localStorage.getItem('docName') || '',
        deptName: localStorage.getItem('deptName') || '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedDoctors, fetchedDepartments] = await Promise.all([getDoctors(), getDepartments()]);
                setDoctors(fetchedDoctors);
                setDepartments(fetchedDepartments);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [setDoctors, setDepartments]);

    useEffect(() => {
        const filteredTickets = tickets.filter(item => item.consumer[0].uid === uid);
        if (doctors && departments && filteredTickets.length > 0) {
            const specificTicket = filteredTickets[0];
            let diagonstics: string[] = [];
            const admissionType = specificTicket?.prescription[0]?.admission;
            try {
                if (specificTicket?.prescription[0]?.diagnostics.length > 0) {
                    for (let i = 0; i < specificTicket?.prescription[0]?.diagnostics.length; i++) {
                        diagonstics.push(specificTicket?.prescription[0]?.diagnostics[i]);
                    }
                }

            } catch (error) {
                console.error('Error processing diagnostics:', error);
            }


            const diagonsticType = specificTicket?.prescription[0]?.diagnostics[0];
            const docName = fetchDoctorName(specificTicket);
            const depName = fetchDepartmentName(specificTicket);

            setDoctorData({
                admissionType: admissionType,
                diagonstics: diagonstics,
                diagonsticType: diagonsticType,
                docName: docName,
                deptName: depName,
            });
            localStorage.setItem('admissionType', admissionType);
            localStorage.setItem('diagonstics', JSON.stringify(diagonstics));
            localStorage.setItem('diagonsticType', diagonsticType);
            localStorage.setItem('docName', docName);
            localStorage.setItem('deptName', depName);
        }
    }, [uid, tickets, doctors, departments]);

    const fetchDoctorName = (ticket: iTicket) => {
        const specificDoctorId = ticket?.prescription[0]?.doctor;
        const specificDoctor = doctors?.find(doc => doc._id === specificDoctorId);
        return specificDoctor ? formatDoctorName(specificDoctor.name) : 'Unknown Doctor';
    };

    const fetchDepartmentName = (ticket: iTicket) => {
        const specificDepartmentId = ticket?.prescription[0]?.departments?.[0];
        const specificDepartment = departments?.find(dep => dep._id === specificDepartmentId);
        return specificDepartment ? formatDepartmentName(specificDepartment.name) : 'Unknown Department';
    };

    const formatDoctorName = (name: string) => {
        let formattedName = name.split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        const titleIndex = formattedName.indexOf('Dr.');
        if (titleIndex !== -1 && titleIndex + 3 < formattedName.length) {
            const title = formattedName.slice(0, titleIndex + 3);
            const firstName = formattedName.slice(titleIndex + 3);
            formattedName = `${title} ${firstName}`;
        }

        return formattedName;
    };

    const formatDepartmentName = (name: string) => {
        return name.split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <Box>
            <Card sx={{ display: 'flex', flexDirection: 'row', padding: '12px 7px 0px 12px', borderRadius: '15px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto', wordSpacing: '2px' }}>
                        <Typography component="div" variant="h6">
                            <span style={{ color: "grey", fontSize: '19px' }}>Doctor Name:</span> <span style={{ color: "black", fontSize: '19px', fontWeight: 'bold' }}>{doctorData.docName}</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Department Name:</span> <span style={{ color: "black", fontSize: '15px' }}>{doctorData.deptName}</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Admission Type:</span>
                            <span style={{ color: 'black', fontSize: '15px' }}>
                                {doctorData.admissionType ? doctorData.admissionType : ' No Admission Type'}
                            </span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Diagonstics:</span>
                            {Array.isArray(doctorData.diagonstics) && doctorData.diagonstics.length > 0 ? (
                                <span style={{ color: 'black', fontSize: '15px' }}>
                                    {doctorData.diagonstics.join(', ')}
                                </span>
                            ) : (
                                <span style={{ color: 'black', fontSize: '15px' }}>No diagnostics available</span>
                            )}
                        </Typography>
                    </CardContent>
                </Box>
            </Card>
        </Box>
    );
}

export default DoctorCard;
