// import React, { useState, useEffect } from 'react';
// import Loader from '../../components/Loader';
// import { Box, Card, CardContent, Grid } from '@mui/material';


// import ChartTwo from './widgets/ChartTwo';
// import ChartThree from './widgets/ChartThree';
// import Diversity2Icon from '@mui/icons-material/Diversity2';

// import useTicketStore from '../../store/ticketStore';
// import { getAllStageCountHandler, getAllTimerStatusHandlerCallCompleted, getAllTimerStatusHandlerDnd, getAllTimerStatusHandlerPending, getAllTimerStatusHandlerRescheduledCall, getAllTimerStatusHandlerTodaysTask, getAllWonAndLossHandler } from '../../api/dashboard/dashboardHandler';
// import { Pie } from 'react-chartjs-2';
// import PieChart from './widgets/PieChart';
// import useServiceStore from '../../store/serviceStore';
// import useReprentativeStore from '../../store/representative';
// import useUserStore from '../../store/userStore';
// import { getRepresntativesHandler } from '../../api/representive/representativeHandler';

// type Props = {};

// const Dashboard = (props: Props) => {

//   const { stages } = useServiceStore();
//   const [dnd, setDnd] = useState(0);
//   const [pending, setPending] = useState(0);
//   const [todaysTask, setTodaysTask] = useState(0);
//   const [callCompleted, setCallCompleted] = useState(0);
//   const [wonCount, setWonCount] = useState(0);
//   const [lossCount, setLossCount] = useState(0);
//   const [reschedule, setReschedule] = useState(0);
//   const [stageCount, setStageCount] = useState(0);
//   const [newLead, setNewLead] = useState(0);
//   const [contacted, setContacted] = useState(0);
//   const [working, setWorking] = useState(0);
//   const [orientation, setOrientation] = useState(0);
//   const [nurturing, setNurturing] = useState(0);
//   const { user } = useUserStore.getState();
//   const phone = user?.phone;

//   const { representative } = useReprentativeStore();

//   getAllTimerStatusHandlerDnd()
//     .then((timerData) => {
//       const data = timerData.tickets.length;
//       setDnd(data)
//     }
//     )
//     // Handle the timerData here

//     .catch((error) => {
//       console.error('Error fetching timer data:', error);
//       // Handle the error here
//     });

//   getAllTimerStatusHandlerPending()
//     .then((timerData) => {
//       const data = timerData.tickets.length;
//       setPending(data)
//     })
//     .catch((error) => {
//       console.error('Error fetching timer data:', error);
//       // Handle the error here
//     });


//   getAllTimerStatusHandlerTodaysTask()
//     .then((timerData) => {
//       // console.log(timerData, "todaytask")
//       const data = timerData.tickets.length;
//       setTodaysTask(data)
//       // Handle the timerData here
//     })
//     .catch((error) => {
//       console.error('Error fetching timer data:', error);
//       // Handle the error here
//     });

//   getAllTimerStatusHandlerCallCompleted()
//     .then((timerData) => {
//       // console.log(timerData, "callback completed")
//       const data = timerData.tickets.length;
//       setCallCompleted(data)
//       // Handle the timerData here
//     })
//     .catch((error) => {
//       console.error('Error fetching timer data:', error);
//       // Handle the error here
//     });

//   // getAllWonAndLossHandler()
//   //   .then((timerData) => {
//   //     if (timerData && timerData.tickets) {
//   //       const data = timerData.tickets.length;

//   //     } else {
//   //       setWonCount(timerData.wonCount);
//   //       setLossCount(timerData.lossCount);
//   //     }

//   //   })
//   //   .catch((error) => {
//   //     console.error('Error fetching timer data:', error);
//   //     // Handle the error here
//   //   });

//   getAllTimerStatusHandlerRescheduledCall()
//     .then((timerData) => {
//       const data = timerData.tickets.length;
//       setReschedule(data)
//       // Handle the timerData here
//     })
//     .catch((error) => {
//       console.error('Error fetching timer data:', error);
//       // Handle the error here
//     });

//   useEffect(() => {
//     getAllStageCountHandler()
//       .then((timerData) => {
//         if (timerData && timerData.tickets) {
//           const data = timerData.tickets.length;
//           console.log(data, "data from stage")
//           setStageCount(data);
//         } else {
//           timerData.ticketsCountByStage.forEach((item) => {
//             // Check the stage value of each item and set the corresponding state variable
//             switch (item.stage) {
//               case stages[0]._id:
//                 setNewLead(item.count);

//                 break;
//               case stages[1]._id:
//                 setContacted(item.count);

//                 break;
//               case stages[2]._id:
//                 setWorking(item.count);

//                 break;
//               case stages[3]._id:
//                 setOrientation(item.count);

//                 break;
//               case stages[4]._id:
//                 setNurturing(item.count);

//                 break;
//               default:
//                 break;
//             }
//           });

//         }

//       })
//       .catch((error) => {
//         console.error('Error fetching timer data:', error);
//         // Handle the error here
//       });
//   }, []);


