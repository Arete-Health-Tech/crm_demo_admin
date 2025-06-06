import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  createTheme,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  outlinedInputClasses,
  Select,
  Snackbar,
  Stack,
  TextField,
  Theme,
  ThemeProvider,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Form, useParams } from 'react-router-dom';
import '../../singleTicket.css';
import ShowPrescription from '../../widgets/ShowPrescriptionModal';
import { iTicket } from '../../../../types/store/ticket';
import useTicketStore from '../../../../store/ticketStore';
import useServiceStore from '../../../../store/serviceStore';
import { iDepartment, iDoctor } from '../../../../types/store/service';
import { Interface } from 'readline';
import { updateConusmerData } from '../../../../api/ticket/ticket';
import {
  getTicketFilterHandler,
  getTicketHandler,
  getTicketHandlerSearch
} from '../../../../api/ticket/ticketHandler';
import { apiClient } from '../../../../api/apiClient';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import {
  hasChanges,
  initialFiltersNew,
  oldInitialFilters
} from '../../../../constants/commomFunctions';
import { UNDEFINED } from '../../../../constantUtils/constant';

const CopyToClipboardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 12.69V18.08C16 20.42 14.44 21.97 12.11 21.97H5.89C3.56 21.97 2 20.42 2 18.08V10.31C2 7.97004 3.56 6.42004 5.89 6.42004H9.72C10.75 6.42004 11.74 6.83004 12.47 7.56004L14.86 9.94004C15.59 10.67 16 11.66 16 12.69Z"
      stroke="#292D32"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22 8.24997V13.64C22 15.97 20.44 17.53 18.11 17.53H16V12.69C16 11.66 15.59 10.67 14.86 9.93997L12.47 7.55997C11.74 6.82997 10.75 6.41997 9.72 6.41997H8V5.85997C8 3.52997 9.56 1.96997 11.89 1.96997H15.72C16.75 1.96997 17.74 2.37997 18.47 3.10997L20.86 5.49997C21.59 6.22997 22 7.21997 22 8.24997Z"
      stroke="#292D32"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#D4DBE5',
            '--TextField-brandBorderHoverColor': '#B2BAC2',
            '--TextField-brandBorderFocusedColor': '#0566FF',
            fontSize: '12px',

            '& label.Mui-focused': {
              color: 'grey'
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: 'none',
            fontSize: '14px'
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderHoverColor)'
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderFocusedColor)'
            }
          }
        }
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: 'none'
            },
            '&::after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)'
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)'
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)'
            }
          }
        }
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: 'none',
              fontSize: '14px'
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)'
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)'
            }
          }
        }
      }
    }
  });

interface patientData {
  uhid: string;
  firstName: string;
  lastName: string;
  phone: string;
  age: string;
  gender: string;
  doctor: string;
  department: string;
  remarks: string | '';
  followUp: string;
}

const EditIcon = () => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="vuesax/linear/edit-2">
      <g id="edit-2">
        <path
          id="Vector"
          d="M11.05 3.50002L4.20829 10.7417C3.94996 11.0167 3.69996 11.5584 3.64996 11.9334L3.34162 14.6333C3.23329 15.6083 3.93329 16.275 4.89996 16.1084L7.58329 15.65C7.95829 15.5834 8.48329 15.3084 8.74162 15.025L15.5833 7.78335C16.7666 6.53335 17.3 5.10835 15.4583 3.36668C13.625 1.64168 12.2333 2.25002 11.05 3.50002Z"
          stroke="#080F1A"
          stroke-width="1.25"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="Vector_2"
          d="M9.90833 4.7085C10.2667 7.0085 12.1333 8.76683 14.45 9.00016"
          stroke="#080F1A"
          stroke-width="1.25"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="Vector_3"
          d="M2.5 18.8335H17.5"
          stroke="#080F1A"
          stroke-width="1.25"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </g>
  </svg>
);

interface MyComponentProps {
  isPatient: boolean;
}

