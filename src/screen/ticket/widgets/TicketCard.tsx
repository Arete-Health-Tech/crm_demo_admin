import { Box, Chip, Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import { iTicket } from '../../../types/store/ticket';
import useServiceStore from '../../../store/serviceStore';
import FemaleIcon from '@mui/icons-material/Female';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { ageSetter } from '../../../utils/ageReturn';
import { Grid, LinearProgress } from '@mui/material';
import useTicketStore from '../../../store/ticketStore';
import { useEffect, useState } from 'react';
import { iStage } from '../../../types/store/service';

type Props = {
  patientData: iTicket;
};

const TicketCard = (props: Props) => {
  const { doctors, departments, allServices, stages } = useServiceStore();

  const [currentStage, setCurrentStage] = useState<iStage>({
    _id: '',
    name: '',
    code: 1,
    description: '',
    parent: null,
    child: []
  });

  const doctorSetter = (id: string) => {
    return doctors.find((element) => element._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((element) => element._id === id)?.name;
  };

  const navigate = useNavigate();

  const { ticketID } = useParams();
  const { tickets } = useTicketStore();
  console.log(tickets);

  useEffect(() => {
    const stageDetail: any = stages?.find(
      ({ _id }) => props.patientData?.stage === _id
    );
    setCurrentStage(stageDetail);
  }, [stages]);

  return (
    <Box
      p={2}
      bgcolor={ticketID === props.patientData._id ? '#E2ECFB' : '#f1f5f7'}
      borderRadius={2}
      my={1}
      sx={{
        '&:hover': {
          bgcolor: '#E2ECFB',
          cursor: 'pointer'
        }
      }}
      onClick={() => {
        navigate(`/ticket/${props.patientData._id}`);
      }}
    >
      <Box
        display="flex"
        width={'100%'}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          minWidth="70%"
        >
          <Typography
            variant="subtitle1"
            textTransform={'capitalize'}
            fontWeight={500}
          >
            {props.patientData.consumer[0].firstName}{' '}
            {props.patientData.consumer[0].lastName &&
              props.patientData.consumer[0].lastName}
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body2">
              {props.patientData.consumer[0].dob
                ? ageSetter(props.patientData.consumer[0].dob)
                : null}
            </Typography>
            {props.patientData.consumer[0].gender === 'M' ? (
              <MaleIcon fontSize="inherit" />
            ) : props.patientData.consumer[0].gender === 'F' ? (
              <FemaleIcon />
            ) : null}
          </Box>
        </Box>
        <Box>
          <Typography variant="body2">
            {props.patientData.consumer[0].uid}
          </Typography>
        </Box>
      </Box>
      <Typography variant="inherit" textTransform="capitalize">
        {doctorSetter(props.patientData.prescription[0].doctor)}(
        {departmentSetter(props.patientData.prescription[0].departments[0])})
      </Typography>
      <Typography variant="inherit" textTransform="capitalize">
        {props.patientData.estimate[0]?.service[0]?.name}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          marginTop: 1
        }}
      >
        {props.patientData.prescription[0].admission && (
          <Chip
            label={props.patientData.prescription[0].admission}
            color="success"
            size="small"
          />
        )}

        {/* // D STARTS HERE__________________________ */}
        {props.patientData.prescription[0].diagnostics.length > 0 && (
          <Chip label="Diagnostics" color="primary" size="small" />
        )}
        {props.patientData.estimate[0]?.paymentType && (
          <Chip
            // D ENDS HERE__________________________
            size="small"
            label={
              props.patientData.estimate[0].paymentType === 1
                ? 'Cash'
                : props.patientData.estimate[0].paymentType === 2
                ? 'Insurance'
                : props.patientData.estimate[0].paymentType === 3
                ? 'CGHS| ECHS'
                : ''
            }
            sx={{
              display: 'block',
              backgroundColor: 'blue',
              color: 'white',
              borderRadius: '4px',
              padding: '4px 8px'
            }}
          />
        )}

        <Chip
          sx={{
            display: props.patientData.estimate.length === 0 ? 'none' : ''
          }}
          size="small"
          label={
            220 > 15000 ? 'High' : 220 < 4500 && 450 < 2220 ? 'Medium' : 'Low'
          }
          color={
            222 > 15000
              ? 'info'
              : 1500 < 4500 && 4500 < 22200
              ? 'warning'
              : 'secondary'
          }
        />
      </Box>
      <Typography variant="caption" color="blue">
        Created At:
        {dayjs(props.patientData.createdAt).format('DD/MMM/YYYY , HHMM')}hrs
      </Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={8}>
          <LinearProgress variant="determinate" value={(currentStage?.code * 20) || 0} />
        </Grid>
        <Grid item xs={4}>
          <Typography fontSize={'14px'} fontWeight={500}>{`(${(currentStage?.code * 20) || 0}%) ${currentStage?.name ||  'N/A'}`}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketCard;
