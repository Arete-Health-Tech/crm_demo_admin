import { Box, Chip, Stack, Typography } from '@mui/material';
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
import DnpIcon from '../../../../src/assets/DNP-icon.svg'
import MediumPr from '../../../../src/assets/MediumPr.svg'
import LowPr from '../../../../src/assets/LowPr.svg'
import HighPr from '../../../../src/assets/HighPr.svg'
import DefaultPr from '../../../../src/assets/DefaultPr.svg'
import NotifyAudit from '../../../../src/assets/NotifyAudit.svg'
import '../singleTicket.css'
import { apiClient, socket } from '../../../api/apiClient';

// import { updateIsNewTicket } from '../../../api/ticket/ticket';


type Props = {
  patientData: iTicket;
  index: number;
};

interface storeMessage {
  message: string;
  ticket: string;
  unreadCount: number;

  // Add other fields as needed
}

dayjs.extend(utc);
dayjs.extend(timezone);


const TicketCard = (props: Props) => {
  const { ticketID } = useParams();
  const { doctors, departments, allServices, stages } = useServiceStore();
  const [isNewTicket, setIsNewTicket] = useState(true);
  const [taskPendingCount, setTaskPendingCount] = useState(0);

  const [currentStage, setCurrentStage] = useState<iStage>({
    _id: '',
    name: '',
    code: 1,
    description: '',
    parent: null,
    child: []
  });

  console.log(props)

  const { tickets, filterTickets, setIsAuditor, allTaskCount, viewEstimates,
    setViewEstimates, isEstimateUpload, setIsEstimateUpload } = useTicketStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (filterTickets.stageList.length === 0 && props.index === 0 && window.location.href.split('/')[3] === "tickets") {
      navigate(`/ticket/${props.patientData._id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTickets, props.index, props.patientData._id])


  const doctorSetter = (id: string) => {
    return doctors.find((element) => element._id === id)?.name;
  };

  const departmentSetter = (id: string) => {
    return departments.find((element) => element._id === id)?.name;
  };


  // const { tickets, setTickets } = useTicketStore();

  // console.log(tickets);

  useEffect(() => {
    setIsNewTicket(props.patientData.isNewTicket);
  }, [props.patientData.isNewTicket]);

  useEffect(() => {
    props.patientData.isNewTicket = true;
    // console.log("-----------------------", props.patientData.isNewTicket, props.patientData.subStageCode.active);
    const stageDetail: any = stages?.find(
      ({ _id }) => props.patientData?.stage === _id
    );
    setCurrentStage(stageDetail);
    const { setStages } = useServiceStore.getState();
    setStages(stages);
  }, [stages]);
  // console.log(props.patientData, ' this is props patient data');
  // console.log(
  //   dayjs(props.patientData.createdAt)
  //     .tz('Asia/Kolkata')
  //     .format('DD/MMM/YYYY , HH:mm'),
  //   ' thui sis patient data '


  // );

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



  const baseStyle = {
    fontFamily: 'Outfit, sans-serif',
    color: '#007BFF',
    padding: '0px 8px',
    borderRadius: '10px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 400,
    fontSize: '12px',
    gap: '4px',
    lineHeight: '18px',
  };

  const stageStyles = {
    'New Lead': {
      ...baseStyle,
      backgroundColor: '#D9EBFF',

    },
    Contacted: {
      ...baseStyle,
      color: "#FFA500",
      backgroundColor: '#FFF2D9',
    },
    Working: {
      ...baseStyle,
      backgroundColor: '#DFF2E3',
      color: '#28A745',
    },
    Orientation: {
      ...baseStyle,
      color: "#20C997",
      backgroundColor: '#DEF7EF',
    },
    Nurturing: {
      ...baseStyle,
      backgroundColor: '#E9E3F6',
      color: '#6F42C1',
    },
  };

  const stageName = currentStage?.name;
  const stageStyle = stageStyles[stageName] || {};

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
      // console.log(formattedTimeDifference)
      return `${formattedTimeDifference} hrs ago`
    } else {
      return `${dayDifference} days ago`
    }
  }

  useEffect(() => {
    const foundData = allTaskCount.find(item => item.ticketId === props.patientData._id);
    if (foundData) {
      setTaskPendingCount(foundData.totalCount);
    } else {
      setTaskPendingCount(0);
    }
  }, [props.patientData._id, allTaskCount]);


  const isSelected = ticketID === props.patientData._id;

  // const [messages, setMessages] = useState<storeMessage[]>([]);

  // useEffect(() => {
  //   console.log("useEffect is running in ticketCard"); // Check if this logs

  //   // Check if socket is connected
  //   if (socket.connected) {
  //     console.log("Socket connected successfully in ticketCard");
  //   } else {
  //     console.log("Socket not connected, attempting to connect...");
  //     socket.connect();
  //   }

  //   const handleNewMessage = (data) => {
  //     console.log('Received new message in ticketCard', data);
  //     setMessages((prevMessages) => [...prevMessages, data.message]);
  //   };

  //   // Listen for the 'newMessage' event
  //   socket.on('newMessage', handleNewMessage);

  //   // Clean up the socket connection on component unmount
  //   return () => {
  //     socket.off('newMessage', handleNewMessage); // Remove the event listener
  //     socket.disconnect();
  //   };
  // }, []);

  const [totalEstimateValue, setTotalEstimateValue] = useState(0);

  useEffect(() => {
    const fetchEstimateData = async () => {
      const ticketId = props.patientData._id;

      if (!ticketId) {
        console.error("Ticket ID is undefined.");
        return;
      }

      try {
        const { data } = await apiClient.get(`ticket/uploadestimateData/${ticketId}`);

        if (data?.length && data[data.length - 1]?.ticket === ticketId) {
          setTotalEstimateValue(data[data.length - 1]?.total);
        } else {
          setTotalEstimateValue(0);
        }
      } catch (error) {
        setTotalEstimateValue(0); // Optionally reset state on error
      }
    };

    fetchEstimateData();
    setIsEstimateUpload(false);
  }, [props.patientData._id, isEstimateUpload]);

  return (
    <Box
      p={2}
      bgcolor={ticketID === props.patientData._id ? '#EBEDF0' : '#FFFFFF'}
      my={1}
      sx={{
        borderRadius: "var(--16px, 16px)",
        width: '100%',
        gap: "12px",
        // 1px solid #0566FF
        borderTop: isSelected ? "1px solid #ACB8CB" : 'none',
        borderRight: isSelected ? "1px solid #ACB8CB" : 'none',
        borderLeft: isSelected ? "1px solid #ACB8CB" : 'none',
        '&:hover': {
          bgcolor: '#EBEDF0',
          cursor: 'pointer',
          // borderTop: "1px solid #ACB8CB",
          // borderRight: "1px solid #ACB8CB",
          // borderLeft: "1px solid #ACB8CB"
        }
      }}
      // onClick={() => {
      //   navigate(`/ticket/${props.patientData._id}`);
      // }}
      onClick={showTicket}
    >

      {/* Line 1 */}

      <Box className="ticket-card-line1" sx={{ marginTop: "2px" }}>

        <Stack className='ticket-card-line1-left'>
          <Stack sx={stageStyle}> {stageName}</Stack>
          {totalEstimateValue == 0 ? (<>
            {/* <Stack className="Priority-tag"> <img src={DefaultPr} alt="DefaultPr" /><span style={{ fontSize: "12px" }}>N/A</span></Stack> */}
            <></>
          </>) : (
            <>
              <Stack className="Priority-tag">{totalEstimateValue > 15000 ?
                (<><img src={HighPr} alt="" />High</>)
                :
                (totalEstimateValue < 15000) && 4550 < (totalEstimateValue)
                  ? (<><img src={MediumPr} alt="" />Medium</>)
                  : (<><img src={LowPr} alt="" />Low</>)}
              </Stack>

            </>)
          }

          {props?.patientData.status === "dnp" && <Stack sx={{
            width: "18px",
            height: "18px"
          }}
          ><img src={DnpIcon} /></Stack>}
          {/* <Stack><img src={DNP} /></Stack> */}

        </Stack>

        <Stack className='ticketCard-Uhid'>#{props.patientData.consumer[0].uid}</Stack>

      </Box>

      {/* Line 2 */}

      <Box className="ticket-card-line1 line2">
        <Stack className='ticket-card-name'>
          {props.patientData.consumer[0].firstName}{' '}
          {props.patientData.consumer[0].lastName &&
            props.patientData.consumer[0].lastName}
        </Stack>

        <Stack className='ticket-cardline2-right'>
          {props.patientData.consumer[0].gender ? (<>
            <Stack className="ticket-card-Gender">
              {props.patientData.consumer[0].gender}
            </Stack>
          </>) : (<>
          </>
          )}

          {props.patientData.consumer[0].age
            ? (<><Stack>{props.patientData.consumer[0].age}</Stack></>)
            : (<></>)
          }
        </Stack>
      </Box>

      {/* ------- */}

      <Stack className="docName" marginTop={'5px'}>
        {doctorSetter(props.patientData.prescription[0].doctor)}
      </Stack>
      <Stack className="docName">
        {departmentSetter(props.patientData.prescription[0].departments[0])}
      </Stack>
      <Stack className="docName">
        {props.patientData.estimate[0]?.service[0]?.name}
      </Stack>

      {/* Line 3 */}

      <Box className="ticket-card-line3">
        {props.patientData.prescription[0].admission ? (<>
          <Stack className='ticket-card-line3-tag'>{props.patientData.prescription[0].admission}</Stack>
        </>
        )
          :
          (<></>)
        }
        {props.patientData.prescription[0].diagnostics.length > 0 ? (<>
          <Stack className='ticket-card-line3-tag'>Diagonstic</Stack>
        </>
        )
          :
          (<></>)
        }

        {props.patientData.estimate.length > 0 ? (
          <>
            {props.patientData.estimate[0]?.paymentType === 0
              ? <Stack className='ticket-card-line3-tag'>Cash</Stack>
              : props.patientData.estimate[0]?.paymentType === 1
                ? <Stack className='ticket-card-line3-tag'>Insurance</Stack>
                : props.patientData.estimate[0]?.paymentType === 2
                  ? <Stack className='ticket-card-line3-tag'>CGHS | ECHS</Stack>
                  : ''}
          </>
        ) :
          (<>
          </>)}
      </Box>

      {/*  */}
      <Stack sx={{ borderTop: '2px solid #E1E6EE', marginTop: "10px" }}>
        {/* Borders */}
      </Stack>

      {/* <Box
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


        {props.patientData.prescription[0].diagnostics.length > 0 && (
          <Chip label="Diagnostics" color="primary" size="small" />
        )}

        {props.patientData.estimate.length === 0 ? <></> : <Chip

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
          sx={{
            display: 'block',
            backgroundColor: 'blue',
            color: 'white',
            borderRadius: '4px',
            padding: '4px 8px'
          }}
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
      </Box> */}

      <Stack className="ticket-card-line3" sx={{ justifyContent: "space-between" }}>
        <Stack className='Ticket-LeadAge' sx={{ fontSize: "12px !important", padding: "4px 0 0px 0" }}>
          {calculatedDate(props.patientData?.date)}
        </Stack>
        <Stack sx={{ display: "flex", flexDirection: "row !important", gap: "5px" }}>
          {/* <Stack className='task-pending'><img src={NotifyAudit} alt="" /></Stack> */}
          {taskPendingCount > 0 && <Stack className='task-pending'>{taskPendingCount} Tasks Pending </Stack>}
          {/* <Stack className='ticket-card-notification'>2</Stack> */}
        </Stack>
      </Stack>

      <Stack className='linear-progress'>
        <LinearProgress
          variant="determinate"
          value={currentStage?.code * 20 || 0}
          sx={{
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#0566FF',
              borderBottomLeftRadius: "5px"// custom color
            },
          }}
        />
      </Stack>

    </Box>
  );
};

export default TicketCard;
