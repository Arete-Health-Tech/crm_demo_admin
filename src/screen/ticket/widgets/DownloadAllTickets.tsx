/* eslint-disable @typescript-eslint/no-unused-vars */
import { DownloadForOfflineOutlined, Payment } from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { getDepartmentsHandler } from '../../../api/department/departmentHandler';
import { getDoctorsHandler } from '../../../api/doctor/doctorHandler';
import { getTicketHandler } from '../../../api/ticket/ticketHandler';
import useServiceStore from '../../../store/serviceStore';
import useTicketStore from '../../../store/ticketStore';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import { ageSetter } from '../../../utils/ageReturn';
import { UNDEFINED } from '../../../constantUtils/constant';
import useReprentativeStore from '../../../store/representative';
import DownloadAllFileIcon from '../../../../src/assets/DownloadAllFiles.svg';
import { apiClient } from '../../../api/apiClient';
import {
  getAllTicketAdmission,
  getAllTicketAdmissionNew,
  getAllTicketDiagontics,
  getAllTicketDiagonticsNew,
  getAllTicketFollowUp,
  getAllTicketFollowUpNew
} from '../../../api/ticket/ticket';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Popover } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-toastify';
import useUserStore from '../../../store/userStore';

type Props = {};
const materilaFieldCss = {
  fontSize: '14px',
  color: '#080F1A',
  fontFamily: `"Outfit",sans-serif`
};
const materilaInputFieldCss = {
  fontSize: '14px',
  color: '#080F1A',
  fontFamily: `"Outfit",sans-serif`
};
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#0566FF',
    color: '#ffffff',
    fontSize: 10,
    fontFamily: `"Outfit",sans-serif`
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#0566FF'
  }
}));