const PatientDetail: React.FC<MyComponentProps> = ({ isPatient }) => {
  const outerTheme = useTheme();
  const { ticketID } = useParams();
  const { doctors, departments, stages } = useServiceStore();
  const {
    tickets,
    filterTickets,
    filterTicketsDiago,
    filterTicketsFollowUp,
    searchByName,
    pageNumber,
    viewEstimates,
    setViewEstimates,
    isEstimateUpload,
    setIsEstimateUpload,
    isAuditor,
    setDownloadDisable,
    filteredLocation
  } = useTicketStore();
  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;
  const initialPatientData: patientData = {
    uhid: '',
    firstName: '',
    lastName: '',
    phone: '',
    age: '',
    gender: '',
    doctor: '',
    department: '',
    remarks: '',
    followUp: 'null'
  };
  const [PatientData, setPatientData] =
    React.useState<patientData>(initialPatientData);
  const [currentTicket, setCurrentTicket] = React.useState<iTicket>();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

  useEffect(() => {
    const fetchEstimateData = async () => {
      if (ticketID) {
        try {
          const { data } = await apiClient.get(
            `ticket/uploadestimateData/${ticketID}`
          );
          setViewEstimates(data);
        } catch (error) {
          console.error('Error fetching estimate data:', error);
        }
      } else {
        console.error('Ticket ID is undefined.');
      }
    };

    fetchEstimateData();
    setIsEstimateUpload(false);
  }, [ticketID, isEstimateUpload]);

  const doctorSetter = (id: string) => {
    return doctors.find((doctor: iDoctor) => doctor._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((department: iDepartment) => department._id === id)
      ?.name;
  };
  const patientData = [
    { id: 'uhid', label: 'UHID', value: `#${PatientData.uhid}` },
    { id: 'phone', label: 'Phone No.', value: PatientData.phone },
    {
      id: 'Name',
      label: 'Name',
      value: `${PatientData.firstName} ${PatientData.lastName}`,
      setValue: setPatientData
    },
    {
      id: 'age',
      label: 'Age',
      value: PatientData.age,
      setValue: setPatientData
    },
    {
      id: 'followUp',
      label: 'Followup Date',
      value: PatientData.followUp,
      setValue: setPatientData
    },
    {
      id: 'gender',
      label: 'Gender',
      value: PatientData.gender,
      setValue: setPatientData
    },
    {
      id: 'remarks',
      label: 'Remark',
      value: PatientData.remarks,
      setValue: setPatientData
    },
    {
      id: 'department',
      label: 'Department',
      value: PatientData.department,
      setValue: setPatientData
    },
    {
      id: 'doctor',
      label: 'Doctor',
      value: PatientData.doctor,
      setValue: setPatientData
    }
  ];
  console.log(PatientData.followUp);

  const handleCancel = () => {
    setPatientData((prevData) => ({
      ...prevData,
      uhid: `${currentTicket?.consumer?.[0]?.uid}`,
      firstName: `${currentTicket?.consumer?.[0]?.firstName ?? ''}`,
      lastName: `${currentTicket?.consumer?.[0]?.lastName ?? ''}`,
      remarks: `${
        currentTicket?.prescription[0]?.remarks === ' ' ||
        currentTicket?.prescription[0]?.remarks == undefined
          ? 'No Remark'
          : currentTicket?.prescription[0]?.remarks
      }`,
      age: `${
        currentTicket?.consumer?.[0]?.age && currentTicket?.consumer?.[0]?.age
      }`,
      gender:
        currentTicket?.consumer?.[0]?.gender === 'M'
          ? 'Male'
          : currentTicket?.consumer?.[0]?.gender === 'F'
          ? 'Female'
          : '',
      doctor: `${currentTicket?.prescription?.[0]?.doctor}`,
      department: `${currentTicket?.prescription[0]?.departments[0]}`,
      followUp: `${
        currentTicket?.prescription[0]?.followUp == 'null' ||
        currentTicket?.prescription[0]?.followUp == null ||
        currentTicket?.prescription[0]?.followUp == '1970-01-01T00:00:00.000Z'
          ? `null`
          : dayjs(new Date(currentTicket?.prescription[0]?.followUp)).format(
              'YYYY-MM-DD'
            )
      }`
      // `${new Date(fetchTicket?.prescription[0]?.followUp)}`
    }));
  };

  useEffect(() => {
    const getTicketInfo = (ticketID: string | undefined) => {
      const fetchTicket = tickets.find((element) => ticketID === element._id);
      setCurrentTicket(fetchTicket);
      // const date = new Date(fetchTicket?.prescription[0]?.followUp);
      // const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      setPatientData((prevData) => ({
        ...prevData,
        uhid: `${fetchTicket?.consumer?.[0]?.uid}`,
        phone: `${fetchTicket?.consumer?.[0]?.phone}`,
        firstName: `${fetchTicket?.consumer?.[0]?.firstName ?? ''}`,
        lastName: `${fetchTicket?.consumer?.[0]?.lastName ?? ''}`,
        remarks: `${
          fetchTicket?.prescription[0]?.remarks === ' ' ||
          fetchTicket?.prescription[0]?.remarks == undefined
            ? 'No Remark'
            : fetchTicket?.prescription[0]?.remarks
        }`,
        age: `${
          fetchTicket?.consumer?.[0]?.age && fetchTicket?.consumer?.[0]?.age
        }`,
        gender:
          fetchTicket?.consumer?.[0]?.gender === 'M'
            ? 'Male'
            : fetchTicket?.consumer?.[0]?.gender === 'F'
            ? 'Female'
            : '',
        doctor: `${fetchTicket?.prescription?.[0]?.doctor}`,
        department: `${fetchTicket?.prescription[0]?.departments[0]}`,
        followUp: `${
          fetchTicket?.prescription[0]?.followUp == 'null' ||
          fetchTicket?.prescription[0]?.followUp == null ||
          fetchTicket?.prescription[0]?.followUp == '1970-01-01T00:00:00.000Z'
            ? `null`
            : dayjs(new Date(fetchTicket?.prescription[0]?.followUp)).format(
                'YYYY-MM-DD'
              )
        }`
      }));
    };
    getTicketInfo(ticketID);
    setIsEditing(false);
  }, [ticketID, tickets]);

  const handleSubmit = async (event) => {
    try {
      setDownloadDisable(true);
      event.preventDefault();
      const updatedData = {
        consumer: {
          uid: PatientData.uhid,
          firstName: PatientData.firstName,
          lastName: PatientData.lastName,
          gender:
            PatientData.gender === 'Male'
              ? 'M'
              : PatientData.gender === 'Female'
              ? 'F'
              : '',
          age: PatientData.age
        },
        prescription: {
          doctor: PatientData.doctor,
          departments: [PatientData.department],
          followUp:
            PatientData.followUp !== 'null'
              ? dayjs(PatientData.followUp)
                  .add(5, 'hour')
                  .add(30, 'minute')
                  .toISOString()
              : null
        }
      };
      await updateConusmerData(updatedData, ticketID);
      // await getTicketHandler(searchByName, pageNumber, 'false', newFilter);
      try {
         if (
           hasChanges(newFilter, initialFiltersNew) &&
           !filteredLocation &&
           (searchByName === '' || searchByName === UNDEFINED)
         ) {
           await getTicketHandler(
             searchByName,
             pageNumber,
             'false',
             oldInitialFilters
           );
         } else if (
           hasChanges(newFilter, initialFiltersNew) &&
           !filteredLocation &&
           (searchByName !== '' || searchByName !== UNDEFINED)
         ) {
           await getTicketHandlerSearch(
             searchByName,
             pageNumber,
             'false',
             newFilter
           );
         } else {
           await getTicketFilterHandler(
             searchByName,
             pageNumber,
             'false',
             newFilter
           );
         }
      } catch (error) {
        console.log(error);
        setDownloadDisable(false);
      }
      setIsEditing(false);
      setDownloadDisable(false);
    } catch (error) {
      setDownloadDisable(false);
      setIsEditing(false);
    }
  };

  const fetchPdfUrl = async () => {
    if (currentTicket?.location) {
      window.open(currentTicket.location, '_blank');
    } else {
      setShowAlert(true);
    }
  };

  const fetchUploadPdfUrl = async () => {
    if (viewEstimates[viewEstimates.length - 1]?.total) {
      window.open(viewEstimates[viewEstimates.length - 1].location, '_blank');
    }
    // if (viewEstimates[viewEstimates.length - 1].location) {
    //     window.open(viewEstimates[viewEstimates.length - 1].location, '_blank');
    // }
    else {
      setShowAlert(true);
    }
  };

  const [error, setError] = useState('');

  const handleInput = (e) => {
    const newValue = e.target.value;
    const numericValue = newValue.replace(/[^0-9]/g, '');

    if (newValue !== numericValue || newValue === '') {
      setError(
        'Invalid UHID. Only numeric values are allowed and cannot be empty.'
      );
    } else {
      setError('');
      setPatientData((prev) => ({
        ...prev,
        uhid: newValue
      }));
    }
  };
  const today = new Date().toISOString().split('T')[0];

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(PatientData.phone)
      .then(() => {
        // alert('Phone number copied to clipboard!');
        toast.success('Phone number copied to clipboard!');
      })
      .catch((err) => {
        toast.error('Failed to copy phone number: ', err);
      });
  };

  return (
    <>
      <Box className="Patient-detail">
        <Box className="Patient-detail-Head">
          <Stack className="Patient-detail-Heading">Patient Details</Stack>
          {isPatient ? (
            <>
              <Stack display="flex" flexDirection="row">
                {isEditing ? (
                  <Stack display="flex" flexDirection="row">
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        handleCancel();
                        setIsEditing(false);
                        setError('');
                      }}
                    >
                      cancel
                    </button>
                    <button
                      className="save-btn"
                      onClick={(event) => {
                        if (!error) {
                          handleSubmit(event); // Pass the event argument to handleSubmit
                        }
                      }}
                    >
                      Save
                    </button>
                  </Stack>
                ) : (
                  <>
                    {!isAuditor && (
                      <Stack
                        component="div"
                        className="edit-icon"
                        sx={{ marginLeft: isEditing ? '10px' : '0' }}
                        onClick={() => setIsEditing(true)}
                      >
                        <EditIcon />
                      </Stack>
                    )}
                  </>
                )}
              </Stack>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Stack>
          {isEditing ? (
            <Box>
              <Box>
                {/* UHID */}
                <Box className="Patient-detail-Head">
                  <Stack className="Patient-detail-title">UHID</Stack>
                  {/* <Stack component='div' className='Patient-detail-data'>#{PatientData.uhid}</Stack> */}
                  <Stack component="div" className="Patient-detail-data">
                    <TextField
                      id="uhid"
                      type="text"
                      label="uhid"
                      variant="outlined"
                      size="medium"
                      inputProps={{
                        style: { fontSize: '14px' },
                        onInput: handleInput
                      }}
                      value={PatientData.uhid}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          uhid: e.target.value
                        }))
                      }
                      InputLabelProps={{
                        style: {
                          fontSize: '13px',
                          color: 'grey',

                          fontFamily: `"Outfit",sans-serif`
                        }
                      }}
                      InputProps={{
                        style: {
                          fontSize: '12px',
                          // padding: '2px 0',

                          color: 'var(--Text-Black, #080F1A)',
                          fontFamily: `"Outfit",sans-serif`
                        }
                      }}
                      sx={{
                        width: '75%',
                        color: '#0566FF',
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                          {
                            borderColor: '#0566FF'
                          }
                      }}
                      error={!!error}
                      helperText={error}
                    />
                  </Stack>
                </Box>
                <Box className="Patient-detail-Head">
                  <Stack className="Patient-detail-title">Phone No.</Stack>
                  <Stack component="div" className="Patient-detail-data">
                    {currentTicket?.consumer[0].phone}
                  </Stack>
                </Box>
                {/* First Name */}
                <Box className="Patient-detail-Head">
                  <Stack className="Patient-detail-title">First Name</Stack>
                  <Stack component="div" className="Patient-detail-data">
                    <TextField
                      id="firstName"
                      type="text"
                      label="First Name"
                      variant="outlined"
                      size="medium"
                      inputProps={{ style: { fontSize: '14px' } }}
                      value={PatientData.firstName}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          firstName: e.target.value
                        }))
                      }
                      InputLabelProps={{
                        style: {
                          fontSize: '13px',
                          color: 'grey',

                          fontFamily: `"Outfit",sans-serif`
                        }
                      }}
                      InputProps={{
                        style: {
                          fontSize: '12px',
                          // padding: '2px 0',

                          color: 'var(--Text-Black, #080F1A)',
                          fontFamily: `"Outfit",sans-serif`
                        }
                      }}
                      sx={{
                        width: '75%',
                        color: '#0566FF',
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                          {
                            borderColor: '#0566FF'
                          }
                      }}
                    />
                  </Stack>
                </Box>
                {/* Last Name */}
                <Box className="Patient-detail-Head">
                  <Stack className="Patient-detail-title">Last Name</Stack>
                  <Stack component="div" className="Patient-detail-data">
                    <TextField
                      id="lastName"
                      type="text"
                      label="Last Name"
                      variant="outlined"
                      size="medium"
                      inputProps={{ style: { fontSize: '14px' } }}
                      value={PatientData.lastName}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          lastName: e.target.value
                        }))
                      }
                      InputLabelProps={{
                        style: {
                          fontSize: '13px',
                          color: 'grey',

                          fontFamily: `"Outfit",sans-serif`
                        }
                      }}
                      InputProps={{
                        style: {
                          fontSize: '12px',
                          // padding: '2px 0',

                          color: 'var(--Text-Black, #080F1A)',
                          fontFamily: `"Outfit",sans-serif`
                        }
                      }}
                      sx={{
                        width: '75%',
                        color: '#0566FF',
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                          {
                            borderColor: '#0566FF'
                          }
                      }}
                    />
                  </Stack>
                </Box>
                {/* Age */}
                <Box className="Patient-detail-Head">
                  <Stack className="Patient-detail-title">Age</Stack>
                  <Stack component="div" className="Patient-detail-data">
                    <TextField
                      id="age"
                      type="number"
                      label="Age"
                      variant="outlined"
                      size="medium"
                      inputProps={{ style: { fontSize: '14px' } }}
                      value={PatientData.age}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          age: e.target.value
                        }))
                      }
                      InputLabelProps={{
                        style: {
                          fontSize: '13px',
                          color: 'grey',

                          fontFamily: `"Outfit",sans-serif`
                        }
                      }}
                      InputProps={{
                        style: {
                          fontSize: '12px',
                          // padding: '2px 0',

                          color: 'var(--Text-Black, #080F1A)',
                          fontFamily: `"Outfit",sans-serif`
                        }
                      }}
                      sx={{
                        width: '75%',
                        color: '#0566FF',
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                          {
                            borderColor: '#0566FF'
                          }
                      }}
                    />
                  </Stack>
                </Box>
                {/* FollowUp */}
                <Box className="Patient-detail-Head">
                  <Stack className="Patient-detail-title">FollowUp Date</Stack>
                  <Stack component="div" className="Patient-detail-data">
                    <TextField
                      id="followUp"
                      type="date"
                      label="FollowUp Date"
                      variant="outlined"
                      size="medium"
                      inputProps={{
                        min: today, // Set the min date to today
                        style: { fontSize: '14px' }
                      }}
                      value={PatientData.followUp}
                      onChange={(e) => {
                        setPatientData((prev) => ({
                          ...prev,
                          followUp:
                            e.target.value !== ''
                              ? e.target.value.toString()
                              : `null`
                        }));
                        console.log(e.target.value.toString());
                      }}
                      InputLabelProps={{
                        style: {
                          fontSize: '13px',
                          color: 'grey',

                          fontFamily: `"Outfit",sans-serif`
                        }
                      }}
                      InputProps={{
                        style: {
                          fontSize: '12px',
                          // padding: '2px 0',

                          color: 'var(--Text-Black, #080F1A)',
                          fontFamily: `"Outfit",sans-serif`
                        }
                      }}
                      sx={{
                        width: '75%',
                        color: '#0566FF',
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                          {
                            borderColor: '#0566FF'
                          }
                      }}
                    />
                  </Stack>
                </Box>
                {/* Gender */}
                <Box className="Patient-detail-Head">
                  <Stack className="Patient-detail-title">Gender</Stack>
                  <Stack component="div" className="Patient-detail-data">
                    <FormControl
                      variant="outlined"
                      size="medium"
                      sx={{
                        color: 'grey',
                        width: '75%',
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                          {
                            color: 'grey',
                            borderColor: '#0566FF'
                          }
                      }}
                    >
                      <InputLabel
                        id="gender-label"
                        sx={{
                          textTransform: 'capitalize',
                          fontSize: '14px',
                          fontFamily: 'Outfit,sans-serif',
                          color: 'grey'
                        }}
                      >
                        Gender
                      </InputLabel>
                      <Select
                        labelId="gender-label"
                        id="gender"
                        value={PatientData.gender}
                        onChange={(e) =>
                          setPatientData((prev) => ({
                            ...prev,
                            gender: e.target.value
                          }))
                        }
                        label="Gender"
                        style={{
                          textTransform: 'capitalize',
                          fontSize: '14px',
                          fontFamily: 'Outfit,sans-serif'
                        }}
                        inputProps={{ style: { fontSize: '14px' } }}
                      >
                        <MenuItem
                          value="Male"
                          sx={{
                            fontSize: '14px',
                            fontFamily: 'Outfit,sans-serif'
                          }}
                        >
                          Male
                        </MenuItem>
                        <MenuItem
                          value="Female"
                          sx={{
                            fontSize: '14px',
                            fontFamily: 'Outfit,sans-serif'
                          }}
                        >
                          Female
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
                {/* Remark */}
                <Box className="Patient-detail-Head">
                  <Stack className="Patient-detail-title">Remark</Stack>
                  <Stack component="div" className="Patient-detail-data">
                    {PatientData.remarks}
                  </Stack>
                </Box>
                {/* < Box className='Patient-detail-Head'>
                                    <Stack className='Patient-detail-title'>Followup Date</Stack>
                                    <Stack component='div' className='Patient-detail-data'>{PatientData.followUp}</Stack>
                                </Box> */}

                <Box className="Patient-detail-Head">
                  <Stack className="Patient-detail-title">Department</Stack>
                  <Stack component="div" className="Patient-detail-data">
                    <ThemeProvider theme={customTheme(outerTheme)}>
                      <Autocomplete
                        sx={{ width: '75%' }}
                        size="medium"
                        value={
                          departments.find(
                            (dept) => dept._id === PatientData.department
                          ) || null
                        }
                        onChange={(e, value) =>
                          setPatientData((prev) => ({
                            ...prev,
                            department: value ? `${value._id}` : ''
                          }))
                        }
                        renderOption={(props, option) => (
                          <li
                            {...props}
                            style={{
                              textTransform: 'capitalize',
                              fontFamily: 'sans-serif',
                              fontSize: '12px'
                            }}
                          >
                            {option.name}
                          </li>
                        )}
                        getOptionLabel={(option) => option.name}
                        options={departments.filter(
                          (item) => item.parent === null
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Department"
                            InputProps={{
                              ...params.InputProps,
                              style: {
                                textTransform: 'capitalize',
                                fontSize: '14px',
                                fontFamily: 'Outfit,sans-serif'
                                // padding: '8px 0'
                              }
                            }}
                          />
                        )}
                      />
                    </ThemeProvider>
                  </Stack>
                </Box>

                <Box className="Patient-detail-Head">
                  <Stack className="Patient-detail-title">Doctor</Stack>
                  <Stack component="div" className="Patient-detail-data">
                    <ThemeProvider theme={customTheme(outerTheme)}>
                      <Autocomplete
                        size="medium"
                        disablePortal
                        renderOption={(props, option) => (
                          <li
                            {...props}
                            style={{
                              textTransform: 'capitalize',
                              fontFamily: 'sans-serif',
                              fontSize: '12px'
                            }}
                          >
                            {option.name}
                          </li>
                        )}
                        sx={{ width: '75%' }}
                        value={
                          doctors.find(
                            (dept) => dept._id === PatientData.doctor
                          ) || null
                        }
                        onChange={(e, value) =>
                          setPatientData((prev) => ({
                            ...prev,
                            doctor: value ? value._id : ''
                          }))
                        }
                        options={doctors.filter(
                          (item) =>
                            Array.isArray(item.departments) &&
                            item.departments.includes(PatientData.department)
                        )}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Doctor"
                            InputProps={{
                              ...params.InputProps,
                              style: {
                                textTransform: 'capitalize',
                                fontSize: '14px',
                                fontFamily: 'Outfit,sans-serif'
                                // padding: '8px 0'
                              }
                            }}
                          />
                        )}
                      />
                    </ThemeProvider>
                  </Stack>
                </Box>
              </Box>
            </Box>
          ) : (
            <>
              {patientData.map((field) =>
                field.value !== null &&
                field.value !== undefined &&
                field.value !== '' ? (
                  <Box key={field.id} className="Patient-detail-Head">
                    <Stack className="Patient-detail-title">
                      {field.label}
                    </Stack>
                    <Stack component="div" className="Patient-detail-data">
                      {field.label === 'Department' ? (
                        departmentSetter(field.value)
                      ) : field.label === 'Doctor' ? (
                        doctorSetter(field.value)
                      ) : field.label === 'Followup Date' ? (
                        `${
                          field.value === `null`
                            ? 'Not Mentioned'
                            : `${String(
                                new Date(field.value).getDate()
                              ).padStart(2, '0')}-${String(
                                new Date(field.value).getMonth() + 1
                              ).padStart(2, '0')}-${new Date(
                                field.value
                              ).getFullYear()}`
                        }`
                      ) : field.label === 'Phone No.' ? (
                        <Box display={'flex'} justifyContent={'space-around'}>
                          <Stack>{field.value}</Stack>
                          <Stack
                            component="div"
                            className="edit-icon"
                            sx={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                            onClick={handleCopyClick}
                          >
                            <CopyToClipboardIcon />
                          </Stack>
                        </Box>
                      ) : (
                        field.value
                      )}
                    </Stack>
                  </Box>
                ) : (
                  <React.Fragment key={field.id} />
                )
              )}

              <Stack>
                <ShowPrescription
                  image={currentTicket?.prescription[0]?.image?.split('?')[0]}
                  image1={currentTicket?.prescription[0]?.image1?.split('?')[0]}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Box>

      <Stack className="gray-border">{/* Borders */}</Stack>

      {currentTicket?.opinion !== undefined &&
        currentTicket?.opinion?.length > 0 && (
          <Box className="Patient-records">
            <Box className="additional-detail-Head">
              <Stack className="additional-detail-Heading">
                SECOND OPINIONS
              </Stack>
            </Box>
            <Box className="additional-detail-Head">
              <Stack className="additional-detail-title">Hospital</Stack>
              <Stack
                component="div"
                className="additional-detail-data"
                sx={{ textTransform: 'capitalize' }}
              >
                {' '}
                {currentTicket?.opinion[currentTicket?.opinion?.length - 1]
                  ?.hospital
                  ? currentTicket?.opinion[currentTicket?.opinion?.length - 1]
                      ?.hospital
                  : 'N/A'}
              </Stack>
            </Box>
            <Box className="additional-detail-Head">
              <Stack className="additional-detail-title">Doctor Name</Stack>
              <Stack component="div" className="additional-detail-data">
                {currentTicket?.opinion[currentTicket?.opinion?.length - 1]
                  ?.doctor
                  ? currentTicket?.opinion[currentTicket?.opinion?.length - 1]
                      ?.doctor
                  : 'N/A'}
              </Stack>
            </Box>
            <Box className="additional-detail-Head">
              <Stack className="additional-detail-title">Remark</Stack>
              <Stack component="div" className="additional-detail-data">
                {currentTicket?.opinion[currentTicket?.opinion?.length - 1]
                  ?.additionalInfo
                  ? currentTicket?.opinion[currentTicket?.opinion?.length - 1]
                      ?.additionalInfo
                  : 'N/A'}
              </Stack>
            </Box>
          </Box>
        )}

      {currentTicket?.opinion !== undefined &&
        currentTicket?.opinion?.length > 0 && (
          <Stack className="gray-border">{/* Borders */}</Stack>
        )}
      {currentTicket?.opinion && currentTicket?.opinion?.length !== 0 ? (
        <>
          {currentTicket?.opinion[0]?.challengeSelected?.length !== 0 ? (
            <>
              <Box className="Patient-records">
                <Box className="additional-detail-Head">
                  <Stack className="additional-detail-Heading">
                    CONVERSION CHALLENGES
                  </Stack>
                </Box>
                {currentTicket?.opinion[0]?.challengeSelected?.map((item) => (
                  <Box className="additional-detail-Head" key={item}>
                    <Stack
                      className="record-tag pharmacy-tag"
                      sx={{
                        background: '#dae8ff',
                        padding: '0px 10px',
                        width: 'fit-content',
                        color: '#080F1A',
                        borderRadius: '10px'
                      }}
                      // width={'10.2vw'}
                      // sx={{ color: '#080F1A' }}
                    >
                      {item}
                    </Stack>
                  </Box>
                ))}
              </Box>
              <Stack className="gray-border">{/* Borders */}</Stack>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}

      <Box className="Payment-detail">
        <Box className="Payment-detail-Head">
          <Stack className="Payment-detail-Heading">
            Value And Payment Mode
          </Stack>
        </Box>
        {viewEstimates[viewEstimates.length - 1] ? (
          <Box className="Payment-detail-data">
            {/* <Stack className='Payment-value'>{'\u20B9'} {currentTicket?.estimate[0]?.total}</Stack> */}
            <Stack className="Payment-value">
              {'\u20B9'} {viewEstimates[viewEstimates.length - 1]?.total}
            </Stack>
            <Stack className="ticket-card-line3-tag">
              {viewEstimates[viewEstimates.length - 1]?.paymentType}
            </Stack>
            {/* <Chip
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
                        /> */}
          </Box>
        ) : (
          <Box className="Patient-records-Head" flexDirection={'column'}>
            <Box p={1} className="Payment-value">
              No Estimate Available
            </Box>
            {currentTicket?.prescription[0].payerType && (
              <Box
                p={1}
                className="Payment-value"
                display={'flex'}
                flexDirection={'row'}
                gap={'10px'}
              >
                Payertype -{' '}
                <Stack
                  className="ticket-card-line3-tag"
                  width={'fit-content'}
                  // display={'contents'}
                >
                  {currentTicket?.prescription[0].payerType}
                </Stack>
              </Box>
            )}
          </Box>
        )}
        <Stack className="View-Estimation" onClick={fetchUploadPdfUrl}>
          View Estimate
        </Stack>
        {/* <Stack className='View-Estimation' onClick={fetchPdfUrl}>View Estimate</Stack> */}
        {showAlert && (
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={showAlert}
            autoHideDuration={4000}
            onClose={() => setShowAlert(false)}
          >
            {isAuditor ? (
              <Alert severity="warning">Estimate is not available.</Alert>
            ) : (
              <Alert severity="warning">Please Create an Estimate.</Alert>
            )}
          </Snackbar>
        )}
      </Box>
    </>
  );
};

export default PatientDetail;