//   useEffect(() => {
//     (async () => {
//       try {
//         const fetchedRepresentative = await getRepresntativesHandler();
//         const matchFound = fetchedRepresentative?.some(rep => rep.phone === phone && rep.Unit === "66a4caeaab18bee54eea0866");
//         if (matchFound) {
//           // console.log("Phone number and unit match found in representative.", matchFound);
//           localStorage.setItem('location', "Amritsar")
//         } else {
//           // console.log("No match found.");
//           localStorage.setItem('location', "")
//         }
//       } catch (error) {
//         console.error("Error fetching representatives:", error);
//       }
//     })();
//   }, [])




//   const cardsData = [
//     {
//       id: 1,
//       title: 'DND Leads',
//       content: dnd,
//       color: 'green'
//     },
//     {
//       id: 2,
//       title: 'Lead Pending',
//       content: pending,
//       color: 'blue'
//     },
//     {
//       id: 3,
//       title: 'Today Task Leads',
//       content: todaysTask,
//       color: 'red'
//     },
//     {
//       id: 4,
//       title: ' Call Completed Lead',
//       content: callCompleted,
//       color: 'violet'
//     },
//     // {
//     //   id: 5,
//     //   title: 'Won',
//     //   content: wonCount,
//     //   color: 'pink'
//     // },
//     // {
//     //   id: 6,
//     //   title: 'Loss',
//     //   content: lossCount,
//     //   color: 'grey'
//     // },
//     {
//       id: 5,
//       title: 'Rescheduled Call',
//       content: reschedule,
//       color: 'pink'
//     }
//     // ... add more card data if needed
//   ];

//   const cardsDataBottom = [
//     {
//       id: 1,
//       title: 'Contacted',
//       content: reschedule,
//       color: 'green'
//     },
//     {
//       id: 2,
//       title: 'Orientation',
//       content: '10',
//       color: 'blue'
//     },
//     {
//       id: 3,
//       title: 'Nurturing',
//       content: '10',
//       color: 'red'
//     },
//     {
//       id: 4,
//       title: 'Working',
//       content: '10',
//       color: 'violet'
//     },
//     {
//       id: 5,
//       title: 'Total',
//       content: '50',
//       color: 'pink'
//     }
//     // ... add more card data if needed
//   ];

//   return (
//     <Box bgcolor="#F6F7F9" width={"92.5vw"} height={"93%"} sx={{ display: 'flex', flexDirection: 'column', padding: "0px 0px 0px 150px", }}>
//       <Grid container spacing={1}>
//         {cardsData.map((card) => (
//           <Grid item key={card.id} xs={12} sm={2} md={2} lg={2} xl={2}>
//             <Card>
//               <CardContent
//                 style={{
//                   borderTop: `2px solid ${card.color}`,
//                   borderRadius: '10px',
//                   padding: '8px'
//                 }}
//               >
//                 <h3 style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: "Outfit,sans-serif" }}>
//                   {card.title}
//                 </h3>
//                 <p style={{ fontSize: '16px', fontFamily: "Outfit,sans-serif" }}>{card.content}</p>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       <Grid container spacing={2} sx={{ marginTop: '20px', padding: '30px 50px', }}>
//         {/* Grid item for PieChart */}
//         {/* <Grid item xs={8} sm={2}> */}
//         {/* <PieChart /> */}
//         {/* </Grid> */}

//         {/* Grid item for ChartTwo */}
//         <Grid item xs={12} sm={5}>
//           <PieChart
//             newLead={newLead}
//             contacted={contacted}
//             working={working}
//             orientation={orientation}
//             nurturing={nurturing}
//           />
//           {/* <ChartTwo /> */}
//         </Grid>

//         {/* Grid item for ChartThree */}
//         <Grid item xs={12} sm={4}>
//           <ChartThree
//             dnd={dnd}
//             pending={pending}
//             todaysTask={todaysTask}
//             callCompleted={callCompleted}
//             reschedule={reschedule}
//           />
//         </Grid>
//       </Grid>

//     </Box >
//   );
// };

// export default Dashboard;
import React, { useState, useEffect, useMemo } from 'react';
import Loader from '../../components/Loader';
import { Box, Card, CardContent, Grid } from '@mui/material';

import ChartTwo from './widgets/ChartTwo';
import ChartThree from './widgets/ChartThree';
import Diversity2Icon from '@mui/icons-material/Diversity2';

import useTicketStore from '../../store/ticketStore';
import { getAllStageCountHandler, getAllTimerStatusHandlerCallCompleted, getAllTimerStatusHandlerDnd, getAllTimerStatusHandlerPending, getAllTimerStatusHandlerRescheduledCall, getAllTimerStatusHandlerTodaysTask, getAllWonAndLossHandler } from '../../api/dashboard/dashboardHandler';
import { Pie } from 'react-chartjs-2';
import PieChart from './widgets/PieChart';
import useServiceStore from '../../store/serviceStore';
import useReprentativeStore from '../../store/representative';
import useUserStore from '../../store/userStore';
import { getRepresntativesHandler } from '../../api/representive/representativeHandler';

type Props = {};

