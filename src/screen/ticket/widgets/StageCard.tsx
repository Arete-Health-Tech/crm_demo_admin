<<<<<<< HEAD
import { Box, Paper, Step, StepConnector, StepContent, StepLabel, Stepper } from '@mui/material';
import { useEffect, useState } from 'react';
import useServiceStore from '../../../store/serviceStore';
import { iStage } from '../../../types/store/service';
=======
import {
  Box,

  Step,
 
 
  StepLabel,
  Stepper
} from '@mui/material';
import {  useState } from 'react';
import { apiClient } from '../../../api/apiClient';

// import { makeStyles } from '@material-ui/core/styles';

>>>>>>> dev
type Props = {
  stage: string | undefined;
};


const stages = [
  {
    label: 'New Lead',
    subStages: ['Engagement Sent ', "Create Estimate",'Call ', 'Call Summary ', 'Call Notes']
  },
  {
    label: 'Nurturing',
    subStages: ['Engagement Sent ', 'Call ', 'Call Summary ', 'Call Notes']
  },
  {
    label: 'Follow-up ',
    subStages: ['Engagement Sent ', 'Call ', 'Call Summary ', 'Call Notes']
  },
  {
    label: 'Final Call  ',
    subStages: ['Engagement Sent ', 'Call ', 'Call Summary ', 'Call Notes']
  }
];




