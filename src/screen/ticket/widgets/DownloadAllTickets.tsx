import { DownloadForOfflineOutlined, Payment } from '@mui/icons-material';
import { Box, IconButton, Stack, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
import dayjs from 'dayjs';
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

type Props = {};

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
    color: '#0566FF',
  }
}));

const DownloadAllTickets = (props: Props) => {
  const { doctors, departments, stages, allNotes } = useServiceStore();

  const { representative } = useReprentativeStore();
  const { filterTickets, tickets } = useTicketStore();
  const [disable, setDisable] = useState(false);
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
  const noteSetter = (id: string) => {
    const foundItems = allNotes.filter(item => item.ticket === id);
    const notesArray = foundItems.map(item => item.text);
    return notesArray.length > 0 ? notesArray : [];
  };
  const handleAssigne = (assignees: any) => {
    if (!Array.isArray(assignees)) {
      return [];
    }
    let result: string[] = [];

    for (let i = 0; i <= assignees.length; i++) {
      const rep = representative.find(rep => rep._id === assignees[i]);
      if (rep) {
        // const initials = `${rep.firstName.charAt(0)}${rep.lastName.charAt(0)}`;
        const fullName = `${rep.firstName} ${rep.lastName}`;
        result.push(fullName);
      }
    }
    return result

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
        return "Send Engagement";
      case 2:
        return "Create Estimation";
      case 3:
        return "Call Patient";
      case 4:
        return "Add Call Summary";
      default:
        return "Unknown";
    }
  }
  const returnedDate = (date:string|null|Date) => {
    return dayjs(date).format('DD/MMM/YYYY')
  }

  const downloadData = async () => {
    setDisable(true);
    const sortedTickets = await getTicketHandler(
      UNDEFINED,
      1,
      'true',
      filterTickets
    );
    await getDoctorsHandler();
    await getDepartmentsHandler();

    const data = sortedTickets?.map((ticket: any, index: number) => {
      return {
        serialNo: index + 1,
        firstName: ticket?.consumer[0]?.firstName,
        lastName: ticket?.consumer[0]?.lastName && ticket?.consumer[0]?.lastName,
        uhid: ticket?.consumer[0]?.uid,
        gender: ticket?.consumer[0]?.gender,
        phone: ticket?.consumer[0]?.phone,
        age: ageSetter(ticket?.consumer[0]?.dob),
        location: ticket?.specialty ? ticket?.specialty : "Mohali",
        stage: stageSetter(ticket?.stage) ? stageSetter(ticket?.stage) : "",
        department: departmentSetter(ticket?.prescription[0]?.departments[0]),
        doctor: doctorSetter(ticket?.prescription[0]?.doctor),
        admissionType: ticket.prescription[0].admission
          ? ticket.prescription[0].admission
          : 'Not Advised',
        serviceName: ticket.prescription[0].service
          ? ticket.prescription[0].service.name
          : 'No Advised',
        isPharmacy: ticket?.prescription[0]?.isPharmacy ? 'Advised' : 'No Advised',
        assigned: handleAssigne(ticket.assigned).join(" "),
        CTScan: ticket?.prescription[0]?.diagnostics.includes('CT-Scan')
          ? 'Yes'
          : 'No',
        LAB: ticket.prescription[0].diagnostics.includes('Lab') ? 'Yes' : 'No',
        MRI: ticket.prescription[0].diagnostics.includes('MRI') ? 'Yes' : 'No',
        EEG: ticket.prescription[0].diagnostics.includes('EEG') ? 'Yes' : 'No',
        EMG: ticket.prescription[0].diagnostics.includes('EMG') ? 'Yes' : 'No',
        XRAY: ticket.prescription[0].diagnostics.includes('X-RAY') ? 'Yes' : 'No',
        USG: ticket.prescription[0].diagnostics.includes('USG') ? 'Yes' : 'No',
        PETCT: ticket.prescription[0].diagnostics.includes('PET_CT')
          ? 'Yes'
          : 'No',
        followUpDate: (returnedDate(ticket?.prescription[0]?.followUp) === "Invalid Date" || returnedDate(ticket?.prescription[0]?.followUp) === "01/Jan/1970") ? "No Follow Up" : returnedDate(ticket?.prescription[0]?.followUp),
        capturedBy: ticket?.creator[0]?.firstName + ' ' + ticket?.creator[0]?.lastName,
        prescriptionCreatedAt: `${dayjs(
          ticket.prescription[0].createdAt
        ).format('DD/MMM/YYYY , HHMM ')} hrs`,
        prescriptionLink: ticket?.prescription[0]?.image,
        prescriptionLink1: ticket?.prescription[0]?.image1,
        Lead_disposition: ticket ? (ticket.result === "65991601a62baad220000001" ? "won" : (ticket.result === "65991601a62baad220000002" ? "loss" : null)) : null,
        // pharmacyStatus: ticket?.pharmacyStatus,
        isEstimateUpload: ticket?.estimateupload[0]?.total > 0 ? "Yes" : "No",
        estimateValue: ticket?.estimateupload[0]?.total ? ticket?.estimateupload[0]?.total : 0,
        PaymentType: ticket?.estimateupload[0]?.paymentType ? ticket?.estimateupload[0]?.paymentType : "Not Mentioned",
        date: ticket?.date,
        subStageName: subStageName(ticket?.subStageCode?.code),
        status: ticket?.status !== "dnp" && ticket?.status !== "dnd" && ticket?.status !== "CallCompleted" && ticket?.status !== "RescheduledCall" ? ticket.status : "N/A",
        notes: noteSetter(ticket._id),
        Second_opinion_hospital: ticket?.opinion[0]?.hospital,
        Considering_Consultation: ticket?.opinion[0]?.type === "Considering Consultation" ? "Yes" : "No",
        Consulted: ticket?.opinion[0]?.type === "consulted" ? "Yes" : "No",
        we_are_second_opinion: ticket?.opinion[0]?.type === "we are second opinon" ? "Yes" : "No",
        Second_opinion_doctor: ticket?.opinion[0]?.doctor,
        Second_opinion_add_info: ticket?.opinion[0]?.additionalInfo,
        Awaiting_test_results: ticket?.opinion[0]?.challengeSelected?.includes("Awaiting test results") ? "Yes" : "No",
        Awaiting_TPA_approvals: ticket?.opinion[0]?.challengeSelected?.includes('Awaiting TPA approvals') ? 'Yes' : 'No',
        Bad_Experience: ticket?.opinion[0]?.challengeSelected?.includes('Bad Experience') ? 'Yes' : 'No',
        Under_MM: ticket?.opinion[0]?.challengeSelected?.includes('Under MM') ? 'Yes' : 'No',
        Financial_constatints: ticket?.opinion[0]?.challengeSelected?.includes('Financial constatints') ? 'Yes' : 'No',
        Not_happy_with_doctor: ticket?.opinion[0]?.challengeSelected?.includes('Not happy with doctor') ? 'Yes' : 'No',
        Lead_Probability: `${ticket?.Probability}%`,
        Lead_Rating: ticket?.auditorcomment[ticket?.auditorcomment.length - 1]?.ratings,
        Call_disposition: ticket?.status === "dnp" || ticket?.status === "dnd" || ticket?.status === "CallCompleted" || ticket?.status === "RescheduledCall" ? ticket?.status : "N/A",
        Call_Recording: ticket?.phoneData[ticket?.phoneData.length - 1]?.time || "Not Contacted yet",
        Last_Activity_Date: ticket?.lastActivity,
        lostReasons: ticket?.patientStatus[0]?.dropReason,
      };
    });
    const csv = Papa.unparse(data);
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(
      csvBlob,
      `${dayjs(new Date()).format('DD:MM:YY')}Data.csv`
    );
    setDisable(false);
  };


  return (
    <Box p={1} px={2}>
      <LightTooltip title="Download All Data">
        <Stack style={{
          width: "16.667px",
          height: "15.397px"
        }}>
          <button disabled={disable} onClick={downloadData}
          >
            <img src={DownloadAllFileIcon} alt='Download All Data' /></button>
        </Stack>
      </LightTooltip>
    </Box>
  );
};

export default DownloadAllTickets;
