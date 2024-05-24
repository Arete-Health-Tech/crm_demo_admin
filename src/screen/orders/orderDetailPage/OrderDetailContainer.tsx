
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import PatientCard from './PatientCard';
import { ButtonGroup, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import useTicketStore from '../../../store/ticketStore';
import ShowPrescription from '../../ticket/widgets/ShowPrescriptionModal';
import { iTicket } from '../../../types/store/ticket';
import { getPharmcyTicketHandler } from '../../../api/ticket/ticketHandler';
import BackArrowIcon from '../../../assets/arrow-left.svg';
import '../orderList.css';
import useServiceStore from '../../../store/serviceStore';
import { getDoctors } from '../../../api/doctor/doctor';
import { getDepartments } from '../../../api/department/department';

interface PatientData {
    patientTicket: iTicket[];
}

interface DoctorData {
    admissionType: string;
    diagonstics: string[];
    diagonsticType: string;
    docName: string;
    deptName: string;
}


interface RowData {
    prescription: JSX.Element;
    orderDate: string;
    orderStatus: string;
}

const createData = (
    prescription: JSX.Element,
    orderDate: string,
    orderStatus: string,
): RowData => {
    return { prescription, orderDate, orderStatus };
};

const StyledTableHead = styled(TableHead)(({ theme }) => ({

    '& th': {
        padding: ' 15px 20px',
        fontSize: '14px',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& td': {
        padding: '15px 20px',
        fontSize: '14px',
    },
    '&:hover': {
        backgroundColor: "#F6F7F9",
    },
}));

const OrderDetailContainer = () => {
    const { tickets, pharmcyTicket, setPharmcyTickets } = useTicketStore();
    console.log(tickets, pharmcyTicket, "----------");
    const { uid } = useParams();
    const navigate = useNavigate();
    const [orderStatus, setOrderStatus] = React.useState<string | null>(null);
    const { departments, doctors, setDoctors, setDepartments } = useServiceStore();
    const [doctorData, setDoctorData] = React.useState<DoctorData>({
        admissionType: localStorage.getItem('admissionType') || '',
        diagonstics: JSON.parse(localStorage.getItem('diagonstics') || '[]') as string[], // Parse as array
        diagonsticType: localStorage.getItem('diagnosticType') || '',
        docName: localStorage.getItem('docName') || '',
        deptName: localStorage.getItem('deptName') || '',
    });

    React.useEffect(() => {
        async function fetchData() {
            await getPharmcyTicketHandler();

            let filteredTickets = tickets.filter(item => item.consumer[0].uid === uid);
            setPharmcyTickets(filteredTickets);
            if (filteredTickets.length > 0) {
                localStorage.setItem('orderStatus', filteredTickets[0]?.pharmacyStatus);
            }
            // const orderStatus = localStorage.getItem('orderStatus');
            const orderStatus = localStorage.getItem('orderStatus');
            if (orderStatus === "Pending") {
                setOrderStatus("Processing");
            } else if (orderStatus === "Completed" || orderStatus === "Ready" || orderStatus === "Cancelled") {
                setOrderStatus(orderStatus)
            }
            else {
                setOrderStatus("");
            }
            // setOrderStatus(orderStatus);

        }

        fetchData();
    }, [uid, getPharmcyTicketHandler]);


    const PatientDetail: RowData[] = React.useMemo(() => {
        if (pharmcyTicket.length > 0) {
            localStorage.setItem('pTicket', JSON.stringify(pharmcyTicket));
        }
        const storedData = localStorage.getItem('pTicket');
        const parsedData = storedData ? JSON.parse(storedData) : [];

        return parsedData.map(ticket => {
            const orderStatus = ticket.pharmacyStatus === "Pending" ? "Processing" : ticket.pharmacyStatus === "Completed" || ticket.pharmacyStatus === "Ready" || ticket.pharmacyStatus === "Cancelled" ? ticket.pharmacyStatus : "";
            const prescriptionLink = (
                <ShowPrescription
                    image={ticket?.prescription[0].image}
                    image1={ticket?.prescription[0].image1}
                // other props
                />
            );
            return createData(prescriptionLink, ticket?.prescription[0]?.created_Date || '', orderStatus || '');
        });
    }, [pharmcyTicket]);


    React.useEffect(() => {
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

    React.useEffect(() => {
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
        <>
            <Box className="view-history-container">
                <Box className="view-history-head">
                    <Stack marginTop={'3px'} onClick={() => navigate('/OrderList')}>
                        <img src={BackArrowIcon} />
                    </Stack>
                    <Stack className="orderListBody-title">
                        Patient Order History
                    </Stack>
                </Box>

                <Box className="patient-history-container">

                    <Box sx={{ width: 750 }}><PatientCard uid={uid} /></Box>
                    {/* <Stack sx={{ width: 750 }}> <DoctorCard uid={uid} /></Stack> */}

                    <Box>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <StyledTableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                fontFamily: 'Outfit,sans-serif',
                                                fontSize: '14px',
                                                color: '#647491',
                                            }}
                                            align="left">
                                            Order date
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontFamily: 'Outfit,sans-serif',
                                                fontSize: '14px',
                                                color: '#647491',
                                            }}
                                            align="left">Prescription</TableCell>
                                        <TableCell
                                            sx={{
                                                fontFamily: 'Outfit,sans-serif',
                                                fontSize: '14px',
                                                color: '#647491',

                                            }}
                                            align="left">Doctor name</TableCell>
                                        <TableCell
                                            sx={{
                                                fontFamily: 'Outfit,sans-serif',
                                                fontSize: '14px',
                                                color: '#647491',

                                            }}
                                            align="left">Speciality</TableCell>
                                        <TableCell
                                            sx={{
                                                fontFamily: 'Outfit,sans-serif',
                                                fontSize: '14px',
                                                color: '#647491',
                                            }}
                                            align="left">Order status</TableCell>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {PatientDetail.map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <TableCell
                                                sx={{
                                                    color: "#080F1A",
                                                    fontFamily: 'Outfit,sans-serif',
                                                    fontSize: '14px',
                                                }}
                                                align="left">{row.orderDate}</TableCell>
                                            <TableCell
                                                align="left">{row.prescription}</TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#080F1A",
                                                    fontFamily: 'Outfit,sans-serif',
                                                    fontSize: '14px',
                                                    textTransform: "capitalize"
                                                }}
                                                align="left">{doctorData.docName}</TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#080F1A",
                                                    fontFamily: 'Outfit,sans-serif',
                                                    fontSize: '14px',
                                                    textTransform: "capitalize"
                                                }}
                                                align="left">{doctorData.deptName}</TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#080F1A",
                                                    fontFamily: 'Outfit,sans-serif',
                                                    fontSize: '14px',
                                                }} align="left">{row.orderStatus}</TableCell>

                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>

        </>
    );
}

export default OrderDetailContainer;