const StageCard = (props: Props) => {
<<<<<<< HEAD
  const { stages } = useServiceStore();
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [selectedData, setSelectedData] = useState("");

  const getCurrentStage = () => {
    const index = stages.findIndex((stage) => stage._id === props.stage);
    console.log(index);
    setCurrentStageIndex(index);
  };
  useEffect(() => {
    getCurrentStage();
  }, [props.stage]);
  console.log(stages)
  const HandleClick = (e: any) => {
    setSelectedData(e)
  }
  
  return (
    <Box>
      <Stepper activeStep={currentStageIndex} alternativeLabel>
        {stages.map(
          (label: iStage, index) =>
            label.parent === null && (
              <Step key={label._id}>
                <StepLabel onClick={() => HandleClick(label._id)}>{label.name}</StepLabel>
                {selectedData === label._id ? label.children.map((item, index) => {
                  const childId = `${label._id}-${item._id}`;
                  console.log(item.name)
                  return (
                    <>
                      <Box>
                        <Stepper alternativeLabel>

                          <Step key={childId}>
                            <StepLabel key={index}>
                              {item.name}
                            </StepLabel>
                          </Step >
                        </Stepper>
                      </Box>
                    </>

                  )
                })
                  : ""}
              </Step>

            )


        )}
      </Stepper>

    </Box >
=======
 
  
         const [activeStep, setActiveStep] = useState(0);
         const [subStageStatus, setSubStageStatus] = useState(
           stages.reduce(
             (status, { subStages }) => ({ ...status, [subStages[0]]: false }),
             {}
           )  
         );
         const [resetSubStages, setResetSubStages] = useState(false);

       const handleStepClick = (step) => () => {
         if (step === 1) {
           // for the "Nurturing" stage
           if (
             !subStageStatus[stages[0].subStages[2]] || // check if the "Call" sub-stage is completed
             !subStageStatus[stages[0].subStages[3]] || // check if the "Call Summary" sub-stage is completed
             !subStageStatus[stages[0].subStages[4]] // check if the "Call Notes" sub-stage is completed
           ) {
             return; // if any of the above sub-stages is not completed, prevent clicking on the "Nurturing" stage
           }
         } else if (step === 2 || step === 3) {
           // for the "Follow-up" and "Final Call" stages
           const prevStage = stages[step - 1];
           const lastSubStage =
             prevStage.subStages[prevStage.subStages.length - 1];
           if (!subStageStatus[lastSubStage]) {
             // check if the last sub-stage of the previous stage is completed
             return; // if not, prevent clicking on the "Follow-up" or "Final Call" stage
           }
         }

         setActiveStep(step);
       };


console.log(' I am here');

let consumerId: any;
const url = new URL(`http://localhost:3000/prod/api/v1/ticket/${consumerId}`); 
const searchParams = new URLSearchParams(url.search);
const consumer = searchParams.get('consumerId');

console.log(consumer);
        
       const handleSubStageComplete = (subStage) => () => {
         const currentStage = stages[activeStep];
         const subStageIndex = currentStage.subStages.indexOf(subStage);
         const isLastSubStage =
           subStageIndex === currentStage.subStages.length - 1;

         if (isLastSubStage) {
           const nextStageIndex = activeStep + 1;
           if (nextStageIndex < stages.length) {
             setActiveStep(nextStageIndex);
             setSubStageStatus(
               stages[nextStageIndex].subStages.reduce(
                 (status, subStage) => ({ ...status, [subStage]: false }),
                 {}
               )
             );
           }
         } else {
           setSubStageStatus({ ...subStageStatus, [subStage]: true });
         }

         // Remove the completed substage from the subStageStatus object
         setSubStageStatus((prevStatus) => ({
           ...prevStatus,
           [subStage]: true
         }));
       };



        
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Stepper activeStep={activeStep} orientation="horizontal">
          {stages.map(({ label, subStages }, index) => (
            <Step
              key={label}
              onClick={handleStepClick(index)}
              style={{
                width: '25%',
                position: 'static'
              }}
            >
              <StepLabel
                style={{
                  cursor:
                    (index === 0 &&
                      (Object.values(subStageStatus).every(Boolean) ||
                        resetSubStages)) ||
                    index === activeStep
                      ? 'pointer'
                      : 'default',
                  fontWeight: activeStep === index ? 'bold' : 'normal',
                  color:
                    (index === 0 &&
                      (Object.values(subStageStatus).every(Boolean) ||
                        resetSubStages)) ||
                    index === activeStep
                      ? '#2196f3'
                      : 'inherit',
                  position: 'static'
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box display="flex" alignItems="center">
        {stages.map(({ subStages }, index) => (
          <Box
            key={`sub-stages-${index}`}
            style={{
              width: '50%',
              position: 'static',
              display: activeStep === index ? 'block' : 'none'
            }}
          >
            <Stepper activeStep={0} orientation="horizontal">
              {subStages.map((subStage, subIndex) => (
                <Step key={subStage}>
                  <StepLabel
                    style={{
                      textDecoration: subStageStatus[subStage]
                        ? 'line-through'
                        : 'none',
                      color: subStageStatus[subStage] ? 'red' : 'black',
                      cursor: subStageStatus[subStage] ? 'default' : 'pointer'
                    }}
                    onClick={
                      subStageStatus[subStage]
                        ? undefined
                        : handleSubStageComplete(subStage)
                    }
                  >
                    {subStage}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        ))}
      </Box>
    </Box>
>>>>>>> dev
  );
};

export default StageCard;
// const StageCard = (props: Props) => {
//   const { stages } = useServiceStore();
//   const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

//   const getCurrentStage = () => {
//     const index = stages.findIndex((stage) => stage._id === props.stage);
//     setCurrentStageIndex(index);
//   };

//    const stagesLevel= stages.map((label ) =>{
//     return (label)
//    } )
// console.log(stagesLevel);

//   useEffect(() => {
//     getCurrentStage();
//   }, [props.stage]);

//   const parentStageId = '6447bb8c554bff9e9eacc3a3'; // The ID of the parent stage
// const parentStage = stages.find((stage) => stage._id === parentStageId);

// console.log(parentStage,"substages");
// console.log(stages.filter((stage) => stage.parent === parentStageId));


//   return (
//     <Box>
//       <Stepper activeStep={currentStageIndex} alternativeLabel>
//         {stages.map(
//           (label: iStage, index) =>
//             label.parent === null && (
//               <Step key={label._id}>      
//                 <StepLabel>{label.name}</StepLabel>
               
//               </Step>
              
//             )
//         )}
//       </Stepper>
    
      
      
    



// <Stepper activeStep={currentStageIndex} alternativeLabel>
//   {stages.map((label: iStage, index) => {
//     if (label.parent === null) {
//       const subStages = stages.filter((childLabel: iStage) => childLabel.parent?.toString() === label._id);
//       return (
//         <Step key={label._id}>
//           <StepLabel>{label.name}</StepLabel>
//           <StepContent>
//             <div style={{ display: 'flex'}}>
//               {subStages.map((subStage: iStage) => (
//                 <Step key={subStage._id}  >
//                   <StepLabel className="substage-label" style={{ flexDirection:"row",}} >{subStage.name}</StepLabel>
//                 </Step>
//               ))}
//             </div>
//           </StepContent>
//         </Step>
//       );
//     }
//   })}
// </Stepper>



//     </Box>

//   );

// };

// export default StageCard;