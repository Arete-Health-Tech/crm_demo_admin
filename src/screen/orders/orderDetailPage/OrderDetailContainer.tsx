import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PatientCard from './PatientCard';
import DoctorCard from './DoctorCard';
import { ButtonGroup, TablePagination } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


interface RowData {
    prescription: string;
    orderID: number;
    orderStatus: string;
    amount: number;
}

const createData = (
    prescription: string,
    orderID: number,
    orderStatus: string,
    amount: number,
): RowData => {
    return { prescription, orderID, orderStatus, amount };
};

const PatientDetail: RowData[] = [
    createData('View Prescription', 123324, 'Pending', 100),
    createData('View Prescription', 223234, 'Shipped', 150),
    createData('View Prescription', 323234, 'Delivered', 200),
    createData('View Prescription', 223234, 'Shipped', 150),
    createData('View Prescription', 323234, 'Delivered', 200),
    createData('View Prescription', 223234, 'Shipped', 150),
    createData('View Prescription', 323234, 'Delivered', 200),
    createData('View Prescription', 223234, 'Shipped', 150),
    createData('View Prescription', 323234, 'Delivered', 200),
    // Add more data as needed
];

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

    const { ticketId } = useParams();
    console.log(ticketId, "-----------Ticket ID");
    const navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedData = PatientDetail.slice(startIndex, endIndex);

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
                            marginRight: '5px'
                        }}
                        onClick={() => navigate('/')}
                    > <ArrowBackIcon /> Back
                    </Button>
                    <Button
                        sx={{
                            fontWeight: 'bold'
                        }}
                    > Processing
                        <KeyboardArrowDownIcon />
                    </Button>
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
                    <PatientCard ticketId={ticketId} />
                    <DoctorCard />
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
                                    <TableCell align="center">Amount</TableCell>
                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {displayedData.map((row) => (
                                    <StyledTableRow key={row.orderID}>
                                        <TableCell align="center">{row.prescription}</TableCell>
                                        <TableCell align="center">{row.orderID}</TableCell>
                                        <TableCell align="center">{row.orderStatus}</TableCell>
                                        <TableCell align="center">{row.amount}</TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <TablePagination
                    component="div"
                    count={PatientDetail.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                />

                <Typography
                    variant="h6"
                    component="h2"
                    mt={3}
                    sx={{
                        textAlign: "right",
                        fontSize: "16px"
                    }}>
                    Total orders: 165
                </Typography> */}
                </Box>
            </Box>
        </>
    );
}

export default OrderDetailContainer;