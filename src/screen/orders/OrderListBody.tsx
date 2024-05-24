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
import { Button, Card, CardContent, Grid, Input, Stack, TextField } from '@mui/material';
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
import { iDepartment, iDoctor } from '../../types/store/service';
import { getDepartments } from '../../api/department/department';
import ShowPrescription from '../ticket/widgets/ShowPrescriptionModal';
import { socketEventConstants } from '../../constantUtils/socketEventsConstants';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDownIcon from '../../../src/assets/ArrowDown.svg'
import SortArrowIcon from '../../../src/assets/SortArrow.svg'
import './orderList.css';

const getColorForOption = (optionValue: string): string => {
    switch (optionValue) {
        case 'Completed':
            return '#08A742';
        case 'Ready':
            return '#FFB200';
        case 'Cancelled':
            return '#F94839';
        case 'Pending':
            return '#0566FF';
        default:
            return '';
    }
};
const getBgColor = (optionValue: string): string => {
    switch (optionValue) {
        case 'Completed':
            return '#DAF2E3';
        case 'Ready':
            return ' #FFF3D9';
        case 'Cancelled':
            return ' #FEE4E1';
        case 'Pending':
            return '#DAE8FF';
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
        {
            id: 'uhid', label: 'UHID', minWidth: 50
        },
        {
            id: 'date', label: 'Lead Age', minWidth: 110
        },
        {
            id: 'name', label: 'Name', minWidth: 100
        },
        {
            id: 'number', label: 'Phone Number', minWidth: 130
        },
        {
            id: 'doctor', label: 'Doctor', minWidth: 130
        },
        {
            id: 'specialty', label: 'Specialty', minWidth: 130
        },
        {
            id: 'prescription',
            label: 'Prescription',
            minWidth: 160,
            format: (value: string, handleStatusChange: (ticketId: string, newValue: string) => void, onClickDetail: (uid: string, ticketId: string) => void, handleViewPrescription: (prescription: iPrescrition[]) => void, row: Data) => (
                <Box component="a"
                    sx={{ color: '#4990bd', fontSize: '14px' }}
                    // onClick={() => handleViewPrescription(row.prescription)}
                    rel="view Prescription"
                >
                    <ShowPrescription
                        image={row.prescription[0]?.image}
                        image1={row.prescription[0]?.image1}
                    />
                </Box>
            ),
        },
        {
            id: 'orderStatus',
            label: 'Order Status',
            minWidth: 160,
            format: (value: string, handleStatusChange: (ticketId: string, newValue: string) => void, onClickDetail: (uid: string, ticketId: string) => void, handleViewPrescription: (prescription: iPrescrition[]) => void, row: Data) => (
                <Select
                    value={orderStatuses[row._id] || value}
                    onChange={(e) => handleStatusChange(row._id, e.target.value as string)}
                    sx={{
                        fontSize: '14px',
                        fontWeight: 400,
                        // paddingX: '5px',
                        color: getColorForOption(value),
                        backgroundColor: getBgColor(value),
                        borderRadius: "20px",
                        fontFamily: "Outfit,sans-serif",

                        '& .MuiSelect-select': {
                            padding: '3px 10px',
                            borderRadius: "20px",
                            // border: `1px solid ${getBgColor(value)}`,
                            border: 'none',
                        },
                        '& .MuiListItem-root': {
                            padding: '10px 16px',
                            color: (theme) => getColorForOption(orderStatuses[row._id] || value),
                            borderRadius: "20px"
                        },
                    }}
                >
                    <MenuItem value="Pending" sx={{ fontSize: "14px", fontFamily: "Outfit,sans-serif", color: getColorForOption('Processing'), backgroundColor: getBgColor('Processing') }}>
                        Processing
                    </MenuItem>
                    <MenuItem value="Ready" sx={{ fontSize: "14px", fontFamily: "Outfit,sans-serif", color: getColorForOption('Ready'), backgroundColor: getBgColor('Ready') }}>
                        Ready
                    </MenuItem>
                    <MenuItem value="Completed" sx={{ fontSize: "14px", fontFamily: "Outfit,sans-serif", color: getColorForOption('Completed'), backgroundColor: getBgColor('Completed') }}>
                        Completed
                    </MenuItem>
                    <MenuItem value="Cancelled" sx={{ fontSize: "14px", fontFamily: "Outfit,sans-serif", color: getColorForOption('Cancelled'), backgroundColor: getBgColor('Cancelled') }}>
                        Cancelled
                    </MenuItem>
                </Select>
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
            return `${formattedTimeDifference}h ago`
        } else {
            return `${dayDifference}d ago`
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
            title: 'All Orders',
            content: pharmacyOrderPendingCount + pharmacyOrderReadyCount + pharmacyOrderCompletedCount + pharmacyOrderCancelledCount,
            color: '#cddefe'
        }, {
            id: 2,
            title: 'Processing',
            content: pharmacyOrderPendingCount,
            color: '#cddefe'
        },
        {
            id: 3,
            title: 'Ready',
            content: pharmacyOrderReadyCount,
            color: '#fff1cc'
        },
        {
            id: 4,
            title: 'Completed',
            content: pharmacyOrderCompletedCount,
            color: '#dbf0e7'
        },
        {
            id: 5,
            title: 'Cancelled',
            content: pharmacyOrderCancelledCount,
            color: '#f7c0bb'
        }
    ];


    const menuItemStyles = {
        color: "var(--Text-Black, #080F1A)",
        fontFamily: `"Outfit", sans-serif`,
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "150%",
    };

    const [openOrderType, setOpenOrderType] = useState(false);

    const handleOrderTypeFilter = () => {
        setOpenOrderType(!openOrderType);
    }

    const handleOrderTypeStatusFilter = (orderStatus: string) => {
        setPage(0); //page changed in this component
        setPageNumber(1);
        setPharmacyOrderStatusFilter(orderStatus);
        setOpenOrderType(!openOrderType)
    }

    return (
        <>
            <Box className="orderListBody-container">


                <Stack className="orderListBody-title">
                    Pharmacy
                </Stack>



                {/* Filters Elements */}

                <Box className="Filters-container">


                    <Stack className='Filters-container-Left'>

                        {/* Date Filter */}
                        <Stack className='Ordertype-filter'>
                            <input
                                type='date'
                                value={pharmacyDateFilter}
                                onChange={handleDateFilter}
                                id='your_unique_id'
                                placeholder="DD-MM-YY"
                                style={{
                                    fontFamily: `Outfit,sans-serif`,
                                    backgroundColor: "#E1E6EE",
                                    border: 0,
                                    outline: 'none',
                                    cursor: 'pointer',
                                    margin: '0px 10px 0px 10px'
                                }}
                            />
                        </Stack>
                        {/* --------End------ */}

                        {/* Order Type Filter */}
                        <Stack className='Ordertype-filter' onClick={handleOrderTypeFilter}>
                            <span className='Ordertype-filter-title'>
                                {pharmacyOrderStatusFilter ? pharmacyOrderStatusFilter === "Pending" ? "Processing" : pharmacyOrderStatusFilter : "All Orders"}
                                {/* All Orders */}
                            </span>
                            <span className='Ordertype-filter-icon'><img src={ArrowDownIcon} alt="Arrow-Down" /></span>
                        </Stack>
                        <Stack display={openOrderType ? "block" : "none"}
                            className='Ordertype-filter-options' bgcolor="white"
                        // onClose={() => { setOpenOrderType(!openOrderType) }}
                        >
                            <MenuItem sx={menuItemStyles} onClick={() => handleOrderTypeStatusFilter("Pending")} >Processing</MenuItem>
                            <MenuItem sx={menuItemStyles} onClick={() => handleOrderTypeStatusFilter("Ready")}>Ready</MenuItem>
                            <MenuItem sx={menuItemStyles} onClick={() => handleOrderTypeStatusFilter("Completed")}>Completed</MenuItem>
                            <MenuItem sx={menuItemStyles} onClick={() => handleOrderTypeStatusFilter("Cancelled")}>Cancelled</MenuItem>
                        </Stack>
                        {/* End Here */}

                        {/* Reset Filter */}
                        <Stack className="Ordertype-filter"
                            onClick={() => {
                                setPharmacyDateFilter("");
                                setPharmacyOrderStatusFilter("");
                                setPharmacySearchFilter("")
                            }}
                        >
                            <span className='Clearbtn'>Reset Filter</span>
                            <span className='Clearbtn'><RefreshIcon /></span>
                        </Stack>
                        {/* End Here */}

                    </Stack>



                    <Stack className='search'>
                        <div className="search-container">
                            {/* <span className="search-icon">&#128269;</span> */}
                            <span className="search-icon"><SearchIcon /></span>
                            <input type="text"
                                className="search-input"
                                placeholder=" Search..."
                                value={pharmacySearchFilter}
                                onChange={(event) => setPharmacySearchFilter(event.target?.value)}
                                onKeyPress={handleSearchKeyPress}
                            />
                        </div>
                    </Stack>
                </Box>

                {/* -----------------------End here------------ */}
                {/* Count Of Order Type */}

                <Box className="OrderType-container">
                    {cardsData.map((card) => (
                        <>
                            <Stack className='OrderType-card' sx={{ borderLeft: card.id !== 1 ? "1px solid var(--Borders-Light-Grey, #D4DBE5)" : "none" }}>
                                <Stack className='OrderType-card-title'>{card.title}</Stack>
                                <Stack className='OrderType-card-value'>{card.content ? card.content : 0}</Stack>
                            </Stack>
                        </>

                    ))}
                </Box>

                {/* ---------End here---- */}

                <Box sx={{ backgroundColor: 'white', borderRadius: '15px', height: '62%', border: '1px solid #D4DBE5' }}>
                    <Box sx={{ width: '100%', borderRadius: '15px', height: '88%', overflow: 'hidden' }} >
                        <TableContainer sx={{
                            maxHeight: '100%', overflowY: 'auto',
                            '&::-webkit-scrollbar': { width: '4px', marginTop: "100px" },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#DAE8FF', borderRadius: '4px' },
                            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' }
                        }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow sx={{
                                        padding: "var(--8px, 8px) var(--16px, 16px)",
                                        gap: "var(--12px, 12px)",

                                    }}>
                                        {columns.map((column) => (
                                            <TableCell
                                                sx={{
                                                    backgroundColor: 'white',
                                                    textTransform: 'capitalize',
                                                    color: "var(--Text-Light-Grey, #647491)",
                                                    /* Body/Medium */
                                                    fontFamily: "Outfit,sans-serif",
                                                    fontSize: "14px",
                                                    fontStyle: "normal",
                                                    fontWeight: "400",
                                                    lineHeight: "150%",
                                                    padding: '32px 20px 16px 20px'

                                                }}
                                                key={column.id}
                                                style={{ minWidth: column.minWidth, }}
                                            >
                                                {column.label === "Name" ? (
                                                    <Stack display={"flex"} flexDirection={"row"}>
                                                        <Stack>{column.label}</Stack>
                                                        <Stack sx={{ marginLeft: "5px", marginTop: "2px" }}>
                                                            <img src={SortArrowIcon} alt="sortArrow" />
                                                        </Stack>
                                                    </Stack>

                                                ) : (
                                                    <>{column.label}</>
                                                )}

                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows
                                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <TableRow key={row._id}
                                                // hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                sx={{
                                                    height: '14px',
                                                    '&:hover': {
                                                        backgroundColor: '#F6F7F9',
                                                    },
                                                }}
                                            >
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align || 'left'}

                                                            sx={{
                                                                minHeight: "1vh",
                                                                textTransform: 'capitalize',
                                                                color: "var(--Text-Black, #080F1A)",
                                                                /* Body/Medium */
                                                                fontFamily: "Outfit,sans-serif",
                                                                fontSize: "14px",
                                                                fontStyle: "normal",
                                                                fontWeight: "400",
                                                                cursor: column.id === 'prescription' || column.id === 'orderStatus' ? 'default' : 'pointer',
                                                                padding: '16px 20px 16px 20px'
                                                            }}
                                                            onClick={column.id === 'prescription' || column.id === 'orderStatus' ? undefined : () => onClickDetail(row.uhid, row._id)}
                                                        >
                                                            {column.format ? column.format(value, handleStatusChange, onClickDetail, handleViewPrescription, row) : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Box>
                    <Box sx={{ borderTop: '1px solid #D4DBE5', height: '12%', }}>
                        <TablePagination
                            component="div"
                            count={ticketCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[]}
                        />
                    </Box>

                </Box>

            </Box >
        </>
    );
};

export default OrderListBody;