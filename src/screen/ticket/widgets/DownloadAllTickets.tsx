import { DownloadForOfflineOutlined } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
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

type Props = {};

const DownloadAllTickets = (props: Props) => {
  const { doctors, departments } = useServiceStore();
  const { filterTickets } = useTicketStore();
  const [disable, setDisable] = useState(false);

  const doctorSetter = (id: string) => {
    return doctors.find((element) => element._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((element) => element._id === id)?.name;
  };

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

    const data = sortedTickets?.map((ticket: any, index) => {
      return {
        serialNo: index + 1,
        firstName: ticket.consumer[0].firstName,
        lastName: ticket.consumer[0].lastName && ticket.consumer[0].lastName,
        uhid: ticket.consumer[0].uid,
        gender: ticket.consumer[0].gender,
        phone: ticket.consumer[0].phone,
        age: ageSetter(ticket.consumer[0].dob),
        department: departmentSetter(ticket.prescription[0].departments[0]),
        doctor: doctorSetter(ticket.prescription[0].doctor),
        admissionType: ticket.prescription[0].admission
          ? ticket.prescription[0].admission
          : 'Not Advised',
        serviceName: ticket.prescription[0].service
          ? ticket.prescription[0].service.name
          : 'No Advised',
        isPharmacy:ticket.prescription[0].isPharmacy ? 'Advised' : 'No Advised' ,
        stage: ticket.stage,
        CTScan: ticket.prescription[0].diagnostics.includes('CT-Scan')
          ? 'Yes'
          : 'No',
        LAB: ticket.prescription[0].diagnostics.includes('Lab') ? 'Yes' : 'No',
        MRI: ticket.prescription[0].diagnostics.includes('MRI') ? 'Yes' : 'No',
        PETCT: ticket.prescription[0].diagnostics.includes('PET_CT')
          ? 'Yes'
          : 'No',
        XRAY: ticket.prescription[0].diagnostics.includes('XRAY')
          ? 'Yes'
          : 'No',
        USG: ticket.prescription[0].diagnostics.includes('USG')
          ? 'Yes'
          : 'No',
        followUpDate: ticket.prescription[0].followUp
          ? dayjs(ticket.prescription[0].followUp).format('DD/MMM/YYYY')
          : 'No Follow Up',
        capturedBy:
          ticket.creator[0].firstName + ' ' + ticket.creator[0].lastName,
        prescriptionCreatedAt: `${dayjs(
          ticket.prescription[0].createdAt
        ).format('DD/MMM/YYYY , HHMM ')} hrs`,
        prescriptionLink: ticket.prescription[0].image
      };
    })
    const csv = Papa.unparse(data);
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(
      csvBlob,
      `${dayjs(new Date()).format('DD:MM:YY')}Data.csv`
    );
    setDisable(false);
  };

  return (
    <Box>
      <Tooltip title="Download All Data">
        <IconButton disabled={disable} onClick={downloadData}>
          <DownloadForOfflineOutlined />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default DownloadAllTickets;
