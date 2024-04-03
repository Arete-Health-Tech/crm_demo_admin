
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PatientCard from './PatientCard';
import DoctorCard from './DoctorCard';
import { ButtonGroup, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import useTicketStore from '../../../store/ticketStore';
import ShowPrescription from '../../ticket/widgets/ShowPrescriptionModal';
import { iTicket } from '../../../types/store/ticket';
import { getPharmcyTicketHandler } from '../../../api/ticket/ticketHandler';

interface PatientData {
    patientTicket: iTicket[];
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
    backgroundColor: "rgba(146, 143, 143, 0.183)",
    borderRadius: '15px',
    fontWeight: 'bold',
    '& th': {
        padding: '20px',
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& td': {
        padding: '20px',
        fontSize: '15px',
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover, // Change color on hover
    },
}));

const OrderDetailContainer = () => {
    const { tickets, pharmcyTicket, setPharmcyTickets } = useTicketStore();
    console.log(tickets, pharmcyTicket, "----------");
    const { uid } = useParams();
    const navigate = useNavigate();
    const [orderStatus, setOrderStatus] = React.useState<string | null>(null);

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
                // other props
                />
            );
            return createData(prescriptionLink, ticket?.prescription[0]?.created_Date || '', orderStatus || '');
        });
    }, [pharmcyTicket]);

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '2vh 5vw 0 5vw',
                backgroundColor: '#ESE7EB',
                marginTop: '11vh',
            }}>
                <Typography
                    variant="h4"
                    component="h3"
                    mb={2}
                    sx={{
                        fontSize: '32px',
                        fontWeight: 'bold'
                    }}>
                    Patient Order History
                </Typography>
                <ButtonGroup variant="contained" aria-label="Basic button group">
                    <Button
                        sx={{
                            fontWeight: 'bold',
                            // marginRight: '5px'
                        }}
                        onClick={() => navigate('/')}
                    > <ArrowBackIcon /> Back
                    </Button>
                    {/* <Button
                        sx={{
                            fontWeight: 'bold'
                        }}
                    > {orderStatus}
                        <KeyboardArrowDownIcon />
                    </Button> */}
                </ButtonGroup>
            </Box>
            <Box sx={{
                padding: '5px 60px',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: '18px',
                    marginBottom: '30px',
                }} >
                    <Stack sx={{ width: 750 }}><PatientCard uid={uid} /></Stack>
                    <Stack sx={{ width: 750 }}> <DoctorCard uid={uid} /></Stack>
                </Box>
                <Box
                    sx={{
                        padding: '32px 40px',
                        marginTop: '8px',
                        backgroundColor: 'white',
                        borderRadius: '15px',
                    }}
                >
                    <Typography variant="h5" component="h2" mb={2} sx={{ fontSize: '28px' }}>
                        Order Details
                    </Typography>
                    <TableContainer sx={{
                        minWidth: 650,
                        borderRadius: '10px',
                        marginTop: '25px',
                    }}>
                        <Table aria-label="simple table">
                            <StyledTableHead>
                                <TableRow>
                                    <TableCell align="center">Prescription</TableCell>
                                    <TableCell align="center">Order DATE</TableCell>
                                    <TableCell align="center">Order Status</TableCell>
                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {PatientDetail.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <TableCell align="center">{row.prescription}</TableCell>
                                        <TableCell align="center">{row.orderDate}</TableCell>
                                        <TableCell align="center">{row.orderStatus}</TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </>
    );
}

export default OrderDetailContainer;
