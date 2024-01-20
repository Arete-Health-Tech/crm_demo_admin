import React, { useState } from 'react';
import Loader from '../../components/Loader';
import { Box, Card, CardContent, Grid } from '@mui/material';


import ChartTwo from './widgets/ChartTwo';
import ChartThree from './widgets/ChartThree';
import Diversity2Icon from '@mui/icons-material/Diversity2';

import useTicketStore from '../../store/ticketStore';
import { getAllStageCountHandler, getAllTimerStatusHandlerCallCompleted, getAllTimerStatusHandlerDnd, getAllTimerStatusHandlerPending, getAllTimerStatusHandlerRescheduledCall, getAllTimerStatusHandlerTodaysTask, getAllWonAndLossHandler} from '../../api/dashboard/dashboardHandler';
import { Pie } from 'react-chartjs-2';
import PieChart from './widgets/PieChart';

type Props = {};

const Dashboard =  (props: Props) => {

const[dnd,setDnd]=useState(0);
const[pending,setPending]=useState(0);
const [todaysTask,setTodaysTask]=useState(0);
const[callCompleted,setCallCompleted]=useState(0);
const [wonLoss,setWonLoss]=useState(0);
const[reschedule,setReschedule]=useState(0);

 getAllTimerStatusHandlerDnd()
   .then((timerData) => {
     console.log(timerData.tickets.length, 'Dnd');
  const data = timerData.tickets.length;
  setDnd(data)
  }
  )
     // Handle the timerData here
   
   .catch((error) => {
     console.error('Error fetching timer data:', error);
     // Handle the error here
   });
console.log("this is dnd number",dnd)

   getAllTimerStatusHandlerPending()
     .then((timerData) => {
       console.log(timerData, 'Pending');
       const data = timerData.tickets.length;
       setPending(data)
     })
     .catch((error) => {
       console.error('Error fetching timer data:', error);
       // Handle the error here
     });


getAllTimerStatusHandlerTodaysTask()
  .then((timerData) => {
    console.log(timerData, 'TodaysTask');
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
      console.log(timerData, 'CallCompleted');
      const data = timerData.tickets.length;
      setCallCompleted(data)
      // Handle the timerData here
    })
    .catch((error) => {
      console.error('Error fetching timer data:', error);
      // Handle the error here
    });

 getAllWonAndLossHandler()
   .then((timerData) => {
     console.log(timerData, 'Won and loss');
    
     // Handle the timerData here
   })
   .catch((error) => {
     console.error('Error fetching timer data:', error);
     // Handle the error here
   });

    getAllTimerStatusHandlerRescheduledCall()
      .then((timerData) => {
        console.log(timerData, 'RescheduledCall');
        const data = timerData.tickets.length;
        setReschedule(data)
        // Handle the timerData here
      })
      .catch((error) => {
        console.error('Error fetching timer data:', error);
        // Handle the error here
      });

       getAllStageCountHandler()
         .then((timerData) => {
           console.log(timerData, 'Stage Count');
         
           // Handle the timerData here
         })
         .catch((error) => {
           console.error('Error fetching timer data:', error);
           // Handle the error here
         });



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
     {
       id: 5,
       title: 'Won And LOSS',
       content: wonLoss,
       color: 'pink'
     },
     {
       id: 6,
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

    // const data = {
    //   labels: ['Label 1', 'Label 2', 'Label 3'],
    //   datasets: [
    //     {
    //       data: [30, 40, 30], // Data values for each segment
    //       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for each segment
    //       hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    //     }
    //   ]
    // };
  return (
    <div>
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
      <Grid container spacing={2}>
        {' '}
        {/* Grid for charts */}
        <Grid item xs={8} sm={1}>
          {/* <PieChart */}
           
          {/* /> */}
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChartTwo />
        </Grid>
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2
          style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '20px' }}
        >
          {' '}
          <Diversity2Icon />
          Stage Wise Patient in Pipeline
        </h2>
        <h2
          style={{ fontSize: '30px', fontWeight: 'bold', marginLeft: '180px' }}
        >
          {' '}
          <Diversity2Icon />
          Stage Wise Value in Pipeline
        </h2>
      </div>
      <Grid container spacing={1}>
        {cardsDataBottom.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={2} lg={3} xl={1.1}>
            <Card>
              <CardContent
                style={{
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
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1.1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Nurturing
              </h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1.1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Orientation
              </h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1.1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Working</h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1.1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>RFA</h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1.1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Contacted
              </h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Lost Lead
              </h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
