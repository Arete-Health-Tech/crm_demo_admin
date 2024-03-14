import { Box, Chip, Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import { iReminder, iTicket } from '../../../types/store/ticket';
import useServiceStore from '../../../store/serviceStore';
import FemaleIcon from '@mui/icons-material/Female';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { ageSetter } from '../../../utils/ageReturn';
import { Grid, LinearProgress } from '@mui/material';
import useTicketStore from '../../../store/ticketStore';
import { useEffect, useState } from 'react';
import { iStage } from '../../../types/store/service';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// import { updateIsNewTicket } from '../../../api/ticket/ticket';


type Props = {
  patientData: iTicket;
  index: number;
};

dayjs.extend(utc);
dayjs.extend(timezone);


const TicketCard = (props: Props) => {
  const { doctors, departments, allServices, stages } = useServiceStore();
  const [isNewTicket, setIsNewTicket] = useState(true);

  const [currentStage, setCurrentStage] = useState<iStage>({
    _id: '',
    name: '',
    code: 1,
    description: '',
    parent: null,
    child: []
  });

  const { tickets, filterTickets } = useTicketStore();

  const navigateFunction = () => {
    console.log("inside function")

    try {
      console.log("inside try")

      if (filterTickets.stageList.length === 0 && props.index === 0) {
        console.log("inside inside try if")

        navigate(`/ticket/${props.patientData._id}`);
        console.log("after navigate")

      }
    } catch (error) {
      console.error('Error in navigateFunction:', error);
    }
  }

  useEffect(() => {
    console.log("inside useeffect")
    navigateFunction()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTickets, props.index, props.patientData._id])


  const doctorSetter = (id: string) => {
    return doctors.find((element) => element._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((element) => element._id === id)?.name;
  };

  const navigate = useNavigate();

  const { ticketID } = useParams();
  // const { tickets, setTickets } = useTicketStore();

  // console.log(tickets);

  useEffect(() => {
    setIsNewTicket(props.patientData.isNewTicket);
  }, [props.patientData.isNewTicket]);

  useEffect(() => {
    props.patientData.isNewTicket = true;
    console.log("-----------------------", props.patientData.isNewTicket, props.patientData.subStageCode.active);
    const stageDetail: any = stages?.find(
      ({ _id }) => props.patientData?.stage === _id
    );
    setCurrentStage(stageDetail);
    const { setStages } = useServiceStore.getState();
    setStages(stages);
  }, [stages]);
  console.log(props.patientData, ' this is props patient data');
  console.log(
    dayjs(props.patientData.createdAt)
      .tz('Asia/Kolkata')
      .format('DD/MMM/YYYY , HH:mm'),
    ' thui sis patient data '


  );

  const showTicket = () => {

    // updateIsNewTicket(props.patientData._id, false);

    setIsNewTicket(false);
    navigate(`/ticket/${props.patientData._id}`);
  }

  // const updateIsNewTicket = (ticketId: any, newValue: boolean) => {

  //   const ticketIndex = tickets.findIndex(ticket => ticket._id === ticketId);


  //   if (ticketIndex !== -1) {

  //     const updatedTickets = [...tickets];
  //     updatedTickets[ticketIndex] = {
  //       ...updatedTickets[ticketIndex],
  //       isNewTicket: newValue
  //     };
  //   }
  // }


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
      // onClick={() => {
      //   navigate(`/ticket/${props.patientData._id}`);
      // }}
      onClick={showTicket}
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
            {/* .............. */}
            {isNewTicket ? (
              <NotificationsActiveIcon style={{ color: '#4859ca' }} />
            ) : (
              <NotificationsActiveIcon style={{ display: 'none' }} />
            )}

          </Typography>
        </Box>
        <Box>
          <Typography variant="body2">
            {props.patientData.consumer[0].uid}
          </Typography>
        </Box>
      </Box>

      <Typography variant="inherit" textTransform="capitalize">
        {doctorSetter(props.patientData.prescription[0].doctor)}
      </Typography>
      <Typography variant="inherit" textTransform="capitalize">
        {departmentSetter(props.patientData.prescription[0].departments[0])}
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

        {props.patientData.estimate.length === 0 ? <></> : <Chip
          // D ENDS HERE__________________________
          size="small"
          disabled={props.patientData.estimate.length === 0 ? true : false}
          label={
            props.patientData.estimate[0]?.paymentType === 0
              ? 'Cash'
              : props.patientData.estimate[0]?.paymentType === 1
                ? 'Insurance'
                : props.patientData.estimate[0]?.paymentType === 2
                  ? 'CGHS| ECHS'
                  : ''
          }
        // sx={{
        //   display: 'block',
        //   backgroundColor: 'blue',
        //   color: 'white',
        //   borderRadius: '4px',
        //   padding: '4px 8px'
        // }}
        />}

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

        Created At:{' '}
        {dayjs(props.patientData.createdAt)
          .tz('Asia/Kolkata')
          .format('DD/MMM/YYYY , HH:mm')}{' '}
        hrs
      </Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={8}>
          <LinearProgress
            variant="determinate"
            value={currentStage?.code * 20 || 0}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography fontSize={'14px'} fontWeight={500}>{`(${currentStage?.code * 20 || 0
            }%) ${currentStage?.name || 'N/A'}`}


          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketCard;