const Dashboard = (props: Props) => {
  const { stages } = useServiceStore();
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
  const { user } = useUserStore.getState();
  const phone = user?.phone;

  const { representative } = useReprentativeStore();

  useEffect(() => {
    getAllStageCountHandler()
      .then((timerData) => {
        if (timerData && timerData.tickets) {
          const data = timerData.tickets.length;
          setStageCount(data);
        } else {
          timerData.ticketsCountByStage.forEach((item) => {
            switch (item.stage) {
              case stages[0]._id:
                setNewLead(item.count);
                break;
              case stages[1]._id:
                setContacted(item.count);
                break;
              case stages[2]._id:
                setWorking(item.count);
                break;
              case stages[3]._id:
                setOrientation(item.count);
                break;
              case stages[4]._id:
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
      });


    getAllTimerStatusHandlerDnd()
      .then((timerData) => {
        const data = timerData.tickets.length;
        setDnd(data)
      })
      .catch((error) => {
        console.error('Error fetching timer data:', error);
      });

    getAllTimerStatusHandlerPending()
      .then((timerData) => {
        const data = timerData.tickets.length;
        setPending(data)
      })
      .catch((error) => {
        console.error('Error fetching timer data:', error);
      });

    getAllTimerStatusHandlerTodaysTask()
      .then((timerData) => {
        const data = timerData.tickets.length;
        setTodaysTask(data)
      })
      .catch((error) => {
        console.error('Error fetching timer data:', error);
      });

    getAllTimerStatusHandlerCallCompleted()
      .then((timerData) => {
        const data = timerData.tickets.length;
        setCallCompleted(data)
      })
      .catch((error) => {
        console.error('Error fetching timer data:', error);
      });

    getAllTimerStatusHandlerRescheduledCall()
      .then((timerData) => {
        const data = timerData.tickets.length;
        setReschedule(data)
      })
      .catch((error) => {
        console.error('Error fetching timer data:', error);
      });


    (async () => {
      try {
        const fetchedRepresentative = await getRepresntativesHandler();
        // console.log(fetchedRepresentative, "repressentive");
        const amritsarFound = fetchedRepresentative?.some(rep => rep.phone === phone && rep.Unit === "66a4caeaab18bee54eea0866");
        const hoshiarpurFound = fetchedRepresentative?.some(rep => rep.phone === phone && rep.Unit === "66bf5f702586bb9ea5598451");
        const nawanshahrFound = fetchedRepresentative?.some(rep => rep.phone === phone && rep.Unit === "66bf5f5c2586bb9ea5598450");
        const khannaFound = fetchedRepresentative?.some(rep => rep.phone === phone && rep.Unit === "66d5535689e33e0601248a79");

        if (amritsarFound) {
          localStorage.setItem('location', "Amritsar");
        }
        else if (hoshiarpurFound) {
          localStorage.setItem('location', "Hoshiarpur");
        }
        else if (nawanshahrFound) {
          localStorage.setItem('location', "Nawanshahr");
        }
        else if (khannaFound) {
          localStorage.setItem('location', "Khanna");
        }
        else {
          localStorage.setItem('location', "");
        }
      } catch (error) {
        console.error("Error fetching representatives:", error);
      }
    })();
  }, [phone, stages]);

  const cardsData = useMemo(() => [
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
      title: 'Rescheduled Call',
      content: reschedule,
      color: 'pink'
    }
  ], [dnd, pending, todaysTask, callCompleted, reschedule]);

  const cardsDataBottom = useMemo(() => [
    { id: 1, title: 'newLead', content: newLead },
    { id: 2, title: 'contacted', content: contacted },
    { id: 3, title: 'working', content: working },
    { id: 4, title: 'orientation', content: orientation },
    { id: 5, title: 'nurturing', content: nurturing }
  ], [newLead, contacted, working, orientation, nurturing]);

  const newLeadContent = cardsDataBottom.find(item => item.title === 'newLead')?.content ?? 0;
  const contactedContent = cardsDataBottom.find(item => item.title === 'contacted')?.content ?? 0;
  const workingContent = cardsDataBottom.find(item => item.title === 'working')?.content ?? 0;
  const orientationContent = cardsDataBottom.find(item => item.title === 'orientation')?.content ?? 0;
  const nurturingContent = cardsDataBottom.find(item => item.title === 'nurturing')?.content ?? 0;

  return (
    <Box bgcolor="#F6F7F9" width={"92.5vw"} height={"93%"} sx={{ display: 'flex', flexDirection: 'column', padding: "0px 0px 0px 150px" }}>
      <Grid container spacing={1}>
        {cardsData.map((card) => (
          <Grid item key={card.id} xs={12} sm={2} md={2} lg={2} xl={2}>
            <Card>
              <CardContent
                style={{
                  borderTop: `2px solid ${card.color}`,
                  borderRadius: '10px',
                  padding: '8px'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: "Outfit,sans-serif" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '16px', fontFamily: "Outfit,sans-serif" }}>{card.content}</p>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: '20px', padding: '30px 50px' }}>
        <Grid item xs={12} sm={5}>
          <PieChart
            newLead={newLead}
            contacted={contacted}
            working={working}
            orientation={orientation}
            nurturing={nurturing}
          />
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
    </Box>
  );
};

export default Dashboard;
