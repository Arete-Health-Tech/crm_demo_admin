import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FilterAlt from '@mui/icons-material/FilterAlt';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const getColorForOption = (optionValue: string): string => {
    switch (optionValue) {
        case 'Completed':
            return 'green';
        case 'Ready':
            return '#FFCE56';
        case 'Cancelled':
            return 'red';
        case 'Processing':
            return 'blue';
        default:
            return '';
    }
};

interface Column {
    id: string;
    label: string;
    minWidth: number;
    align?: 'left' | 'right';
    format?: (value: any, handleClick: () => void) => JSX.Element;
}

const columns: Column[] = [
    { id: 'uhid', label: 'UHID', minWidth: 60 },
    { id: 'name', label: 'Name', minWidth: 120 },
    { id: 'number', label: 'Number', minWidth: 80 },
    { id: 'doctor', label: 'Doctor', minWidth: 130 },
    { id: 'specialty', label: 'Specialty', minWidth: 130 },
    {
        id: 'prescription',
        label: 'Prescription',
        minWidth: 150,
        format: (value: string) => (
            <Box component="a" sx={{ color: '#4990bd' }} href={value} target="_blank" rel="noopener noreferrer">
                {value}
            </Box>
        ),
    },

    {
        id: 'orderStatus',
        label: 'Order Status',
        minWidth: 150,
        format: (value: string, handleSelectChange: (newValue: string) => void) => (
            <Select
                value={value}
                onChange={(e) => handleSelectChange(e.target.value as string)}
                sx={{
                    fontSize: '14px',
                    padding: '0px',
                    '& .MuiSelect-select': {
                        padding: '5px',
                    },
                    '& .MuiListItem-root': {
                        padding: '5px 16px',
                        color: (theme) => getColorForOption(value),
                    },
                }}
            >
                <MenuItem value="Pending" sx={{ color: getColorForOption('Processing') }}>
                    Processing
                </MenuItem>
                <MenuItem value="Completed" sx={{ color: getColorForOption('Ready') }}>
                    Ready
                </MenuItem>
                <MenuItem value="Completed" sx={{ color: getColorForOption('Completed') }}>
                    Completed
                </MenuItem>
                <MenuItem value="Cancelled" sx={{ color: getColorForOption('Cancelled') }}>
                    Cancelled
                </MenuItem>
            </Select>

        ),
    },
    {
        id: 'action',
        label: ' ',
        minWidth: 50,
        format: (value: string, handleClick: () => void) => (
            <Button sx={{ color: '#4990bd', backgroundColor: '#1976D214', fontSize: '11px' }} onClick={handleClick}>
                {value}
            </Button>
        ),
    },
];

interface Data {
    uhid: number;
    name: string;
    number: number;
    doctor: string;
    specialty: string;
    prescription: string;
    orderStatus: string;
    action: string;
}

function createData(
    uhid: number,
    name: string,
    number: number,
    doctor: string,
    specialty: string,
    prescription: string,
    orderStatus: string,
    action: string
): Data {
    return { uhid, name, number, doctor, specialty, prescription, orderStatus, action };
}


const rows = [
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
    createData(84934, 'Christrine brook', 7854239231, 'Dr. Amit Sharma', 'Cardiologist', 'View Prescription', 'Pending', 'View Detail'),
];