const DownloadAllTickets = (props: Props) => {
  const { doctors, departments, stages, allNotes } = useServiceStore();
  // const { allUnits } = useServiceStore();
  const { user } = useUserStore.getState();
  const phoneNumber = user?.phone;
  const [errors, setErrors] = useState({ unit: false, date: false });
  const { representative } = useReprentativeStore();
  const {
    filterTickets,
    filterTicketsDiago,
    filterTicketsFollowUp,
    setDownloadDisable,
    downloadDisable
  } = useTicketStore();
  // const [disable, setDisable] = useState(false);

  const newFilter =
    localStorage.getItem('ticketType') === 'Admission'
      ? filterTickets
      : localStorage.getItem('ticketType') === 'Diagnostics'
      ? filterTicketsDiago
      : localStorage.getItem('ticketType') === 'Follow-Up'
      ? filterTicketsFollowUp
      : filterTickets;

  const doctorSetter = (id: string) => {
    return doctors.find((element) => element._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((element) => element._id === id)?.name;
  };
  const stageSetter = (id: string) => {
    return stages.find((element) => element._id === id)?.name;
  };
  const assigneSetter = (id: string) => {
    return representative.find((element) => element._id === id);
  };
  const noteSetter = (id: string): string[] => {
    const foundItems = allNotes.filter((item) => item.ticket === id);

    const notesArray = foundItems.map(
      (item) => item.text.replace(/<[^>]*>/g, '') // Remove HTML tags
    );

    return notesArray.length > 0 ? notesArray : [];
  };
  const handleAssigne = (assignees: any) => {
    if (!Array.isArray(assignees)) {
      return [];
    }
    let result: string[] = [];

    for (let i = 0; i <= assignees.length; i++) {
      const rep = representative.find((rep) => rep._id === assignees[i]);
      if (rep) {
        // const initials = `${rep.firstName.charAt(0)}${rep.lastName.charAt(0)}`;
        const fullName = `${rep.firstName} ${rep.lastName}`;
        result.push(fullName);
      }
    }
    return result;

    // return assignees.reduce((result: fullName: string[], assigneeId: string) => {
    //     const rep = representative.find(rep => rep._id === assigneeId);
    //     if (rep) {
    //         // const initials = `${rep.firstName.charAt(0)}${rep.lastName.charAt(0)}`;
    //         const fullName = `${rep.firstName} ${rep.lastName}`;
    //         result.push(fullName );
    //     }
    //     return result;
    // }, []);
  };

  function subStageName(code: number): string {
    switch (code) {
      case 1:
        return 'Send Engagement';
      case 2:
        return 'Create Estimation';
      case 3:
        return 'Call Patient';
      case 4:
        return 'Add Call Summary';
      default:
        return 'Unknown';
    }
  }
  const returnedDate = (date: string | null | Date) => {
    return dayjs(date).format('DD/MMM/YYYY');
  };
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  // From here this is used for select download the data with the date

  useEffect(() => {
    setAnchorEl(null);
  }, [localStorage.getItem('ticketType')]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);

  // const currentDate = dayjs(); // Get the current date
  // const latestAllowedYear = currentDate.year(); // Dynamically set the latest allowed year
  // const latestAllowedMonth = currentDate.month();

  // const handleDateChange = (newDate: Dayjs | null) => {
  //   if (newDate) {
  //     // const year = newDate.year();
  //     // const month = newDate.month(); // 0-based index (0 = January)

  //     // // Allow only Jan - Mar for the latest year, and all months for previous years
  //     // if (year === latestAllowedYear && month > latestAllowedMonth) {
  //     //   return; // Prevent selection
  //     // }

  //     setSelectedDate(newDate);
  //   }
  // };

  const handleStartChange = (date: Dayjs | null) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      console.log('Start Date:', formattedDate);
    }
    setStartDate(date);
  };
  const handleEndChange = (date: Dayjs | null) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      console.log('End Date:', formattedDate);
    }
    setEndDate(date);
  };

  // This function is for downloading the data
  const downloadData = async () => {
    // if (!selectedUnit || !selectedDate) {
    //   setErrors({
    //     unit: !selectedUnit,
    //     date: !selectedDate
    //   });
    //   return;
    // }

    try {
      // setDownloadDisable(true);

      const ticketType = localStorage.getItem('ticketType');
      let sortedTickets = [];
      const startDateFormatted = startDate?.format('YYYY-MM-DD');
      const EndDateFormatted = endDate?.format('YYYY-MM-DD');

      if (!startDateFormatted || !EndDateFormatted) {
        toast.error('Please select both start and end dates.');
        return;
      }

      // Check if the date range is more than 30 days
      const diffDays = dayjs(EndDateFormatted).diff(
        dayjs(startDateFormatted),
        'day'
      );
      if (diffDays > 30) {
        toast.error('Date range should not exceed 31 days.');
        return;
      }

      toast.success('Data will Sent to your mail');
      setAnchorEl(null);
      setSelectedUnit('');
      setStartDate(null);
      setEndDate(null);

      // New Process To download the data
      if (ticketType === 'Admission') {
        // sortedTickets = await getAllTicketAdmission(selectedDate, selectedUnit);
        // sortedTickets =
        await getAllTicketAdmissionNew(
          startDateFormatted,
          EndDateFormatted,
          phoneNumber
        );
      } else if (ticketType === 'Diagnostics') {
        // sortedTickets = await getAllTicketDiagontics(
        //   selectedDate,
        //   selectedUnit
        // );
        // sortedTickets =
        await getAllTicketDiagonticsNew(
          startDateFormatted,
          EndDateFormatted,
          phoneNumber
        );
      } else if (ticketType === 'Follow-Up') {
        await getAllTicketFollowUpNew(
          startDateFormatted,
          EndDateFormatted,
          phoneNumber
        );
        // sortedTickets = await getAllTicketFollowUp(selectedDate, selectedUnit);
        // sortedTickets = await getAllTicketFollowUpNew(startDate, endDate,phoneNumber);
      }

      // No Use Doctors and Departments API for New Process of Downloading
      // await Promise.all([getDoctorsHandler(), getDepartmentsHandler()]);

      // Old Process To download the data
      // const data = sortedTickets?.map((ticket: any, index: number) => ({
      //   serialNo: index + 1,
      //   firstName: ticket?.consumer[0]?.firstName || '',
      //   lastName: ticket?.consumer[0]?.lastName || '',
      //   uhid: ticket?.consumer[0]?.uid || '',
      //   gender: ticket?.consumer[0]?.gender || '',
      //   phone: ticket?.consumer[0]?.phone ? `${ticket.consumer[0].phone}` : '',
      //   age: Number(ticket?.consumer[0]?.age) || '',
      //   location: ticket?.specialty || 'Mohali',
      //   stage: stageSetter(ticket?.stage[0]?._id) || '',
      //   department:
      //     departmentSetter(ticket?.prescription[0]?.departments[0]) ||
      //     ticket?.prescription[0]?.departmentDetails[0]?.name ||
      //     '',
      //   doctor:
      //     doctorSetter(ticket?.prescription[0]?.doctor) ||
      //     ticket?.prescription[0]?.doctorDetails[0]?.name ||
      //     '',
      //   admissionType: ticket.prescription[0].admission || 'Not Advised',
      //   serviceName: ticket.prescription[0].service?.name || 'Not Advised',
      //   isPharmacy: ticket?.prescription[0]?.isPharmacy
      //     ? ticket?.prescription[0]?.isPharmacy
      //     : 'No Advised',
      //   assigned:
      //     handleAssigne(ticket?.assigned[0]?._id).join(' ') ||
      //     ticket?.assigned[0]?.firstName ||
      //     '',
      //   diagnostics:
      //     ticket.prescription[0].diagnostics &&
      //     ticket.prescription[0].diagnostics.length > 0
      //       ? ticket.prescription[0].diagnostics
      //       : 'Not Advised',
      //   followUpDate: ['Invalid Date', '01/Jan/1970', '01/Jan/1900'].includes(
      //     returnedDate(ticket?.prescription[0]?.followUp)
      //   )
      //     ? 'No Follow Up'
      //     : returnedDate(ticket?.prescription[0]?.followUp),
      //   // CTScan: ticket?.prescription[0]?.diagnostics.includes('CT-Scan')
      //   //   ? 'Yes'
      //   //   : 'No',
      //   // LAB: ticket.prescription[0].diagnostics.includes('Lab')
      //   //   ? 'Yes'
      //   //   : 'No',
      //   // MRI: ticket.prescription[0].diagnostics.includes('MRI')
      //   //   ? 'Yes'
      //   //   : 'No',
      //   // EEG: ticket.prescription[0].diagnostics.includes('EEG')
      //   //   ? 'Yes'
      //   //   : 'No',
      //   // EMG: ticket.prescription[0].diagnostics.includes('EMG')
      //   //   ? 'Yes'
      //   //   : 'No',
      //   // XRAY: ticket.prescription[0].diagnostics.includes('X-RAY')
      //   //   ? 'Yes'
      //   //   : 'No',
      //   // USG: ticket.prescription[0].diagnostics.includes('USG')
      //   //   ? 'Yes'
      //   //   : 'No',
      //   // PETCT: ticket.prescription[0].diagnostics.includes('PET_CT')
      //   //   ? 'Yes'
      //   //   : 'No',
      //   payerType: ticket.prescription[0].payerType || '',
      //   capturedBy: ticket?.creator?.length
      //     ? `${ticket.creator[0].firstName || ''} ${
      //         ticket.creator[0].lastName || ''
      //       }`.trim()
      //     : 'Created by Livasa HMS',
      //   prescriptionCreatedAt: ticket?.date.split('T')[0] || '',
      //   prescriptionLink: ticket?.prescription[0]?.image || '',
      //   prescriptionLink1: ticket?.prescription[0]?.image1 || '',
      //   Lead_disposition:
      //     ticket.result === '65991601a62baad220000001'
      //       ? 'won'
      //       : ticket.result === '65991601a62baad220000002'
      //       ? 'loss'
      //       : '',
      //   isEstimateUpload: ticket?.estimateupload[0]?.total > 0 ? 'Yes' : 'No',
      //   estimateValue: ticket?.estimateupload[0]?.total || 0,
      //   PaymentType: ticket?.estimateupload[0]?.paymentType || 'Not Mentioned',
      //   date: ticket?.date.split('T')[0] || '',
      //   subStageName: subStageName(ticket?.subStageCode?.code) || '',
      //   status: ['dnp', 'dnd', 'CallCompleted', 'RescheduledCall'].includes(
      //     ticket?.status
      //   )
      //     ? 'N/A'
      //     : ticket?.status,
      //   notes: noteSetter(ticket._id) || '',
      //   Second_opinion_hospital: ticket?.opinion[0]?.hospital,
      //   Considering_Consultation:
      //     ticket?.opinion[0]?.type === 'Considering Consultation'
      //       ? 'Yes'
      //       : 'No',
      //   Consulted: ticket?.opinion[0]?.type === 'consulted' ? 'Yes' : 'No',
      //   we_are_second_opinion:
      //     ticket?.opinion[0]?.type === 'we are second opinon' ? 'Yes' : 'No',
      //   Second_opinion_doctor: ticket?.opinion[0]?.doctor,
      //   Second_opinion_add_info: ticket?.opinion[0]?.additionalInfo,
      //   Awaiting_test_results: ticket?.opinion[0]?.challengeSelected?.includes(
      //     'Awaiting test results'
      //   )
      //     ? 'Yes'
      //     : 'No',
      //   Awaiting_TPA_approvals: ticket?.opinion[0]?.challengeSelected?.includes(
      //     'Awaiting TPA approvals'
      //   )
      //     ? 'Yes'
      //     : 'No',
      //   Bad_Experience: ticket?.opinion[0]?.challengeSelected?.includes(
      //     'Bad Experience'
      //   )
      //     ? 'Yes'
      //     : 'No',
      //   Under_MM: ticket?.opinion[0]?.challengeSelected?.includes('Under MM')
      //     ? 'Yes'
      //     : 'No',
      //   Financial_constatints: ticket?.opinion[0]?.challengeSelected?.includes(
      //     'Financial constatints'
      //   )
      //     ? 'Yes'
      //     : 'No',
      //   Not_happy_with_doctor: ticket?.opinion[0]?.challengeSelected?.includes(
      //     'Not happy with doctor'
      //   )
      //     ? 'Yes'
      //     : 'No',
      //   Lead_Probability: `${ticket?.Probability}%`,
      //   Lead_Rating:
      //     ticket?.auditorcomment[ticket?.auditorcomment.length - 1]?.ratings,
      //   Call_disposition: [
      //     'dnp',
      //     'dnd',
      //     'CallCompleted',
      //     'RescheduledCall',
      //     'Wrong Number'
      //   ].includes(ticket?.status)
      //     ? ticket?.status
      //     : 'N/A',
      //   Call_Recording:
      //     ticket?.phoneData?.length > 0
      //       ? ticket?.phoneData[ticket?.phoneData.length - 1]?.time
      //       : 'Not Contacted yet',
      //   Last_Activity_Date: ticket?.lastActivity || '',
      //   lostReasons: ticket?.patientStatus[0]?.dropReason || ''
      // }));

      // const csv = Papa.unparse(data);
      // const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

      // FileSaver.saveAs(
      //   csvBlob,
      //   `${dayjs(new Date()).format('DD-MM-YY')}Data.csv`
      // );

      // toast.success('Data will Sent to your mail, within 1-2 Hours');
      setAnchorEl(null);
      setSelectedUnit('');
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      console.error(
        'Error generating CSV:  Please Contact Octa Admin for Download Data',
        error
      );
      // toast.error(
      //   'Error generating CSV: Check Your Internet Connectivity if still facing issue while Downloading - Please Contact Octa Admin for Download Data)'
      // );
    } finally {
      // setDownloadDisable(false);
      setAnchorEl(null);
      setSelectedDate(null);
      setSelectedUnit('');
      setStartDate(null);
      setEndDate(null);
    }
  };
  const [selectedUnit, setSelectedUnit] = useState<string>('');

  const handleUnitChange = (event: SelectChangeEvent<string>) => {
    setSelectedUnit(event.target.value);
    setErrors((prev) => ({ ...prev, unit: false })); // Clear error on selection
  };

  const shouldDisableDate = (date: Dayjs) => {
    const year = date.year();
    const month = date.month(); // 0-based index (0 = January, 11 = December)

    // Disable future years
    if (year > 2025) {
      return true;
    }

    // Restrict months for 2025 (only allow January - March)
    if (year === 2025 && month > 2) {
      return true;
    }

    return false; // Enable all months for other years
  };

  const oneMonthAgo = dayjs().subtract(1, 'month');
  const oneMonthAhead = dayjs().add(1, 'month');

  return (
    <Box p={1} px={2}>
      {/* <LightTooltip
        title={!downloadDisable ? 'Download All Data' : 'Downloading....'}
      > */}
      <Stack style={{ borderRadius: '12px' }}>
        {/* Button to open dropdown */}
        <button
          onClick={handleClick}
          style={{ border: 'none', background: 'transparent', width: '20px' }}
        >
          <img src={DownloadAllFileIcon} alt="Download All Data" />
        </button>

        {/* Popover dropdown for DatePicker */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          sx={{ borderRadius: '24px' }}
        >
          <Box
            display={'flex'}
            width={'25rem'}
            flexDirection={'column'}
            gap={'15px'}
            sx={{
              padding: '30px 20px',
              borderRadius: '16px'
            }}
          >
            {/* <FormControl fullWidth size="small">
              <InputLabel id="unit-select-label" sx={materilaFieldCss}>
                Select Unit
              </InputLabel>
              <Select
                labelId="unit-select-label"
                id="unit-select"
                value={selectedUnit}
                label="Select Unit"
                sx={materilaInputFieldCss}
                onChange={handleUnitChange}
              >
                <MenuItem value="All" sx={materilaInputFieldCss}>
                  All
                </MenuItem>
                <MenuItem value="Mohali" sx={materilaInputFieldCss}>
                  Mohali
                </MenuItem>
                <MenuItem value="Amritsar" sx={materilaInputFieldCss}>
                  Amritsar
                </MenuItem>
                <MenuItem value="Hoshiarpur" sx={materilaInputFieldCss}>
                  Hoshiarpur
                </MenuItem>
                <MenuItem value="Nawanshahr" sx={materilaInputFieldCss}>
                  Nawanshahr
                </MenuItem>
                <MenuItem value="Khanna" sx={materilaInputFieldCss}>
                  Khanna
                </MenuItem>
              </Select>
              {errors.unit && (
                <Stack sx={{ fontSize: '12px', color: 'red' }}>
                  Please select a unit.
                </Stack>
              )}
            </FormControl> */}
            <Stack>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <DatePicker
                  slotProps={{ textField: { size: 'small' } }}
                  label="MM/YYYY"
                  views={['month', 'year']}
                  value={selectedDate}
                  onChange={handleDateChange}
                  // minDate={dayjs('2000-01-01')} // Set a reasonable lower limit
                  // maxDate={dayjs(
                  //   `${latestAllowedYear}-${latestAllowedMonth + 1}-01`
                  // )} // Dynamically set maxDate
                /> */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartChange}
                    slotProps={{ textField: { size: 'small' } }}
                    // minDate={oneMonthAgo}
                    // maxDate={oneMonthAhead}
                  />

                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={handleEndChange}
                    slotProps={{ textField: { size: 'small' } }}
                    // minDate={oneMonthAgo}
                    // maxDate={oneMonthAhead}
                  />
                </div>
              </LocalizationProvider>
              {errors.date && (
                <Stack sx={{ fontSize: '12px', color: 'red' }}>
                  Please select a Month.
                </Stack>
              )}
            </Stack>
            <Stack
              style={{
                padding: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'outFit,san-serif',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                color: '#0566FF',
                border: '1.5px solid #0566FF',
                borderRadius: '4px'
              }}
              onClick={downloadData}
            >
              Download
              {/* <img src={DownloadAllFileIcon} alt="Download All Data" /> */}
            </Stack>
          </Box>
        </Popover>
      </Stack>
      {/* </LightTooltip> */}
    </Box>
  );
};

export default DownloadAllTickets;
