import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { Box, Card, CardContent, Grid } from '@mui/material';


import ChartTwo from './widgets/ChartTwo';
import ChartThree from './widgets/ChartThree';
import Diversity2Icon from '@mui/icons-material/Diversity2';

import useTicketStore from '../../store/ticketStore';
import { getAllStageCountHandler, getAllTimerStatusHandlerCallCompleted, getAllTimerStatusHandlerDnd, getAllTimerStatusHandlerPending, getAllTimerStatusHandlerRescheduledCall, getAllTimerStatusHandlerTodaysTask, getAllWonAndLossHandler } from '../../api/dashboard/dashboardHandler';
import { Pie } from 'react-chartjs-2';
import PieChart from './widgets/PieChart';

type Props = {};

const Dashboard = (props: Props) => {

  const [dnd, setDnd] = useState(0);
  const [pending, setPending] = useState(0);
  const [todaysTask, setTodaysTask] = useState(0);
  const [callCompleted, setCallCompleted] = useState(0);
  const [wonCount, setWonCount] = useState(0);
  const [lossCount, setLossCount] = useState(0);
  const [reschedule, setReschedule] = useState(0);
  const [stageCount, setStageCount] = useState(0);
  const [newLead, setNewLead] = useState(0);
  const [contacted, setContacted] = useState(0);
  const [working, setWorking] = useState(0);
  const [orientation, setOrientation] = useState(0);
  const [nurturing, setNurturing] = useState(0);


  getAllTimerStatusHandlerDnd()
    .then((timerData) => {
      //  console.log(timerData.tickets.length, 'Dnd');
      const data = timerData.tickets.length;
      setDnd(data)
    }
    )
    // Handle the timerData here

    .catch((error) => {
      console.error('Error fetching timer data:', error);
      // Handle the error here
    });
  // console.log("this is dnd number",dnd)

  getAllTimerStatusHandlerPending()
    .then((timerData) => {
      //  console.log(timerData, 'Pending');
      const data = timerData.tickets.length;
      setPending(data)
    })
    .catch((error) => {
      console.error('Error fetching timer data:', error);
      // Handle the error here
    });


  getAllTimerStatusHandlerTodaysTask()
    .then((timerData) => {
      // console.log(timerData, 'TodaysTask');
      const data = timerData.tickets.length;
      setTodaysTask(data)
      // Handle the timerData here
    })
    .catch((error) => {
      console.error('Error fetching timer data:', error);
      // Handle the error here
    });

  getAllTimerStatusHandlerCallCompleted()
    .then((timerData) => {
      // console.log(timerData, 'CallCompleted');
      const data = timerData.tickets.length;
      setCallCompleted(data)
      // Handle the timerData here
    })
    .catch((error) => {
      console.error('Error fetching timer data:', error);
      // Handle the error here
    });

  // getAllWonAndLossHandler()
  //   .then((timerData) => {
  //     if (timerData && timerData.tickets) {
  //       const data = timerData.tickets.length;

  //     } else {
  //       console.error('Invalid timer data:', timerData.wonCount);
  //       setWonCount(timerData.wonCount);
  //       setLossCount(timerData.lossCount);
  //     }

  //   })
  //   .catch((error) => {
  //     console.error('Error fetching timer data:', error);
  //     // Handle the error here
  //   });

  getAllTimerStatusHandlerRescheduledCall()
    .then((timerData) => {
      // console.log(timerData, 'RescheduledCall');
      const data = timerData.tickets.length;
      console.log(data, "Call scheduled")
      setReschedule(data)
      // Handle the timerData here
    })
    .catch((error) => {
      console.error('Error fetching timer data:', error);
      // Handle the error here
    });

  useEffect(() => {
    getAllStageCountHandler()
      .then((timerData) => {
        if (timerData && timerData.tickets) {
          const data = timerData.tickets.length;
          setStageCount(data);
        } else {
          console.log('StageCount:', timerData);
          console.log('StageCount:1', timerData.ticketsCountByStage[0].count);
          timerData.ticketsCountByStage.forEach((item) => {
            // Check the stage value of each item and set the corresponding state variable
            switch (item.stage) {
              case '6494196d698ecd9a9db95e3a':
                setNewLead(item.count);
                break;
              case '649598d9586b137ea9086788':
                setContacted(item.count);
                break;
              case '649ace47bda0ea4d79a1ec38':
                setWorking(item.count);
                break;
              case '649acdbbbda0ea4d79a1ec36':
                setOrientation(item.count);
                break;
              case '649ace20bda0ea4d79a1ec37':
                setNurturing(item.count);
                break;
              default:
                break;
            }
          });

        }

      })
      .catch((error) => {
        console.error('Error fetching timer data:', error);
        // Handle the error here
      });
  }, []);





  const cardsData = [
    {
      id: 1,
      title: 'DND Leads',
      content: dnd,
      color: 'green'
    },
    {
      id: 2,
      title: 'Lead Pending',
      content: pending,
      color: 'blue'
    },
    {
      id: 3,
      title: 'Today Task Leads',
      content: todaysTask,
      color: 'red'
    },
    {
      id: 4,
      title: ' Call Completed Lead',
      content: callCompleted,
      color: 'violet'
    },
    // {
    //   id: 5,
    //   title: 'Won',
    //   content: wonCount,
    //   color: 'pink'
    // },
    // {
    //   id: 6,
    //   title: 'Loss',
    //   content: lossCount,
    //   color: 'grey'
    // },
    {
      id: 5,
      title: 'Rescheduled Call',
      content: reschedule,
      color: 'pink'
    }
    // ... add more card data if needed
  ];

  const cardsDataBottom = [
    {
      id: 1,
      title: 'Contacted',
      content: reschedule,
      color: 'green'
    },
    {
      id: 2,
      title: 'Orientation',
      content: '10',
      color: 'blue'
    },
    {
      id: 3,
      title: 'Nurturing',
      content: '10',
      color: 'red'
    },
    {
      id: 4,
      title: 'Working',
      content: '10',
      color: 'violet'
    },
    {
      id: 5,
      title: 'Total',
      content: '50',
      color: 'pink'
    }
    // ... add more card data if needed
  ];

  return (
    <Box width={"92vw"} height={"86vh"} sx={{ display: 'flex', flexDirection: 'column', padding: "0px 0px 0px 150px", }}>
      <Grid container spacing={1}>
        {cardsData.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={2} lg={2} xl={2}>
            <Card>
              <CardContent
                style={{
                  borderTop: `2px solid ${card.color}`,
                  borderRadius: '10px',
                  padding: '8px'
                }}
              >
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '20px' }}>{card.content}</p>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: '45px', padding: '45px 0px', }}>
        {/* Grid item for PieChart */}
        {/* <Grid item xs={8} sm={2}> */}
        {/* <PieChart /> */}
        {/* </Grid> */}

        {/* Grid item for ChartTwo */}
        <Grid item xs={12} sm={5}>
          <PieChart
            newLead={newLead}
            contacted={contacted}
            working={working}
            orientation={orientation}
            nurturing={nurturing}
          />
          {/* <ChartTwo /> */}
        </Grid>

        {/* Grid item for ChartThree */}
        <Grid item xs={12} sm={4}>
          <ChartThree
            dnd={dnd}
            pending={pending}
            todaysTask={todaysTask}
            callCompleted={callCompleted}
            reschedule={reschedule}
          />
        </Grid>
      </Grid>

    </Box >
  );
};

export default Dashboard;