const OrderListBody = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(7);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [filter, setFilter] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value as string);
    };

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
                <Typography variant="h4" component="h2" mb={2} sx={{ fontSize: '36px', fontWeight: 'bold', }}>
                    Order Details
                </Typography>


                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '5px',
                        color: 'black',
                    }}
                >
                    <FormControl sx={{
                        my: 1,
                        borderRadius: '0',
                        backgroundColor: 'white',
                        border: '2px solid #ccc',
                        borderTopLeftRadius: '12px',
                        borderBottomLeftRadius: '12px',
                        borderRight: '1px solid #ccc',
                    }}>
                        <span style={{
                            width: '50px',
                            position: 'relative',
                            left: '12px',
                            top: '12px',
                            borderRadius: '0',
                            borderTopLeftRadius: '15px',
                            borderBottomLeftRadius: '15px',
                            color: '',
                            fontSize: '20px',
                            outline: 'none',

                        }}><FilterListIcon sx={{ fontSize: '28px' }} /></span>
                    </FormControl>

                    <FormControl
                        sx={{
                            my: 1,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderLeft: 'none',
                            borderRight: 'none',

                        }}
                    >
                        <InputLabel id="demo-simple-select-label" sx={{ color: 'black', fontWeight: 'bold', display: 'flex' }}>Filter By <KeyboardArrowDownIcon /></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            label="FilterBy >"
                            onChange={handleChange}
                            IconComponent={() => null}
                            sx={{
                                width: '120px',
                                borderRadius: '0',
                                paddding: '0px 50px',
                                border: 'none',
                                '&:focus': {
                                    border: 'none',
                                    outline: 'none',
                                },
                            }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        sx={{
                            my: 1,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderLeft: 'none',
                            borderRight: 'none',
                        }}
                    >
                        <InputLabel id="demo-simple-select-label" sx={{ color: 'black', fontWeight: 'bold', display: 'flex' }}>Date By<KeyboardArrowDownIcon /></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            label="Date By ^"
                            onChange={handleChange}
                            IconComponent={() => null}
                            sx={{
                                width: '110px',
                                borderRadius: '0',
                                paddding: '0px 50px',
                                border: 'none',
                                '&:focus': {
                                    border: 'none',
                                    outline: 'none',
                                },
                            }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        sx={{
                            my: 1,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderLeft: 'none',
                            borderRight: 'none',
                        }}
                    >
                        <InputLabel id="demo-simple-select-label" sx={{ color: 'black', fontWeight: 'bold', display: 'flex' }}>Order Type <KeyboardArrowDownIcon /></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            label="Order Type @"
                            onChange={handleChange}
                            IconComponent={() => null}
                            sx={{
                                width: '130px',
                                borderRadius: '0',
                                paddding: '0px 50px',
                                border: 'none',
                                '&:focus': {
                                    border: 'none',
                                    outline: 'none',
                                },
                            }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        sx={{
                            my: 1,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderLeft: 'none',
                            borderRight: 'none',
                        }}
                    >
                        <InputLabel id="demo-simple-select-label" sx={{ color: 'black', fontWeight: 'bold', display: 'flex' }}>Order Status <KeyboardArrowDownIcon /></InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            label="order status ^"
                            onChange={handleChange}
                            IconComponent={() => null}
                            sx={{
                                width: '145px',
                                borderRadius: '0',
                                paddding: '0px 50px',
                                border: 'none',
                                '&:focus': {
                                    border: 'none',
                                    outline: 'none',
                                },
                            }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        sx={{
                            my: 1,
                            backgroundColor: 'white',
                            color: 'red',
                            border: '1px solid #ccc',
                            borderLeft: 'none',
                            borderRight: 'none',
                            borderTopRightRadius: '12px',
                            borderBottomRightRadius: '12px',
                        }}
                    >
                        <InputLabel id="demo-simple-select-label" sx={{ color: 'red', fontWeight: 'bold', display: 'flex' }}><RefreshIcon sx={{ marginRight: '5px' }} />Reset Filter</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            label=" & Reset Filter btn"
                            onChange={handleChange}
                            IconComponent={() => null} // Hide default arrow
                            sx={{
                                width: '145px',
                                borderRadius: '0',

                                borderTopRightRadius: '12px',
                                borderBottomRightRadius: '12px',
                                // borderRadius: '12px',
                                paddding: '0px 50px',
                                border: 'none',
                                '&:focus': {
                                    border: 'none',
                                    outline: 'none',
                                },
                            }}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Box>



                <Box sx={{ marginTop: '18px' }}>

                    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '15px' }}>

                        <TableContainer sx={{ maxHeight: '100%', overflow: 'auto' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead >
                                    <TableRow sx={{}}>
                                        {columns.map((column) => (
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center', textTransform: 'uppercase' }}
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
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.uhid}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell sx={{ fontSize: '13px' }} key={column.id} align={column.align || 'center'}>
                                                            {column.format
                                                                ? column.format(value, () => {
                                                                    console.log('handleClick called');
                                                                })
                                                                : value}
                                                        </TableCell>




                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                </TableBody>

                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>


            </Box>
        </>
    )
}

export default OrderListBody
