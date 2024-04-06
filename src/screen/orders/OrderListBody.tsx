import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, Card, CardContent, Grid, Input, TextField } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';

import useTicketStore from '../../store/ticketStore';
import { iPrescrition, iTicket } from '../../types/store/ticket';
import { getPharmacyTickets, getTicket, updatePharmacyOrderStatus } from '../../api/ticket/ticket';
import { apiClient, socket } from '../../api/apiClient';
import axios from 'axios';
import { getDoctors } from '../../api/doctor/doctor';
import { getPharmcyTicketHandler } from '../../api/ticket/ticketHandler';
import { UNDEFINED } from '../../constantUtils/constant';
import { iDepartment, iDoctor } from '../../types/store/service';
import { getDepartments } from '../../api/department/department';
import { DatePicker } from '@mui/lab';
import { MenuOpen } from '@mui/icons-material';
import ShowPrescription from '../ticket/widgets/ShowPrescriptionModal';
import { socketEventConstants } from '../../constantUtils/socketEventsConstants';

const getColorForOption = (optionValue: string): string => {
    switch (optionValue) {
        case 'Completed':
            return '#41a179';
        case 'Ready':
            return '#FFCE56';
        case 'Cancelled':
            return '#ea574a';
        case 'Pending':
            return '#043999';
        default:
            return '';
    }
};
const getBgColor = (optionValue: string): string => {
    switch (optionValue) {
        case 'Completed':
            return '#dbf0e7';
        case 'Ready':
            return ' #fff1cc';
        case 'Cancelled':
            return ' #f7c0bb';
        case 'Pending':
            return '#cddefe';
        default:
            return '';
    }
};

interface Data {
    _id: string;
    uhid: string;
    name: string;
    date: any;
    number: string;
    doctor: string;
    specialty: string;
    prescription: iPrescrition[];
    orderStatus: string;
    action: string;
    // handleStatusChange: (ticketId: string, newValue: string) => void;
    // onClickDetail: (ticketId: string) => void;
}

interface Column {
    id: string;
    label: string;
    minWidth: number;
    align?: 'left' | 'right';
    format?: (value: string, handleStatusChange: (ticketId: string, newValue: string) => void, onClickDetail: (uid: string, ticketId: string) => void, handleViewPrescription: (prescription: iPrescrition[]) => void, row: Data) => JSX.Element;
}

const OrderListBody = () => {

    const {
        tickets,
        filterTickets,
        ticketCount,
        pageNumber,
        setPageNumber,
        pharmacyDateFilter,
        setPharmacyDateFilter,
        pharmacyOrderStatusFilter,
        setPharmacyOrderStatusFilter,
        pharmacySearchFilter,
        setPharmacySearchFilter,
        pharmacyOrderPendingCount,
        pharmacyOrderReadyCount,
        pharmacyOrderCompletedCount,
        pharmacyOrderCancelledCount
    } = useTicketStore();
    const [page, setPage] = React.useState<number>(pageNumber - 1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    // const [filter, setFilter] = useState<string>('');
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<iDoctor[] | null>(null);
    const [department, setDepartment] = useState<iDepartment[] | null>(null);
    // const [orderStatusFilterValue, setOrderStatusFilterValue] = useState("");
    // const [dateFilterValue, setDateFilterValue] = useState("");
    const [orderStatuses, setOrderStatuses] = useState<{ [key: string]: string }>({});
    // const [selectedValues, setSelectedValues] = useState<string>('Pending');

    console.log(tickets)
    useEffect(() => {

        const refetchTickets = async () => {
            await getPharmcyTicketHandler();
        };
        //  pageNumber = page
        socket.on(socketEventConstants.PHARMACY_REFETCH_TICKETS, refetchTickets);

        return () => {
            socket.off(socketEventConstants.PHARMACY_REFETCH_TICKETS, refetchTickets);
        };
    }, [pageNumber]);

    useEffect(() => {
        (async function () {
            await getPharmcyTicketHandler();
        })();
    }, [page, pharmacyDateFilter, pharmacyOrderStatusFilter, orderStatuses]);

    const handleChangePage = (event: any, newPage: number) => {
        console.log(newPage)
        setPage(newPage); //page changed in this component
        setPageNumber(newPage + 1);//pagenumber changed in the store 
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const onClickDetail = (uid: string, ticketId: string) => {
        navigate(`orderDetails/${uid}`);
    };

    const handleStatusChange = async (ticketId: string, newValue: string) => {
        console.log(ticketId, newValue)
        const data = await updatePharmacyOrderStatus(ticketId, newValue)
        setOrderStatuses(prevStatuses => ({
            ...prevStatuses,
            [ticketId]: newValue,
        }));
    };

    const handleOrderStatusFilter = (event: SelectChangeEvent) => {

        setPharmacyOrderStatusFilter(event.target.value as string);

    }

    const handleDateFilter = (event: SelectChangeEvent) => {
        setPharmacyDateFilter(event.target.value);
    }

    const handleViewPrescription = (prescription: iPrescrition[]) => {
        console.log("viewPrescription");
        console.log(prescription, "prescription array");
    }

    function createData(
        _id: string, uhid: string, date: any, name: string, number: string, doctor: string, specialty: string, prescription: iPrescrition[], orderStatus: string, action: string
        // handleStatusChange: (ticketId: string, newValue: string) => void,
        // onClickDetail: (ticketId: string) => void
    ): Data {
        const uniqueKey = `${_id}`;
        return { _id: uniqueKey, uhid, date, name, number, doctor, specialty, prescription, orderStatus, action };
    }

    let rows: Data[] = [];

    const columns: Column[] = [
        { id: 'uhid', label: 'UHID', minWidth: 60 },
        {
            id: 'date', label: 'Laed Age', minWidth: 60,
            format: (value: any) => (
                <Box component="a"
                    sx={{ fontSize: '14px' }}
                >
                    {value}
                </Box>
            ),
        },
        { id: 'name', label: 'Name', minWidth: 120 },
        { id: 'number', label: 'Number', minWidth: 80 },
        { id: 'doctor', label: 'Doctor', minWidth: 130 },
        { id: 'specialty', label: 'Specialty', minWidth: 160 },
        {
            id: 'prescription',
            label: 'Prescription',
            minWidth: 150,
            format: (value: string, handleStatusChange: (ticketId: string, newValue: string) => void, onClickDetail: (uid: string, ticketId: string) => void, handleViewPrescription: (prescription: iPrescrition[]) => void, row: Data) => (
                <Box component="a"
                    sx={{ color: '#4990bd', fontSize: '14px' }}
                    // onClick={() => handleViewPrescription(row.prescription)}
                    rel="view Prescription"
                >
                    <ShowPrescription
                        image={row.prescription[0].image}
                    />
                </Box>
            ),
        },
        {
            id: 'orderStatus',
            label: 'Order Status',
            minWidth: 150,
            format: (value: string, handleStatusChange: (ticketId: string, newValue: string) => void, onClickDetail: (uid: string, ticketId: string) => void, handleViewPrescription: (prescription: iPrescrition[]) => void, row: Data) => (
                <Select
                    value={orderStatuses[row._id] || value}
                    onChange={(e) => handleStatusChange(row._id, e.target.value as string)}
                    sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: '0px',
                        color: getColorForOption(value),
                        backgroundColor: getBgColor(value),
                        border: 'none',
                        '& .MuiSelect-select': {
                            padding: '5px',
                        },
                        '& .MuiListItem-root': {
                            padding: '5px 16px',
                            color: (theme) => getColorForOption(orderStatuses[row._id] || value),
                        },
                    }}
                >
                    <MenuItem value="Pending" sx={{ color: getColorForOption('Processing'), backgroundColor: getBgColor('Processing') }}>
                        Processing
                    </MenuItem>
                    <MenuItem value="Ready" sx={{ color: getColorForOption('Ready'), backgroundColor: getBgColor('Ready') }}>
                        Ready
                    </MenuItem>
                    <MenuItem value="Completed" sx={{ color: getColorForOption('Completed'), backgroundColor: getBgColor('Completed') }}>
                        Completed
                    </MenuItem>
                    <MenuItem value="Cancelled" sx={{ color: getColorForOption('Cancelled'), backgroundColor: getBgColor('Cancelled') }}>
                        Cancelled
                    </MenuItem>
                </Select>
            ),
        },
        {
            id: 'action',
            label: ' ',
            minWidth: 50,
            format: (value: string, handleStatusChange: (ticketId: string, newValue: string) => void, onClickDetail: (uid: string, ticketId: string) => void, handleViewPrescription: (prescription: iPrescrition[]) => void, row: Data) => (
                <Button
                    sx={{ color: '#4990bd', backgroundColor: '#1976D214', fontSize: '11px' }}
                    onClick={() => onClickDetail(row.uhid, row._id)}
                >
                    {value}
                </Button>
            ),
        },
    ];

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const fetchedDoct = await getDoctors();
                setDoctors(fetchedDoct);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        const fetchDepartment = async () => {
            try {
                const fetchedDept = await getDepartments();
                setDepartment(fetchedDept);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDoctor();
        fetchDepartment();
    }, [tickets]);

    const fetchDoctorName = (ticket: iTicket) => {
        const specificDoctor = doctors?.find(doc => doc._id === ticket.prescription[0]?.doctor);
        let doctorName = (specificDoctor?.name ?? 'Unknown Doctor')
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        const titleIndex = doctorName.indexOf('Dr.');
        if (titleIndex !== -1 && titleIndex + 3 < doctorName.length) {
            const title = doctorName.slice(0, titleIndex + 3);
            const name = doctorName.slice(titleIndex + 3);
            doctorName = `${title} ${name}`;
        }

        return doctorName;
    };

    const fetchDepartmentName = (ticket: iTicket) => {
        const specificDepartmentId = ticket.prescription[0]?.departments;
        if (specificDepartmentId && specificDepartmentId.length > 0) {
            const specificDepartment = department?.find(dep => dep._id === specificDepartmentId[0]);

            let departmentName = (specificDepartment?.name ?? 'Unknown Department')
                .split(/\s+/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');

            return departmentName;
        } else {
            console.log("Department ID is missing or invalid.");
            return 'Unknown Department';
        }
    };

    const patientName = (ticket: iTicket) => {
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

    const calculatedDate = (date: any) => {
        const creationDate = new Date(date);

        // Get today's date
        const today = new Date();

        // Calculate the difference in milliseconds
        const timeDifference = today.getTime() - creationDate.getTime();

        // Calculate the difference in days
        const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (dayDifference < 1) {
            // Calculate the difference in hours
            const hourDifference = Math.floor(timeDifference / (1000 * 60 * 60));
            const minuteDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const formattedTimeDifference = `${hourDifference.toString().padStart(2, '0')}:${minuteDifference.toString().padStart(2, '0')}`;
            console.log(formattedTimeDifference)
            return `${formattedTimeDifference}Hrs`
        } else {
            return `${dayDifference}Days`
        }
    }

    for (const ticket of tickets) {
        // const prescriptionImage = 
        const ticketId = ticket?._id;
        const uid = ticket?.consumer[0]?.uid;
        const date = calculatedDate(ticket?.date);
        const name = patientName(ticket);
        const phoneNumber = ticket?.consumer[0]?.phone;
        const doctorName = fetchDoctorName(ticket);
        const departmentName = fetchDepartmentName(ticket);
        const prescription = ticket?.prescription;
        const pharmacyStatus = ticket?.pharmacyStatus;

        rows.push(
            createData(
                ticketId,
                uid,
                date,
                name,
                phoneNumber,
                doctorName,
                departmentName,
                prescription,
                pharmacyStatus,
                'View Detail'
            )
        );
    }

    const handleSearchKeyPress = async (e: any) => {
        // console.log(e)
        // if (e.target.value) {
        //     setPharmacySearchFilter(e.target?.value)
        // }
        if (e.key === 'Enter') {
            (async function () {
                await getPharmcyTicketHandler();
            })();
        }

    };



    const cardsData = [
        {
            id: 1,
            title: 'Processing',
            content: pharmacyOrderPendingCount,
            color: '#cddefe'
        },
        {
            id: 2,
            title: 'Ready',
            content: pharmacyOrderReadyCount,
            color: '#fff1cc'
        },
        {
            id: 3,
            title: 'Completed',
            content: pharmacyOrderCompletedCount,
            color: '#dbf0e7'
        },
        {
            id: 4,
            title: 'Cancelled',
            content: pharmacyOrderCancelledCount,
            color: '#f7c0bb'
        }
    ];


    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '32px 40px',
                    marginTop: '9vh',
                }}
            >
                <Typography variant="h4" component="h2" mb={2} sx={{ fontSize: '36px', fontWeight: 'bold' }}>
                    Order Details
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        marginTop: '5px',
                        color: 'black',
                    }}
                >
                    <Box>
                        <FormControl>
                            <span style={{
                                backgroundColor: 'white',
                                width: '44px',
                                padding: '12px 5px',
                                position: 'relative',
                                border: '1px solid #ccc',
                                top: '8px',
                                fontSize: '20px',
                                borderTopLeftRadius: '15px',
                                borderBottomLeftRadius: '15px',

                            }}><FilterListIcon sx={{ fontSize: '28px' }} /></span>
                        </FormControl>

                        <FormControl
                            sx={{ my: 1 }}
                        >
                            <Input

                                type='text'
                                placeholder='Search ...'
                                sx={{
                                    backgroundColor: 'white',
                                    width: '145px',
                                    height: '56px',
                                    border: '1px solid #ccc',
                                    borderBottom: 'none',
                                    paddingLeft: '10px',
                                    paddingRight: '10px',
                                    '&::placeholder': {
                                        textAlign: 'center',
                                        marginLeft: '20px',
                                    }

                                }}
                                value={pharmacySearchFilter}
                                onChange={(event) => setPharmacySearchFilter(event.target?.value)}
                                onKeyPress={handleSearchKeyPress}
                            />
                        </FormControl>
                        <FormControl
                            sx={{
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                my: 1
                            }}

                        // onClick={(event) => {
                        //     event.stopPropagation();
                        // }}
                        >
                            <input
                                type='date'
                                value={pharmacyDateFilter}
                                onChange={handleDateFilter}
                                id='your_unique_id'
                                placeholder="DD-MM-YY"
                                style={{
                                    width: '127px',
                                    height: '54px',
                                    border: 0,
                                    outline: 'none',
                                    cursor: 'pointer',
                                    margin: '0px 10px 0px 10px'
                                }}
                            />
                        </FormControl>

                        <FormControl sx={{ my: 1 }}>
                            {/* <InputLabel id="demo-simple-select-label" sx={{ color: 'black', fontWeight: 'bold', display: 'flex' }}>Order Status </InputLabel> */}
                            <Select
                                // labelId="demo-simple-select-label"
                                // id="demo-simple-select"
                                value={pharmacyOrderStatusFilter}
                                inputProps={{ 'aria-label': 'Select' }}
                                // label="order status ^"
                                displayEmpty
                                onChange={handleOrderStatusFilter}
                                // IconComponent={() => null}
                                sx={{
                                    width: '145px',
                                    borderRadius: '0',
                                    border: 0,
                                    backgroundColor: 'white',
                                    '&:focus': {
                                        border: 'none',
                                        outline: 'none',
                                    },
                                }}
                            >
                                <MenuItem value="" disabled>
                                    Select Status
                                </MenuItem>
                                <MenuItem value={"Pending"}>Processing</MenuItem>
                                <MenuItem value={"Ready"}>Ready</MenuItem>
                                <MenuItem value={"Completed"}>Completed</MenuItem>
                                <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ my: 1 }}>
                            <button style={{
                                backgroundColor: 'white',
                                padding: '15px 15px',
                                border: '1px solid #ccc',
                                width: '150px',
                                borderTopRightRadius: '15px',
                                borderBottomRightRadius: '15px',
                                color: 'red',
                                fontWeight: 'bold', display: 'flex',
                                cursor: 'pointer'
                            }}
                                onClick={() => { setPharmacyDateFilter(""); setPharmacyOrderStatusFilter(""); setPharmacySearchFilter("") }}
                            ><RefreshIcon sx={{ marginRight: '5px' }} />Reset Filter</button>
                        </FormControl>
                    </Box>
                    <Box sx={{ width: '35vw', display: 'flex', justifyContent: 'space-around' }}>
                        {cardsData.map((card) => (
                            <Grid container spacing={1} justifyContent="center" alignItems="center">
                                <Grid item>
                                    <Card sx={{
                                        width: '8vw', borderRadius: "7px ",
                                    }}>
                                        <CardContent
                                            style={{
                                                borderTop: `4px solid ${card.color}`,
                                                borderRadius: 10,
                                                padding: '6px 15px 6px 15px'
                                            }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                                                {card.title}
                                            </h3>
                                            <p style={{ fontSize: '14px', fontWeight: 500 }}>{card.content}</p>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ marginTop: '18px' }}>
                    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '15px' }}>
                        <TableContainer sx={{ maxHeight: '100%', overflow: 'auto' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                sx={{ fontWeight: 'bold', backgroundColor: 'white', fontSize: '14px', textAlign: 'center', textTransform: 'uppercase' }}
                                                key={column.id}
                                                align={column.align || 'left'}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows
                                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <TableRow key={row._id} hover role="checkbox" tabIndex={-1}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align || 'center'}>
                                                            {column.format ? column.format(value, handleStatusChange, onClickDetail, handleViewPrescription, row) : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={ticketCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[]}
                        />
                    </Paper>
                </Box>
            </Box>
        </>
    );
};

export default OrderListBody;